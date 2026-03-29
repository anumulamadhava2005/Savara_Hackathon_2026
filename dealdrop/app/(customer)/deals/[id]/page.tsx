'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Share2, Bookmark, Timer, Flame, MapPin, Star, Navigation, Minus, Plus, ArrowRight, ShieldCheck } from '@/components/ui/Icons';
import { useAppStore } from '@/store/appStore';
import { Button } from '@/components/ui/Button';

interface Deal {
  id: string;
  product_name: string;
  description: string;
  category: string;
  original_price: number;
  current_price: number;
  discount_percent: number;
  quantity_remaining: number;
  expiry_time: string;
  image_url: string;
  is_flash_mob: boolean;
  distance_km?: number;
  retailers: {
    shop_name: string;
    address: string;
    avatar_url?: string;
    rating?: number;
  };
}

export default function DealDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { claimDeal, claimedDealIds, savedDealIds, toggleSave } = useAppStore();

  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savePending, setSavePending] = useState(false);

  const isClaimed = claimedDealIds.includes(id);

  // Fetch deal from API
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/deals/${id}`)
      .then(r => r.json())
      .then(json => {
        if (json.deal) {
          setDeal(json.deal);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  // Sync saved state from Supabase on load
  useEffect(() => {
    if (!id) return;
    // Optimistic: check local store first
    setIsSaved(savedDealIds.includes(id));
    // Then verify with server
    fetch('/api/customer/saved')
      .then(r => r.json())
      .then(json => {
        if (json.savedIds) {
          setIsSaved(json.savedIds.includes(id));
        }
      })
      .catch(() => {});
  }, [id, savedDealIds]);

  const handleSave = useCallback(async () => {
    if (savePending) return;
    setSavePending(true);

    // Optimistic toggle
    const newSaved = !isSaved;
    setIsSaved(newSaved);
    toggleSave(id); // local store

    try {
      const res = await fetch('/api/customer/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deal_id: id }),
      });
      const json = await res.json();
      if (res.ok) {
        setIsSaved(json.saved); // confirm server state
      } else {
        // Revert on error
        setIsSaved(!newSaved);
        toggleSave(id);
      }
    } catch {
      setIsSaved(!newSaved);
      toggleSave(id);
    } finally {
      setSavePending(false);
    }
  }, [id, isSaved, savePending, toggleSave]);

  const timeLeft = () => {
    if (!deal) return '';
    const ms = new Date(deal.expiry_time).getTime() - Date.now();
    if (ms <= 0) return 'Expired';
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 gap-4">
        <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center">
          <div className="w-7 h-7 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
        </div>
        <p className="text-gray-400 font-semibold text-sm">Loading pulse details…</p>
      </div>
    );
  }

  if (notFound || !deal) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-black text-on-surface mb-2">Pulse Not Found</h2>
        <p className="text-on-surface-variant mb-6">This deal may have expired or vanished into the city.</p>
        <Link href="/discover">
          <Button>Back to Discover</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-surface relative pb-40">
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-surface-container-high/50 md:sticky">
        <div className="flex items-center px-4 h-16 max-w-2xl mx-auto w-full">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 text-primary hover:bg-surface-container rounded-full transition-colors"
          >
            <ArrowLeft size={24} strokeWidth={2.5} />
          </button>
          <h1 className="font-headline font-black text-lg flex-1 ml-2 text-on-surface">Pulse Details</h1>
          <div className="flex gap-1">
            <button className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
              <Share2 size={20} />
            </button>
            <button
              onClick={handleSave}
              disabled={savePending}
              className={`w-10 h-10 flex items-center justify-center transition-all ${
                isSaved ? 'text-red-500 scale-110' : 'text-on-surface-variant'
              } ${savePending ? 'opacity-50' : 'hover:scale-110'}`}
              title={isSaved ? 'Remove from saved' : 'Save deal'}
            >
              <Bookmark size={22} fill={isSaved ? 'currentColor' : 'none'} strokeWidth={isSaved ? 0 : 2} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto pt-4 md:pt-0">
        {/* Hero Section */}
        <section className="relative h-[40vh] md:h-[450px] w-full md:rounded-[40px] overflow-hidden md:mt-4 shadow-xl">
          <img
            alt={deal.product_name}
            className="w-full h-full object-cover"
            src={deal.image_url || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800'}
          />

          {/* Badges */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
            <div className="bg-primary text-white px-5 py-2.5 rounded-[20px] font-headline font-black text-2xl shadow-2xl btn-gradient">
              {Math.round(deal.discount_percent)}% OFF
            </div>
            {deal.is_flash_mob && (
              <div className="bg-white/90 backdrop-blur-md text-primary px-3 py-1.5 rounded-xl font-headline font-black text-xs flex items-center gap-1.5 shadow-lg border border-white">
                <ShieldCheck size={14} fill="currentColor" className="text-primary/20" />
                <span>SQUAD DROP</span>
              </div>
            )}
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <div className="absolute bottom-6 left-6 right-6 text-white">
            <p className="font-bold text-white/70 text-sm mb-1 uppercase tracking-widest">{deal.category}</p>
            <h2 className="text-3xl md:text-4xl font-black leading-tight tracking-tight drop-shadow-md">{deal.product_name}</h2>
          </div>
        </section>

        {/* Content Area */}
        <div className="px-6 -mt-8 relative z-10">
          {/* Main Info Card */}
          <div className="bg-white rounded-[32px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-surface-container-high/50">
            {/* Pulse Indicators */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-surface-container-low p-4 rounded-2xl flex items-center gap-4 border border-surface-container">
                <div className="w-12 h-12 rounded-full bg-[#ffefdb] flex items-center justify-center text-[#a33700]">
                  <Timer size={24} />
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest">Ends In</p>
                  <p className="font-headline font-black text-on-surface text-[15px]">{timeLeft()}</p>
                </div>
              </div>

              <div className="bg-surface-container-low p-4 rounded-2xl flex items-center gap-4 border border-surface-container">
                <div className="w-12 h-12 rounded-full bg-[#fae8e8] flex items-center justify-center text-[#b31b25]">
                  <Flame size={24} fill="currentColor" />
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest">Inventory</p>
                  <p className="font-headline font-black text-[#b31b25] text-[15px]">{deal.quantity_remaining} Left</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4 mb-8">
              <h4 className="text-[11px] font-black text-on-surface-variant uppercase tracking-[0.2em]">The Narrative</h4>
              <p className="text-on-surface-variant leading-relaxed font-medium text-[15px]">
                {deal.description || 'A limited-time local pulse deal. Grab it before it vanishes!'}
              </p>
            </div>

            {/* Store Info */}
            <div className="pt-6 border-t border-surface-container-high/50">
              <div className="flex items-center gap-4">
                {deal.retailers?.avatar_url ? (
                  <img
                    alt={deal.retailers.shop_name}
                    className="w-16 h-16 rounded-2xl object-cover border border-surface-container"
                    src={deal.retailers.avatar_url}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-2xl border border-surface-container">
                    {deal.retailers?.shop_name?.[0] ?? '🏪'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <h3 className="font-headline font-black text-on-surface text-lg truncate">{deal.retailers?.shop_name}</h3>
                    <ShieldCheck size={16} className="text-secondary shrink-0" fill="currentColor" />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-on-surface-variant font-bold">
                    {deal.distance_km != null && (
                      <span className="flex items-center gap-1">
                        <MapPin size={14} /> {deal.distance_km.toFixed(1)} km away
                      </span>
                    )}
                    {deal.retailers?.rating && (
                      <span className="flex items-center gap-1 text-[#fcab23]">
                        <Star size={14} fill="currentColor" />
                        {deal.retailers.rating} (Verified)
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => {
                    const q = encodeURIComponent(deal.retailers?.address ?? deal.retailers?.shop_name ?? '');
                    window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, '_blank');
                  }}
                  className="w-12 h-12 bg-secondary text-white rounded-full flex items-center justify-center shadow-lg shadow-secondary/20 hover:scale-105 active:scale-95 transition-all"
                >
                  <Navigation size={22} fill="white" />
                </button>
              </div>
            </div>
          </div>

          {/* Claim Methodology */}
          <div className="mt-10 mb-6">
            <h4 className="text-[11px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-4 text-center">Claim Methodology</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-3xl bg-white border-2 border-primary bg-primary-container/5 shadow-md">
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="w-10 h-10 rounded-full bg-[#ffefdb] flex items-center justify-center text-primary mb-1">
                    <ShieldCheck size={20} />
                  </div>
                  <span className="text-[13px] font-black text-primary uppercase tracking-tight">Priority Claim</span>
                  <span className="text-[10px] text-on-surface-variant font-bold leading-tight">Instant digital key issued immediately.</span>
                </div>
              </div>
              <div className="p-5 rounded-3xl bg-white border border-surface-container-high grayscale opacity-60">
                <div className="flex flex-col items-center gap-2 text-center text-on-surface-variant">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center mb-1">
                    <MapPin size={20} />
                  </div>
                  <span className="text-[13px] font-black uppercase tracking-tight">Pay at Pulse</span>
                  <span className="text-[10px] font-bold leading-tight">Reserved for 30m. Pay on arrival.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Checkout Action Bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-2xl z-50 rounded-t-[40px] shadow-[0_-15px_40px_rgba(0,0,0,0.08)] border-t border-surface-container-high/50">
        <div className="px-8 pt-6 pb-12 max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-1">
              <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest">Pulse Value</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-headline font-black text-on-surface">₹{deal.current_price.toFixed(0)}</span>
                <span className="text-base text-on-surface-variant/40 line-through font-bold">₹{deal.original_price.toFixed(0)}</span>
              </div>
            </div>

            <div className="flex items-center bg-surface-container-low rounded-full p-1.5 border border-surface-container-high h-12">
              <button className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface hover:bg-white shadow-sm transition-all">
                <Minus size={18} strokeWidth={2.5} />
              </button>
              <span className="w-10 text-center font-black text-lg">1</span>
              <button className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface hover:bg-white shadow-sm transition-all">
                <Plus size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {isClaimed ? (
            <Link href={`/redeem/${deal.id}`} className="block w-full">
              <button className="w-full h-16 rounded-full flex items-center justify-center gap-3 bg-green-600 text-white font-headline font-black text-lg shadow-xl shadow-green-200 transition-all hover:scale-[1.02] active:scale-[0.98]">
                <span>View Reserved Claim</span>
                <ArrowRight size={22} strokeWidth={2.5} />
              </button>
            </Link>
          ) : (
            <button
              onClick={() => claimDeal(deal.id)}
              className="primary-gradient w-full h-16 rounded-full flex items-center justify-center gap-3 text-white font-headline font-black text-lg shadow-[0_12px_24px_rgba(163,55,0,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Initiate Priority Claim</span>
              <ArrowRight size={22} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
