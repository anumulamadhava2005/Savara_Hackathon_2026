"use client";

import React, { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Share2, Heart, Clock, Navigation, Calendar, MapPin, Tag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/appStore';

export default function DealDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { deals, savedDealIds, claimedDealIds, toggleSave, claimDeal, currentUser } = useAppStore();
  const [claiming, setClaiming] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const deal = deals.find(d => d.id === id);
  const isSaved = savedDealIds.includes(id);
  const isClaimed = claimedDealIds.includes(id);

  if (!deal) {
    return (
      <div className="flex flex-col min-h-[100dvh] bg-surface items-center justify-center p-6">
        <Tag size={48} className="text-outline mb-4" />
        <h1 className="text-2xl font-bold mb-2">Deal Unavailable</h1>
        <p className="text-on-surface-variant mb-6">This pulse has expired or doesn't exist.</p>
        <Link href="/discover"><Button>Back to Discover</Button></Link>
      </div>
    );
  }

  const handleClaim = async () => {
    if (!currentUser) { router.push('/login'); return; }
    setClaiming(true);
    await new Promise(r => setTimeout(r, 1200));
    claimDeal(id);
    setClaiming(false);
    setShowSuccess(true);
    setTimeout(() => router.push(`/redeem/${id}`), 1200);
  };

  const timeRemaining = () => {
    const ms = new Date(deal.expiry_time).getTime() - Date.now();
    if (ms <= 0) return 'Expired';
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    return h > 0 ? `${h}h ${m}m` : `${m}m left`;
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-surface relative pb-28 md:pb-0">
      {/* Hero */}
      <div className="relative h-[360px] md:h-[480px] w-full bg-slate-200 shrink-0">
        <img src={deal.image_url || ''} alt={deal.product_name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80"></div>
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
          <Link href="/discover" className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex gap-2">
            <button
              onClick={() => toggleSave(deal.id)}
              className={`w-10 h-10 backdrop-blur-md rounded-full flex items-center justify-center transition-colors ${isSaved ? 'bg-[#b31b25] text-white' : 'bg-white/20 text-white hover:bg-white/40'}`}
            >
              <Heart size={18} fill={isSaved ? 'white' : 'none'} />
            </button>
            <button
              onClick={() => navigator.share?.({ title: deal.product_name, url: window.location.href }).catch(() => {})}
              className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>
        <div className="absolute bottom-6 left-6 right-6 z-10">
          <div className="flex gap-2 mb-2">
            <div className={`text-white text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wider ${deal.quantity_remaining <= 4 ? 'bg-[#b31b25] animate-pulse' : 'bg-white/20 backdrop-blur-md'}`}>
              {deal.quantity_remaining} REMAINING
            </div>
            {deal.is_flash_mob && (
              <div className="bg-primary text-white text-[10px] font-black px-2.5 py-1 rounded-md tracking-wider btn-gradient">SQUAD DROP</div>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-1 tracking-tight drop-shadow-md">{deal.product_name}</h1>
          <p className="text-white/90 font-bold text-lg drop-shadow-sm">{deal.retailers.shop_name}</p>
        </div>
      </div>

      <div className="flex-1 bg-surface -mt-5 rounded-t-3xl relative z-20 px-6 pt-8 flex flex-col md:flex-row md:gap-10">
        {/* Left column */}
        <div className="flex-1">
          {/* Pricing */}
          <div className="flex items-end justify-between mb-8 pb-6 border-b border-surface-container-high">
            <div>
              <p className="text-sm text-on-surface-variant font-bold uppercase tracking-widest mb-1">Pulse Price</p>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-extrabold text-primary">${deal.current_price.toFixed(2)}</span>
                <span className="text-xl text-outline-variant font-bold line-through">${deal.original_price.toFixed(2)}</span>
                <span className="text-sm font-black text-[#b31b25] bg-red-50 px-2 py-0.5 rounded-md">{Math.round(deal.discount_percent)}% OFF</span>
              </div>
            </div>
            <div className="bg-[#b31b25]/10 text-[#b31b25] px-3 py-2 rounded-lg flex items-center gap-1.5 font-bold text-sm border border-[#b31b25]/20">
              <Clock size={16} /> {timeRemaining()}
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-on-surface mb-3">About this Deal</h3>
            <p className="text-[15px] font-medium text-on-surface-variant leading-relaxed">{deal.description}</p>
          </div>

          {/* Location */}
          <div className="mb-8 p-5 bg-surface-container-low rounded-2xl border border-surface-container-high">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Location</h3>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <p className="font-bold text-on-surface text-[16px]">{deal.retailers.shop_name}</p>
                <p className="text-[14px] text-on-surface-variant font-medium mt-0.5">{deal.retailers.address}</p>
                <p className="text-[13px] text-primary font-bold mt-1.5 flex items-center gap-1"><Navigation size={12} /> {deal.distance_km} km away</p>
              </div>
            </div>
          </div>

          <div className="mb-8 p-4 rounded-xl border border-outline-variant/30 text-xs font-medium text-on-surface-variant flex gap-3 items-start">
            <Calendar size={18} className="text-outline shrink-0" />
            <span>Valid for redemption today only. Must be claimed in-store within the active timer window. No credit card required.</span>
          </div>
        </div>

        {/* Right: Sticky Checkout Pane */}
        <div className="md:w-[340px] shrink-0">
          <div className="fixed bottom-0 left-0 right-0 p-5 bg-white border-t border-surface-container-high z-40 md:sticky md:bottom-auto md:top-8 md:border md:rounded-3xl md:shadow-xl md:p-6">
            <div className="hidden md:block mb-6">
              <h3 className="text-xl font-bold text-primary mb-1">Claim This Deal</h3>
              <p className="text-sm text-on-surface-variant font-medium">Reserve your price instantly. Pay when you arrive.</p>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-on-surface-variant">Total Due Now</span>
              <span className="font-extrabold text-2xl text-primary">$0.00</span>
            </div>
            {showSuccess ? (
              <div className="w-full h-14 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                ✓ Reserved! Redirecting...
              </div>
            ) : (
              <Button
                className="w-full h-14 rounded-full text-lg shadow-xl"
                onClick={handleClaim}
                disabled={claiming || isClaimed || deal.quantity_remaining <= 0}
              >
                {claiming ? 'Locking Price...' : isClaimed ? '✓ Already Claimed' : deal.quantity_remaining <= 0 ? 'Sold Out' : 'Reserve & Lock Price'}
              </Button>
            )}
            {isClaimed && (
              <Link href={`/redeem/${deal.id}`} className="block mt-3 text-center text-primary font-bold text-sm hover:underline">
                View Redemption QR →
              </Link>
            )}
            <p className="text-center text-[10px] font-medium text-outline-variant mt-3 uppercase tracking-widest">No credit card required</p>
          </div>
        </div>
      </div>
    </div>
  );
}
