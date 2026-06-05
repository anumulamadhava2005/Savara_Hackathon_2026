import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/claims/by-phone?phone={phone_number}
 *
 * Used by the /claim/phone page to let Hunters look up their claims
 * by the phone number they gave DropBot during the voice call.
 *
 * The end-call handler stores { phone_number, deal_id } in phone_claims.
 * This endpoint joins phone_claims → claims → deals → retailers.
 *
 * If phone_claims table doesn't exist yet (not migrated), falls back to
 * returning a helpful empty state.
 */
export async function GET(req: NextRequest) {
  const phone = req.nextUrl.searchParams.get('phone');

  if (!phone) {
    return NextResponse.json({ error: 'Missing phone query param' }, { status: 400 });
  }

  const supabase = await createClient();

  // Normalize phone number (strip spaces/dashes)
  const normalizedPhone = phone.replace(/[\s\-().]/g, '');

  // ── Primary: look up via phone_claims table ────────────────────────────────
  try {
    const { data: phoneClaims, error } = await supabase
      .from('phone_claims')
      .select('deal_id, status, created_at')
      .eq('phone_number', normalizedPhone)
      .order('created_at', { ascending: false });

    if (!error && phoneClaims && phoneClaims.length > 0) {
      const dealIds = phoneClaims.map(pc => pc.deal_id);

      // Fetch full deal details
      const { data: deals } = await supabase
        .from('deals')
        .select('id, product_name, discount_percent, current_price, expiry_time, retailers ( shop_name, address )')
        .in('id', dealIds);

      const claims = phoneClaims.map(pc => {
        const deal = deals?.find(d => d.id === pc.deal_id);
        const retailer = deal
          ? (Array.isArray(deal.retailers) ? deal.retailers[0] : deal.retailers)
          : null;
        return {
          id: pc.deal_id,
          status: pc.status,
          claimed_at: pc.created_at,
          deal: {
            product_name: deal?.product_name ?? 'Unknown Deal',
            discount_percent: deal?.discount_percent ?? 0,
            current_price: deal?.current_price ?? 0,
            expiry_time: deal?.expiry_time ?? new Date().toISOString(),
            shop_name: (retailer as { shop_name?: string } | null)?.shop_name ?? 'Local Store',
            address: (retailer as { address?: string } | null)?.address ?? 'N/A',
          },
        };
      });

      return NextResponse.json({ success: true, count: claims.length, claims });
    }
  } catch {
    // phone_claims table may not exist — fall through to empty response
  }

  // ── Fallback: table doesn't exist or no results ───────────────────────────
  return NextResponse.json({
    success: true,
    count: 0,
    claims: [],
    note: 'No claims found for this phone number. If you just called DropBot, your claim may take a moment to appear.',
  });
}
