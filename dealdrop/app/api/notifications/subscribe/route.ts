import { NextRequest, NextResponse } from 'next/server';

// POST /api/notifications/subscribe — save push subscription
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { subscription } = body;

  if (!subscription) {
    return NextResponse.json({ error: 'Subscription required' }, { status: 400 });
  }

  // TODO: Save subscription to database for sending push notifications
  // const supabase = await createClient();
  // await supabase.from('push_subscriptions').insert({ ... });

  console.log('Push subscription received:', JSON.stringify(subscription).slice(0, 100));

  return NextResponse.json({ success: true });
}
