import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  
  const { data: squads, error } = await supabase
    .from('squads')
    .select('*, deals(*, retailers(*))')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Squads fetch error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ squads: squads || [] });
}
