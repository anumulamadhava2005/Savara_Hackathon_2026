import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Verify retailer
  const { data: retailer } = await supabase
    .from('retailers')
    .select('id')
    .eq('user_id', user.id)
    .single();
    
  if (!retailer) return NextResponse.json({ error: 'Not a retail account' }, { status: 403 });

  // Fetch all deals strictly mapped to the querying retailer
  const { data: deals, error } = await supabase
    .from('deals')
    .select('*')
    .eq('retailer_id', retailer.id)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ deals });
}
