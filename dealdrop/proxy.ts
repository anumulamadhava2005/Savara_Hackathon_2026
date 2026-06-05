import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Fetch with 4-second timeout so DNS failures fail fast in middleware
function fetchWithTimeout(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4000);
  return fetch(input, { ...init, signal: controller.signal }).finally(() => clearTimeout(timer));
}

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: { fetch: fetchWithTimeout },
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

  // Try to refresh session — if Supabase is unreachable, treat as logged out
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    // Supabase unreachable (DNS/network error) — fall through with user = null
  }

  const { pathname } = request.nextUrl;

  // ── Strip route group prefixes if accidentally used as URLs ─────────────
  const routeGroupMatch = pathname.match(/^\/\([^)]+\)(\/.*)?$/);
  if (routeGroupMatch) {
    const url = request.nextUrl.clone();
    url.pathname = routeGroupMatch[1] || '/';
    return NextResponse.redirect(url);
  }

  // ── "/" root: pass through to app/page.tsx ───────────────────────────────
  if (pathname === '/') {
    return supabaseResponse;
  }

  // ── /login and /register: always allow through when Supabase is down ─────
  const authPages = ['/login', '/register'];
  if (authPages.some(p => pathname.startsWith(p))) {
    if (user) {
      try {
        const { data: retailer } = await supabase.from('retailers').select('id').eq('user_id', user.id).single();
        const url = request.nextUrl.clone();
        url.pathname = retailer ? '/dashboard' : '/';
        return NextResponse.redirect(url);
      } catch {
        // DB unreachable — just let them through to login
        return supabaseResponse;
      }
    }
    return supabaseResponse;
  }

  // ── /onboarding and /store-setup ─────────────────────────────────────────
  const setupPages = ['/onboarding', '/store-setup'];
  if (setupPages.some(p => pathname.startsWith(p))) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    try {
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
    } catch {
      // DB unreachable — let them through
    }
    return supabaseResponse;
  }

  // ── All other routes: require authentication ──────────────────────────────
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // ── Role-based route guards ───────────────────────────────────────────────
  try {
    const { data: retailer } = await supabase.from('retailers').select('id').eq('user_id', user.id).single();
    const isRetailer = !!retailer;

    const retailerPaths = ['/dashboard', '/create-deal', '/fulfillment'];
    const isRetailerRoute = retailerPaths.some(p => pathname.startsWith(p));

    if (isRetailerRoute && !isRetailer) {
      const url = request.nextUrl.clone();
      url.pathname = '/discover';
      return NextResponse.redirect(url);
    }

    const customerPaths = ['/discover', '/map', '/passport', '/claim', '/deal', '/interests', '/location', '/welcome', '/deals', '/saved', '/wallet', '/flash', '/community', '/notifications'];
    const isCustomerRoute = customerPaths.some(p => pathname.startsWith(p));

    if (isCustomerRoute && isRetailer) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  } catch {
    // DB unreachable — skip role guards, let request through
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};
