import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/deals?lat=&lng=&radius_km=&category=
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get('lat') ?? '0');
  const lng = parseFloat(searchParams.get('lng') ?? '0');
  const radiusKm = parseFloat(searchParams.get('radius_km') ?? '2');
  const category = searchParams.get('category');

  const supabase = await createClient();

  // PostGIS geo query: find active deals within radius
  let query = supabase
    .rpc('get_nearby_deals', {
      user_lat: lat,
      user_lng: lng,
      radius_km: radiusKm,
    })
    .eq('status', 'active');

  if (category) query = query.eq('category', category);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ deals: data });
}

// POST /api/deals — create a new deal (retailer only)
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();

  // Get retailer profile
  const { data: retailer } = await supabase
    .from('retailers')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!retailer) return NextResponse.json({ error: 'Retailer not found' }, { status: 404 });

  const expiryTime = new Date(Date.now() + body.expiry_hours * 60 * 60 * 1000);

  const { data: deal, error } = await supabase
    .from('deals')
    .insert({
      retailer_id: retailer.id,
      product_name: body.product_name,
      description: body.description,
      category: body.category,
      original_price: body.original_price,
      current_price: body.current_price,
      discount_percent: body.discount_percent,
      quantity_total: body.quantity_total,
      quantity_remaining: body.quantity_total,
      expiry_time: expiryTime.toISOString(),
      location: `POINT(${body.lng} ${body.lat})`,
      image_url: body.image_url,
      is_flash_mob: body.is_flash_mob ?? false,
      flash_mob_target: body.flash_mob_target,
      flash_mob_discount: body.flash_mob_discount,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ deal }, { status: 201 });
}
