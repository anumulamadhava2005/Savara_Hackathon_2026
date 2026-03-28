import { NextRequest, NextResponse } from 'next/server';
import { parseVoiceTranscript } from '@/lib/ai/claude';

export async function POST(req: NextRequest) {
  const { transcript } = await req.json();
  if (!transcript) return NextResponse.json({ error: 'Transcript required' }, { status: 400 });

  try {
    const parsed = await parseVoiceTranscript(transcript);
    return NextResponse.json({ deal: parsed });
  } catch {
    return NextResponse.json({ error: 'AI parsing failed' }, { status: 500 });
  }
}
