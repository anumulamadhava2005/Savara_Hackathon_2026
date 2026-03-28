'use client';
import { useDeals } from '@/hooks/useDeals';
import { useSquad } from '@/hooks/useSquad';
import { useDealStore } from '@/store/dealStore';
import { DealTimer } from '@/components/deals/DealTimer';
import { SquadWidget } from '@/components/squad/SquadWidget';
import { formatCurrency } from '@/lib/utils';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { userLocation } = useDealStore();
  const { deals, loading } = useDeals(userLocation);
  const { squad, members, joinSquad } = useSquad(id);
  const [claiming, setClaiming] = useState(false);

  const deal = deals.find((d) => d.id === id);

  const handleClaim = async () => {
    setClaiming(true);
    try {
      const res = await fetch(`/api/deals/${id}/claim`, { method: 'POST' });
      if (res.ok) {
        alert('Deal claimed successfully! Show your passport at the shop.');
        router.push('/passport');
      } else {
        alert('Failed to claim deal.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setClaiming(false);
    }
  };

  if (loading || !deal) return <div className="p-8 text-center text-gray-500">Loading deal details...</div>;

  return (
    <div className="space-y-6">
      <div className="aspect-square bg-gray-100 rounded-3xl overflow-hidden relative border border-gray-100">
        {deal.image_url ? (
          <img src={deal.image_url} alt={deal.product_name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">🛍️</div>
        )}
        <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1.5 rounded-full font-black text-sm shadow-xl">
          {deal.discount_percent}% OFF
        </div>
      </div>

      <section>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">{deal.product_name}</h1>
            <p className="text-lg font-bold text-indigo-600 uppercase tracking-widest mt-1">
              {deal.retailer?.shop_name || 'Nearby Shop'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-gray-900">{formatCurrency(deal.current_price)}</p>
            <p className="text-sm text-gray-400 line-through font-bold">{formatCurrency(deal.original_price)}</p>
          </div>
        </div>
      </section>

      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Expiring in</span>
          <DealTimer expiryTime={deal.expiry_time} className="text-lg" />
        </div>
        <div className="text-right">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Stock remaining</span>
          <p className="text-lg font-black text-gray-900">{deal.quantity_remaining} items</p>
        </div>
      </div>

      {deal.is_flash_mob && squad && (
        <SquadWidget squad={squad} onJoin={() => joinSquad(squad.id)} />
      )}

      <div className="space-y-3">
        <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest">About this deal</h3>
        <p className="text-gray-600 leading-relaxed">
          {deal.description || 'No description provided by retailer.'}
        </p>
      </div>

      <div className="bg-indigo-50 p-4 rounded-xl flex items-center gap-3">
        <span className="text-2xl">📍</span>
        <div>
          <p className="text-xs font-bold text-indigo-900">{deal.retailer?.address || 'See map for location'}</p>
          <p className="text-[10px] text-indigo-500 font-bold uppercase">{deal.walk_time_mins} min walk from you</p>
        </div>
      </div>

      <button
        onClick={handleClaim}
        disabled={claiming || deal.quantity_remaining <= 0}
        className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-xl hover:bg-indigo-700 transition shadow-2xl shadow-indigo-200 disabled:opacity-50 disabled:grayscale"
      >
        {claiming ? 'Claiming...' : deal.quantity_remaining > 0 ? 'CLAIM DEAL' : 'SOLD OUT'}
      </button>

      <p className="text-center text-[10px] text-gray-400 font-bold uppercase pb-10 italic">
        * Claiming a deal adds a stamp to your passport. Only valid for in-store pickup.
      </p>
    </div>
  );
}
