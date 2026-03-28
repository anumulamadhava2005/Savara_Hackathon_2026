'use client';
import { useState, useEffect, useCallback } from 'react';
import { DealPulseEvent } from '@/types';

export function useDealPulse() {
  const [events, setEvents] = useState<DealPulseEvent[]>([]);
  const [connected, setConnected] = useState(false);

  const addEvent = useCallback((event: DealPulseEvent) => {
    setEvents((prev) => [event, ...prev].slice(0, 50)); // keep last 50 events
  }, []);

  useEffect(() => {
    // TODO: Connect to Server-Sent Events endpoint for live deal activity
    // For now, simulate with periodic mock events
    setConnected(true);

    const interval = setInterval(() => {
      const mockEvents: DealPulseEvent[] = [
        { type: 'claim', message: 'Someone claimed Fresh Bread nearby!', timestamp: new Date().toISOString(), distance_m: 300 },
        { type: 'new_deal', message: 'New deal: 40% off Milk at corner dairy', timestamp: new Date().toISOString(), distance_m: 500 },
        { type: 'squad_join', message: 'Squad forming for bulk rice deal — 3/5 joined', timestamp: new Date().toISOString(), distance_m: 800 },
      ];
      const randomEvent = mockEvents[Math.floor(Math.random() * mockEvents.length)];
      addEvent(randomEvent);
    }, 15000); // every 15 seconds

    return () => {
      clearInterval(interval);
      setConnected(false);
    };
  }, [addEvent]);

  return { events, connected };
}
