import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/retailer/items — list this retailer's catalog items
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: retailer } = await supabase
    .from('retailers')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!retailer) return NextResponse.json({ items: [] });

  const { data, error } = await supabase
    .from('retailer_items')
    .select('*')
    .eq('retailer_id', retailer.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data ?? [] });
}

// POST /api/retailer/items — add a new catalog item
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: retailer } = await supabase
    .from('retailers')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!retailer) return NextResponse.json({ error: 'Retailer not found' }, { status: 404 });

  const body = await req.json();
  const { name, description, category, base_price, image_url } = body;

  if (!name || !base_price) {
    return NextResponse.json({ error: 'name and base_price are required' }, { status: 400 });
  }

  const { data: item, error } = await supabase
    .from('retailer_items')
    .insert({
      retailer_id: retailer.id,
      name,
      description: description ?? '',
      category: category ?? 'general',
      base_price: parseFloat(base_price),
      image_url: image_url ?? null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item }, { status: 201 });
}

// DELETE /api/retailer/items?id=xxx — soft-delete an item
export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const { error } = await supabase
    .from('retailer_items')
    .update({ is_active: false })
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
