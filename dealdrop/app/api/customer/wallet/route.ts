import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // 1. Fetch Profile
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // 2. Fetch Activity
  const { data: activity } = await supabase
    .from('user_activity')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20);

  // 3. Fetch Claims (to calculate savings if not already aggregated)
  const { data: claims } = await supabase
    .from('claims')
    .select('id, deals(original_price, current_price)')
    .eq('user_id', user.id);

  return NextResponse.json({
    profile,
    activity: activity || [],
    claims: claims || [],
  });
}
