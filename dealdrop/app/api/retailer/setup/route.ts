import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { shop_name, description, address, category, lat, lng, pin } = body;

  if (!shop_name || !address || !category || lat === undefined || lng === undefined) {
    return NextResponse.json(
      { error: 'Missing required fields: shop_name, address, category, lat, lng' },
      { status: 400 }
    );
  }

  // Validate PIN (4 digits) if provided
  if (pin && !/^\d{4}$/.test(String(pin))) {
    return NextResponse.json({ error: 'PIN must be exactly 4 digits' }, { status: 400 });
  }

  // Embed PIN in description so /api/merchant/verify can read it without a migration
  const storedDescription = pin
    ? `${description ?? ''}|PIN:${pin}`
    : (description ?? null);

  const { data: retailer, error } = await supabase
    .from('retailers')
    .insert({
      user_id: user.id,
      shop_name,
      description: storedDescription,
      address,
      category,
      location: `POINT(${lng} ${lat})`,
      is_verified: false,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Return PIN separately (strip from description in response)
  const cleanRetailer = {
    ...retailer,
    description: description ?? null, // hide the internal |PIN: suffix from the client
    pin_set: !!pin,
  };

  return NextResponse.json({ retailer: cleanRetailer }, { status: 201 });
}

