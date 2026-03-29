import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { shop_name, description, address, category, lat, lng } = body;

  const { data: retailer, error } = await supabase
    .from('retailers')
    .insert({
      user_id: user.id,
      shop_name,
      description,
      address,
      category,
      location: `POINT(${lng} ${lat})`,
      is_verified: false,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ retailer }, { status: 201 });
}
