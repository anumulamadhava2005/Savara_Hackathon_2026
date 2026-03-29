'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Search, ChevronDown, Heart, Zap, Navigation2, Clock,
  TrendingUp, Frown, MapPin, LogOut, RefreshCw, Loader2
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

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

/* ── tiny deal card ─────────────────────────────────────── */
function DealCard({ deal, saved, onSave }: { deal: Deal; saved: boolean; onSave: () => void }) {
  const countdown = useCountdown(deal.expiry_time);
  const isUrgent = deal.quantity_remaining <= 4;
  const isExpiringSoon = new Date(deal.expiry_time).getTime() - Date.now() < 30 * 60 * 1000;

  return (
    <div className="relative group">
      <Link href={`/deals/${deal.id}`}>
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          {/* Image */}
          <div className="relative h-52 bg-slate-100">
            <img
              src={deal.image_url || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400'}
              alt={deal.product_name}
              className="w-full h-full object-cover"
            />
            {/* Badges */}
            {deal.discount_percent > 50 && (
              <div className="absolute top-3 left-3 bg-amber-400 text-white text-[10px] font-black px-2.5 py-1 rounded-md flex items-center gap-1 uppercase tracking-wide shadow-sm">
                <TrendingUp size={11} strokeWidth={3} /> Hot Pick
              </div>
            )}
            {deal.is_flash_mob && (
              <div className="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-black px-2.5 py-1 rounded-md flex items-center gap-1 uppercase tracking-wide shadow-sm">
                <Zap size={11} fill="white" /> Squad Drop
              </div>
            )}
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-orange-600 text-[11px] font-black px-2.5 py-1 rounded-md shadow-sm">
              {Math.round(deal.discount_percent)}% OFF
            </div>
            {/* Countdown */}
            <div className={`absolute bottom-3 left-3 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${isUrgent || isExpiringSoon ? 'bg-red-600/90' : 'bg-black/60'}`}>
              <Clock size={11} className={isUrgent ? 'animate-pulse' : ''} />
              {countdown}
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            <div className="flex justify-between items-start mb-0.5">
              <h3 className="font-extrabold text-[15px] text-gray-900 truncate pr-2 max-w-[68%]">
                {deal.retailers?.shop_name ?? 'Local Store'}
              </h3>
              <span className="font-extrabold text-[15px] text-orange-600">
                ₹{deal.current_price.toFixed(0)}
              </span>
            </div>
            <p className="text-[13px] font-semibold text-gray-500 truncate mb-3">{deal.product_name}</p>
            <div className="flex items-center gap-3 text-[11px] text-gray-400 font-medium">
              <span className="flex items-center gap-1">
                <Navigation2 size={11} /> {deal.distance_km?.toFixed(1) ?? '—'} km
              </span>
              <span className={`flex items-center gap-1 ${isUrgent ? 'text-red-500 font-bold' : ''}`}>
                <Zap size={11} className={isUrgent ? 'fill-red-500 text-red-500' : ''} />
                {deal.quantity_remaining} left
              </span>
              <span className="ml-auto capitalize text-gray-300">{deal.category}</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Save button */}
      <button
        onClick={e => { e.preventDefault(); onSave(); }}
        className={`absolute top-[215px] right-4 w-9 h-9 rounded-full flex items-center justify-center shadow-md border transition-all z-10 ${saved ? 'bg-red-500 border-red-500 text-white' : 'bg-white border-gray-200 text-gray-400 hover:text-red-400'}`}
      >
        <Heart size={15} fill={saved ? 'white' : 'none'} />
      </button>
    </div>
  );
}

