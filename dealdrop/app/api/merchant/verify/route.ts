import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const AGENT_SECRET = process.env.LEVRAGE_API_SECRET;

/**
 * POST /api/merchant/verify
 * Called by the Levrage voice agent BEFORE creating a deal.
 *
 * Body: { storeName: string, pin: string }
 * Auth: Bearer LEVRAGE_API_SECRET
 *
 * Verifies the store exists and the PIN matches.
 * PIN is stored as the last 4 chars of the retailer's UUID (deterministic, no migration needed).
 * Retailers can also set a custom PIN stored in their description as "|PIN:XXXX".
 */
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.replace('Bearer ', '');
  if (!AGENT_SECRET || token !== AGENT_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const storeName = body.storeName || body.store_name;
  const pin = body.pin;

  if (!storeName || !pin) {
    return NextResponse.json({ error: 'Missing store_name or pin' }, { status: 400 });
  }

  const supabase = await createClient();

  const { data: retailer, error } = await supabase
    .from('retailers')
    .select('id, shop_name, description, address, category, rating')
    .ilike('shop_name', `%${storeName}%`)
    .single();

  if (error || !retailer) {
    return NextResponse.json(
      { error: `Store "${storeName}" not found. Please check the store name and try again.`, verified: false },
      { status: 404 }
    );
  }

  // ── PIN verification ──────────────────────────────────────────────────────
  // Priority 1: Custom PIN embedded in description as "|PIN:1234"
  const pinMatch = (retailer.description ?? '').match(/\|PIN:(\d{4})/);
  const storedPin = pinMatch ? pinMatch[1] : retailer.id.replace(/-/g, '').slice(-4);

  if (String(pin).trim() !== storedPin) {
    return NextResponse.json(
      { error: 'Incorrect PIN. Please try again.', verified: false },
      { status: 403 }
    );
  }

  return NextResponse.json({
    success: true,
    verified: true,
    retailer_id: retailer.id,
    shop_name: retailer.shop_name,
    address: retailer.address,
    category: retailer.category,
    rating: retailer.rating,
    message: `Verified! Welcome back, ${retailer.shop_name}. What deal would you like to drop today?`,
  });
}
