import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Verify retailer
  const { data: retailer } = await supabase
    .from('retailers')
    .select('id')
    .eq('user_id', user.id)
    .single();
    
  if (!retailer) return NextResponse.json({ error: 'Not a retail account' }, { status: 403 });

  // Fetch metrics: Total claimed vs Total redeemed vs Deals created
  const { data: deals, error } = await supabase
    .from('deals')
    .select('id, product_name, current_price, quantity_total, quantity_remaining, claims(status)')
    .eq('retailer_id', retailer.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const stats = deals.map(d => {
    const claims = Array.isArray(d.claims) ? d.claims : [];
    return {
      id: d.id,
      product_name: d.product_name,
      revenue_potential: d.current_price * (d.quantity_total - d.quantity_remaining),
      total_claims: claims.length,
      redeemed_count: claims.filter((c: any) => c.status === 'redeemed').length
    };
  });

  return NextResponse.json({ stats });
}
