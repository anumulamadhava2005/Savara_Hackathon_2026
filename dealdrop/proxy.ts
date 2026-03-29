import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options as Parameters<typeof supabaseResponse.cookies.set>[2])
          );
        },
      },
    }
  );

  // Refresh session — CRITICAL: must not remove this
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // ── Strip route group prefixes if accidentally used as URLs ─────────────
  // e.g. /(retailer)/dashboard → /dashboard, /(customer)/discover → /discover
  const routeGroupMatch = pathname.match(/^\/\([^)]+\)(\/.*)?$/);
  if (routeGroupMatch) {
    const url = request.nextUrl.clone();
    url.pathname = routeGroupMatch[1] || '/';
    return NextResponse.redirect(url);
  }

  // ── "/" root: handled by app/page.tsx server-side, just pass through ─────
  // app/page.tsx does its own DB check and redirect() call
  if (pathname === '/') {
    return supabaseResponse;
  }

  // ── /login and /register: pass through if unauthed, redirect to home if authed ─
  const authPages = ['/login', '/register'];
  if (authPages.some(p => pathname.startsWith(p))) {
    if (user) {
      const { data: retailer } = await supabase.from('retailers').select('id').eq('user_id', user.id).single();
      const url = request.nextUrl.clone();
      url.pathname = retailer ? '/dashboard' : '/';
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  // ── /onboarding and /store-setup: require auth, but skip if profile exists ─
  const setupPages = ['/onboarding', '/store-setup'];
  if (setupPages.some(p => pathname.startsWith(p))) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    const { data: retailer } = await supabase.from('retailers').select('id').eq('user_id', user.id).single();
    if (retailer) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
    const { data: profile } = await supabase.from('user_profiles').select('id').eq('id', user.id).single();
    if (profile) {
      const url = request.nextUrl.clone();
      url.pathname = '/discover';
      return NextResponse.redirect(url);
    }
    // No profile yet — let them through to complete setup
    return supabaseResponse;
  }

  // ── All other routes: require authentication ──────────────────────────────
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // ── Role-based route guards ───────────────────────────────────────────────
  const { data: retailer } = await supabase.from('retailers').select('id').eq('user_id', user.id).single();
  const isRetailer = !!retailer;

  // Retailer-only routes
  const retailerPaths = ['/dashboard', '/create-deal', '/fulfillment'];
  const isRetailerRoute = retailerPaths.some(p => pathname.startsWith(p));

  // Customer trying to access retailer routes → send to customer home
  if (isRetailerRoute && !isRetailer) {
    const url = request.nextUrl.clone();
    url.pathname = '/discover';
    return NextResponse.redirect(url);
  }

  // Customer-only routes
  const customerPaths = ['/discover', '/map', '/passport', '/claim', '/deal', '/interests', '/location', '/welcome', '/deals', '/saved', '/wallet', '/flash', '/community', '/notifications'];
  const isCustomerRoute = customerPaths.some(p => pathname.startsWith(p));

  // Retailer trying to access customer routes → send to retailer dashboard
  if (isCustomerRoute && isRetailer) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};
