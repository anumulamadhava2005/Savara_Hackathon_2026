"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, Heart, Zap, Navigation, Clock, TrendingUp, Frown, MapPin } from 'lucide-react';
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
      <div className="md:hidden flex justify-between items-center p-5 pb-3">
        <div className="flex items-center gap-3">
          <img src={currentUser?.avatar_url} className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm" />
          <div>
            <p className="text-xs text-on-surface-variant font-medium">Good afternoon 👋</p>
            <p className="font-extrabold text-[15px] text-on-surface leading-tight">{currentUser?.full_name?.split(' ')[0] || 'Explorer'}</p>
          </div>
        </div>
        <div className="w-10 h-10 bg-[#ffefdb] text-[#a33700] rounded-full flex items-center justify-center font-black text-sm">
          {(currentUser?.reward_points || 0) > 999 ? `${Math.floor((currentUser?.reward_points || 0) / 1000)}k` : currentUser?.reward_points}
          <span className="sr-only">pts</span>
        </div>
      </div>

      {/* Desktop header row */}
      <div className="hidden md:flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-on-surface tracking-tight">Discover</h1>
          <p className="text-on-surface-variant font-medium mt-1">Real-time pulses in your neighborhood</p>
        </div>
        <div className="relative w-72">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-outline-variant" />
          </div>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search local gems..."
            className="w-full h-12 bg-surface-container-low border border-surface-container-high text-on-surface placeholder:text-outline-variant rounded-full pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium text-[15px] shadow-sm"
          />
        </div>
      </div>

      {/* Mobile search */}
      <div className="md:hidden px-5 mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={16} className="text-outline-variant" />
          </div>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search deals, stores..."
            className="w-full h-11 bg-[#e6e8ea] text-on-surface placeholder:text-outline-variant rounded-full pl-10 pr-4 focus:outline-none text-[14px] font-medium"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="px-5 md:px-0 mb-6">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full text-[13px] font-bold shadow-sm transition-all ${
                activeCategory === cat
                  ? 'bg-primary text-white btn-gradient shadow-md'
                  : 'bg-white text-on-surface hover:bg-surface-container border border-surface-container-high/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Deals Grid */}
      <div className="px-5 md:px-0 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-[20px] font-extrabold text-on-surface tracking-tight">
            {activeCategory === 'All' ? 'Live Near You' : `${activeCategory} Deals`}
          </h2>
          <Link href="/deals" className="text-[13px] font-bold text-primary hover:underline flex items-center gap-1">
            My Deals <ChevronDown size={14} className="-rotate-90" />
          </Link>
        </div>

        {filtered.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-surface-container-low rounded-3xl border border-surface-container-high">
            <Frown className="mx-auto text-outline-variant mb-4" size={48} />
            <h3 className="text-lg font-bold text-on-surface mb-2">No pulses here!</h3>
            <p className="text-on-surface-variant font-medium max-w-sm mx-auto">Try a different category or search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((deal, index) => {
              const isSaved = savedDealIds.includes(deal.id);
              const isUrgent = deal.quantity_remaining <= 4;
              return (
                <div key={deal.id} className="relative group">
                  <Link href={`/deals/${deal.id}`} className="block">
                    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-surface-container-high hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                      <div className="relative h-[220px] bg-slate-100">
                        <img
                          src={deal.image_url}
                          alt={deal.product_name}
                          className="w-full h-full object-cover"
                        />
                        {deal.discount_percent > 50 && (
                          <div className="absolute top-3 left-3 bg-[#fcab23] text-white text-[10px] font-black px-2.5 py-1 rounded-md flex items-center gap-1 uppercase tracking-wider shadow-sm">
                            <TrendingUp size={12} strokeWidth={3} /> Hot Pick
                          </div>
                        )}
                        {deal.is_flash_mob && (
                          <div className="absolute top-3 left-3 bg-primary text-white text-[10px] font-black px-2.5 py-1 rounded-md flex items-center gap-1 uppercase tracking-wider shadow-sm btn-gradient">
                            <Zap size={12} fill="white" /> Squad Drop
                          </div>
                        )}
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-primary text-[10px] font-black px-2.5 py-1 rounded-md shadow-sm">
                          {Math.round(deal.discount_percent)}% OFF
                        </div>
                        <div className={`absolute bottom-3 left-3 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${isUrgent ? 'bg-[#b31b25]/90' : 'bg-black/60'}`}>
                          <Clock size={12} className={isUrgent ? 'animate-pulse' : ''} />
                          {new Date(deal.expiry_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-extrabold text-[16px] text-on-surface truncate pr-2 max-w-[70%]">{deal.retailers.shop_name}</h3>
                          <span className="font-extrabold text-[16px] text-primary">${deal.current_price.toFixed(2)}</span>
                        </div>
                        <p className="text-[14px] font-bold text-on-surface-variant truncate mb-3">{deal.product_name}</p>
                        <div className="flex items-center gap-3 text-[12px] text-on-surface-variant font-medium">
                          <span className="flex items-center gap-1"><Navigation size={12} /> {deal.distance_km} km away</span>
                          <span className={`flex items-center gap-1 ${isUrgent ? 'text-[#b31b25] font-bold' : ''}`}>
                            <Zap size={12} className={isUrgent ? 'fill-[#b31b25] text-[#b31b25]' : ''} />
                            {deal.quantity_remaining} left
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                  {/* Save button */}
                  <button
                    onClick={() => toggleSave(deal.id)}
                    className={`absolute top-[232px] right-6 w-9 h-9 rounded-full flex items-center justify-center shadow-md border transition-all z-10 ${
                      isSaved ? 'bg-[#b31b25] border-[#b31b25] text-white' : 'bg-white border-surface-container-high text-on-surface-variant hover:text-[#b31b25]'
                    }`}
                  >
                    <Heart size={16} fill={isSaved ? 'white' : 'none'} />
                  </button>
                </div>
              );
            })}

            {/* Surprise Pulse card */}
            <div className="bg-primary rounded-3xl p-7 text-white shadow-xl btn-gradient relative overflow-hidden pulse-animation border-[2px] border-white/30 flex flex-col justify-between min-h-[320px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
              <div>
                <Zap size={28} className="mb-4 text-[#ffefdb]" fill="currentColor" />
                <h3 className="text-[22px] font-extrabold mb-2 tracking-tight">Surprise Pulse!</h3>
                <p className="text-[14px] text-white/90 font-medium leading-relaxed">A mystery deal within 500m is locked behind the pulse. Unlock to reveal the merchant.</p>
              </div>
              <Link href="/map" className="block mt-6 bg-white text-primary text-center font-extrabold text-[15px] py-4 rounded-xl shadow-md hover:bg-surface transition-colors">
                Reveal on Map
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
