import { createBrowserClient } from '@supabase/ssr';

/**
 * Wraps fetch so that DNS/network failures are caught at the source.
 * Instead of throwing a TypeError (which the Supabase SDK internally logs
 * and Turbopack's overlay picks up), we return a fake 503 JSON response.
 * The SDK then returns { data: null, error: { message: '...' } } normally,
 * and our component's existing `if (error)` check shows a friendly UI message.
 */
function safeFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  return fetch(input, { ...init, signal: controller.signal })
    .finally(() => clearTimeout(timer))
    .catch(() => {
      // Network failure (DNS, timeout, offline) — return a well-formed error
      // response so the SDK never throws and never logs internally.
      return new Response(
        JSON.stringify({
          error: 'service_unavailable',
          error_description: 'Cannot connect to server. Please check your internet connection and try again.',
          message: 'Cannot connect to server. Please check your internet connection and try again.',
          msg: 'Cannot connect to server. Please check your internet connection and try again.',
          code: 503,
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    });
}

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { fetch: safeFetch } }
  );
}

