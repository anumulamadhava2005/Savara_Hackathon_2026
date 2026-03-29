"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, Navigation, MapPin, Zap } from 'lucide-react';
import { useAppStore } from '@/store/appStore';

export default function PulseMapPage() {
  const { deals } = useAppStore();
  const [activeId, setActiveId] = useState<string | null>(null);

  // Map pins from real deals (spread over mock positions)
  const positions = [
    { x: 28, y: 42 },
    { x: 62, y: 22 },
    { x: 72, y: 67 },
    { x: 44, y: 78 },
    { x: 55, y: 48 },
    { x: 80, y: 35 },
  ];

  const activeDeal = deals.find(d => d.id === activeId);

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-900 relative overflow-hidden md:rounded-3xl">
      {/* Map background */}
      <div className="absolute inset-0 z-0 opacity-80">
        <div className="w-full h-full bg-slate-800" style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        {/* Heatmap blobs from deal positions */}
        {deals.slice(0, 3).map((d, i) => (
          <div
            key={d.id}
            className="absolute rounded-full blur-[70px] opacity-60"
            style={{
              top: `${positions[i]?.y || 30}%`,
              left: `${positions[i]?.x || 50}%`,
              width: '220px',
              height: '220px',
              background: d.quantity_remaining <= 4 ? '#b31b25' : '#d35400',
              transform: 'translate(-50%, -50%)',
            }}
          ></div>
        ))}
        <div className="absolute inset-0 bg-slate-900/40"></div>
      </div>

      {/* Header */}
      <div className="z-10 p-5 pt-10 md:pt-6 pb-4 bg-gradient-to-b from-slate-900/90 to-transparent">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={16} className="text-white/60" />
            </div>
            <input
              type="text"
              placeholder="Search active pulses..."
              className="w-full h-11 bg-black/40 backdrop-blur-md border border-white/10 text-white placeholder:text-white/50 rounded-full pl-10 pr-4 focus:outline-none focus:border-primary/50 text-sm transition-all"
            />
          </div>
          <div className="w-10 h-10 bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-white/10 transition-colors">
            <SlidersHorizontal size={18} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-[#b31b25] px-3 py-1 rounded-full flex items-center gap-2 border border-red-500/30 shadow-[0_0_15px_rgba(179,27,37,0.5)]">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
            <span className="text-[10px] font-bold tracking-widest text-white uppercase">{deals.length} Live Heat zones</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-bold border border-white/10">
            Bangalore, India
          </div>
        </div>
      </div>

      {/* Map pins area */}
      <div className="flex-1 relative z-10 w-full" onClick={() => setActiveId(null)}>
        {/* User location */}
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white z-20 shadow-[0_0_15px_rgba(59,130,246,0.8)] relative"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-blue-400/15 rounded-full animate-[pulse_3s_infinite]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-400/08 rounded-full animate-[pulse_3s_infinite]" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Deal pins */}
        {deals.map((deal, i) => {
          const pos = positions[i] || { x: 50, y: 50 };
          const isActive = activeId === deal.id;
          const isUrgent = deal.quantity_remaining <= 4;
          return (
            <div
              key={deal.id}
              className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer group z-30"
              style={{ top: `${pos.y}%`, left: `${pos.x}%` }}
              onClick={(e) => { e.stopPropagation(); setActiveId(isActive ? null : deal.id); }}
            >
              {/* Tooltip */}
              <div className={`mb-1.5 bg-white px-3 py-2 rounded-xl shadow-lg border border-surface-container transition-all duration-200 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                <p className="text-[11px] font-black text-on-surface whitespace-nowrap">{deal.retailers.shop_name}</p>
                <p className="text-[10px] text-primary font-bold whitespace-nowrap">{Math.round(deal.discount_percent)}% OFF · ${deal.current_price.toFixed(2)}</p>
              </div>
              
              <div className={`relative flex items-center justify-center w-9 h-9 rounded-full shadow-lg border-2 border-white transition-all duration-300 hover:scale-110 ${
                isUrgent
                  ? 'bg-[#b31b25] pulse-animation'
                  : deal.is_flash_mob
                  ? 'bg-primary btn-gradient'
                  : 'bg-[#ff7943]'
              }`}>
                <Zap size={16} color="white" fill="white" />
                {isUrgent && (
                  <span className="absolute -top-1.5 -right-1.5 bg-white text-[#b31b25] text-[8px] font-black rounded-full w-4 h-4 flex items-center justify-center border border-[#b31b25]/20">
                    {deal.quantity_remaining}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom overlay when pin active */}
      <div className={`absolute bottom-24 md:bottom-6 left-5 right-5 z-40 transition-all duration-400 ${activeId ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'}`}>
        {activeDeal && (
          <div className="bg-white rounded-3xl p-4 shadow-2xl flex items-center gap-4 relative">
            <div className="absolute -top-3 right-5 bg-primary text-white text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-wider btn-gradient shadow-sm">
              {activeDeal.distance_km} km
            </div>
            <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden shadow-inner shrink-0">
              <img src={activeDeal.image_url} alt={activeDeal.product_name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-extrabold text-on-surface text-lg truncate">{activeDeal.retailers.shop_name}</h3>
              <p className="text-[13px] text-primary font-bold truncate">{activeDeal.product_name}</p>
              <p className="text-[12px] text-on-surface-variant font-medium mt-0.5">
                ${activeDeal.current_price.toFixed(2)} · {activeDeal.quantity_remaining} remaining
              </p>
            </div>
            <Link
              href={`/deals/${activeDeal.id}`}
              className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors shrink-0"
            >
              <Navigation size={18} strokeWidth={2.5} className="ml-0.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
