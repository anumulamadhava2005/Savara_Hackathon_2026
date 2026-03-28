'use client';
import { useState, useEffect } from 'react';
import { GeoPoint } from '@/types';

export function useLocation() {
  const [location, setLocation] = useState<GeoPoint | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
      },
      () => {
        // Default to Chennai (for demo)
        setLocation({ lat: 13.0827, lng: 80.2707 });
        setLoading(false);
      }
    );
  }, []);

  return { location, error, loading };
}
