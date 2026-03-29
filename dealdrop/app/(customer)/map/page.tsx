'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
  Search, Navigation2, Zap, Clock,
  X, MapPin, Loader2, RefreshCw, ChevronRight
} from 'lucide-react';

/* ── types ──────────────────────────────────────────────── */
interface Deal {
  id: string;
  product_name: string;
  category: string;
  original_price: number;
  current_price: number;
  discount_percent: number;
  quantity_remaining: number;
  expiry_time: string;
  image_url: string;
  is_flash_mob: boolean;
  distance_km: number;
  lat?: number;
  lng?: number;
  retailers?: { shop_name: string; address: string };
}

const DEFAULT_CENTER: [number, number] = [12.9716, 77.5946];

/* ── countdown ───────────────────────────────────────────── */
function useCountdown(expiry: string) {
  const [left, setLeft] = useState('');
  useEffect(() => {
    const tick = () => {
      const ms = new Date(expiry).getTime() - Date.now();
      if (ms <= 0) { setLeft('Expired'); return; }
      const h = Math.floor(ms / 3_600_000);
      const m = Math.floor((ms % 3_600_000) / 60_000);
      const s = Math.floor((ms % 60_000) / 1_000);
      setLeft(h > 0 ? `${h}h ${m}m` : `${m}m ${s}s`);
    };
    tick();
    const t = setInterval(tick, 1_000);
    return () => clearInterval(t);
  }, [expiry]);
  return left;
}

