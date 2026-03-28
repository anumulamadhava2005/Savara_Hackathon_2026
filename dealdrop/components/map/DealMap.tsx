'use client';
import { useEffect, useRef } from 'react';
import { Deal, GeoPoint } from '@/types';
import dynamic from 'next/dynamic';

// Leaflet must be loaded client-side only
const MapContainerComponent = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayerComponent = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const MarkerComponent = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const PopupComponent = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface DealMapProps {
  deals: Deal[];
  center: GeoPoint;
  zoom?: number;
}

export function DealMap({ deals, center, zoom = 14 }: DealMapProps) {
  const mapRef = useRef(null);

  useEffect(() => {
    // Import leaflet CSS
    import('leaflet/dist/leaflet.css');
  }, []);

  return (
    <div className="w-full h-full min-h-[400px] rounded-xl overflow-hidden border border-gray-200">
      <MapContainerComponent
        center={[center.lat, center.lng]}
        zoom={zoom}
        className="w-full h-full"
        ref={mapRef}
      >
        <TileLayerComponent
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {deals.map((deal) => (
          <MarkerComponent key={deal.id} position={[deal.location.lat, deal.location.lng]}>
            <PopupComponent>
              <div className="p-1">
                <h3 className="font-semibold text-sm">{deal.product_name}</h3>
                <p className="text-xs text-gray-500">₹{deal.current_price} ({deal.discount_percent}% off)</p>
                <p className="text-xs text-gray-400">{deal.quantity_remaining} left</p>
              </div>
            </PopupComponent>
          </MarkerComponent>
        ))}
      </MapContainerComponent>
    </div>
  );
}
