'use client';
import { useState, useEffect } from 'react';
import { Deal } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { getUrgencyLevel } from '@/lib/pricing/dynamicPricing';
import { haversineKm, walkTimeMins } from '@/lib/geo/haversine';
import { GeoPoint } from '@/types';

export function useDeals(userLocation: GeoPoint | null, radiusKm = 2, category?: string) {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userLocation) return;

    const fetchDeals = async () => {
      const params = new URLSearchParams({
        lat: String(userLocation.lat),
        lng: String(userLocation.lng),
        radius_km: String(radiusKm),
        ...(category ? { category } : {}),
      });

      try {
        const res = await fetch(`/api/deals?${params}`);
        if (!res.ok) {
          console.error('Failed to fetch deals:', res.statusText);
          setDeals([]);
          setLoading(false);
          return;
        }

        const text = await res.text();
        const raw = text ? JSON.parse(text).deals : [];

        const enriched: Deal[] = (raw ?? []).map((d: Deal) => {
          const distanceKm = haversineKm(userLocation.lat, userLocation.lng, d.location.lat, d.location.lng);
          return {
            ...d,
            distance_km: distanceKm,
            walk_time_mins: walkTimeMins(distanceKm),
            urgency_level: getUrgencyLevel(d.expiry_time),
          };
        });

        // Sort: critical first, then by distance
        enriched.sort((a, b) => {
          const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 };
          const uDiff = urgencyOrder[a.urgency_level!] - urgencyOrder[b.urgency_level!];
          return uDiff !== 0 ? uDiff : (a.distance_km ?? 0) - (b.distance_km ?? 0);
        });

        setDeals(enriched);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching deals:', err);
        setDeals([]);
        setLoading(false);
      }
    };

    fetchDeals();

    // Supabase Realtime: listen for new/updated deals
    const supabase = createClient();
    const channel = supabase
      .channel('deals-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'deals' }, () => {
        fetchDeals(); // refetch on any change
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userLocation, radiusKm, category]);

  return { deals, loading };
}