/* ── main page ───────────────────────────────────────────── */
export default function DiscoverPage() {
  const router = useRouter();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [userLat, setUserLat] = useState(DEFAULT_LAT);
  const [userLng, setUserLng] = useState(DEFAULT_LNG);
  const [locationLabel, setLocationLabel] = useState('Bangalore, India');
  const [radiusKm] = useState(10);

  /* get geolocation then fetch deals */
  const fetchDeals = useCallback(async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ lat: String(lat), lng: String(lng), radius_km: String(radiusKm) });
      if (activeCategory !== 'All') params.set('category', activeCategory.toLowerCase());
      const res = await fetch(`/api/deals?${params}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      setDeals(json.deals ?? []);
    } catch {
      setDeals([]);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, radiusKm]);

  useEffect(() => {
    if (!navigator.geolocation) { fetchDeals(DEFAULT_LAT, DEFAULT_LNG); return; }
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setUserLat(lat); setUserLng(lng);
        // reverse geocode via Google Maps Geocoding API
        try {
          const r = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GMAPS_KEY}`);
          const g = await r.json();
          const comp = g.results?.[0]?.address_components;
          const locality = comp?.find((c: { types: string[] }) => c.types.includes('locality'))?.long_name;
          if (locality) setLocationLabel(locality);
        } catch {}
        fetchDeals(lat, lng);
      },
      () => fetchDeals(DEFAULT_LAT, DEFAULT_LNG)
    );
  }, []);  // eslint-disable-line

  // re-fetch on category change
  useEffect(() => { fetchDeals(userLat, userLng); }, [activeCategory]); // eslint-disable-line

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const toggleSave = (id: string) =>
    setSavedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const filtered = deals.filter(d => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      d.product_name.toLowerCase().includes(q) ||
      (d.retailers?.shop_name ?? '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col min-h-full bg-[#f5f7fa] pb-24 md:pb-6">

      {/* ── Mobile header ───────────────────────── */}
      <div className="md:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-5 py-4 flex justify-between items-center">
        <div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1">
            <MapPin size={10} className="text-orange-500" /> {locationLabel}
          </p>
          <h1 className="text-xl font-black text-gray-900 tracking-tight leading-tight">Discover Deals</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => fetchDeals(userLat, userLng)} className="w-9 h-9 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center hover:bg-orange-100 transition-colors">
            <RefreshCw size={15} />
          </button>
          <button onClick={handleLogout} title="Logout" className="w-9 h-9 bg-red-50 text-red-400 rounded-full flex items-center justify-center hover:bg-red-100 transition-colors">
            <LogOut size={15} />
          </button>
        </div>
      </div>

      {/* ── Desktop header ──────────────────────── */}
      <div className="hidden md:flex items-center justify-between mb-6 sticky top-0 z-30 bg-[#f5f7fa]/90 backdrop-blur-xl pt-2 pb-4">
        <div>
          <p className="text-xs text-gray-400 font-bold flex items-center gap-1.5 mb-1">
            <MapPin size={12} className="text-orange-500" /> {locationLabel} · {radiusKm} km radius
          </p>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Discover Deals</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search deals, stores…"
              className="w-72 h-11 bg-white border border-gray-200 rounded-full pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-300 shadow-sm"
            />
          </div>
          <button onClick={() => fetchDeals(userLat, userLng)} className="w-11 h-11 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-orange-500 transition-colors shadow-sm">
            <RefreshCw size={16} />
          </button>
          <button onClick={handleLogout} title="Logout" className="w-11 h-11 bg-red-50 text-red-400 rounded-full flex items-center justify-center hover:bg-red-100 transition-colors">
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* ── Mobile search ───────────────────────── */}
      <div className="md:hidden px-5 pt-4 pb-2">
        <div className="relative">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
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
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Stats bar ────────────────────────────── */}
      <div className="px-5 md:px-0 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-100">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            <span className="text-[12px] font-bold text-gray-600">
              {loading ? 'Loading…' : `${filtered.length} pulse${filtered.length !== 1 ? 's' : ''} active`}
            </span>
          </div>
          <Link href="/map" className="flex items-center gap-2 bg-orange-500 text-white rounded-full px-4 py-2 text-[12px] font-bold shadow-sm shadow-orange-200 hover:bg-orange-600 transition-colors">
            <MapPin size={13} /> Pulse Map
          </Link>
        </div>
      </div>

      {/* ── Main content ─────────────────────────── */}
      <div className="px-5 md:px-0">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center">
              <Loader2 size={28} className="text-orange-500 animate-spin" />
            </div>
            <p className="text-gray-400 font-semibold text-sm">Finding deals near you…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 bg-white rounded-3xl border border-gray-100">
            <Frown size={48} className="text-gray-200" />
            <h3 className="text-lg font-bold text-gray-700">No pulses found</h3>
            <p className="text-sm text-gray-400 max-w-xs text-center font-medium">
              {deals.length === 0
                ? 'No active deals within your area right now. Check back soon!'
                : 'Try a different category or search term.'}
            </p>
            <button onClick={() => fetchDeals(userLat, userLng)} className="mt-2 flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-orange-600 transition-colors">
              <RefreshCw size={14} /> Refresh
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-extrabold text-gray-900">
                {activeCategory === 'All' ? 'Live Near You' : `${activeCategory} Deals`}
              </h2>
              <Link href="/map" className="text-[13px] font-bold text-orange-500 flex items-center gap-1 hover:underline">
                View on map <ChevronDown size={14} className="-rotate-90" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(deal => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  saved={savedIds.includes(deal.id)}
                  onSave={() => toggleSave(deal.id)}
                />
              ))}

              {/* Surprise Pulse CTA */}
              <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-7 text-white relative overflow-hidden flex flex-col justify-between min-h-[300px] border-2 border-white/20 shadow-xl shadow-orange-200">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-10 translate-x-10 pointer-events-none" />
                <div>
                  <Zap size={28} className="mb-4 text-yellow-200" fill="currentColor" />
                  <h3 className="text-[22px] font-extrabold mb-2 tracking-tight">Surprise Pulse!</h3>
                  <p className="text-[14px] text-white/90 font-medium leading-relaxed">
                    A mystery deal within 500m is waiting. Tap to reveal on the Pulse Map.
                  </p>
                </div>
                <Link href="/map" className="mt-6 bg-white text-orange-600 text-center font-extrabold text-[15px] py-3.5 rounded-2xl block hover:bg-orange-50 transition-colors">
                  Reveal on Map →
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
