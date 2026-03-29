import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { points, label, iconType } = body;

  if (!points || points <= 0) {
    return NextResponse.json({ error: 'Invalid points' }, { status: 400 });
  }

  // 1. Check current balance
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('reward_points')
    .eq('id', user.id)
    .single();

  if (!profile || (profile.reward_points || 0) < points) {
    return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
  }

  // 2. Perform Atomic Update (Supabase RPC or sequential for simple sites)
  const newPoints = (profile.reward_points || 0) - points;
  
  const { error: updateError } = await supabase
    .from('user_profiles')
    .update({ reward_points: newPoints })
    .eq('id', user.id);

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  // 3. Log Activity
  const { error: activityError } = await supabase
    .from('user_activity')
    .insert({
      user_id: user.id,
      type: 'redeem',
      label: `Redeemed: ${label}`,
      value: `-${points} Pulse PTS`,
    });

  if (activityError) console.error('Activity Logging failed:', activityError);

  return NextResponse.json({ 
    success: true, 
    newPoints 
  });
}
