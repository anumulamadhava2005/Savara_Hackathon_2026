"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Wallet, TrendingDown, Gift, Trophy, ShieldCheck, Ticket, Star, ChevronRight, BarChart3 } from 'lucide-react';
import { useAppStore } from '@/store/appStore';

export default function WalletPage() {
  const { currentUser, claimedDealIds, deals, activity } = useAppStore();
  const [showRedeemModal, setShowRedeemModal] = useState(false);

  const totalSaved = deals
    .filter(d => claimedDealIds.includes(d.id))
    .reduce((acc, d) => acc + (d.original_price - d.current_price), 0);

  const displaySavings = (currentUser?.total_savings || 0) + totalSaved;
  const points = currentUser?.reward_points || 0;
  const level = currentUser?.passport_level || 'Newcomer';
  const stamps = currentUser?.deal_passport_stamps || 0;

  const levelInfo: Record<string, { next: string; target: number; color: string }> = {
    Newcomer: { next: 'Explorer', target: 10, color: '#6b7280' },
    Explorer: { next: 'Hunter', target: 25, color: '#0058ba' },
    Hunter: { next: 'Hero', target: 50, color: '#a33700' },
    Hero: { next: 'Legend', target: 100, color: '#7c3aed' },
  };
  const li = levelInfo[level] || levelInfo.Newcomer;
  const progress = Math.min((stamps / li.target) * 100, 100);

  return (
    <div className="flex flex-col min-h-[100dvh] bg-surface relative pb-28 md:pb-8">
      {/* Header */}
      <div className="flex items-center p-6 pb-4 sticky top-0 bg-surface/90 backdrop-blur-xl z-30 border-b border-surface-container-high/50">
        <h1 className="text-[22px] font-extrabold tracking-tight text-on-surface flex items-center gap-2">
          City Wallet <Wallet size={20} className="text-primary" />
        </h1>
      </div>

      <div className="px-6 md:px-0 space-y-6 max-w-2xl mx-auto w-full pt-4">
        {/* Balance Card */}
        <div className="bg-primary rounded-3xl p-6 text-white shadow-xl btn-gradient relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full blur-2xl transform translate-x-12 -translate-y-12"></div>
          <p className="font-bold text-white/80 text-[12px] uppercase tracking-widest mb-1 flex items-center gap-1.5">
            <TrendingDown size={14} /> Total Savings
          </p>
          <h2 className="text-5xl font-black mb-2 tracking-tight drop-shadow-sm">${displaySavings.toFixed(2)}</h2>
          <p className="text-white/70 text-[13px] font-medium mb-6">Across {claimedDealIds.length + (currentUser?.deal_passport_stamps || 0)} claimed deals</p>

          <div className="border-t border-white/20 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy size={18} className="text-[#fcab23]" />
                <span className="font-bold text-sm">{level}</span>
              </div>
              <span className="text-white/70 text-xs font-medium">{stamps} / {li.target} stamps → {li.next}</span>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#fcab23] rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setShowRedeemModal(true)}
            className="bg-white rounded-2xl p-5 shadow-sm border border-surface-container flex flex-col items-center text-center cursor-pointer hover:bg-surface-container transition-colors active:scale-95"
          >
            <div className="w-12 h-12 bg-[#ffefdb] text-[#a33700] rounded-full flex items-center justify-center mb-3">
              <Gift size={22} />
            </div>
            <h3 className="font-bold text-[14px]">Redeem Points</h3>
            <p className="text-[11px] text-on-surface-variant font-medium mt-1">{points.toLocaleString()} available</p>
          </button>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-surface-container flex flex-col items-center text-center cursor-pointer hover:bg-surface-container transition-colors">
            <div className="w-12 h-12 bg-surface-container text-on-surface-variant rounded-full flex items-center justify-center mb-3">
              <BarChart3 size={22} />
            </div>
            <h3 className="font-bold text-[14px]">Stats</h3>
            <p className="text-[11px] text-on-surface-variant font-medium mt-1">{(claimedDealIds.length + stamps)} total claims</p>
          </div>
        </div>

        {/* Activity */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-[20px] font-extrabold text-on-surface tracking-tight">Recent Activity</h2>
            <Link href="/deals" className="text-[13px] font-bold text-primary hover:underline">View Deals</Link>
          </div>
          <div className="space-y-3">
            {activity.slice(0, 5).map((a) => (
              <Link key={a.id} href={`/deals/${a.deal_id}`} className="block">
                <div className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-surface-container hover:shadow-md transition-shadow group">
                  <div className="w-12 h-12 bg-[#eff1f2] rounded-xl flex items-center justify-center text-on-surface shrink-0">
                    {a.type === 'claim' ? <Ticket size={20} className="text-[#b31b25]" /> : a.type === 'squad' ? <Trophy size={20} className="text-[#a33700]" /> : <Star size={20} className="text-[#fcab23]" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[14px] text-on-surface leading-tight mb-0.5 group-hover:text-primary transition-colors">{a.label}</h4>
                    <p className="text-[12px] text-on-surface-variant font-medium">{a.time}</p>
                  </div>
                  <span className={`font-bold text-[13px] shrink-0 ${a.value.includes('$') ? 'text-[#0058ba]' : a.value === 'Pending' ? 'text-[#a33700]' : 'text-green-600'}`}>
                    {a.value}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Redeem Modal */}
      {showRedeemModal && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-end md:items-center justify-center p-4" onClick={() => setShowRedeemModal(false)}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#ffefdb] rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift size={28} className="text-[#a33700]" />
              </div>
              <h3 className="text-xl font-extrabold text-on-surface mb-1">Redeem Points</h3>
              <p className="text-on-surface-variant font-medium text-sm">You have <strong>{points.toLocaleString()}</strong> reward points</p>
            </div>
            <div className="space-y-3 mb-6">
              {[{ label: '500 pts → $5 off next deal', pts: 500 }, { label: '1000 pts → Free Latte', pts: 1000 }, { label: '2500 pts → VIP Flash Access', pts: 2500 }].map(opt => (
                <button
                  key={opt.pts}
                  disabled={points < opt.pts}
                  className={`w-full text-left p-4 rounded-2xl border flex justify-between items-center font-medium transition-colors ${points >= opt.pts ? 'border-primary/30 hover:bg-surface-container text-on-surface cursor-pointer' : 'border-surface-container text-outline-variant cursor-not-allowed opacity-50'}`}
                >
                  <span className="text-sm">{opt.label}</span>
                  <ChevronRight size={16} />
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowRedeemModal(false)}
              className="w-full h-12 border border-surface-container-high rounded-xl text-on-surface-variant font-bold hover:bg-surface-container transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
