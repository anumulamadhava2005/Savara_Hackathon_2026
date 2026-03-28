'use client';
import { Deal } from '@/types';
import { DealCard } from './DealCard';

interface DealFeedProps {
  deals: Deal[];
  loading: boolean;
}

export function DealFeed({ deals, loading }: DealFeedProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse rounded-xl border border-gray-200 p-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-3" />
            <div className="h-5 bg-gray-200 rounded w-1/4 mb-2" />
            <div className="flex justify-between">
              <div className="h-3 bg-gray-200 rounded w-1/3" />
              <div className="h-3 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (deals.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-4xl mb-3">🔍</p>
        <h3 className="text-lg font-semibold text-gray-700">No deals nearby</h3>
        <p className="text-sm text-gray-500 mt-1">Try expanding your search radius or check back later!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {deals.map((deal) => (
        <DealCard key={deal.id} deal={deal} />
      ))}
    </div>
  );
}
