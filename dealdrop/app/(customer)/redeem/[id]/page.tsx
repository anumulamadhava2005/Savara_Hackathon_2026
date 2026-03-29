"use client";

import React, { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Map, MapPin, Star, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/appStore';

export default function RedeemDealPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { deals, claimedDealIds } = useAppStore();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [rated, setRated] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const deal = deals.find(d => d.id === id);
  const isClaimed = claimedDealIds.includes(id);

  // If not claimed, redirect to deal details
  if (!isClaimed && deal) {
    return (
      <div className="flex flex-col min-h-[100dvh] bg-surface items-center justify-center p-6 text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold mb-2">Not Claimed Yet</h2>
        <p className="text-on-surface-variant font-medium mb-6">You need to reserve this deal before viewing the QR code.</p>
        <Link href={`/deals/${id}`}><Button>Claim This Deal</Button></Link>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="flex flex-col min-h-[100dvh] bg-surface items-center justify-center p-6">
        <Link href="/deals"><Button>Back to My Deals</Button></Link>
      </div>
    );
  }

  const claimId = `UP-${id.split('-')[1]?.toUpperCase() || 'XXXX'}-${Date.now().toString(36).toUpperCase().slice(-4)}`;

  const handleRating = (star: number) => {
    setRating(star);
    setTimeout(() => {
      setShowThankYou(true);
    }, 500);
  };

  const handleNavigate = () => {
    const query = encodeURIComponent(deal.retailers.address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-surface relative pb-8 px-6 pt-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Link href="/deals" className="mr-3 text-primary hover:text-primary-dim transition-colors">
          <ArrowLeft size={22} strokeWidth={2.5} />
        </Link>
        <h1 className="text-[17px] font-bold tracking-tight text-primary">Redeem Deal</h1>
      </div>

      {/* Title */}
      <div className="mb-5">
        <p className="text-[11px] font-black tracking-widest text-[#a33700] uppercase mb-1">✓ Reservation Active</p>
        <h2 className="text-[30px] font-extrabold text-on-surface leading-tight tracking-tight mb-1">Ready to Claim!</h2>
        <p className="text-[16px] text-on-surface-variant font-medium">{deal.product_name}</p>
      </div>

      {/* QR Card */}
      <div className="bg-white rounded-[28px] shadow-sm border border-surface-container-high p-6 flex flex-col items-center mb-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#ffefdb] rounded-full blur-2xl opacity-50 -translate-y-8 translate-x-8"></div>

        {/* QR Code SVG — real-looking mock */}
        <div className="mb-5 p-3 bg-white border-2 border-surface-container-high rounded-2xl shadow-inner">
          <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* QR code pattern simulation */}
            <rect width="180" height="180" fill="white"/>
            <rect x="10" y="10" width="60" height="60" rx="4" fill="#1a1a1a"/>
            <rect x="18" y="18" width="44" height="44" rx="2" fill="white"/>
            <rect x="26" y="26" width="28" height="28" rx="1" fill="#1a1a1a"/>
            <rect x="110" y="10" width="60" height="60" rx="4" fill="#1a1a1a"/>
            <rect x="118" y="18" width="44" height="44" rx="2" fill="white"/>
            <rect x="126" y="26" width="28" height="28" rx="1" fill="#1a1a1a"/>
            <rect x="10" y="110" width="60" height="60" rx="4" fill="#1a1a1a"/>
            <rect x="18" y="118" width="44" height="44" rx="2" fill="white"/>
            <rect x="26" y="126" width="28" height="28" rx="1" fill="#1a1a1a"/>
            <rect x="80" y="10" width="10" height="10" fill="#1a1a1a"/>
            <rect x="80" y="30" width="10" height="10" fill="#1a1a1a"/>
            <rect x="80" y="50" width="10" height="10" fill="#1a1a1a"/>
            <rect x="80" y="80" width="10" height="10" fill="#1a1a1a"/>
            <rect x="80" y="100" width="20" height="10" fill="#1a1a1a"/>
            <rect x="80" y="120" width="10" height="20" fill="#1a1a1a"/>
            <rect x="100" y="80" width="10" height="10" fill="#1a1a1a"/>
            <rect x="120" y="80" width="20" height="10" fill="#b31b25"/>
            <rect x="100" y="100" width="20" height="10" fill="#1a1a1a"/>
            <rect x="130" y="100" width="10" height="10" fill="#1a1a1a"/>
            <rect x="110" y="120" width="30" height="10" fill="#1a1a1a"/>
            <rect x="150" y="120" width="20" height="10" fill="#1a1a1a"/>
            <rect x="10" y="80" width="10" height="10" fill="#1a1a1a"/>
            <rect x="30" y="80" width="20" height="10" fill="#1a1a1a"/>
            <rect x="60" y="80" width="10" height="10" fill="#1a1a1a"/>
            <rect x="10" y="100" width="20" height="10" fill="#1a1a1a"/>
            <rect x="40" y="100" width="20" height="10" fill="#1a1a1a"/>
            <rect x="150" y="80" width="20" height="10" fill="#1a1a1a"/>
            <rect x="150" y="100" width="10" height="20" fill="#1a1a1a"/>
          </svg>
        </div>

        <p className="text-[11px] font-bold tracking-widest text-outline-variant uppercase mb-1.5">Confirmation</p>
        <p className="text-[22px] font-extrabold text-on-surface tracking-wider">#{claimId}</p>

        <div className="mt-4 w-full bg-surface-container-low rounded-xl p-3 flex justify-between text-[12px] font-bold">
          <span className="text-on-surface-variant uppercase tracking-widest">Savings</span>
          <span className="text-[#0058ba]">+${(deal.original_price - deal.current_price).toFixed(2)}</span>
        </div>
      </div>

      {/* Navigate Button */}
      <Button className="w-full shadow-lg h-14 text-[17px] mb-3" onClick={handleNavigate}>
        <Navigation className="mr-2" size={20} />
        Navigate to {deal.retailers.shop_name}
      </Button>

      {/* Address */}
      <p className="flex items-center justify-center gap-1.5 text-[13px] text-on-surface-variant font-medium mb-6">
        <MapPin size={14} className="text-outline-variant" /> {deal.retailers.address} · {deal.distance_km} km away
      </p>

      {/* Rating area */}
      {!showThankYou ? (
        <div className="bg-[#eff1f2] rounded-3xl p-6 flex flex-col items-center text-center border border-surface-container">
          <h3 className="text-[17px] font-extrabold text-on-surface mb-2">How was your experience?</h3>
          <p className="text-[13px] text-on-surface-variant font-medium mb-5">Your rating helps local merchants thrive.</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <Star
                key={star}
                size={36}
                fill={star <= (hoverRating || rating) ? '#fcab23' : 'transparent'}
                stroke={star <= (hoverRating || rating) ? '#fcab23' : '#abadae'}
                strokeWidth={1.5}
                className="cursor-pointer transition-all hover:scale-110"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => handleRating(star)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-3xl p-6 flex flex-col items-center text-center">
          <div className="text-4xl mb-3">🎉</div>
          <h3 className="text-[17px] font-extrabold text-green-800 mb-1">Thanks for the rating!</h3>
          <p className="text-[13px] text-green-700 font-medium">You earned +50 reward points for reviewing.</p>
        </div>
      )}
    </div>
  );
}
