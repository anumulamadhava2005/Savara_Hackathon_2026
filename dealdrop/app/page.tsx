import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function RootPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Not logged in → login
  if (!user) {
    redirect('/login');
  }

  // Check if retailer
  const { data: retailer } = await supabase
    .from('retailers')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (retailer) {
    redirect('/dashboard');
  }

  // Check if customer profile exists
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('id', user.id)
    .single();

  if (profile) {
    redirect('/discover'); // customer main feed
  }

  // No profile yet — send to onboarding
  redirect('/onboarding');
}
