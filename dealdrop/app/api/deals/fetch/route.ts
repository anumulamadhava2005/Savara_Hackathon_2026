import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST /api/deals/fetch
// Fetches active deals for a given zip code
export async function POST(req: NextRequest) {
  try {
    // Verify Bearer token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid Authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7);
    if (token !== process.env.LEVRAGE_API_SECRET) {
      return NextResponse.json(
        { error: 'Invalid API secret' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { zipCode } = body as { zipCode?: string };

    if (!zipCode || typeof zipCode !== 'string') {
      return NextResponse.json(
        { error: 'zipCode is required and must be a string' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Query active deals
    // Note: Current schema doesn't have zipCode field. Using fallback approach.
    // In production, you may want to:
    // 1. Add a zipCode column to the deals table
    // 2. Use geolocation mapping if zipCode <-> coordinates conversion is available
    const { data: deals, error } = await supabase
      .from('deals')
      .select(
        `
        id,
        product_name,
        description,
        category,
        original_price,
        current_price,
        discount_percent,
        quantity_remaining,
        expiry_time,
        status,
        retailers (
          shop_name,
          address
        )
      `
      )
      .eq('status', 'active')
      .gt('quantity_remaining', 0)
      .not('expiry_time', 'is', null)
      .gt('expiry_time', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[/api/deals/fetch] Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch deals' },
        { status: 500 }
      );
    }

    // Format deals as simple string descriptions for the AI agent
    const dealDescriptions = deals.map((deal: any) => {
      const retailer = deal.retailers;
      return `${deal.product_name} at ${retailer?.shop_name || 'Unknown Store'}: ${deal.discount_percent}% off (${deal.current_price} from ${deal.original_price}). ${deal.quantity_remaining} available. Expires: ${new Date(deal.expiry_time).toLocaleString()}`;
    });

    return NextResponse.json({
      success: true,
      zipCode,
      deals: dealDescriptions,
      count: dealDescriptions.length,
    });
  } catch (error) {
    console.error('[/api/deals/fetch] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
