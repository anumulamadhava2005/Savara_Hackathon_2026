import { PricingSuggestion } from '@/types';

interface PricingInput {
  originalPrice: number;
  expiryTime: Date;
  quantityTotal: number;
  quantityRemaining: number;
  category: string;
}

export function computeDynamicPrice(input: PricingInput): PricingSuggestion {
  const now = new Date();
  const hoursLeft = (input.expiryTime.getTime() - now.getTime()) / (1000 * 60 * 60);
  const stockRatio = input.quantityRemaining / input.quantityTotal;

  let baseDiscount = 10;
  let urgency_tier: PricingSuggestion['urgency_tier'] = 'low';

  // Time-based decay
  if (hoursLeft <= 1) {
    baseDiscount += 40;
    urgency_tier = 'critical';
  } else if (hoursLeft <= 3) {
    baseDiscount += 25;
    urgency_tier = 'high';
  } else if (hoursLeft <= 6) {
    baseDiscount += 15;
    urgency_tier = 'medium';
  }

  // Low stock amplifier
  if (stockRatio < 0.2) baseDiscount += 15;
  else if (stockRatio < 0.5) baseDiscount += 8;

  // Perishable category amplifier
  const perishableBonus: Record<string, number> = {
    dairy: 10, bakery: 12, produce: 8, grocery: 5, general: 0,
  };
  baseDiscount += perishableBonus[input.category] ?? 0;

  const finalDiscount = Math.min(baseDiscount, 75); // cap at 75%
  const suggestedPrice = input.originalPrice * (1 - finalDiscount / 100);

  const reasoning = [
    `${hoursLeft.toFixed(1)}h until expiry`,
    `${Math.round(stockRatio * 100)}% stock remaining`,
    urgency_tier === 'critical' ? 'Critical urgency — maximum discount applied' : '',
  ].filter(Boolean).join(' · ');

  return {
    suggested_discount: finalDiscount,
    suggested_price: Math.round(suggestedPrice * 100) / 100,
    reasoning,
    urgency_tier,
  };
}

export function getUrgencyLevel(expiryTime: string): 'low' | 'medium' | 'high' | 'critical' {
  const hoursLeft = (new Date(expiryTime).getTime() - Date.now()) / (1000 * 60 * 60);
  if (hoursLeft <= 1) return 'critical';
  if (hoursLeft <= 3) return 'high';
  if (hoursLeft <= 6) return 'medium';
  return 'low';
}
