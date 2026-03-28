'use client';
import { Deal } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

const urgencyConfig = {
  low:      { bg: 'bg-green-50',  border: 'border-green-200', badge: 'bg-green-100 text-green-800',  emoji: '' },
  medium:   { bg: 'bg-yellow-50', border: 'border-yellow-300', badge: 'bg-yellow-100 text-yellow-800', emoji: '⚡' },
  high:     { bg: 'bg-orange-50', border: 'border-orange-400', badge: 'bg-orange-100 text-orange-800', emoji: '🔥' },
  critical: { bg: 'bg-red-50',    border: 'border-red-500',    badge: 'bg-red-100 text-red-800',       emoji: '🔥🔥' },
};

interface DealCardProps {
  deal: Deal;
}

export function DealCard({ deal }: DealCardProps) {
  const urgency = urgencyConfig[deal.urgency_level ?? 'low'];
  const expiresIn = formatDistanceToNow(new Date(deal.expiry_time), { addSuffix: true });

  return (
    <Link href={`/deal/${deal.id}`}>
      <div className={`rounded-xl border-2 ${urgency.border} ${urgency.bg} p-4 hover:shadow-md transition-all cursor-pointer`}>
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-base leading-tight">{deal.product_name}</h3>
            <p className="text-sm text-gray-500 mt-0.5">{deal.retailer?.shop_name}</p>
          </div>
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${urgency.badge} whitespace-nowrap`}>
            {urgency.emoji} {deal.discount_percent}% OFF
          </span>
        </div>

        {/* Price Row */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-lg font-bold text-gray-900">₹{deal.current_price}</span>
          <span className="text-sm text-gray-400 line-through">₹{deal.original_price}</span>
        </div>

        {/* Meta Row */}
        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
          <span>{deal.walk_time_mins}min walk · {deal.distance_km?.toFixed(1)}km</span>
          <span>{deal.quantity_remaining} left · expires {expiresIn}</span>
        </div>

        {/* Flash Mob Badge */}
        {deal.is_flash_mob && (
          <div className="mt-2 bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full inline-block">
            ⚡ Flash Mob — extra {deal.flash_mob_discount}% if {deal.flash_mob_target} join
          </div>
        )}
      </div>
    </Link>
  );
}
