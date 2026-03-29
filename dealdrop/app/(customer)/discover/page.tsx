"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, Heart, Zap, Navigation, Clock, TrendingUp, Frown, MapPin, Sparkles, ShieldCheck } from '@/components/ui/Icons';
import { useAppStore } from '@/store/appStore';

const CATEGORIES = ['All', 'Food', 'Wellness', 'Fashion', 'Grocery'];

export default function DiscoverPage() {
  const { deals, savedDealIds, toggleSave, currentUser } = useAppStore();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = deals.filter(d => {
    const matchCat = activeCategory === 'All' || d.category.toLowerCase() === activeCategory.toLowerCase();
    const matchSearch = !search || d.product_name.toLowerCase().includes(search.toLowerCase()) || d.retailers.shop_name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="flex flex-col min-h-full bg-surface relative pb-8 md:pb-0 pt-0">
      {/* Mobile header */}
      <div className="md:hidden flex justify-between items-center p-6 pb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src={currentUser?.avatar_url} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md bg-slate-200" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full primary-gradient border-2 border-white flex items-center justify-center">
              <Sparkles size={8} fill="white" />
            </div>
          </div>
          <div>
            <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest">Citizen Protocol</p>
            <p className="font-headline font-black text-lg text-on-surface leading-tight">{currentUser?.full_name?.split(' ')[0] || 'Explorer'}</p>
          </div>
        </div>
        <div className="h-11 px-4 bg-[#ffefdb] text-[#a33700] rounded-2xl flex items-center gap-2 font-black text-sm shadow-sm">
          <Zap size={16} fill="currentColor" />
          {(currentUser?.reward_points || 0) > 999 ? `${Math.floor((currentUser?.reward_points || 0) / 1000)}k` : currentUser?.reward_points}
        </div>
      </div>

      {/* Desktop header row */}
      <div className="hidden md:flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-headline font-black text-on-surface tracking-tight">Discover</h1>
          <p className="text-on-surface-variant font-bold mt-1 text-lg">Real-time pulses in your neighborhood</p>
        </div>
        <div className="relative w-80">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search size={20} className="text-outline-variant" />
          </div>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search local pulses..."
            className="w-full h-14 bg-white border border-surface-container-high text-on-surface placeholder:text-outline-variant rounded-3xl pl-13 pr-6 focus:outline-none focus:ring-4 focus:ring-primary/10 font-bold text-[15px] shadow-sm transition-all"
          />
        </div>
      </div>

      {/* Mobile search */}
      <div className="md:hidden px-6 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search size={18} className="text-on-surface-variant/40" />
          </div>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search deals, stores..."
            className="w-full h-12 bg-white text-on-surface placeholder:text-on-surface-variant/40 rounded-2xl pl-12 pr-4 focus:outline-none text-[15px] font-bold shadow-sm border border-surface-container-high/30"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="px-6 md:px-0 mb-8 overflow-visible">
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-6 py-3 rounded-2xl text-[14px] font-black transition-all ${activeCategory === cat
                  ? 'primary-gradient text-white shadow-xl shadow-primary/20 scale-105'
                  : 'bg-white text-on-surface hover:bg-surface-container border border-surface-container-high/50 shadow-sm'
                }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Deals Grid */}
      <div className="px-6 md:px-0 space-y-8">
        <div className="flex justify-between items-end">
          <h2 className="text-2xl font-headline font-black text-on-surface tracking-tight">
            {activeCategory === 'All' ? 'Live Near You' : `${activeCategory} Pulses`}
          </h2>
          <Link href="/deals" className="text-[13px] font-black text-primary hover:underline flex items-center gap-1.5 uppercase tracking-widest">
            My Deals <ChevronDown size={14} className="-rotate-90" />
          </Link>
        </div>

        {filtered.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-[40px] border border-dashed border-surface-container-high shadow-inner">
            <Frown className="mx-auto text-outline-variant/30 mb-6" size={64} />
            <h3 className="text-xl font-headline font-black text-on-surface mb-2">No pulses detected!</h3>
            <p className="text-on-surface-variant font-bold max-w-sm mx-auto">Try a different category or search term to bypass the void.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((deal, index) => {
              const isSaved = savedDealIds.includes(deal.id);
              const isUrgent = deal.quantity_remaining <= 4;
              return (
                <div key={deal.id} className="relative group">
                  <Link href={`/deals/${deal.id}`} className="block">
                    <div className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-surface-container-high/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                      <div className="relative h-[240px] bg-slate-100 overflow-hidden">
                        <img
                          src={deal.image_url}
                          alt={deal.product_name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                        
                        {deal.discount_percent > 50 && (
                          <div className="absolute top-4 left-4 bg-[#fcab23] text-white text-[10px] font-black px-3 py-1.5 rounded-xl flex items-center gap-1.5 uppercase tracking-widest shadow-lg">
                            <TrendingUp size={14} strokeWidth={3} /> Hot Pick
                          </div>
                        )}
                        {deal.is_flash_mob && (
                          <div className="absolute top-4 left-4 primary-gradient text-white text-[10px] font-black px-3 py-1.5 rounded-xl flex items-center gap-1.5 uppercase tracking-widest shadow-lg">
                            <Zap size={14} fill="white" /> Squad Drop
                          </div>
                        )}
                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md text-primary text-[12px] font-black px-3 py-1.5 rounded-xl shadow-lg border border-white">
                          {Math.round(deal.discount_percent)}% OFF
                        </div>
                        <div className={`absolute bottom-4 left-4 backdrop-blur-md text-white text-[11px] font-black px-4 py-2 rounded-2xl flex items-center gap-2 ${isUrgent ? 'bg-[#b31b25]/90 animate-pulse' : 'bg-black/60'}`}>
                          <Clock size={14} strokeWidth={2.5} />
                          {new Date(deal.expiry_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-headline font-black text-lg text-on-surface truncate pr-2 max-w-[70%]">{deal.retailers.shop_name}</h3>
                          <span className="font-headline font-black text-xl text-primary">${deal.current_price.toFixed(2)}</span>
                        </div>
                        <p className="text-[15px] font-bold text-on-surface-variant truncate mb-5">{deal.product_name}</p>
                        <div className="flex items-center justify-between text-[11px] text-on-surface-variant font-black uppercase tracking-widest">
                          <span className="flex items-center gap-1.5"><Navigation size={14} className="text-secondary" /> {deal.distance_km} km Away</span>
                          <span className={`flex items-center gap-1.5 ${isUrgent ? 'text-[#b31b25]' : 'text-primary'}`}>
                            <Zap size={14} fill="currentColor" />
                            {deal.quantity_remaining} left
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                  {/* Save button */}
                  <button
                    onClick={() => toggleSave(deal.id)}
                    className={`absolute bottom-28 right-8 w-12 h-12 rounded-full flex items-center justify-center shadow-xl border-4 border-white transition-all duration-300 z-10 active:scale-90 ${isSaved ? 'bg-[#b31b25] text-white' : 'bg-white text-on-surface-variant hover:text-[#b31b25]'
                      }`}
                  >
                    <Heart size={20} strokeWidth={2.5} fill={isSaved ? 'white' : 'none'} />
                  </button>
                </div>
              );
            })}

            {/* Surprise Pulse card */}
            <div className="primary-gradient rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden pulse-animation border-[3px] border-white/20 flex flex-col justify-between min-h-[340px] hover:scale-[1.02] transition-transform duration-500">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl transform translate-x-14 -translate-y-14"></div>
              <div>
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/30 shadow-lg">
                  <Zap size={32} className="text-[#ffefdb]" fill="currentColor" />
                </div>
                <h3 className="text-3xl font-headline font-black mb-3 tracking-tight">Ghost Pulse</h3>
                <p className="text-[15px] text-white/90 font-bold leading-relaxed">A high-value mystery drop is active within 300m. Location is encrypted. Reveal to claim.</p>
              </div>
              <Link href="/map" className="block mt-8 bg-white text-primary text-center font-headline font-black text-base py-5 rounded-2xl shadow-xl hover:bg-surface transition-all active:scale-95 group">
                REVEAL CO-ORDINATES <Navigation size={18} className="inline ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="currentColor" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
