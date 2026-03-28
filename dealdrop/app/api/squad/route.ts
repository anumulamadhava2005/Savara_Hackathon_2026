import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST /api/squad — create a squad for a flash mob deal
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { deal_id, target_count, expires_in_hours = 2 } = body;

  const expiresAt = new Date(Date.now() + expires_in_hours * 60 * 60 * 1000);

  const { data: squad, error } = await supabase
    .from('squads')
    .insert({
      deal_id,
      target_count,
      current_count: 1,
      status: 'forming',
      expires_at: expiresAt.toISOString(),
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Add creator as first member
  await supabase
    .from('squad_members')
    .insert({ squad_id: squad.id, user_id: user.id });

  return NextResponse.json({ squad }, { status: 201 });
}
