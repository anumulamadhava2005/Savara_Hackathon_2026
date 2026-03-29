"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Zap, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function LocationPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-surface relative px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 z-10 w-full relative">
        <Link href="/interests" className="text-on-surface hover:text-primary transition-colors absolute left-0">
          <ArrowLeft size={24} />
        </Link>
        <div className="flex justify-center flex-1">
          <div className="flex gap-2 items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-outline-variant/40"></div>
            <div className="w-6 h-1.5 rounded-full bg-[#8f2f00]"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-outline-variant/40"></div>
          </div>
        </div>
      </div>

      {/* Visual / Radar animation area */}
      <div className="relative flex justify-center items-center h-[320px] mb-8 w-full mt-8">
        {/* Background stylized lines (Mocking the radar swirl) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-60">
          <div className="w-full h-full max-w-[280px] max-h-[280px] rounded-full border-[1px] border-outline-variant/30 flex items-center justify-center">
            <div className="w-[80%] h-[80%] rounded-full border-[1.5px] border-outline-variant/40 flex items-center justify-center">
               <div className="w-[60%] h-[60%] rounded-full border-[2px] border-outline-variant/50"></div>
            </div>
          </div>
          <div className="absolute w-[2px] h-[340px] bg-gradient-to-b from-transparent via-outline-variant/40 to-transparent"></div>
          <div className="absolute h-[2px] w-[340px] bg-gradient-to-r from-transparent via-outline-variant/40 to-transparent"></div>
        </div>

        {/* Center Card */}
        <div className="bg-white rounded-[48px] shadow-2xl p-10 flex flex-col items-center justify-center relative z-10">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#ffefdb]/50 to-transparent rounded-[48px]"></div>
          
          <div className="w-[84px] h-[84px] rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(163,55,0,0.3)] relative btn-gradient pulse-animation z-20">
            <MapPin size={36} color="white" strokeWidth={2.5} />
            
            {/* LIVE Badge */}
            <div className="absolute -bottom-3 -right-6 bg-white shadow-xl rounded-full px-3 py-1.5 flex items-center gap-1.5 border border-surface-container whitespace-nowrap z-30">
              <div className="w-2 h-2 rounded-full bg-[#0058ba] animate-pulse"></div>
              <span className="text-[10px] font-bold text-[#0058ba] tracking-[0.1em] uppercase">Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-col items-center text-center space-y-5 flex-1 z-10">
        <h1 className="text-4xl font-extrabold text-on-surface leading-tight tracking-tight">
          Set Your Location
        </h1>
        <p className="text-[16px] font-medium text-on-surface-variant leading-relaxed px-4">
          To show you the best real-time deals in your neighborhood, we need your location.
        </p>

        {/* Chips */}
        <div className="flex items-center justify-center gap-3 pt-6">
          <div className="flex items-center gap-1.5 bg-surface-container rounded-full px-4 py-2">
            <Zap size={15} className="text-[#a33700]" />
            <span className="text-[13px] font-bold text-on-surface">Instant Access</span>
          </div>
          <div className="flex items-center gap-1.5 bg-surface-container rounded-full px-4 py-2 border border-blue-100">
            <MapPin size={15} className="text-[#0058ba]" />
            <span className="text-[13px] font-bold text-on-surface">Radius Sync</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-4 z-10">
        <Link href="/discover" className="w-full">
          <Button className="w-full h-15 rounded-full text-lg shadow-xl hover:shadow-2xl">
            Allow Location Access <ChevronRight size={22} className="ml-1" />
          </Button>
        </Link>
        <div className="flex justify-center w-full mt-2 mb-6">
          <span className="text-[16px] font-bold text-on-surface-variant hover:text-on-surface cursor-pointer">
            Skip for Now
          </span>
        </div>
      </div>

      {/* Footer Text */}
      <p className="text-center text-[11px] font-medium text-on-surface-variant/80 mt-auto px-6 mb-4 leading-relaxed z-10 max-w-sm mx-auto">
        We respect your privacy. Your location data is used only to personalize your experience and is never shared with third parties without your explicit consent.
      </p>
    </div>
  );
}
