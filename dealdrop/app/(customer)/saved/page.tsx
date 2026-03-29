"use client";

import React from 'react';
import Link from 'next/link';
import { Bookmark, Navigation, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/appStore';

export default function SavedPage() {
  const { deals, savedDealIds, toggleSave } = useAppStore();
  const saved = deals.filter(d => savedDealIds.includes(d.id));

  return (
    <div className="flex flex-col min-h-[100dvh] bg-surface relative pb-28 md:pb-8">
      <div className="flex items-center justify-between p-6 pb-4 sticky top-0 bg-surface/90 backdrop-blur-xl z-30 border-b border-surface-container-high/50">
        <h1 className="text-[22px] font-extrabold tracking-tight text-on-surface flex items-center gap-2">
          Saved Pulses <Bookmark size={20} className="text-primary" />
        </h1>
        {saved.length > 0 && (
          <span className="text-[13px] font-bold text-outline-variant">{saved.length} saved</span>
        )}
      </div>

      <div className="px-6 md:px-0 pt-4 max-w-3xl mx-auto w-full">
        {saved.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-surface-container p-8">
            <Bookmark className="mx-auto text-outline-variant mb-4" size={48} />
            <h3 className="text-lg font-bold text-on-surface mb-2">No Saved Deals Yet</h3>
            <p className="text-on-surface-variant font-medium mb-6">Tap the heart ❤️ on any deal card to save it here.</p>
            <Link href="/discover"><Button>Explore Discover</Button></Link>
          </div>
        ) : (
          <div className="space-y-4">
            {saved.map(deal => {
              const isExpiring = deal.quantity_remaining <= 3;
              return (
                <div key={deal.id} className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-surface-container group">
                  <div className="flex gap-4 p-4">
                    <Link href={`/deals/${deal.id}`} className="w-24 h-24 bg-slate-100 rounded-xl overflow-hidden shrink-0 block">
                      <img src={deal.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <Link href={`/deals/${deal.id}`}>
                          <h4 className="font-extrabold text-[15px] truncate text-on-surface group-hover:text-primary transition-colors">
                            {deal.product_name}
                          </h4>
                        </Link>
                        <button
                          onClick={() => toggleSave(deal.id)}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-[#b31b25] hover:bg-red-50 shrink-0 transition-colors"
                          title="Remove from saved"
                        >
                          <Bookmark size={16} fill="#b31b25" />
                        </button>
                      </div>
                      <p className="text-[13px] text-on-surface-variant font-medium mb-2 truncate">{deal.retailers.shop_name}</p>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="font-extrabold text-primary">${deal.current_price.toFixed(2)}</span>
                        <span className="text-outline-variant line-through text-sm">${deal.original_price.toFixed(2)}</span>
                        <span className="text-[10px] font-black text-[#b31b25] bg-red-50 px-1.5 py-0.5 rounded">{Math.round(deal.discount_percent)}% OFF</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-on-surface-variant font-medium">
                        <span className="flex items-center gap-1">
                          <Navigation size={11} /> {deal.distance_km} km
                        </span>
                        <span className={`flex items-center gap-1 ${isExpiring ? 'text-[#b31b25] font-bold' : ''}`}>
                          <Clock size={11} className={isExpiring ? 'animate-pulse' : ''} />
                          {new Date(deal.expiry_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isExpiring ? 'bg-red-50 text-[#b31b25]' : 'bg-surface-container text-on-surface-variant'}`}>
                          {deal.quantity_remaining} left
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-surface-container-high/50 px-4 pb-3 pt-3 flex gap-3">
                    <Link href={`/deals/${deal.id}`} className="flex-1 h-10 bg-primary text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-sm btn-gradient hover:opacity-90 transition-opacity">
                      Claim Now
                    </Link>
                    <button
                      onClick={() => {
                        const q = encodeURIComponent(deal.retailers.address);
                        window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, '_blank');
                      }}
                      className="h-10 px-4 border border-surface-container-high rounded-xl text-on-surface-variant text-sm font-bold hover:bg-surface-container transition-colors flex items-center gap-1.5"
                    >
                      <Navigation size={14} /> Navigate
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
