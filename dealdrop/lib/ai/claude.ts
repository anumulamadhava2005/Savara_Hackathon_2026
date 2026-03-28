import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function parseVoiceTranscript(transcript: string) {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 500,
    messages: [
      {
        role: 'user',
        content: `You are a retail inventory parser. Extract deal information from this voice transcript and return ONLY a JSON object with no markdown, no explanation.

Transcript: "${transcript}"

Return this exact JSON shape:
{
  "product_name": "string",
  "quantity_total": number,
  "expiry_hours": number (how many hours until expiry, default 24 if unclear),
  "suggested_discount": number (0-75, percentage),
  "category": "grocery" | "bakery" | "dairy" | "produce" | "general",
  "description": "string (short 1-sentence description)"
}`,
      },
    ],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  return JSON.parse(text);
}

export async function getAIPricingSuggestion(data: {
  productName: string;
  category: string;
  originalPrice: number;
  expiryHours: number;
  quantityRemaining: number;
  quantityTotal: number;
}) {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 300,
    messages: [
      {
        role: 'user',
        content: `You are a retail pricing AI. Suggest an optimal discount for clearing this inventory. Return ONLY JSON with no markdown.

Product: ${data.productName}
Category: ${data.category}
Original price: ₹${data.originalPrice}
Hours until expiry: ${data.expiryHours}
Stock remaining: ${data.quantityRemaining}/${data.quantityTotal}

Return:
{
  "suggested_discount": number (percentage 0-75),
  "suggested_price": number,
  "reasoning": "string (max 20 words)",
  "urgency_tier": "low" | "medium" | "high" | "critical"
}`,
      },
    ],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  return JSON.parse(text);
}
