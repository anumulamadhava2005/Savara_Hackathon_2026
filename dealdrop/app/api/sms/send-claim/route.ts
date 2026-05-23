import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface SendClaimRequest {
  phoneNumber: string;
  dealId: string;
}

// POST /api/sms/send-claim
// Sends an SMS to the user with their deal claim information
export async function POST(req: NextRequest) {
  try {
    // Verify Bearer token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid Authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7);
    if (token !== process.env.LEVRAGE_API_SECRET) {
      return NextResponse.json(
        { error: 'Invalid API secret' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await req.json() as SendClaimRequest;
    const { phoneNumber, dealId } = body;

    // Validate required fields
    if (!phoneNumber || !dealId) {
      return NextResponse.json(
        { error: 'Missing required fields: phoneNumber, dealId' },
        { status: 400 }
      );
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^\+?1?\d{9,15}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\D/g, ''))) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Fetch deal details for the SMS content
    const { data: deal, error: dealError } = await supabase
      .from('deals')
      .select(
        `
        id,
        product_name,
        discount_percent,
        current_price,
        expiry_time,
        retailers (
          shop_name,
          address
        )
      `
      )
      .eq('id', dealId)
      .single();

    if (dealError || !deal) {
      console.error('[/api/sms/send-claim] Deal lookup error:', dealError);
      return NextResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      );
    }

    // Mock SMS sending logic
    const smsContent = `
DealDrop Alert: You've claimed ${deal.product_name}!
${deal.discount_percent}% off - Just $${deal.current_price}
At: ${deal.retailers?.shop_name || 'Unknown'}
${deal.retailers?.address || ''}
Expires: ${new Date(deal.expiry_time).toLocaleString()}
Show this message at the register.
    `.trim();

    // Mock: Log SMS that would be sent
    console.log(
      `[/api/sms/send-claim] Sending SMS to ${phoneNumber}:\n${smsContent}`
    );

    // In production, you would integrate with an SMS service here:
    // - Twilio
    // - AWS SNS
    // - Azure Communication Services
    // - etc.
    //
    // Example with Twilio:
    // const twilio = require('twilio')(
    //   process.env.TWILIO_ACCOUNT_SID,
    //   process.env.TWILIO_AUTH_TOKEN
    // );
    // await twilio.messages.create({
    //   body: smsContent,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: phoneNumber,
    // });

    // Simulate SMS sending delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    return NextResponse.json({
      success: true,
      message: `SMS sent successfully to ${phoneNumber}`,
      smsPreview: smsContent,
      dealId,
    });
  } catch (error) {
    console.error('[/api/sms/send-claim] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
