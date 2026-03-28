import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: dealId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Check deal is still active and has stock
  const { data: deal } = await supabase
    .from('deals')
    .select('*')
    .eq('id', dealId)
    .eq('status', 'active')
    .single();

  if (!deal) return NextResponse.json({ error: 'Deal not available' }, { status: 404 });
  if (deal.quantity_remaining <= 0) return NextResponse.json({ error: 'Sold out' }, { status: 409 });

  // Atomic decrement + claim
  const { error: claimError } = await supabase
    .from('claims')
    .insert({ deal_id: dealId, user_id: user.id, status: 'claimed' });

  if (claimError) return NextResponse.json({ error: 'Already claimed' }, { status: 409 });

  await supabase
    .from('deals')
    .update({ quantity_remaining: deal.quantity_remaining - 1 })
    .eq('id', dealId);

  // Update passport stamps
  await supabase.rpc('increment_passport_stamps', { uid: user.id });

  return NextResponse.json({ success: true });
}
