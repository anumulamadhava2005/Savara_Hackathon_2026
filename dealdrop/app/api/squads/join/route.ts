import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { squad_id } = body;

  if (!squad_id) return NextResponse.json({ error: 'Squad ID required' }, { status: 400 });

  // 1. Fetch Squad and Deal info
  const { data: squad, error: squadFetchError } = await supabase
    .from('squads')
    .select('*, deals(*)')
    .eq('id', squad_id)
    .single();

  if (squadFetchError || !squad) {
     return NextResponse.json({ error: 'Squad not found' }, { status: 404 });
  }

  // 2. Check if already a member
  const { data: existing } = await supabase
    .from('squad_members')
    .select('id')
    .eq('squad_id', squad_id)
    .eq('user_id', user.id)
    .single();

  if (existing) return NextResponse.json({ error: 'Already in squad' }, { status: 400 });

  // 3. Join Squad
  const { error: joinError } = await supabase
    .from('squad_members')
    .insert({ squad_id, user_id: user.id });

  if (joinError) return NextResponse.json({ error: joinError.message }, { status: 500 });

  // 4. Update Current Count
  const newCount = (squad.current_count || 0) + 1;
  const isComplete = newCount >= squad.target_count;

  await supabase
    .from('squads')
    .update({ 
      current_count: newCount,
      status: isComplete ? 'completed' : 'forming'
    })
    .eq('id', squad_id);

  // 5. Create Notification
  await supabase
    .from('notifications')
    .insert({
      user_id: user.id,
      type: 'squad',
      title: 'Squad Pulse Recorded!',
      message: `You joined the squad for ${squad.deals.product_name}. ${isComplete ? 'Target achieved! Deal unlocked.' : `${squad.target_count - newCount} more members needed.`}`,
    });

  // 6. If complete, auto-create claim for the user
  if (isComplete) {
    const savings = (squad.deals.original_price || 0) - (squad.deals.current_price || 0);
    
    // Create the claim
    await supabase.from('claims').insert({
      deal_id: squad.deals.id,
      user_id: user.id,
      squad_id: squad_id,
      status: 'pending'
    });

    // Update Profile
    const { data: profile } = await supabase.from('user_profiles').select('reward_points, total_savings').eq('id', user.id).single();
    await supabase.from('user_profiles').update({
       reward_points: (profile?.reward_points || 0) + 150,
       total_savings: (profile?.total_savings || 0) + savings
    }).eq('id', user.id);

    // Log Activity
    await supabase.from('user_activity').insert({
      user_id: user.id,
      type: 'claim',
      label: `Squad Unlock: ${squad.deals.product_name}`,
      value: `+$${savings.toFixed(2)} saved`,
      deal_id: squad.deals.id
    });
  }

  return NextResponse.json({ success: true, isComplete, newCount });
}
