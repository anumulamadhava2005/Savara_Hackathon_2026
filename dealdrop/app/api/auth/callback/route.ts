import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

async function routeUser(supabase: Awaited<ReturnType<typeof createClient>>, origin: string, type?: string | null) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Check retailer first
  const { data: retailer } = await supabase.from('retailers').select('id').eq('user_id', user.id).single();
  if (retailer) return NextResponse.redirect(`${origin}/dashboard`);

  // Check customer profile
  const { data: profile } = await supabase.from('user_profiles').select('id').eq('id', user.id).single();
  if (profile) return NextResponse.redirect(`${origin}/discover`);

  // New user — route based on intended account type
  if (type === 'retailer') return NextResponse.redirect(`${origin}/store-setup`);
  return NextResponse.redirect(`${origin}/onboarding`);
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const type = searchParams.get('type');

  const supabase = await createClient();

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  const redirect = await routeUser(supabase, origin, type);
  if (redirect) return redirect;

  return NextResponse.redirect(`${origin}/login?error=Invalid_Auth_Code`);
}

