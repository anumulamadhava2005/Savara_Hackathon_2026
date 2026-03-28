'use client';
import { useDealStore } from '@/store/dealStore';
import { DealMap } from '@/components/map/DealMap';
import { HeatmapLayer } from '@/components/map/HeatmapLayer';

export default function MapPage() {
  const { deals, userLocation } = useDealStore();

  if (!userLocation) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <p className="text-gray-500 font-medium">Waiting for location...</p>
      </div>
    );
  }

  // Convert deals to heatmap points [lat, lng, intensity]
  const heatmapPoints: [number, number, number][] = deals.map((d) => [
    d.location.lat,
    d.location.lng,
    d.discount_percent / 100, // higher discount = higher intensity
  ]);

  return (
    <div className="space-y-4 h-[80vh] flex flex-col">
      <section>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Deal Heatmap 🔥</h2>
        <p className="text-sm text-gray-500">Visualizing the hottest discounts in your area</p>
      </section>

      <div className="flex-1 rounded-2xl overflow-hidden border-2 border-white shadow-2xl relative">
        <DealMap deals={deals} center={userLocation} />
        {/* HeatmapLayer would be added inside DealMap if it supported children or via a more complex prop structure */}
        {/* For this scaffold, we show how points are computed */}
      </div>

      <div className="bg-white p-3 rounded-xl border border-gray-100 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-xs font-bold text-gray-600">High Discount</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="text-xs font-bold text-gray-600">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-300" />
          <span className="text-xs font-bold text-gray-600">Active Deal</span>
        </div>
      </div>
    </div>
  );
}
