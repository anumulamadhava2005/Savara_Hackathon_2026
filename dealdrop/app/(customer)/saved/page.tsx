'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Bookmark, Navigation, Clock, Heart, RefreshCw, MapPin } from 'lucide-react';
import { useAppStore } from '@/store/appStore';

interface SavedDeal {
  id: string;
  product_name: string;
  category: string;
  original_price: number;
  current_price: number;
  discount_percent: number;
  quantity_remaining: number;
  expiry_time: string;
  image_url: string;
  distance_km: number;
  retailers: { shop_name: string; address: string };
}

function useCountdown(expiry: string) {
  const [left, setLeft] = useState('');
  useEffect(() => {
    const update = () => {
      const ms = new Date(expiry).getTime() - Date.now();
      if (ms <= 0) { setLeft('Expired'); return; }
      const h = Math.floor(ms / 3_600_000);
      const m = Math.floor((ms % 3_600_000) / 60_000);
      const s = Math.floor((ms % 60_000) / 1_000);
      setLeft(h > 0 ? `${h}h ${m}m` : `${m}m ${s}s`);
    };
    update();
    const t = setInterval(update, 1_000);
    return () => clearInterval(t);
  }, [expiry]);
  return left;
}

function SavedCard({ deal, onUnsave }: { deal: SavedDeal; onUnsave: () => void }) {
  const countdown = useCountdown(deal.expiry_time);
  const isUrgent = deal.quantity_remaining <= 3;

  return (
    <div className="bg-white rounded-[28px] overflow-hidden shadow-sm border border-gray-100 group hover:shadow-lg transition-all duration-300">
      <div className="flex gap-4 p-4">
        {/* Thumbnail */}
        <Link href={`/deals/${deal.id}`} className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 block bg-slate-100">
          <img
            src={deal.image_url || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            alt={deal.product_name}
          />
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <Link href={`/deals/${deal.id}`}>
              <h4 className="font-black text-[15px] text-gray-900 truncate pr-2 hover:text-orange-500 transition-colors">
                {deal.product_name}
              </h4>
            </Link>
            <button
              onClick={onUnsave}
              className="w-8 h-8 rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 shrink-0 transition-colors"
              title="Remove from saved"
            >
              <Heart size={16} fill="currentColor" />
            </button>
          </div>

          <p className="text-[12px] text-gray-400 font-semibold mb-2 truncate">
            {deal.retailers?.shop_name ?? 'Local Store'}
          </p>

          <div className="flex items-center gap-3 mb-3">
            <span className="font-black text-orange-500 text-[15px]">
              ₹{deal.current_price.toFixed(0)}
            </span>
            <span className="text-gray-300 line-through text-sm">
              ₹{deal.original_price.toFixed(0)}
            </span>
            <span className="text-[10px] font-black text-red-500 bg-red-50 px-2 py-0.5 rounded-lg">
              {Math.round(deal.discount_percent)}% OFF
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-gray-400 font-bold">
            <span className="flex items-center gap-1">
              <Navigation size={11} /> {deal.distance_km?.toFixed(1) ?? '—'} km
            </span>
            <span className={`flex items-center gap-1 ${isUrgent ? 'text-red-500' : ''}`}>
              <Clock size={11} className={isUrgent ? 'animate-pulse' : ''} />
              {countdown}
            </span>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${isUrgent ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-400'}`}>
              {deal.quantity_remaining} left
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-gray-50 px-4 pb-4 pt-3 flex gap-3">
        <Link
          href={`/deals/${deal.id}`}
          className="flex-1 h-10 bg-orange-500 text-white rounded-xl flex items-center justify-center font-black text-sm shadow-sm hover:opacity-90 transition-opacity"
        >
          Claim Now
        </Link>
        <button
          onClick={() => {
            const q = encodeURIComponent(deal.retailers?.address ?? deal.retailers?.shop_name ?? '');
            window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, '_blank');
          }}
          className="h-10 px-4 border border-gray-200 rounded-xl text-gray-500 text-sm font-bold hover:bg-gray-50 transition-colors flex items-center gap-1.5"
        >
          <MapPin size={14} /> Navigate
        </button>
      </div>
    </div>
  );
}

export default function SavedPage() {
  const { savedDealIds, toggleSave } = useAppStore();
  const [savedDeals, setSavedDeals] = useState<SavedDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [localSavedIds, setLocalSavedIds] = useState<string[]>([]);

  // Load saved deal IDs from Supabase, fall back to store
  const fetchSaved = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/customer/saved');
      if (res.ok) {
        const json = await res.json();
        setLocalSavedIds(json.savedIds ?? []);
        
        // Fetch full deal details for each saved deal
        if ((json.savedIds ?? []).length > 0) {
          // Fetch deals from API — we fetch all nearby with large radius as a workaround
          // since we don't have a /api/deals/[id] batch endpoint
          const dealsRes = await fetch('/api/deals?lat=12.9716&lng=77.5946&radius_km=100');
          if (dealsRes.ok) {
            const dealsJson = await dealsRes.json();
            const allDeals: SavedDeal[] = dealsJson.deals ?? [];
            setSavedDeals(allDeals.filter(d => json.savedIds.includes(d.id)));
          }
        } else {
          setSavedDeals([]);
        }
      } else {
        // Fallback: use Zustand store IDs (show local state)
        setLocalSavedIds(savedDealIds);
      }
    } catch {
      setLocalSavedIds(savedDealIds);
    } finally {
      setLoading(false);
    }
  }, [savedDealIds]);

  useEffect(() => { fetchSaved(); }, []);

  const handleUnsave = async (dealId: string) => {
    // Optimistic UI update
    setSavedDeals(prev => prev.filter(d => d.id !== dealId));
    setLocalSavedIds(prev => prev.filter(id => id !== dealId));

    // Sync to Supabase
    try {
      await fetch('/api/customer/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deal_id: dealId }),
      });
    } catch {}

    // Also remove from local Zustand store
    toggleSave(dealId);
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#f5f7fa] pb-28 md:pb-8">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-gray-100 px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            Saved Pulses
            <Bookmark size={20} className="text-orange-500" fill="currentColor" />
          </h1>
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
            {loading ? 'Loading…' : `${savedDeals.length} bookmark${savedDeals.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={fetchSaved}
          className="w-10 h-10 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center hover:bg-orange-100 transition-colors"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="px-5 md:px-6 pt-6 max-w-2xl mx-auto w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
              <div className="w-6 h-6 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
            </div>
            <p className="text-gray-400 font-semibold text-sm">Loading your saved pulses…</p>
          </div>
        ) : savedDeals.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-[32px] border border-gray-100 shadow-sm p-10">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <Bookmark size={36} className="text-red-200" />
            </div>
            <h3 className="text-xl font-black text-gray-800 mb-2">Nothing Saved Yet</h3>
            <p className="text-gray-400 font-medium mb-7 leading-relaxed">
              Tap the ❤️ heart on any deal card to bookmark it here.
            </p>
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 bg-orange-500 text-white font-black px-6 py-3 rounded-2xl hover:opacity-90 transition-opacity shadow-lg shadow-orange-200"
            >
              Explore Deals
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {savedDeals.map(deal => (
              <SavedCard
                key={deal.id}
                deal={deal}
                onUnsave={() => handleUnsave(deal.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
