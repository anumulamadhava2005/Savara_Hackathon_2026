import { NextRequest, NextResponse } from 'next/server';
import { getAIPricingSuggestion } from '@/lib/ai/claude';

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const suggestion = await getAIPricingSuggestion(body);
    return NextResponse.json({ suggestion });
  } catch {
    return NextResponse.json({ error: 'Pricing AI failed' }, { status: 500 });
  }
}
