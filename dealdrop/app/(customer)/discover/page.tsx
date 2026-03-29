'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Search, ChevronDown, Heart, Zap, Navigation, Clock,
  TrendingUp, Frown, MapPin, Sparkles, RefreshCw, LogOut
} from '@/components/ui/Icons';
import { useAppStore } from '@/store/appStore';

/* ── types ──────────────────────────────────────────────── */
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
  distance_km: number;
  retailers?: { shop_name: string; address: string };
}

const CATEGORIES = ['All', 'Food', 'Wellness', 'Fashion', 'Grocery', 'General'];
const DEFAULT_LAT = 12.9716;
const DEFAULT_LNG = 77.5946;

/* ── countdown helper ────────────────────────────────────── */
function useCountdown(expiry: string) {
  const [left, setLeft] = useState('');
  useEffect(() => {
    const update = () => {
      const ms = new Date(expiry).getTime() - Date.now();
      if (ms <= 0) { setLeft('Expired'); return; }
      const h = Math.floor(ms / 3_600_000);
      const m = Math.floor((ms % 3_600_000) / 60_000);
      const s = Math.floor((ms % 60_000) / 1_000);
      setLeft(h > 0 ? `${h}h ${m}m` : `${m}m ${s}s`);
    };
    update();
    const t = setInterval(update, 1_000);
    return () => clearInterval(t);
  }, [expiry]);
  return left;
}

