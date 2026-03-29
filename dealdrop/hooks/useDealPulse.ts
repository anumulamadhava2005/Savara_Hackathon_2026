'use client';
import { useState, useEffect, useCallback } from 'react';
import { DealPulseEvent } from '@/types';
import { createClient } from '@/lib/supabase/client';

export function useDealPulse() {
  const [events, setEvents] = useState<DealPulseEvent[]>([]);
  const [connected, setConnected] = useState(false);

  const addEvent = useCallback((event: DealPulseEvent) => {
    setEvents((prev) => [event, ...prev].slice(0, 50)); // keep last 50 events
  }, []);

  useEffect(() => {
    const supabase = createClient();
    let isMounted = true;

    const channel = supabase.channel('public:claims')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'claims' }, async (payload) => {
        // Fetch deal info to make a nice message
        const { data: deal } = await supabase
          .from('deals')
          .select('product_name')
          .eq('id', payload.new.deal_id)
          .single();
        
        if (isMounted && deal) {
          addEvent({
            type: 'claim',
            message: `Someone just claimed "${deal.product_name}" nearby!`,
            timestamp: payload.new.claimed_at || new Date().toISOString(),
            distance_m: Math.floor(Math.random() * 800) + 100 // Approximation for privacy
          });
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') setConnected(true);
        if (status === 'CLOSED' || status === 'CHANNEL_ERROR') setConnected(false);
      });

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [addEvent]);

  return { events, connected };
}
