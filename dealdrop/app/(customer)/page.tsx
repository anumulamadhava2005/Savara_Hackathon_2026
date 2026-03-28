'use client';
import { useDealStore } from '@/store/dealStore';
import { useDeals } from '@/hooks/useDeals';
import { useLocation } from '@/hooks/useLocation';
import { DealFeed } from '@/components/deals/DealFeed';
import { DealFilters } from '@/components/deals/DealFilters';
import { DealPulse } from '@/components/deals/DealPulse';
import { useEffect } from 'react';

export default function HomePage() {
  const { location, loading: locLoading } = useLocation();
  const { selectedCategory, radiusKm, setCategory, setRadius, setUserLocation } = useDealStore();
  
  const { deals, loading: dealsLoading } = useDeals(
    location,
    radiusKm,
    selectedCategory || undefined
  );

  useEffect(() => {
    if (location) setUserLocation(location);
  }, [location, setUserLocation]);

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-1">
          Flash Deals Nearby ⚡
        </h2>
        <p className="text-sm text-gray-500 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
          {locLoading ? 'Detecting your location...' : `Active deals within ${radiusKm}km of you`}
        </p>
      </section>

      <DealFilters
        selectedCategory={selectedCategory}
        onCategoryChange={setCategory}
        radiusKm={radiusKm}
        onRadiusChange={setRadius}
      />

      <DealPulse />

      <DealFeed deals={deals} loading={dealsLoading} />

      <div className="pt-4 text-center">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          Powered by Supabase Realtime & PostGIS
        </p>
      </div>
    </div>
  );
}
