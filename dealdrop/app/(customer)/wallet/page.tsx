"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Wallet, TrendingDown, Gift, Trophy, ShieldCheck, Ticket, Star, ChevronRight, BarChart3, Leaf, Wind, Sparkles, Navigation, Zap, X, CheckCircle2, Loader2, RefreshCw } from '@/components/ui/Icons';
import { useAppStore } from '@/store/appStore';
import { Button } from '@/components/ui/Button';

export default function WalletPage() {
  const [isHydrated, setIsHydrated] = useState(false);
  const { currentUser, activity, syncWallet, redeemPoints } = useAppStore();
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [redeemLoading, setRedeemLoading] = useState<string | null>(null);

  useEffect(() => {
    setIsHydrated(true);
    const performSync = async () => {
      setIsSyncing(true);
      await syncWallet();
      setIsSyncing(false);
    };
    performSync();
  }, [syncWallet]);

  const displaySavings = currentUser?.total_savings || 0;
  const points = currentUser?.reward_points || 0;
  const level = currentUser?.passport_level || 'Bronze';
  const stamps = currentUser?.deal_passport_stamps || 0;

  const levelInfo: Record<string, { next: string; target: number; color: string }> = {
    Bronze: { next: 'Silver', target: 5, color: '#cd7f32' },
    Silver: { next: 'Gold', target: 15, color: '#c0c0c0' },
    Gold: { next: 'Platinum', target: 30, color: '#ffd700' },
    Platinum: { next: 'Diamond', target: 60, color: '#e5e4e2' },
  };

  const li = levelInfo[level] || levelInfo.Bronze;
  const progress = Math.min((stamps / li.target) * 100, 100);

  // Mocked savings history (could be expanded later with a real analytics endpoint)
  const savingsHistory = [45, 12, 89, 34, 110, 65, 92];
  const maxSavings = Math.max(...savingsHistory);

  const handleRedeem = async (item: { label: string, pts: number }) => {
    setRedeemLoading(item.label);
    const success = await redeemPoints(item.pts, item.label);
    if (success) {
      // Small delay for UI feel
      setTimeout(() => {
        setRedeemLoading(null);
        setShowRedeemModal(false);
      }, 800);
    } else {
      setRedeemLoading(null);
      alert('Redemption failed. Check your balance or connection.');
    }
  };

  if (!isHydrated) return null;

  return (
    <div className="flex flex-col min-h-screen bg-surface relative pb-32 md:pb-8 pt-0">
      {/* Dynamic Header */}
      <div className="px-6 pt-10 pb-16 bg-white border-b border-surface-container-high relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 primary-gradient/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-2xl mx-auto relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
               <h1 className="text-4xl font-headline font-black text-on-surface tracking-tighter">Your <span className="text-primary">Vault</span></h1>
               {isSyncing && <Loader2 size={16} className="text-primary animate-spin mt-1" />}
            </div>
            <p className="text-on-surface-variant font-bold mt-1 uppercase tracking-[0.2em] text-[10px]">Secure Hyperlocal Ledger</p>
          </div>
          <div className="flex -space-x-3">
             <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-primary shadow-sm">
                <Navigation size={18} />
             </div>
             <div className="w-10 h-10 rounded-full primary-gradient border-2 border-white flex items-center justify-center text-white shadow-lg">
                <Wallet size={18} />
             </div>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-0 space-y-8 max-w-2xl mx-auto w-full -mt-10 relative z-20">
        {/* Main Balance Card */}
        <div className="bg-white rounded-[44px] p-8 shadow-2xl shadow-black/5 border border-surface-container-high relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-64 h-64 primary-gradient/10 rounded-full blur-[60px] group-hover:scale-125 transition-transform duration-1000" />
          
          <div className="flex justify-between items-start mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <p className="font-black text-on-surface-variant text-[10px] uppercase tracking-[0.2em]">
                  LIVE DISCOUNTS ASSETS
                </p>
                <div className="w-2 h-2 rounded-full bg-[#1d823b]" />
              </div>
              <h2 className="text-6xl font-headline font-black text-on-surface tracking-tighter leading-none">
                ${displaySavings.toFixed(2)}
              </h2>
            </div>
            <div className="bg-[#eff6ff] text-primary px-4 py-2 rounded-2xl flex items-center gap-2 font-black text-[11px] uppercase tracking-widest border border-primary/10">
               <TrendingDown size={14} /> SAVED
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 p-6 bg-surface-container-low/50 rounded-[32px] border border-surface-container">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest leading-none">Status</p>
              <p className="text-lg font-headline font-black text-on-surface leading-none">{level}</p>
              <p className="text-[11px] font-bold text-on-surface-variant opacity-60">Verified Citizen</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest leading-none">Points</p>
              <p className="text-lg font-headline font-black text-primary leading-none">{points.toLocaleString()}</p>
              <p className="text-[11px] font-bold text-primary/60">Pulse Rewards</p>
            </div>
          </div>
          
          <div className="mt-8 space-y-4">
             <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-on-surface-variant">
                <span>Passport Progress</span>
                <span>{stamps} / {li.target} STAMPS</span>
             </div>
             <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden relative border border-surface-container-high">
               <div
                 className="h-full primary-gradient rounded-full transition-all duration-1000 ease-out"
                 style={{ width: `${progress}%` }}
               />
             </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Savings Chart */}
          <div className="bg-white rounded-[40px] p-8 border border-surface-container-high shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-headline font-black text-lg">Savings Pulse</h3>
               <BarChart3 size={20} className="text-on-surface-variant" />
            </div>
            <div className="flex-1 flex items-end justify-between h-32 gap-3 pb-2 border-b border-surface-container-high mb-4">
               {savingsHistory.map((val, i) => (
                 <div key={i} className="flex-1 group relative">
                    <div 
                      className={`w-full rounded-t-xl transition-all duration-700 primary-gradient ${i === 6 ? 'opacity-100' : 'opacity-30'}`} 
                      style={{ height: `${(val/maxSavings) * 100}%` }}
                    />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[9px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      ${val}
                    </div>
                 </div>
               ))}
            </div>
            <div className="flex justify-between text-[9px] font-black text-on-surface-variant uppercase tracking-widest px-1">
               <span>MON</span>
               <span>SUN</span>
            </div>
          </div>

          {/* Eco-Impact Card */}
          <div className="bg-[#f0fdf4] rounded-[40px] p-8 border border-[#dcfce7] shadow-sm relative overflow-hidden group">
            <Leaf size={100} className="absolute -bottom-6 -right-6 text-[#16a34a] opacity-[0.05] -rotate-12 group-hover:opacity-10 transition-opacity" />
            <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 rounded-2xl bg-[#16a34a] text-white flex items-center justify-center shadow-lg">
                  <Wind size={20} />
               </div>
               <h3 className="font-headline font-black text-lg text-[#166534]">Local Impact</h3>
            </div>
            <div className="space-y-6">
               <div>
                  <h4 className="text-3xl font-headline font-black text-[#166534] leading-none mb-1">{(displaySavings * 0.12).toFixed(1)}kg</h4>
                  <p className="text-[11px] font-black text-[#166534]/60 uppercase tracking-widest">Estimated CO2 Saved</p>
               </div>
               <div className="flex items-center gap-4 py-4 px-5 bg-white/60 backdrop-blur-md rounded-2xl border border-white">
                  <div className="text-[#16a34a]"><CheckCircle2 size={24} /></div>
                  <p className="text-[12px] font-bold text-[#166534] leading-tight">By walking <strong>{stamps * 1.2}km</strong> to local shops vs driving.</p>
               </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <section className="bg-white rounded-[44px] p-8 border border-surface-container-high shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-headline font-black text-on-surface tracking-tighter">Activity Stream</h2>
            <div className="w-10 h-10 rounded-2xl bg-surface-container flex items-center justify-center text-on-surface-variant">
               <Zap size={20} />
            </div>
          </div>
          <div className="space-y-6">
            {activity.length === 0 ? (
              <p className="text-center py-10 font-bold text-on-surface-variant uppercase tracking-widest text-xs">No Recent Pulses Detected</p>
            ) : (
              activity.slice(0, 10).map((a: any) => (
                <div key={a.id} className="group relative">
                  <div className="absolute inset-0 bg-surface-container-low opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity -mx-4 -my-2" />
                  <div className="flex items-center gap-5 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-surface-container-low border border-surface-container flex items-center justify-center text-on-surface shrink-0 group-hover:scale-110 transition-transform">
                      {a.type === 'claim' ? <Ticket size={24} className="text-primary" /> : a.type === 'redeem' ? <Gift size={24} className="text-[#a33700]" /> : <Star size={24} className="text-[#fcab23]" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-headline font-black text-[15px] text-on-surface group-hover:text-primary transition-colors">{a.label}</h4>
                      <p className="text-[11px] text-on-surface-variant font-bold uppercase tracking-widest opacity-60">
                        {new Date(a.created_at || Date.now()).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`font-headline font-black text-[15px] ${a.value.includes('$') || a.value.includes('+') ? 'text-[#1d823b]' : a.value.includes('-') ? 'text-[#b31b25]' : 'text-primary'}`}>
                        {a.value}
                      </span>
                      <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.2em]">{a.type === 'redeem' ? 'CONSUMED' : 'VERIFIED'}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Bottom Actions */}
        <div className="flex gap-4">
           <Button onClick={() => setShowRedeemModal(true)} className="flex-1 h-18 rounded-[28px] primary-gradient text-white font-headline font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
              <Gift size={24} className="mr-2" /> REDEEM POINTS
           </Button>
           <button 
             onClick={() => syncWallet()}
             className={`h-18 px-8 rounded-[28px] bg-white border border-surface-container-high text-on-surface hover:bg-surface-container transition-all flex items-center justify-center active:scale-95 shadow-lg shadow-black/5 ${isSyncing ? 'opacity-50' : ''}`}
           >
              <RefreshCw size={24} className={isSyncing ? 'animate-spin' : ''} />
           </button>
        </div>
      </div>

      {/* Point Redemption Modal */}
      {showRedeemModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xl animate-[fadeIn_0.3s_ease]" onClick={() => !redeemLoading && setShowRedeemModal(false)} />
          <div className="relative bg-white rounded-[44px] w-full max-w-sm overflow-hidden shadow-2xl animate-[slideUp_0.4s_ease]">
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-[#ffefdb] rounded-3xl flex items-center justify-center mx-auto mb-6 text-[#a33700] shadow-lg">
                <Gift size={40} />
              </div>
              <h3 className="text-3xl font-headline font-black text-on-surface mb-2 tracking-tighter">Reward Store</h3>
              <p className="text-on-surface-variant font-bold text-sm mb-10">Balance: <span className="text-primary">{points.toLocaleString()} PTS</span></p>
              
              <div className="space-y-4 mb-10">
                {[
                  { label: '$5 Credit Reveal', pts: 500, icon: <Zap size={20} /> },
                  { label: 'Free Local Latte', pts: 1000, icon: <Star size={20} /> },
                  { label: 'Hyperlocal Badge', pts: 2500, icon: <Trophy size={20} /> }
                ].map(opt => (
                  <button
                    key={opt.pts}
                    disabled={points < opt.pts || !!redeemLoading}
                    onClick={() => handleRedeem(opt)}
                    className={`w-full group text-left p-6 rounded-3xl border transition-all flex justify-between items-center ${points >= opt.pts ? 'border-primary/20 bg-white hover:bg-primary/5 hover:border-primary shadow-sm' : 'bg-surface-container/50 border-surface-container opacity-50 cursor-not-allowed'}`}
                  >
                    <div className="flex items-center gap-4">
                       <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${points >= opt.pts ? 'bg-primary/10 text-primary' : 'bg-outline-variant/20 text-outline-variant'}`}>
                          {redeemLoading === opt.label ? <Loader2 size={18} className="animate-spin" /> : opt.icon}
                       </div>
                       <div>
                          <p className="font-headline font-black text-sm text-on-surface">{opt.label}</p>
                          <p className={`text-[10px] font-black uppercase tracking-widest ${points >= opt.pts ? 'text-primary' : 'text-on-surface-variant'}`}>{opt.pts} PULSE PTS</p>
                       </div>
                    </div>
                    <ChevronRight size={16} className="text-outline-variant group-hover:translate-x-1 group-hover:text-primary transition-all" />
                  </button>
                ))}
              </div>
              
              <Button 
                variant="outline" 
                className="w-full h-14 rounded-2xl font-headline font-black border-2"
                disabled={!!redeemLoading}
                onClick={() => setShowRedeemModal(false)}
              >
                CLOSE STORE
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Global Animations */}
      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
