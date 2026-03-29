import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { id, all } = body;

  if (all) {
    await supabase
      .from('notifications')
      .update({ unread: false })
      .eq('user_id', user.id);
  } else if (id) {
    await supabase
      .from('notifications')
      .update({ unread: false })
      .eq('id', id)
      .eq('user_id', user.id);
  }

  return NextResponse.json({ success: true });
}
