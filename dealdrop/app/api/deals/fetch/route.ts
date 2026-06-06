import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const AGENT_SECRET = process.env.LEVRAGE_API_SECRET;

/**
 * Geocode a ZIP code or neighborhood name → { lat, lng }
 * Uses OpenStreetMap Nominatim (free, no API key needed).
 */
async function geocodeLocation(query: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const encoded = encodeURIComponent(query);
    const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'DealDrop/1.0 (hackathon demo)' },
      signal: AbortSignal.timeout(5000),
    });
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {
    return null;
  }
}

/**
 * POST /api/deals/fetch
 * Called by the Levrage voice agent (Hunter flow).
 *
 * Body: { zipCode?: string, neighborhood?: string, radius_km?: number }
 * Auth: Bearer LEVRAGE_API_SECRET
 *
 * Returns:
 *   - voice_summary: one string the agent can read aloud
 *   - deals[]: structured array with id, voice_summary, prices, etc.
 */
export async function POST(req: NextRequest) {
  // ── Auth ────────────────────────────────────────────────────────────────
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.replace('Bearer ', '');
  if (!AGENT_SECRET || token !== AGENT_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { zipCode, neighborhood, radius_km = 10 } = body as {
    zipCode?: string;
    neighborhood?: string;
    radius_km?: number;
  };

  const locationQuery = neighborhood || zipCode || '';
  const supabase = await createClient();

  // ── Geocode ─────────────────────────────────────────────────────────────
  const coords = locationQuery ? await geocodeLocation(locationQuery) : null;

  let deals: {
    id: string;
    product_name: string;
    current_price: number;
    original_price: number;
    discount_percent: number;
    quantity_remaining: number;
    expiry_time: string;
    retailers: { shop_name: string; address: string } | null;
  }[] = [];

  let locationUsed = 'all areas';

  if (coords) {
    locationUsed = locationQuery;

    // Try PostGIS RPC first
    const { data: nearbyIds } = await supabase.rpc('get_nearby_deals', {
      user_lat: coords.lat,
      user_lng: coords.lng,
      radius_km: Number(radius_km),
    });

    if (nearbyIds && nearbyIds.length > 0) {
      const ids = (nearbyIds as { id: string }[]).map((d) => d.id);
      const { data } = await supabase
        .from('deals')
        .select('id, product_name, current_price, original_price, discount_percent, quantity_remaining, expiry_time, retailers ( shop_name, address )')
        .in('id', ids)
        .eq('status', 'active')
        .gt('quantity_remaining', 0);
      deals = (data as unknown as typeof deals) ?? [];
    }
  }

  // ── Fallback: all active deals ──────────────────────────────────────────
  if (deals.length === 0) {
    const { data } = await supabase
      .from('deals')
      .select('id, product_name, current_price, original_price, discount_percent, quantity_remaining, expiry_time, retailers ( shop_name, address )')
      .eq('status', 'active')
      .gt('quantity_remaining', 0)
      .gt('expiry_time', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(10);
    deals = (data as unknown as typeof deals) ?? [];
    if (coords) locationUsed = `${locationQuery} (none in radius — showing all)`;
  }

  // ── Format ──────────────────────────────────────────────────────────────
  const formatted = deals.map((deal) => {
    const retailer = Array.isArray(deal.retailers) ? deal.retailers[0] : deal.retailers;
    const minsLeft = Math.round((new Date(deal.expiry_time).getTime() - Date.now()) / 60000);
    const timeLeft = minsLeft > 60 ? `${Math.floor(minsLeft / 60)}h ${minsLeft % 60}m left` : `${minsLeft}m left`;

    return {
      id: deal.id,
      product_name: deal.product_name,
      shop_name: retailer?.shop_name ?? 'Local Store',
      address: retailer?.address ?? 'N/A',
      discount_percent: deal.discount_percent,
      current_price: deal.current_price,
      original_price: deal.original_price,
      quantity_remaining: deal.quantity_remaining,
      expires_in: timeLeft,
      // One-liner the agent can read aloud
      voice_summary: `${deal.product_name} at ${retailer?.shop_name ?? 'Local Store'} — ${deal.discount_percent}% off, ₹${deal.current_price} (was ₹${deal.original_price}). ${deal.quantity_remaining} left. ${timeLeft}. ${retailer?.address ?? ''}`,
    };
  });

  const voiceSummary =
    formatted.length === 0
      ? `No active deals found near ${locationUsed} right now. Check back soon!`
      : `I found ${formatted.length} live deal${formatted.length > 1 ? 's' : ''} near ${locationUsed}. ` +
        formatted
          .slice(0, 3)
          .map((d) => d.voice_summary)
          .join(' … ');

  return NextResponse.json({
    success: true,
    location_searched: locationUsed,
    coordinates: coords,
    count: formatted.length,
    deals: formatted,
    voice_summary: voiceSummary,
  });
}