/* ── deal info card ─────────────────────────────────────── */
function DealCard({ deal, onClose }: { deal: Deal; onClose: () => void }) {
  const countdown = useCountdown(deal.expiry_time);
  const isUrgent = deal.quantity_remaining <= 4;

  return (
    <div className="absolute bottom-28 md:bottom-6 left-4 right-4 z-[1000] pointer-events-auto">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 max-w-md mx-auto">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={14} fill="white" className="text-white" />
            <span className="text-[11px] font-black text-white uppercase tracking-widest">
              {isUrgent ? '🔥 Almost Gone!' : 'Active Deal'}
            </span>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <X size={18} />
          </button>
        </div>
        <div className="flex gap-4 p-4">
          <div className="w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden shrink-0">
            <img
              src={deal.image_url || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200'}
              alt={deal.product_name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-extrabold text-gray-900 text-[17px] leading-tight truncate">
              {deal.retailers?.shop_name ?? 'Local Store'}
            </h3>
            <p className="text-[13px] text-orange-500 font-bold truncate">{deal.product_name}</p>
            <div className="flex items-center gap-3 mt-2 text-[12px] text-gray-400 font-medium flex-wrap">
              <span className="flex items-center gap-1">
                <Clock size={11} className={isUrgent ? 'text-red-500' : ''} />
                <span className={isUrgent ? 'text-red-500 font-bold' : ''}>{countdown}</span>
              </span>
              <span className="flex items-center gap-1">
                <Navigation2 size={11} /> {deal.distance_km?.toFixed(1) ?? '—'} km
              </span>
              <span className={`flex items-center gap-1 ${isUrgent ? 'text-red-500 font-bold' : ''}`}>
                <Zap size={11} fill={isUrgent ? '#ef4444' : 'none'} /> {deal.quantity_remaining} left
              </span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-gray-300 text-xs line-through">₹{deal.original_price.toFixed(0)}</p>
            <p className="text-gray-900 font-black text-xl leading-tight">₹{deal.current_price.toFixed(0)}</p>
            <span className="inline-block mt-1 bg-orange-100 text-orange-600 text-[10px] font-black px-2 py-0.5 rounded-md">
              {Math.round(deal.discount_percent)}% OFF
            </span>
          </div>
        </div>
        <div className="px-4 pb-4">
          <Link
            href={`/deals/${deal.id}`}
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-black text-[15px] py-3.5 rounded-2xl hover:opacity-90 transition-opacity shadow-lg shadow-orange-200"
          >
            Claim This Deal <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── leaflet map (dynamic import to avoid SSR) ──────────── */
function LeafletMap({
  deals,
  activeId,
  setActiveId,
  userPos,
  center,
}: {
  deals: Deal[];
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  userPos: [number, number] | null;
  center: [number, number];
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Dynamically import Leaflet (client-only)
    import('leaflet').then(L => {
      // Fix default icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      leafletRef.current = L;

      if (!mapRef.current || mapInstanceRef.current) return;

      // Create map
      const map = L.map(mapRef.current, {
        center,
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      // Dark tile layer (Carto Dark Matter — free, no API key)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Attribution (required by Carto ToS)
      L.control.attribution({ prefix: false }).addTo(map);
      map.attributionControl?.setPrefix('© <a href="https://carto.com/">CARTO</a> © <a href="https://www.openstreetmap.org/copyright">OSM</a>');

      // Layers group for markers
      markersLayerRef.current = L.layerGroup().addTo(map);

      map.on('click', () => setActiveId(null));
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); // eslint-disable-line

  // Pan to user position
  useEffect(() => {
    if (mapInstanceRef.current && userPos) {
      mapInstanceRef.current.setView(userPos, 14, { animate: true });
    }
  }, [userPos]);

  // Update markers when deals change
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    if (!L || !map || !layer) return;

    layer.clearLayers();

    // User location marker
    if (userPos) {
      const userIcon = L.divIcon({
        className: '',
        html: `<div style="
          width:18px;height:18px;
          background:#3b82f6;
          border:3px solid white;
          border-radius:50%;
          box-shadow:0 0 0 8px rgba(59,130,246,0.2),0 2px 8px rgba(0,0,0,0.4);
        "></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });
      L.marker(userPos, { icon: userIcon }).addTo(layer);
    }

    // Deal markers
    deals.forEach(deal => {
      if (!deal.lat || !deal.lng) return;

      const km = deal.distance_km ?? 999;
      const isUrgent = deal.quantity_remaining <= 4;
      const pct = Math.round(deal.discount_percent ?? 0);
      const isActive = activeId === deal.id;

      // ── distance-based colour ──────────────────────────────────
      // green  < 1 km   very close
      // orange  1–3 km  a little further
      // red    > 3 km   far away
      const distColor = km < 1 ? '#16a34a' : km < 3 ? '#f97316' : '#dc2626';
      const distGlow  = km < 1
        ? 'rgba(22,163,74,0.35)'
        : km < 3
        ? 'rgba(249,115,22,0.35)'
        : 'rgba(220,38,38,0.35)';
      const distLabel = km < 1 ? '🟢' : km < 3 ? '🟠' : '🔴';

      const icon = L.divIcon({
        className: '',
        html: `
          <div style="position:relative;display:inline-flex;flex-direction:column;align-items:center;">
            ${isUrgent ? `<div style="
              position:absolute;inset:-6px;border-radius:50%;
              background:${distGlow};
              animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;
            "></div>` : ''}
            <div style="
              width:${isActive ? '44px' : '38px'};
              height:${isActive ? '44px' : '38px'};
              background:${distColor};
              border-radius:50%;
              border:${isActive ? '3px solid white' : '2px solid white'};
              box-shadow:0 4px 14px ${distGlow},0 2px 6px rgba(0,0,0,0.4);
              display:flex;align-items:center;justify-content:center;
              cursor:pointer;
              transition:all 0.2s;
            ">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <polygon points="13,2 4.09,12.11 10,12.11 11,22 19.91,11.89 14,11.89"/>
              </svg>
            </div>
            <div style="
              position:absolute;top:-8px;right:-8px;
              background:white;color:${distColor};
              font-size:9px;font-weight:900;
              border-radius:999px;
              width:22px;height:22px;
              display:flex;align-items:center;justify-content:center;
              box-shadow:0 2px 6px rgba(0,0,0,0.3);
              border:1.5px solid ${distColor};
            ">${pct}%</div>
            <div style="
              margin-top:2px;
              background:rgba(0,0,0,0.75);
              color:white;font-size:9px;font-weight:700;
              padding:2px 6px;border-radius:999px;
              max-width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
            ">${distLabel} ${deal.retailers?.shop_name ?? 'Store'}</div>
          </div>
        `,
        iconSize: [60, 60],
        iconAnchor: [22, 22],
      });

      const marker = L.marker([deal.lat, deal.lng], { icon });
      marker.on('click', (e: any) => {
        e.originalEvent?.stopPropagation();
        setActiveId(activeId === deal.id ? null : deal.id);
      });
      marker.addTo(layer);
    });
  }, [deals, activeId, userPos]); // eslint-disable-line


  return (
    <>
      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </>
  );
}

/* ── main page ───────────────────────────────────────────── */
export default function PulseMapPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER);

  const fetchDeals = useCallback(async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/deals?lat=${lat}&lng=${lng}&radius_km=10000`);
      if (!res.ok) throw new Error();
      const json = await res.json();
      const enriched = (json.deals ?? []).map((d: Deal, i: number) => ({
        ...d,
        lat: d.lat ?? lat + (Math.cos(i * 1.3) * 0.012),
        lng: d.lng ?? lng + (Math.sin(i * 1.3) * 0.012),
      }));
      setDeals(enriched);
    } catch {
      setDeals([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) { fetchDeals(...DEFAULT_CENTER); return; }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setUserPos([lat, lng]);
        setCenter([lat, lng]);
        fetchDeals(lat, lng);
      },
      () => fetchDeals(...DEFAULT_CENTER)
    );
  }, []); // eslint-disable-line

  const activeDeal = deals.find(d => d.id === activeId);
  const filtered = deals.filter(d =>
    !search ||
    d.product_name.toLowerCase().includes(search.toLowerCase()) ||
    (d.retailers?.shop_name ?? '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative overflow-hidden bg-slate-900" style={{ width: '100%', height: '100dvh' }}>

      {/* ── Leaflet Map ──────────────────────────── */}
      <LeafletMap
        deals={filtered}
        activeId={activeId}
        setActiveId={setActiveId}
        userPos={userPos}
        center={center}
      />

      {/* ── Loading overlay ───────────────────── */}
      {loading && (
        <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center z-[900]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 bg-orange-500/20 rounded-2xl flex items-center justify-center">
              <Loader2 size={28} className="text-orange-400 animate-spin" />
            </div>
            <p className="text-white/60 text-sm font-bold tracking-wide">Scanning for pulses…</p>
          </div>
        </div>
      )}

      {/* ── Top bar ───────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 z-[800] p-4 pt-12 md:pt-5 bg-gradient-to-b from-slate-950/90 via-slate-900/60 to-transparent pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search active pulses…"
              className="w-full h-11 bg-black/50 backdrop-blur-xl border border-white/10 text-white placeholder:text-white/40 rounded-full pl-10 pr-4 focus:outline-none focus:border-orange-400/50 text-sm font-medium"
            />
          </div>
          <button
            onClick={() => userPos ? fetchDeals(...userPos) : fetchDeals(...DEFAULT_CENTER)}
            className="w-11 h-11 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center text-white/70 hover:text-orange-400 transition-colors"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-2 mt-3 pointer-events-auto">
          <div className="bg-red-600/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">
              {filtered.length} Live Pulse{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>
          {userPos && (
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5 flex items-center gap-1.5">
              <MapPin size={11} className="text-blue-400" />
              <span className="text-[10px] font-bold text-white/70">Your location</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Horizontal deal pills ─────────────── */}
      {!activeId && filtered.length > 0 && (
        <div className="absolute bottom-28 md:bottom-6 left-0 right-0 z-[800] px-4 pointer-events-none">
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 pointer-events-auto">
            {filtered.slice(0, 8).map(deal => (
              <button
                key={deal.id}
                onClick={() => setActiveId(deal.id)}
                className="flex-shrink-0 bg-white/90 backdrop-blur-xl rounded-2xl px-4 py-3 flex items-center gap-3 shadow-lg border border-white/50 hover:bg-white transition-colors min-w-[200px]"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                  <img
                    src={deal.image_url || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=80'}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left min-w-0">
                  <p className="font-black text-gray-900 text-[13px] truncate">
                    {deal.retailers?.shop_name ?? 'Local Store'}
                  </p>
                  <p className="text-[11px] text-orange-500 font-bold">
                    {Math.round(deal.discount_percent)}% off · {deal.distance_km?.toFixed(1)} km
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Active deal card ──────────────────── */}
      {activeDeal && (
        <DealCard deal={activeDeal} onClose={() => setActiveId(null)} />
      )}

      {/* ── No deals ─────────────────────────── */}
      {!loading && deals.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-[800] pointer-events-none">
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 text-center border border-white/10 shadow-2xl mx-8 pointer-events-auto">
            <MapPin size={40} className="text-white/20 mx-auto mb-3" />
            <h3 className="text-white font-bold text-lg mb-2">No Pulses in Your Area</h3>
            <p className="text-white/50 text-sm font-medium mb-5">No active deals within 10 km right now.</p>
            <button
              onClick={() => userPos ? fetchDeals(...userPos) : fetchDeals(...DEFAULT_CENTER)}
              className="flex items-center gap-2 bg-orange-500 text-white rounded-full px-5 py-2.5 text-sm font-bold mx-auto hover:bg-orange-600 transition-colors"
            >
              <RefreshCw size={14} /> Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