/* ── deal card ───────────────────────────────────────────── */
/* ── retailer card (store list view) — same shape as DealCard ── */
function RetailerCard({
  name, address, avatar_url, rating, distance_km, dealCount, category, onSelect
}: {
  name: string; address: string; avatar_url?: string;
  rating?: number; distance_km?: number; dealCount: number;
  category: string; onSelect: () => void;
}) {
  const emoji = category === 'food' ? '🍽️' : category === 'wellness' ? '🧘' : category === 'fashion' ? '👗' : category === 'grocery' ? '🛒' : '🏪';

  return (
    <div
      onClick={onSelect}
      className="relative group cursor-pointer bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100/80 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
    >
      {/* Image / hero area */}
      <div className="relative h-56 bg-slate-100 overflow-hidden">
        {avatar_url ? (
          <img src={avatar_url} alt={name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 transition-transform duration-700 group-hover:scale-110">
            <span className="text-7xl">{emoji}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {/* Deal count badge — top left */}
        <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest shadow-lg">
          {dealCount} deal{dealCount !== 1 ? 's' : ''}
        </div>

        {/* Category chip — top right */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md text-gray-600 text-[11px] font-black px-3 py-1.5 rounded-xl shadow-lg capitalize">
          {category}
        </div>

        {/* Distance — bottom left */}
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white text-[11px] font-black px-4 py-2 rounded-2xl flex items-center gap-2">
          <Navigation size={12} className="text-secondary" />
          {distance_km != null ? `${distance_km.toFixed(1)} km` : '—'}
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-black text-[16px] text-gray-900 truncate pr-2 max-w-[75%]">{name}</h3>
          {rating && (
            <span className="font-black text-[14px] text-amber-500 flex items-center gap-1">
              ★ {rating.toFixed(1)}
            </span>
          )}
        </div>
        <p className="text-[13px] font-semibold text-gray-400 truncate">{address}</p>
      </div>
    </div>
  );
}


/* ── deal card (deal list inside a store) ────────────────── */
function DealCard({ deal, saved, onSave }: { deal: Deal; saved: boolean; onSave: () => void }) {
  const countdown = useCountdown(deal.expiry_time ?? new Date().toISOString());
  const qty = deal.quantity_remaining ?? 0;
  const currentPrice = deal.current_price ?? 0;
  const discPct = deal.discount_percent ?? 0;
  const isUrgent = qty <= 4;
  const isExpiringSoon = deal.expiry_time
    ? new Date(deal.expiry_time).getTime() - Date.now() < 30 * 60 * 1000
    : false;

  return (
    <div className="relative group">
      <Link href={`/deals/${deal.id}`} className="block">
        <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100/80 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer">
          {/* Image */}
          <div className="relative h-48 bg-slate-100 overflow-hidden">
            <img
              src={deal.image_url || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400'}
              alt={deal.product_name ?? 'Deal'}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            {/* Save button — inside image top-right */}
            <button
              onClick={e => { e.preventDefault(); onSave(); }}
              className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-lg border-2 border-white transition-all duration-300 z-10 active:scale-90 ${saved ? 'bg-red-500 text-white' : 'bg-black/40 backdrop-blur-sm text-white hover:bg-red-500'}`}
            >
              <Heart size={15} strokeWidth={2.5} fill={saved ? 'white' : 'none'} />
            </button>
            {/* Badges */}
            {discPct > 50 && (
              <div className="absolute top-3 left-3 bg-amber-400 text-white text-[10px] font-black px-2.5 py-1 rounded-xl flex items-center gap-1 uppercase tracking-widest shadow-lg">
                <TrendingUp size={11} strokeWidth={3} /> Hot
              </div>
            )}
            {deal.is_flash_mob && (
              <div className="absolute top-3 left-3 bg-primary text-white text-[10px] font-black px-2.5 py-1 rounded-xl flex items-center gap-1 uppercase tracking-widest shadow-lg">
                <Zap size={11} fill="white" /> Squad
              </div>
            )}
            {/* Discount badge */}
            <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md text-primary text-[12px] font-black px-2.5 py-1 rounded-xl shadow-lg">
              {Math.round(discPct)}% OFF
            </div>
            {/* Countdown */}
            <div className={`absolute bottom-3 left-3 backdrop-blur-md text-white text-[11px] font-black px-3 py-1.5 rounded-2xl flex items-center gap-1.5 ${isUrgent || isExpiringSoon ? 'bg-red-600/90' : 'bg-black/60'}`}>
              <Clock size={12} className={isUrgent ? 'animate-pulse' : ''} />
              {countdown}
            </div>
          </div>
          {/* Info */}
          <div className="p-4">
            <div className="flex justify-between items-start mb-0.5">
              <p className="font-black text-[15px] text-gray-900 truncate pr-2 max-w-[65%]">{deal.product_name}</p>
              <span className="font-black text-[16px] text-primary">₹{currentPrice.toFixed(0)}</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-2">
              <span className={`flex items-center gap-1 ${isUrgent ? 'text-red-500 font-black' : ''}`}>
                <Zap size={11} fill={isUrgent ? 'currentColor' : 'none'} /> {qty} left
              </span>
              <span className="line-through text-gray-300 normal-case font-semibold">₹{(deal.original_price ?? 0).toFixed(0)}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

/* ── main page ───────────────────────────────────────────── */
export default function DiscoverPage() {
  const { currentUser, savedDealIds, toggleSave } = useAppStore();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [userLat, setUserLat] = useState(DEFAULT_LAT);
  const [userLng, setUserLng] = useState(DEFAULT_LNG);
  const [locationLabel, setLocationLabel] = useState('Bangalore, India');
  const [showAll, setShowAll] = useState(false);
  // null = retailer list, string = selected retailer shop_name
  const [selectedRetailer, setSelectedRetailer] = useState<string | null>(null);
  const radiusKm = 10;

  /* fetch deals from API */
  const fetchDeals = useCallback(async (lat: number, lng: number, category?: string, globalMode?: boolean) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        lat: String(lat),
        lng: String(lng),
        radius_km: globalMode ? '99999' : String(radiusKm),
      });
      if (category && category !== 'All') params.set('category', category.toLowerCase());
      const res = await fetch(`/api/deals?${params}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      setDeals(json.deals ?? []);
    } catch {
      setDeals([]);
    } finally {
      setLoading(false);
    }
  }, [radiusKm]);

  /* geolocation on mount */
  useEffect(() => {
    if (!navigator.geolocation) {
      fetchDeals(DEFAULT_LAT, DEFAULT_LNG);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setUserLat(lat);
        setUserLng(lng);
        try {
          const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
          const g = await r.json();
          const city = g.address?.city || g.address?.town || g.address?.suburb;
          if (city) setLocationLabel(city);
        } catch {}
        fetchDeals(lat, lng);
      },
      () => fetchDeals(DEFAULT_LAT, DEFAULT_LNG)
    );
  }, []); // eslint-disable-line

  /* re-fetch on category change */
  useEffect(() => {
    fetchDeals(userLat, userLng, activeCategory, showAll);
  }, [activeCategory, showAll]); // eslint-disable-line

  const toggleShowAll = () => {
    const next = !showAll;
    setShowAll(next);
    fetchDeals(userLat, userLng, activeCategory, next);
  };

  const syncSave = async (dealId: string) => {
    toggleSave(dealId); // optimistic local update
    try {
      await fetch('/api/customer/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deal_id: dealId }),
      });
    } catch {}
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  // Group valid deals by retailer
  const retailerMap = React.useMemo(() => {
    const map = new Map<string, { info: Deal['retailers'] & { distance_km?: number }, deals: Deal[] }>();
    deals
      .filter(d => d.id && d.product_name != null)
      .filter(d => !search || (d.product_name ?? '').toLowerCase().includes(search.toLowerCase()) || (d.retailers?.shop_name ?? '').toLowerCase().includes(search.toLowerCase()))
      .forEach(d => {
        const key = d.retailers?.shop_name ?? 'Unknown Store';
        if (!map.has(key)) {
          map.set(key, { info: { ...d.retailers, distance_km: d.distance_km } as any, deals: [] });
        }
        map.get(key)!.deals.push(d);
      });
    return map;
  }, [deals, search]);

  const retailerList = Array.from(retailerMap.entries());
  const selectedDeals = selectedRetailer ? (retailerMap.get(selectedRetailer)?.deals ?? []) : [];
  const totalFiltered = deals.filter(d => d.id && d.product_name != null).length;

  return (
    <div className="flex flex-col min-h-full bg-[#f5f7fa] pb-24 md:pb-6">

      {/* ── Mobile header ───────────────────────── */}
      <div className="md:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100/80 px-5 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={currentUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop'}
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md bg-slate-200"
              alt="avatar"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-primary border-2 border-white flex items-center justify-center">
              <Sparkles size={8} />
            </div>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-1">
              <MapPin size={10} className="text-primary" /> {locationLabel}
            </p>
            <h1 className="text-xl font-black text-gray-900 tracking-tight leading-tight">Discover Deals</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {currentUser?.reward_points != null && (
            <div className="h-9 px-3 bg-orange-50 text-primary rounded-xl flex items-center gap-1.5 font-black text-sm">
              <Zap size={14} fill="currentColor" />
              {currentUser.reward_points > 999
                ? `${Math.floor(currentUser.reward_points / 1000)}k`
                : currentUser.reward_points}
            </div>
          )}
          <button
            onClick={() => fetchDeals(userLat, userLng, activeCategory)}
            className="w-9 h-9 bg-orange-50 text-primary rounded-full flex items-center justify-center hover:bg-orange-100 transition-colors"
          >
            <RefreshCw size={15} />
          </button>
          <button
            onClick={handleLogout}
            className="w-9 h-9 bg-red-50 text-red-400 rounded-full flex items-center justify-center hover:bg-red-100 transition-colors"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>

      {/* ── Desktop header ──────────────────────── */}
      <div className="hidden md:flex items-center justify-between mb-6 sticky top-0 z-30 bg-[#f5f7fa]/90 backdrop-blur-xl pt-2 pb-4">
        <div>
          <p className="text-xs text-gray-400 font-bold flex items-center gap-1.5 mb-1">
            <MapPin size={12} className="text-primary" /> {locationLabel} · {radiusKm} km radius
          </p>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Discover Deals</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search deals, stores…"
              className="w-72 h-11 bg-white border border-gray-200 rounded-full pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
            />
          </div>
          <button
            onClick={() => fetchDeals(userLat, userLng, activeCategory)}
            className="w-11 h-11 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-primary transition-colors shadow-sm"
          >
            <RefreshCw size={16} />
          </button>
          <button
            onClick={handleLogout}
            className="w-11 h-11 bg-red-50 text-red-400 rounded-full flex items-center justify-center hover:bg-red-100 transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* ── Mobile search ───────────────────────── */}
      <div className="md:hidden px-5 pt-4 pb-2">
        <div className="relative">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search deals, stores…"
            className="w-full h-11 bg-white rounded-full pl-10 pr-4 text-sm font-medium focus:outline-none shadow-sm border border-gray-100"
          />
        </div>
      </div>

      {/* ── Category pills ──────────────────────── */}
      <div className="px-5 md:px-0 py-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-[13px] font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-primary text-white shadow-md shadow-primary/25'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-primary/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Stats bar ───────────────────────────────── */}
      <div className="px-5 md:px-0 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-100">
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${showAll ? 'bg-blue-400' : 'bg-green-400'}`} />
            <span className="text-[12px] font-bold text-gray-600">
              {loading ? 'Loading…' : `${retailerList.length} store${retailerList.length !== 1 ? 's' : ''} · ${totalFiltered} deal${totalFiltered !== 1 ? 's' : ''} ${showAll ? 'globally' : 'nearby'}`}
            </span>
          </div>
          <button
            onClick={toggleShowAll}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[12px] font-black transition-all duration-300 shadow-sm border ${
              showAll ? 'bg-blue-500 text-white border-blue-500 shadow-blue-200 shadow-md' : 'bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-500'
            }`}
          >
            <span className="text-[14px]">{showAll ? '🌍' : '📍'}</span>
            {showAll ? 'Showing All' : 'Show All'}
          </button>
          <Link href="/map" className="ml-auto flex items-center gap-2 bg-primary text-white rounded-full px-4 py-2 text-[12px] font-bold shadow-sm shadow-primary/20 hover:opacity-90 transition-opacity">
            <MapPin size={13} /> Pulse Map
          </Link>
        </div>
      </div>

      {/* ── Main content ─────────────────────────── */}
      <div className="px-5 md:px-0">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center">
              <div className="w-7 h-7 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
            <p className="text-gray-400 font-semibold text-sm">Finding deals near you…</p>
          </div>
        ) : retailerList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 bg-white rounded-3xl border border-gray-100">
            <Frown size={48} className="text-gray-200" />
            <h3 className="text-lg font-bold text-gray-700">No stores found</h3>
            <p className="text-sm text-gray-400 max-w-xs text-center font-medium">
              No active deals in your area right now. Try 'Show All' or check back soon!
            </p>
            <button
              onClick={() => fetchDeals(userLat, userLng, activeCategory, showAll)}
              className="mt-2 flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full text-sm font-bold hover:opacity-90 transition-opacity"
            >
              <RefreshCw size={14} /> Refresh
            </button>
          </div>
        ) : selectedRetailer ? (
          /* ── DEAL LIST for selected retailer ── */
          <>
            <button
              onClick={() => setSelectedRetailer(null)}
              className="flex items-center gap-2 mb-5 text-primary font-black text-[14px] hover:opacity-70 transition-opacity"
            >
              <ChevronDown size={18} className="rotate-90" /> Back to stores
            </button>
            <div className="mb-4">
              <h2 className="text-xl font-black text-gray-900">{selectedRetailer}</h2>
              <p className="text-sm text-gray-400 font-medium">{selectedDeals.length} active deal{selectedDeals.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {selectedDeals.map(deal => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  saved={savedDealIds.includes(deal.id)}
                  onSave={() => syncSave(deal.id)}
                />
              ))}
            </div>
          </>
        ) : (
          /* ── RETAILER / STORE LIST ── */
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-extrabold text-gray-900">
                {activeCategory === 'All' ? 'Stores Near You' : `${activeCategory} Stores`}
              </h2>
              <Link href="/map" className="text-[13px] font-bold text-primary flex items-center gap-1 hover:underline">
                View on map <ChevronDown size={14} className="-rotate-90" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {retailerList.map(([shopName, { info, deals: rDeals }]) => (
                <RetailerCard
                  key={shopName}
                  name={shopName}
                  address={(info as any)?.address ?? ''}
                  avatar_url={(info as any)?.avatar_url}
                  rating={(info as any)?.rating}
                  distance_km={(info as any)?.distance_km}
                  dealCount={rDeals.length}
                  category={(info as any)?.category ?? (rDeals[0]?.category ?? 'general')}
                  onSelect={() => setSelectedRetailer(shopName)}
                />
              ))}

              {/* Ghost Pulse CTA */}
              <div className="bg-gradient-to-br from-primary to-red-500 rounded-[32px] p-7 text-white relative overflow-hidden flex flex-col justify-between min-h-[320px] border-2 border-white/20 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform duration-500">
                <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full blur-3xl -translate-y-10 translate-x-10 pointer-events-none" />
                <div>
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-5 backdrop-blur-md border border-white/30">
                    <Zap size={26} fill="currentColor" className="text-yellow-200" />
                  </div>
                  <h3 className="text-[22px] font-black mb-2 tracking-tight">Ghost Pulse!</h3>
                  <p className="text-[14px] text-white/85 font-medium leading-relaxed">
                    A mystery deal within 300m is waiting. Tap to reveal on the Pulse Map.
                  </p>
                </div>
                <Link href="/map" className="mt-6 bg-white text-primary text-center font-black text-[15px] py-3.5 rounded-2xl block hover:bg-orange-50 transition-colors active:scale-95">
                  Reveal Co-ordinates →
                </Link>
              </div>
            </div>

          </>
        )}
      </div>
    </div>
  );
}
