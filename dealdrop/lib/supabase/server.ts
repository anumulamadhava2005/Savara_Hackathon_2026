import { createServerClient } from '@supabase/ssr';
import { cookies, headers } from 'next/headers';

// Fetch wrapper that adds a 5-second timeout so DNS failures fail fast
function fetchWithTimeout(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  return fetch(input, { ...init, signal: controller.signal }).finally(() =>
    clearTimeout(timeout)
  );
}

export async function createClient() {
  const cookieStore = await cookies();
  const reqHeaders = await headers();
  const authHeader = reqHeaders.get('Authorization') || reqHeaders.get('authorization');
  
  let finalAuthHeader = authHeader || '';
  if (finalAuthHeader.includes(process.env.LEVRAGE_API_SECRET || 'lev_')) {
    finalAuthHeader = '';
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        fetch: fetchWithTimeout,
        headers: {
          // Pass Authorization specifically so API routes can natively accept Bearer tokens
          ...(finalAuthHeader ? { Authorization: finalAuthHeader } : {}),
        },
      },
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}

