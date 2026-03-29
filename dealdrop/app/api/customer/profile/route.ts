import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { full_name, preferred_radius_km, preferred_categories, lat, lng } = body;

  const { data: profile, error } = await supabase
    .from('user_profiles')
    .insert({
      id: user.id,
      full_name,
      location: lat && lng ? `POINT(${lng} ${lat})` : null,
      preferred_radius_km: preferred_radius_km || 5,
      preferred_categories: preferred_categories || [],
      deal_passport_stamps: 0,
      passport_level: 'Bronze'
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ profile }, { status: 201 });
}
