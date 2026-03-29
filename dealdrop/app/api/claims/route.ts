import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { deal_id, squad_id } = body;

  if (!deal_id) return NextResponse.json({ error: 'Deal ID required' }, { status: 400 });

  // 1. Check if already claimed
  const { data: existing } = await supabase
    .from('claims')
    .select('id')
    .eq('deal_id', deal_id)
    .eq('user_id', user.id)
    .single();

  if (existing) return NextResponse.json({ error: 'Already claimed' }, { status: 400 });

  // 2. Fetch Deal for price details
  const { data: deal } = await supabase
    .from('deals')
    .select('original_price, current_price, quantity_remaining, product_name')
    .eq('id', deal_id)
    .single();

  if (!deal || (deal.quantity_remaining || 0) <= 0) {
    return NextResponse.json({ error: 'Deal no longer available' }, { status: 404 });
  }

  // 3. Create Claim
  const { data: claim, error: claimError } = await supabase
    .from('claims')
    .insert({
      deal_id,
      user_id: user.id,
      squad_id: squad_id || null,
      status: 'pending'
    })
    .select()
    .single();

  if (claimError) return NextResponse.json({ error: claimError.message }, { status: 500 });

  // 4. Update Profile (Points & Savings)
  const savings = (deal.original_price || 0) - (deal.current_price || 0);
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('reward_points, total_savings, deal_passport_stamps')
    .eq('id', user.id)
    .single();

  const newPoints = (profile?.reward_points || 0) + 150;
  const newSavings = (profile?.total_savings || 0) + savings;
  const newStamps = (profile?.deal_passport_stamps || 0) + 1;

  await supabase
    .from('user_profiles')
    .update({ 
      reward_points: newPoints, 
      total_savings: newSavings,
      deal_passport_stamps: newStamps
    })
    .eq('id', user.id);

  // 5. Log Activity
  await supabase
    .from('user_activity')
    .insert({
      user_id: user.id,
      type: 'claim',
      label: `Claimed: ${deal.product_name}`,
      value: `+$${savings.toFixed(2)} saved`,
      deal_id
    });

  // 6. Decement Quantity
  await supabase
    .from('deals')
    .update({ quantity_remaining: deal.quantity_remaining - 1 })
    .eq('id', deal_id);

  return NextResponse.json({ claim, savings, newPoints });
}
