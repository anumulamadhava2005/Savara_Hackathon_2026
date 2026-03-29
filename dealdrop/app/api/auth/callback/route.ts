import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (code) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.exchangeCodeForSession(code);
    
    if (user) {
      // Check if they are a retailer
      const { data: retailer } = await supabase.from('retailers').select('id').eq('user_id', user.id).single();
      if (retailer) {
        return NextResponse.redirect(`${origin}/dashboard`);
      }
      
      // Check if they are a customer profile
      const { data: profile } = await supabase.from('user_profiles').select('id').eq('id', user.id).single();
      if (profile) {
        return NextResponse.redirect(`${origin}/deals`);
      }
      
      // Need onboarding logic -> pass retailer parameter if they specified
      const type = searchParams.get('type');
      if (type === 'retailer') return NextResponse.redirect(`${origin}/store-setup`);
      
      return NextResponse.redirect(`${origin}/onboarding`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=Invalid_Auth_Code`);
}
