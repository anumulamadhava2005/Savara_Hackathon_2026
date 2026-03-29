import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/customer/saved — list all saved deal IDs for current user
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ savedIds: [] });

  const { data, error } = await supabase
    .from('saved_deals')
    .select('deal_id')
    .eq('user_id', user.id);

  // If table doesn't exist yet, return empty list gracefully
  if (error) {
    console.warn('[/api/customer/saved] GET error:', error.message);
    return NextResponse.json({ savedIds: [] });
  }
  return NextResponse.json({ savedIds: (data ?? []).map(r => r.deal_id) });
}

// POST /api/customer/saved — toggle save/unsave a deal
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { deal_id } = body;
  if (!deal_id) return NextResponse.json({ error: 'deal_id required' }, { status: 400 });

  // Check if already saved
  const { data: existing } = await supabase
    .from('saved_deals')
    .select('id')
    .eq('user_id', user.id)
    .eq('deal_id', deal_id)
    .maybeSingle();

  if (existing) {
    // Unsave
    const { error } = await supabase
      .from('saved_deals')
      .delete()
      .eq('user_id', user.id)
      .eq('deal_id', deal_id);
    if (error) {
      console.warn('[/api/customer/saved] DELETE error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ saved: false });
  } else {
    // Save
    const { error } = await supabase
      .from('saved_deals')
      .insert({ user_id: user.id, deal_id });
    if (error) {
      console.warn('[/api/customer/saved] INSERT error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ saved: true });
  }
}
