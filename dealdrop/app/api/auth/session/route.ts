import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ profile: null }, { status: 200 });
  }

  // 1. Try to fetch Customer Profile
  const { data: customerProfile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (customerProfile) {
    return NextResponse.json({ 
      role: 'customer',
      profile: {
        ...customerProfile,
        full_name: customerProfile.full_name || 'Customer',
        email: user.email,
      } 
    });
  }

  // 2. Try to fetch Retailer Profile
  const { data: retailerProfile } = await supabase
    .from('retailers')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (retailerProfile) {
    return NextResponse.json({ 
      role: 'retailer',
      retailer: retailerProfile, // full retailer object including location
      profile: {
        id: retailerProfile.id,
        full_name: retailerProfile.shop_name,
        avatar_url: retailerProfile.avatar_url,
        shop_name: retailerProfile.shop_name,
        address: retailerProfile.address,
        email: user.email,
        rating: retailerProfile.rating,
      } 
    });
  }

  // Fallback: Default info if no profile exists yet
  return NextResponse.json({ 
    role: 'unknown',
    profile: {
      full_name: user.email?.split('@')[0] || 'User',
      email: user.email,
    } 
  });
}
