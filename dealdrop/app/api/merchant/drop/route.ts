import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface MerchantDropRequest {
  storeName: string;
  pin: string;
  item: string;
  discount: string;
  expiresInHours: number;
}

// POST /api/merchant/drop
// Creates a new flash deal for a merchant after verifying credentials
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
    const body = await req.json() as MerchantDropRequest;
    const { storeName, pin, item, discount, expiresInHours } = body;

    // Validate required fields
    if (!storeName || !pin || !item || !discount || expiresInHours === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: storeName, pin, item, discount, expiresInHours' },
        { status: 400 }
      );
    }

    if (expiresInHours <= 0) {
      return NextResponse.json(
        { error: 'expiresInHours must be greater than 0' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verify merchant credentials
    // Note: Current schema doesn't have a PIN column in retailers table.
    // To implement PIN verification, you can:
    // 1. Add a 'pin' column to the retailers table (hashed/encrypted)
    // 2. Create a separate merchants table with PIN authentication
    // 3. Use another authentication method (API key, etc.)
    //
    // For now, we'll query the retailer and implement PIN verification logic.
    const { data: retailer, error: retailerError } = await supabase
      .from('retailers')
      .select('id, shop_name')
      .ilike('shop_name', storeName)
      .single();

    if (retailerError || !retailer) {
      console.error('[/api/merchant/drop] Retailer lookup error:', retailerError);
      return NextResponse.json(
        { error: 'Retailer not found or authentication failed' },
        { status: 404 }
      );
    }

    // TODO: Verify PIN against stored PIN in database
    // Example: const isPinValid = await verifyPin(retailer.id, pin);
    // For demonstration, we'll accept the PIN as-is. In production, compare with hashed PIN.
    if (!pin || pin.length === 0) {
      return NextResponse.json(
        { error: 'Invalid PIN' },
        { status: 401 }
      );
    }

    // Parse discount (expecting format like "50%" or just "50")
    let discountPercent = parseFloat(discount);
    if (isNaN(discountPercent) || discountPercent <= 0 || discountPercent >= 100) {
      return NextResponse.json(
        { error: 'discount must be a valid number between 0 and 100' },
        { status: 400 }
      );
    }

    // Set deal expiry time
    const expiryTime = new Date();
    expiryTime.setHours(expiryTime.getHours() + expiresInHours);

    // For this demo, set reasonable default values for the deal
    const originalPrice = 100; // Default assumed original price
    const currentPrice = originalPrice * (1 - discountPercent / 100);

    // Insert new deal
    const { data: newDeal, error: insertError } = await supabase
      .from('deals')
      .insert({
        retailer_id: retailer.id,
        product_name: item,
        description: `Flash deal on ${item}`,
        category: 'flash-deal', // Default category
        original_price: originalPrice,
        current_price: currentPrice,
        discount_percent: discountPercent,
        quantity_total: 50, // Default quantity
        quantity_remaining: 50,
        expiry_time: expiryTime.toISOString(),
        location: null, // Will use retailer's location if available
        status: 'active',
        is_flash_mob: true,
        flash_mob_target: 10,
        flash_mob_discount: discountPercent + 10, // Additional discount at target
      })
      .select('id, product_name, discount_percent, expiry_time');

    if (insertError) {
      console.error('[/api/merchant/drop] Insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to create deal' },
        { status: 500 }
      );
    }

    if (!newDeal || newDeal.length === 0) {
      return NextResponse.json(
        { error: 'Deal creation failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Deal created successfully for ${storeName}`,
      deal: {
        id: newDeal[0].id,
        product_name: newDeal[0].product_name,
        discount_percent: newDeal[0].discount_percent,
        expiry_time: newDeal[0].expiry_time,
      },
    });
  } catch (error) {
    console.error('[/api/merchant/drop] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
