"use client";

import React, { useState, useEffect } from 'react';
import { Clock, Zap, Users, MapPin, CheckCircle2, Sparkles, ArrowRight, Share2, Timer, Flame, Loader2 } from '@/components/ui/Icons';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/appStore';

export default function FlashFeedPage() {
  const [isHydrated, setIsHydrated] = useState(false);
  const { deals, squads, joinedSquadIds, joinSquad, claimedDealIds, syncSquads, syncDeals } = useAppStore();
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    setIsHydrated(true);
    const init = async () => {
      await syncDeals();
      await syncSquads();
    };
    init();
  }, [syncDeals, syncSquads]);

  const flashDeals = (deals || []).filter(d => d.is_flash_mob);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  const handleJoin = async (squadId: string, dealId: string) => {
    if (joiningId) return;
    setJoiningId(squadId);
    
    await joinSquad(squadId, dealId);
    
    const squad = squads.find(s => s.id === squadId);
    const newCount = (squad?.current_count || 0) + 1;
    const target = squad?.target_count || 10;
    
    if (newCount >= target) {
      showToast("🚀 Squad target achieved! The deal has been unlocked to your wallet.");
    } else {
      showToast(`⚡️ Pulse Recorded! ${target - newCount} more members needed to drop.`);
    }
    setJoiningId(null);
  };

  if (!isHydrated) return null;

  return (
    <div className="flex flex-col min-h-screen bg-surface relative pb-32 md:pb-8 pt-0">
      {/* Dynamic Toast */}
      <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 pointer-events-none ${toast ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-8 scale-90'}`}>
        <div className="bg-white/90 backdrop-blur-2xl border border-primary/20 text-on-surface px-8 py-4 rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] font-black text-sm flex items-center gap-3">
          <div className="w-8 h-8 rounded-full primary-gradient flex items-center justify-center text-white">
            <Sparkles size={16} fill="white" />
          </div>
          {toast}
        </div>
      </div>

      {/* Hero Header */}
      <div className="px-6 pt-10 pb-16 bg-white border-b border-surface-container-high relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 primary-gradient/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/10">
              Live Pulses
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#b31b25] animate-pulse" />
              <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Real-time Activation</span>
            </div>
          </div>
          <h1 className="text-5xl font-headline font-black text-on-surface tracking-tighter mb-4 leading-none">
            Squad <span className="text-primary">Drops</span>
          </h1>
          <p className="text-on-surface-variant font-bold text-lg leading-relaxed max-w-lg">
            High-value items locked by the community. Join the squad to activate massive hyperlocal discounts.
          </p>
        </div>
      </div>

      <div className="px-6 md:px-0 -mt-10 space-y-10 max-w-2xl mx-auto w-full relative z-20">
        {flashDeals.length === 0 ? (
          <div className="bg-white rounded-[40px] p-20 text-center border border-surface-container-high shadow-sm">
            <Flame size={64} className="mx-auto text-outline-variant/30 mb-6" />
            <h3 className="text-2xl font-headline font-black text-on-surface mb-2">No active drops</h3>
            <p className="text-on-surface-variant font-bold">The next frequency sweep is scheduled soon. Keep your sensors active.</p>
          </div>
        ) : (
          flashDeals.map(deal => {
            const squad = (squads || []).find(s => s.deal_id === deal.id);
            const currentCount = squad?.current_count ?? 0;
            const targetCount = deal.flash_mob_target || squad?.target_count || 10;
            const percent = Math.min((currentCount / targetCount) * 100, 100);
            const isComplete = currentCount >= targetCount;
            const hasJoined = squad ? (joinedSquadIds || []).includes(squad.id) : false;
            const isClaimed = (claimedDealIds || []).includes(deal.id);

            const timeLeft = () => {
              const ms = new Date(deal.expiry_time).getTime() - Date.now();
              if (ms <= 0) return 'EXPIRED';
              const h = Math.floor(ms / 3600000);
              const m = Math.floor((ms % 3600000) / 60000);
              return h > 0 ? `${h}H ${m}M` : `${m}M`;
            };

            return (
              <div key={deal.id} className="relative group">
                <div className="absolute -inset-1 primary-gradient opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-700" />
                <div className="bg-white rounded-[44px] overflow-hidden shadow-2xl shadow-black/5 border border-surface-container-high relative">
                  <div className="relative h-[320px] w-full bg-slate-100 overflow-hidden">
                    <img 
                      src={deal.image_url} 
                      alt={deal.product_name} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>
                    <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                      <div className="flex gap-2">
                        <div className="bg-[#b31b25] text-white text-[11px] font-black px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl border border-white/20">
                          <Timer size={14} className="animate-pulse" strokeWidth={3} /> {timeLeft()}
                        </div>
                        <div className="bg-white/10 backdrop-blur-md text-white text-[11px] font-black px-4 py-2 rounded-2xl shadow-xl border border-white/20">
                          {Math.round(deal.discount_percent)}% OFF
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-10 left-8 right-8 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        <p className="font-black text-white/80 text-[11px] uppercase tracking-widest">{deal.retailers?.shop_name || 'Retailer'}</p>
                      </div>
                      <h3 className="text-3xl font-headline font-black leading-none tracking-tight mb-8">
                        {deal.product_name}
                      </h3>
                      <div className="bg-black/40 backdrop-blur-xl rounded-[28px] p-6 border border-white/10 shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-3">
                            <div className="flex -space-x-2">
                              {[1,2,3].map(i => (
                                <img 
                                  key={i}
                                  src={`https://i.pravatar.cc/100?u=${deal.id}-${i}`} 
                                  className="w-8 h-8 rounded-full border-2 border-white/20 object-cover shadow-lg"
                                />
                              ))}
                              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black backdrop-blur-md border-2 border-white/20">
                                +{currentCount > 3 ? currentCount - 3 : 0}
                              </div>
                            </div>
                            <span className="text-[12px] font-black uppercase tracking-wider text-white/80">
                              {targetCount - currentCount} more members needed
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-3xl font-headline font-black text-primary leading-none">{currentCount}</span>
                            <span className="text-[10px] text-white/60 font-black ml-1 uppercase tracking-widest leading-none">Joined</span>
                          </div>
                        </div>
                        <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden relative border border-white/5">
                          <div
                            className="h-full primary-gradient rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-8 bg-surface-container-low/30">
                    <div className="flex justify-between items-center mb-8">
                      <div className="flex items-center gap-3 text-on-surface-variant font-black text-[11px] uppercase tracking-widest">
                        <div className="w-10 h-10 rounded-2xl bg-white border border-surface-container flex items-center justify-center text-primary shadow-sm">
                           <MapPin size={18} />
                        </div>
                        <span>{(deal.distance_km || 0.5).toFixed(1)} KM • {deal.retailers?.address?.split(',')[0] || 'Nearby'}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest mb-1 line-through opacity-50">Was ${deal.original_price.toFixed(0)}</p>
                        <div className="font-headline font-black text-4xl text-on-surface leading-none">${deal.current_price.toFixed(2)}</div>
                      </div>
                    </div>
                    {isComplete || isClaimed ? (
                      <Link href="/deals" className="block w-full h-18 rounded-[24px] bg-[#1d823b] text-white flex items-center justify-center gap-3 font-headline font-black text-lg shadow-xl hover:bg-[#15612c] transition-all transform hover:scale-[1.02] active:scale-95 group">
                        <CheckCircle2 size={24} fill="white" /> DEAL ACTIVE • VIEW TICKET 
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    ) : (
                      <div className="flex gap-4">
                        <Button
                          className={`flex-1 h-18 rounded-[24px] text-lg font-headline font-black shadow-2xl transition-all ${
                            hasJoined ? 'bg-surface-container text-on-surface-variant border border-surface-container-high' : 'primary-gradient text-white hover:scale-[1.02] active:scale-95'
                          }`}
                          onClick={() => squad && handleJoin(squad.id, deal.id)}
                          disabled={joiningId === squad?.id || hasJoined || !squad}
                        >
                          {joiningId === squad?.id ? (
                            <div className="flex items-center gap-2">
                              <Loader2 size={20} className="animate-spin" />
                              SYNCING...
                            </div>
                          ) : hasJoined ? (
                            <div className="flex items-center gap-2">
                              <CheckCircle2 size={20} /> SYNCED
                            </div>
                          ) : 'JOIN SQUAD'}
                        </Button>
                        <button className="w-18 h-18 rounded-[24px] bg-white border border-surface-container-high flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-all hover:text-primary active:scale-90">
                          <Share2 size={24} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
