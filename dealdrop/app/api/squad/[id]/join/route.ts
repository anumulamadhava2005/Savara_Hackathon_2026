import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST /api/squad/[id]/join
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: squadId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Check squad is still forming
  const { data: squad } = await supabase
    .from('squads')
    .select('*')
    .eq('id', squadId)
    .eq('status', 'forming')
    .single();

  if (!squad) return NextResponse.json({ error: 'Squad not available' }, { status: 404 });

  // Add member
  const { error: joinError } = await supabase
    .from('squad_members')
    .insert({ squad_id: squadId, user_id: user.id });

  if (joinError) return NextResponse.json({ error: 'Already in squad' }, { status: 409 });

  // Increment count
  const newCount = squad.current_count + 1;
  const updates: Record<string, unknown> = { current_count: newCount };
  if (newCount >= squad.target_count) {
    updates.status = 'complete';
  }

  await supabase
    .from('squads')
    .update(updates)
    .eq('id', squadId);

  return NextResponse.json({ success: true, current_count: newCount });
}
