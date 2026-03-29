"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Ticket, Clock, Sparkles, Navigation, ShieldCheck, ChevronDown, CheckCircle2, X, RefreshCw, Frown } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';

interface ClaimedDeal {
  claim_id: string;
  claim_status: string;
  claimed_at: string;
  id: string;            // deal id
  product_name: string;
  description?: string;
  category?: string;
  original_price: number;
  current_price: number;
  discount_percent: number;
  quantity_remaining?: number;
  expiry_time: string;
  image_url?: string;
  is_flash_mob?: boolean;
  status?: string;
  distance_km?: number;
  retailers?: {
    shop_name: string;
    address?: string;
    avatar_url?: string;
    rating?: number;
  };
}

export default function MyDealsPage() {
  const [loading, setLoading] = useState(true);
  const [claims, setClaims] = useState<ClaimedDeal[]>([]);
  const [tab, setTab] = useState<'active' | 'history'>('active');
  const [selectedDeal, setSelectedDeal] = useState<ClaimedDeal | null>(null);
  const [error, setError] = useState('');

  const fetchClaims = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/claims');
      if (!res.ok) {
        if (res.status === 401) { window.location.href = '/login'; return; }
        throw new Error('Failed to load claims');
      }
      const data = await res.json();
      setClaims(data.claims ?? []);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClaims(); }, []);

  const now = new Date();
  const activeDeals  = claims.filter(d => d.expiry_time && new Date(d.expiry_time) > now);
  const historyDeals = claims.filter(d => !d.expiry_time || new Date(d.expiry_time) <= now);
  const currentList  = tab === 'active' ? activeDeals : historyDeals;

  return (
    <div className="flex flex-col min-h-screen bg-surface relative pb-28 md:pb-8 pt-0">
      {/* Header Area */}
      <div className="px-6 pt-10 pb-8 bg-white border-b border-surface-container-high relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 primary-gradient/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="max-w-2xl mx-auto flex items-center justify-between relative z-10">
          <div>
            <h1 className="text-4xl font-headline font-black text-on-surface tracking-tighter">My <span className="text-primary">Wallet</span></h1>
            <p className="text-on-surface-variant font-bold mt-1 uppercase tracking-[0.2em] text-[10px]">Vault Protocol Active</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchClaims} className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500 hover:text-primary hover:bg-primary/10 transition-colors">
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <Ticket size={24} strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-0 -mt-6 max-w-2xl mx-auto w-full relative z-20">
        {/* Tab Switcher */}
        <div className="flex p-1.5 bg-white rounded-3xl border border-surface-container-high shadow-xl mb-10 w-fit mx-auto md:mx-0">
          <button
            onClick={() => setTab('active')}
            className={`px-8 py-3 rounded-2xl text-xs font-black transition-all uppercase tracking-widest ${tab === 'active' ? 'primary-gradient text-white shadow-lg' : 'text-on-surface-variant hover:bg-surface-container'}`}
          >
            Active ({activeDeals.length})
          </button>
          <button
            onClick={() => setTab('history')}
            className={`px-8 py-3 rounded-2xl text-xs font-black transition-all uppercase tracking-widest ${tab === 'history' ? 'primary-gradient text-white shadow-lg' : 'text-on-surface-variant hover:bg-surface-container'}`}
          >
            History ({historyDeals.length})
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center">
              <div className="w-7 h-7 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
            <p className="text-gray-400 font-semibold text-sm">Loading your claimed deals…</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 bg-white rounded-[2rem] border border-gray-100">
            <Frown size={48} className="text-gray-200" />
            <p className="text-sm text-red-500 font-bold">{error}</p>
            <button onClick={fetchClaims} className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full text-sm font-bold">
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        ) : currentList.length === 0 ? (
          <div className="bg-white rounded-[44px] p-20 text-center border border-dashed border-surface-container-high shadow-sm">
            <div className="w-20 h-20 rounded-full bg-surface-container mx-auto mb-6 flex items-center justify-center text-outline-variant">
              <Ticket size={40} />
            </div>
            <h3 className="text-2xl font-headline font-black text-on-surface mb-2">
              {tab === 'active' ? 'No Active Deals' : 'No History Yet'}
            </h3>
            <p className="text-on-surface-variant font-bold mb-8">
              {tab === 'active'
                ? "You haven't claimed any active deals yet."
                : 'Your past deals will appear here once they expire.'}
            </p>
            <Link href="/discover">
              <Button className="rounded-2xl px-8 h-14 font-headline font-black">DISCOVER DEALS</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {currentList.map(deal => (
              <div
                key={deal.claim_id}
                onClick={() => setSelectedDeal(deal)}
                className="group cursor-pointer relative"
              >
                {/* Glow on hover */}
                <div className="absolute -inset-0.5 primary-gradient opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 rounded-[36px]" />

                <div className="bg-white rounded-[36px] overflow-hidden shadow-xl border border-surface-container-high flex flex-col md:flex-row transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                  {/* Left Side: Info */}
                  <div className="flex-1 p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden shrink-0 shadow-sm">
                        <img
                          src={deal.image_url || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=100'}
                          alt={deal.product_name ?? 'Deal'}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-0.5">
                          {deal.retailers?.shop_name ?? 'Local Store'}
                        </p>
                        <h4 className="font-headline font-black text-lg text-on-surface truncate pr-2 leading-tight">
                          {deal.product_name ?? 'Deal'}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-[11px] font-black text-on-surface-variant uppercase tracking-widest mb-6">
                      <span className="flex items-center gap-1.5">
                        <Sparkles size={14} className="text-primary" /> {Math.round(deal.discount_percent ?? 0)}% OFF
                      </span>
                      <span className="w-1 h-1 rounded-full bg-outline-variant" />
                      <span className="capitalize text-gray-400">{deal.category ?? 'general'}</span>
                    </div>

                    <div className={`px-4 py-3 rounded-2xl flex items-center justify-between ${
                      tab === 'active'
                        ? 'bg-[#fae8e8] text-[#b31b25]'
                        : 'bg-surface-container text-on-surface-variant opacity-60'
                    }`}>
                      <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider">
                        <Clock size={16} className={tab === 'active' ? 'animate-pulse' : ''} />
                        {tab === 'active'
                          ? `Expires ${new Date(deal.expiry_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                          : 'Pulse Expired'}
                      </div>
                      <ShieldCheck size={18} />
                    </div>
                  </div>

                  {/* Perforated Divider */}
                  <div className="relative flex items-center justify-center md:flex-col group-hover:bg-primary/5 transition-colors">
                    <div className="hidden md:block absolute -top-4 w-8 h-8 rounded-full bg-surface border-b border-surface-container-high shadow-inner" />
                    <div className="md:w-px md:h-full h-px w-full border-t-4 md:border-t-0 md:border-l-4 border-dashed border-surface-container-high mx-8 md:mx-0 md:my-8 opacity-40" />
                    <div className="hidden md:block absolute -bottom-4 w-8 h-8 rounded-full bg-surface border-t border-surface-container-high shadow-inner" />
                  </div>

                  {/* Right Side: Price */}
                  <div className="bg-surface-container-low/30 md:w-36 flex flex-col items-center justify-center p-6 md:p-8 shrink-0 text-center border-t md:border-t-0 md:border-l border-surface-container-high/50">
                    <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest mb-1 opacity-50 line-through">
                      ₹{(deal.original_price ?? 0).toFixed(0)}
                    </p>
                    <p className="font-headline font-black text-3xl text-primary mb-6">
                      ₹{(deal.current_price ?? 0).toFixed(0)}
                    </p>
                    <div className="w-12 h-12 rounded-2xl bg-white border border-surface-container-high flex items-center justify-center text-on-surface group-hover:text-primary transition-all shadow-sm">
                      <ChevronDown size={20} className="-rotate-90" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Redemption Overlay Modal */}
      {selectedDeal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xl animate-[fadeIn_0.3s_ease]" onClick={() => setSelectedDeal(null)} />
          <div className="relative bg-white rounded-[44px] w-full max-w-sm overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.3)] animate-[slideUp_0.4s_ease]">
            <button
              onClick={() => setSelectedDeal(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors"
            >
              <X size={20} />
            </button>

            <div className="pt-12 pb-8 px-8 text-center">
              <div className="w-14 h-14 rounded-2xl primary-gradient mx-auto mb-6 flex items-center justify-center text-white shadow-xl shadow-primary/20">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-2xl font-headline font-black text-on-surface mb-2">Redeem Protocol</h3>
              <p className="text-on-surface-variant font-bold text-[14px] leading-relaxed mb-10">
                Show this frequency key to the merchant at{' '}
                <span className="text-primary">{selectedDeal.retailers?.shop_name ?? 'the store'}</span>{' '}
                to claim your deal.
              </p>

              {/* QR Code Placeholder */}
              <div className="bg-surface-container-low rounded-[40px] p-10 border border-surface-container mb-8 relative group">
                <div className="w-full aspect-square bg-white rounded-3xl p-4 shadow-inner flex items-center justify-center border border-primary/10 relative overflow-hidden group-hover:scale-[1.05] transition-transform duration-700">
                  <div className="w-full h-full opacity-10 flex flex-wrap gap-2">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div key={i} className={`w-3 h-3 rounded-sm ${i % 3 === 0 ? 'bg-black' : 'bg-transparent'}`} />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-white/40 backdrop-blur-[2px]">
                    <Ticket size={48} className="text-primary/20 mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40">
                      ID: {(selectedDeal.claim_id ?? selectedDeal.id ?? '').slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="absolute inset-x-10 top-10 h-1 bg-primary/20 blur-[1px] rounded-full animate-[scan_2s_infinite]" />
              </div>

              <div className="bg-surface-container-low/50 rounded-2xl p-4 border border-surface-container flex items-center justify-between mb-8">
                <div className="text-left">
                  <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest leading-none mb-1">Status</p>
                  <p className="text-sm font-black text-[#1d823b] uppercase tracking-widest leading-none">Verified Live</p>
                </div>
                <CheckCircle2 size={24} className="text-[#1d823b]" />
              </div>

              <Button
                variant="outline"
                className="w-full h-14 rounded-2xl font-headline font-black border-2"
                onClick={() => setSelectedDeal(null)}
              >
                CLOSE VAULT
              </Button>
            </div>

            <div className="bg-primary/5 py-4 text-center border-t border-primary/10">
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">DEALDROP FREQUENCY KEY • SECURE-AUTH</p>
            </div>
          </div>
        </div>
      )}

      {/* Styles for Animations */}
      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(180px); opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
