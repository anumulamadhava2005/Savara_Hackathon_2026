import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const BUCKET = 'deal-images';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Ensures the deal-images bucket exists, creating it if not.
 * Uses the Supabase Storage REST API directly so we can set public: true.
 */
async function ensureBucket() {
  // Try to get the bucket first
  const getRes = await fetch(`${SUPABASE_URL}/storage/v1/bucket/${BUCKET}`, {
    headers: {
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      apikey: SUPABASE_SERVICE_KEY,
    },
  });

  if (getRes.ok) return; // Already exists

  // Create bucket
  const createRes = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      apikey: SUPABASE_SERVICE_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: BUCKET,
      name: BUCKET,
      public: true,
      file_size_limit: 5242880, // 5MB
      allowed_mime_types: ['image/jpeg', 'image/png', 'image/webp'],
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.json();
    throw new Error(`Could not create storage bucket: ${err.message ?? JSON.stringify(err)}`);
  }
}

export async function POST(req: NextRequest) {
  // Verify the user is authenticated
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    if (!file.type.startsWith('image/')) return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: 'File exceeds 5MB limit' }, { status: 400 });

    // Ensure bucket exists
    await ensureBucket();

    // Upload via Supabase Storage REST API
    const ext = file.name.split('.').pop() ?? 'jpg';
    const fileName = `deal-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${fileName}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        apikey: SUPABASE_SERVICE_KEY,
        'Content-Type': file.type,
        'Cache-Control': '3600',
      },
      body: await file.arrayBuffer(),
    });

    if (!uploadRes.ok) {
      const err = await uploadRes.json();
      throw new Error(err.message ?? 'Upload failed');
    }

    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${fileName}`;
    return NextResponse.json({ url: publicUrl });

  } catch (err: any) {
    console.error('[upload] Error:', err);
    return NextResponse.json({ error: err.message ?? 'Upload failed' }, { status: 500 });
  }
}
