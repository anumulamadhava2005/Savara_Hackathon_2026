"use client";

import React, { useState } from 'react';
import { Clock, Zap, Users, MapPin, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/appStore';
import { MOCK_SQUADS } from '@/lib/mock-data';

export default function FlashFeedPage() {
  const { deals, squads, joinedSquadIds, joinSquad, claimDeal, claimedDealIds } = useAppStore();
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  const flashDeals = deals.filter(d => d.is_flash_mob);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleJoin = async (squadId: string, dealId: string) => {
    if (joiningId) return;
    setJoiningId(squadId);
    await new Promise(r => setTimeout(r, 800));
    const squad = squads.find(s => s.id === squadId);
    joinSquad(squadId);
    const newCount = (squad?.current_count || 0) + 1;
    const target = squad?.target_count || 10;
    if (newCount >= target) {
      showToast("🎉 Squad target reached! Deal unlocked to your wallet.");
      claimDeal(dealId);
    } else {
      showToast(`✓ Joined squad! ${target - newCount} more needed to unlock.`);
    }
    setJoiningId(null);
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-surface relative pb-28 md:pb-8">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-on-surface text-surface px-6 py-3 rounded-full shadow-2xl font-bold text-sm animate-[fadeIn_0.2s_ease]">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col items-center p-6 pb-4 sticky top-0 bg-surface/90 backdrop-blur-xl z-30 border-b border-surface-container-high/50">
        <h1 className="text-[22px] font-extrabold tracking-tight text-on-surface flex items-center gap-2">
          Flash Drops <Zap size={20} className="text-[#a33700]" fill="currentColor" />
        </h1>
        <p className="text-[11px] font-bold uppercase tracking-widest text-[#a33700]">Squad Mechanics • Group Power</p>
      </div>

      <div className="px-6 md:px-0 pt-4 space-y-6 max-w-2xl mx-auto w-full">
        {flashDeals.map(deal => {
          const squad = squads.find(s => s.deal_id === deal.id);
          const currentCount = squad?.current_count ?? 0;
          const targetCount = deal.flash_mob_target ?? 10;
          const percent = Math.min((currentCount / targetCount) * 100, 100);
          const isComplete = currentCount >= targetCount;
          const hasJoined = squad ? joinedSquadIds.includes(squad.id) : false;
          const isClaimed = claimedDealIds.includes(deal.id);

          const timeLeft = () => {
            const ms = new Date(deal.expiry_time).getTime() - Date.now();
            if (ms <= 0) return 'Expired';
            const h = Math.floor(ms / 3600000);
            const m = Math.floor((ms % 3600000) / 60000);
            return h > 0 ? `${h}h ${m}m` : `${m}m`;
          };

          return (
            <div key={deal.id} className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-surface-container-high hover:-translate-y-1 transition-all duration-300">
              {/* Hero */}
              <div className="relative h-[260px] w-full bg-slate-100">
                <img src={deal.image_url} alt={deal.product_name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

                <div className="absolute top-4 left-4 flex gap-2">
                  <div className="bg-[#b31b25] text-white text-[11px] font-black px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg uppercase tracking-wider">
                    <Clock size={14} className="animate-pulse" /> {timeLeft()}
                  </div>
                  <div className="bg-white/20 backdrop-blur-md text-white text-[11px] font-black px-3 py-1.5 rounded-lg shadow-lg border border-white/20">
                    {Math.round(deal.discount_percent)}% OFF
                  </div>
                </div>

                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <p className="font-bold text-white/70 text-[13px] mb-0.5">{deal.retailers.shop_name}</p>
                  <h3 className="text-2xl font-extrabold leading-tight tracking-tight mb-4">{deal.product_name}</h3>

                  {/* Progress Bar */}
                  <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                    <div className="flex justify-between items-end mb-2">
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-primary" />
                        <span className="text-[13px] font-bold">Squad Goal: {targetCount}</span>
                      </div>
                      <div>
                        <span className="text-xl font-extrabold">{currentCount}</span>
                        <span className="text-[11px] text-white/60 font-bold ml-1">Joined</span>
                      </div>
                    </div>
                    <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden relative">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-[#fcab23] rounded-full transition-all duration-700"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-1.5 text-on-surface-variant font-bold text-[14px]">
                    <MapPin size={16} /> {deal.distance_km} km away
                  </div>
                  <div className="font-extrabold text-2xl text-primary">${deal.current_price.toFixed(2)}</div>
                </div>

                {isComplete || isClaimed ? (
                  <div className="w-full h-14 rounded-full bg-green-600 text-white flex items-center justify-center gap-2 font-bold text-lg shadow-md">
                    <CheckCircle2 size={20} /> Deal Unlocked! Check Wallet
                  </div>
                ) : hasJoined ? (
                  <div className="space-y-3">
                    <div className="w-full h-14 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center gap-2 font-bold border border-surface-container-high">
                      ✓ You're In — Waiting for {targetCount - currentCount} more
                    </div>
                    <p className="text-center text-[11px] text-[#b31b25] font-bold uppercase tracking-widest">
                      Share with friends to unlock faster →
                    </p>
                  </div>
                ) : (
                  <Button
                    className="w-full h-14 rounded-full text-[17px] shadow-md"
                    onClick={() => squad && handleJoin(squad.id, deal.id)}
                    disabled={joiningId === squad?.id || !squad}
                  >
                    {joiningId === squad?.id ? 'Joining...' : 'Join Flash Squad'}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
