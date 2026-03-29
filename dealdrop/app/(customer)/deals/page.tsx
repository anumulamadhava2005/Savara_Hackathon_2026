"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Ticket, ExternalLink, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/appStore';

export default function MyDealsPage() {
  const { deals, claimedDealIds } = useAppStore();
  const [tab, setTab] = useState<'active' | 'history'>('active');

  const claimedDeals = deals.filter(d => claimedDealIds.includes(d.id));

  return (
    <div className="flex flex-col min-h-[100dvh] bg-surface relative pb-28 md:pb-8">
      <div className="flex items-center justify-between p-6 pb-4 sticky top-0 bg-surface/90 backdrop-blur-xl z-30 border-b border-surface-container-high/50">
        <Link href="/discover" className="md:hidden text-on-surface"><ArrowLeft size={24} strokeWidth={2.5} /></Link>
        <h1 className="text-[22px] font-extrabold tracking-tight text-on-surface flex items-center gap-2 flex-1 pl-2 md:pl-0">
          My Active Deals <Ticket size={20} className="text-primary" />
        </h1>
      </div>

      <div className="px-6 md:px-0 pt-4 max-w-3xl mx-auto w-full">
        {/* Tab row */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('active')}
            className={`px-5 py-2 rounded-full text-[13px] font-bold transition-colors ${tab === 'active' ? 'bg-primary text-white btn-gradient shadow-sm' : 'bg-white text-on-surface-variant border border-surface-container'}`}
          >
            Active ({claimedDeals.length})
          </button>
          <button
            onClick={() => setTab('history')}
            className={`px-5 py-2 rounded-full text-[13px] font-bold transition-colors ${tab === 'history' ? 'bg-primary text-white btn-gradient shadow-sm' : 'bg-white text-on-surface-variant border border-surface-container'}`}
          >
            History
          </button>
        </div>

        {claimedDeals.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-surface-container p-6">
            <Ticket className="mx-auto text-outline-variant mb-4" size={48} />
            <h3 className="text-lg font-bold text-on-surface mb-2">No Active Deals</h3>
            <p className="text-on-surface-variant font-medium mb-6">You haven't reserved any pulses yet. Explore the discover feed!</p>
            <Link href="/discover"><Button>Explore Discover</Button></Link>
          </div>
        ) : (
          <div className="space-y-4">
            {claimedDeals.map(deal => (
              <Link key={deal.id} href={`/redeem/${deal.id}`} className="block bg-white rounded-[24px] overflow-hidden shadow-sm border border-surface-container hover:shadow-md transition-shadow group">
                <div className="p-5 flex gap-4">
                  <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                    <img src={deal.image_url} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-extrabold text-[15px] truncate max-w-[80%] text-on-surface group-hover:text-primary transition-colors">
                        {deal.product_name}
                      </h4>
                      <span className="font-bold text-primary shrink-0">${deal.current_price.toFixed(2)}</span>
                    </div>
                    <p className="text-[13px] text-on-surface-variant font-medium mb-3">{deal.retailers.shop_name}</p>
                    <div className="bg-surface-container-low rounded-lg p-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[#b31b25] text-[11px] font-bold uppercase tracking-wider">
                        <Clock size={12} className="animate-pulse" /> Expires {new Date(deal.expiry_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <ExternalLink size={14} className="text-primary" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
