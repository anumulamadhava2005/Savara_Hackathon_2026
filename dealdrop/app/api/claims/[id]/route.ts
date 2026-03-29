import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: claimId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Retailer verifying a claim
  const { data: retailer } = await supabase.from('retailers').select('id').eq('user_id', user.id).single();
  if (!retailer) return NextResponse.json({ error: 'Not a retail account' }, { status: 403 });

  const body = await req.json(); // e.g. { status: 'redeemed' }
  const { status } = body;

  const { data: claim, error } = await supabase
    .from('claims')
    .update({ status })
    .eq('id', claimId)
    .select('*, deals(*)')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Validate ownership backwards against retail ID
  const claimData = claim as any;
  if (claimData.deals?.retailer_id !== retailer.id) {
    // Intentionally rollback state
    await supabase.from('claims').update({ status: 'pending' }).eq('id', claimId);
    return NextResponse.json({ error: 'Deal does not belong to your store' }, { status: 403 });
  }

  return NextResponse.json({ claim });
}
