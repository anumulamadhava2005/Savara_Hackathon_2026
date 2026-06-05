import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const AGENT_SECRET = process.env.LEVRAGE_API_SECRET;

/**
 * POST /api/merchant/drop
 * Called by the Levrage voice agent (Merchant Partner flow).
 *
 * Flow: DropBot verifies store + PIN via /api/merchant/verify first,
 * then calls this endpoint with the deal details.
 *
 * Body: { storeName, pin, item, discount, expiresInHours }
 * Auth: Bearer LEVRAGE_API_SECRET
 */
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.replace('Bearer ', '');
  if (!AGENT_SECRET || token !== AGENT_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { storeName, pin, item, discount, expiresInHours } = body as Record<string, string | number>;

  if (!storeName || !pin || !item || !discount) {
    return NextResponse.json(
      { error: 'Missing required fields: storeName, pin, item, discount' },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  // ── 1. Look up retailer ───────────────────────────────────────────────────
  const { data: retailer, error: retailerError } = await supabase
    .from('retailers')
    .select('id, shop_name, description, location')
    .ilike('shop_name', `%${storeName}%`)
    .single();

  if (retailerError || !retailer) {
    return NextResponse.json(
      { error: `Store "${storeName}" not found. Is the store name correct?` },
      { status: 404 }
    );
  }

  // ── 2. Verify PIN (same logic as /api/merchant/verify) ────────────────────
  const pinMatch = (retailer.description ?? '').match(/\|PIN:(\d{4})/);
  const storedPin = pinMatch ? pinMatch[1] : retailer.id.replace(/-/g, '').slice(-4);

  if (String(pin).trim() !== storedPin) {
    return NextResponse.json(
      { error: 'Incorrect PIN. Deal not created. Please call back with the correct PIN.' },
      { status: 403 }
    );
  }

  // ── 3. Parse discount ─────────────────────────────────────────────────────
  const discountNum = parseInt(String(discount).replace(/[^0-9]/g, ''), 10);
  if (isNaN(discountNum) || discountNum < 1 || discountNum > 100) {
    return NextResponse.json(
      { error: 'Invalid discount. Provide a percentage between 1 and 100.' },
      { status: 400 }
    );
  }

  // ── 4. Parse expiry ───────────────────────────────────────────────────────
  const hoursNum = Number(expiresInHours) || 2;
  const expiryTime = new Date(Date.now() + hoursNum * 3600000).toISOString();

  // ── 5. Create the deal ────────────────────────────────────────────────────
  const originalPrice = 100;
  const currentPrice = Math.round(originalPrice * (1 - discountNum / 100));

  const { data: deal, error: dealError } = await supabase
    .from('deals')
    .insert({
      retailer_id: retailer.id,
      product_name: String(item),
      description: `Flash drop via DropBot: ${discountNum}% off ${item}`,
      category: 'General',
      original_price: originalPrice,
      current_price: currentPrice,
      discount_percent: discountNum,
      quantity_total: 50,
      quantity_remaining: 50,
      expiry_time: expiryTime,
      location: retailer.location,
      status: 'active',
      is_flash_mob: true,
      flash_mob_target: 10,
      flash_mob_discount: Math.min(discountNum + 10, 100),
    })
    .select('id, product_name, discount_percent, expiry_time, quantity_remaining')
    .single();

  if (dealError || !deal) {
    return NextResponse.json({ error: 'Failed to create deal: ' + dealError?.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    deal_id: deal.id,
    message: `Flash drop is LIVE! "${item}" at ${retailer.shop_name} — ${discountNum}% off for ${hoursNum}h. 50 slots available.`,
    deal: {
      id: deal.id,
      product_name: deal.product_name,
      discount_percent: deal.discount_percent,
      expiry_time: deal.expiry_time,
      quantity_remaining: deal.quantity_remaining,
    },
  });
}
