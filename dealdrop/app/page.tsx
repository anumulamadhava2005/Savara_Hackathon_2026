import { redirect } from 'next/navigation';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { isRedirectError } = require('next/dist/client/components/redirect-error');
import { createClient } from '@/lib/supabase/server';

export default async function RootPage() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // Not logged in or auth error → login
    if (authError || !user) {
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
  } catch (err: unknown) {
    // Re-throw Next.js redirect errors — they must propagate to the framework
    if (isRedirectError(err)) throw err;
    // Any real error (ENOTFOUND, timeout, etc.) → fall back to login
    redirect('/login');
  }
}

