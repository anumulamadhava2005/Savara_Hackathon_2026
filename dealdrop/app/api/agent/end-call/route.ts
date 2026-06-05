import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const AGENT_SECRET = process.env.LEVRAGE_API_SECRET;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

/**
 * POST /api/agent/end-call
 * Called by the Levrage voice agent at the end of every call (both Hunter and Merchant flows).
 *
 * Hunter flow:  sends claim confirmation SMS with the deal link
 * Merchant flow: sends deal-live confirmation SMS to the store owner
 *
 * Body:
 *   {
 *     caller_type: 'hunter' | 'merchant',
 *     phone_number: string,
 *     // Hunter
 *     deal_id?: string,
 *     zip_or_neighborhood?: string,
 *     // Merchant
 *     store_name?: string,
 *     deal_item?: string,
 *     discount_amount?: string,
 *     expiration_time?: string,
 *     created_deal_id?: string,
 *   }
 */
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.replace('Bearer ', '');
  if (!AGENT_SECRET || token !== AGENT_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const {
    caller_type,
    phone_number,
    deal_id,
    zip_or_neighborhood,
    store_name,
    deal_item,
    discount_amount,
    expiration_time,
    created_deal_id,
  } = body as Record<string, string>;

  if (!caller_type || !phone_number) {
    return NextResponse.json({ error: 'Missing caller_type or phone_number' }, { status: 400 });
  }

  const supabase = await createClient();
  let smsText = '';
  let smsType = '';

  // ── Hunter end-of-call ────────────────────────────────────────────────────
  if (caller_type === 'hunter') {
    if (deal_id) {
      // Specific deal was claimed — fetch its details
      const { data: deal } = await supabase
        .from('deals')
        .select('id, product_name, discount_percent, current_price, expiry_time, retailers ( shop_name, address )')
        .eq('id', deal_id)
        .single();

      const retailer = deal
        ? (Array.isArray(deal.retailers) ? deal.retailers[0] : deal.retailers)
        : null;

      const claimUrl = `${APP_URL}/claim/${deal_id}`;
      const expiresAt = deal ? new Date(deal.expiry_time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : expiration_time;

      smsText = `🛍️ DealDrop Claim Confirmed!\n\n` +
        `${deal?.product_name ?? deal_item ?? 'Your deal'} — ${deal?.discount_percent ?? discount_amount}% OFF\n` +
        `📍 ${retailer?.shop_name ?? store_name ?? 'Local Store'}: ${retailer?.address ?? ''}\n` +
        `💰 ₹${deal?.current_price ?? 'N/A'}\n` +
        `⏰ Expires: ${expiresAt}\n\n` +
        `Show this link at the store:\n${claimUrl}\n\n` +
        `First come, first served — hurry!`;
      smsType = 'claim_confirmation';
    } else {
      // No specific deal — send discovery link
      const discoverUrl = `${APP_URL}/discover${zip_or_neighborhood ? `?search=${encodeURIComponent(zip_or_neighborhood)}` : ''}`;
      smsText = `🛍️ DealDrop Live Deals!\n\n` +
        `Browse active flash deals near ${zip_or_neighborhood ?? 'you'}:\n${discoverUrl}\n\n` +
        `Deals are first-come, first-served. Happy hunting!`;
      smsType = 'discovery_link';
    }
  }

  // ── Merchant end-of-call ──────────────────────────────────────────────────
  else if (caller_type === 'merchant') {
    const dealId = created_deal_id ?? deal_id;
    const dashboardUrl = `${APP_URL}/dashboard`;
    const dealUrl = dealId ? `${APP_URL}/discover` : dashboardUrl;

    smsText = `✅ DealDrop Flash Drop LIVE!\n\n` +
      `Store: ${store_name ?? 'Your store'}\n` +
      `Deal: ${deal_item ?? 'Your item'} — ${discount_amount ?? 'N/A'} OFF\n` +
      `Expires: ${expiration_time ?? 'as set'}\n\n` +
      `Customers can see it at:\n${dealUrl}\n\n` +
      `Track redemptions at:\n${dashboardUrl}`;
    smsType = 'deal_live_confirmation';
  }

  // ── Log (mock send) ────────────────────────────────────────────────────────
  // In production: integrate Twilio/AWS SNS here
  console.log(`\n[END-CALL SMS MOCK]\nTo: ${phone_number}\nType: ${smsType}\n---\n${smsText}\n`);

  // ── Store phone_number + deal_id in a pending_claims table (optional) ──────
  if (caller_type === 'hunter' && deal_id && phone_number) {
    // Normalize phone to digits and + only
    const normalizedPhone = phone_number.replace(/[\s\-().]/g, '');
    
    try {
      await supabase.from('phone_claims').insert({
        phone_number: normalizedPhone,
        deal_id,
        status: 'sms_sent',
      }).select();
    } catch {
      // This table may not exist yet — ignore the error gracefully
    }
  }

  return NextResponse.json({
    success: true,
    sms_sent: true,
    sms_type: smsType,
    to: phone_number,
    preview: smsText,
    message: `End-of-call summary sent to ${phone_number}.`,
  });
}
