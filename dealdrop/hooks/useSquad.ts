'use client';
import { useState, useEffect } from 'react';
import { Squad, SquadMember } from '@/types';
import { createClient } from '@/lib/supabase/client';

export function useSquad(dealId: string | null) {
  const [squad, setSquad] = useState<Squad | null>(null);
  const [members, setMembers] = useState<SquadMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!dealId) return;

    const supabase = createClient();

    const fetchSquad = async () => {
      const { data: squadData } = await supabase
        .from('squads')
        .select('*')
        .eq('deal_id', dealId)
        .eq('status', 'forming')
        .single();

      if (squadData) {
        setSquad(squadData as unknown as Squad);

        const { data: memberData } = await supabase
          .from('squad_members')
          .select('*')
          .eq('squad_id', squadData.id);

        setMembers((memberData ?? []) as unknown as SquadMember[]);
      }
      setLoading(false);
    };

    fetchSquad();

    // Realtime subscription for squad updates
    const channel = supabase
      .channel(`squad-${dealId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'squad_members' }, () => {
        fetchSquad();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'squads' }, () => {
        fetchSquad();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [dealId]);

  const joinSquad = async (squadId: string) => {
    const res = await fetch(`/api/squad/${squadId}/join`, { method: 'POST' });
    return res.ok;
  };

  return { squad, members, loading, joinSquad };
}
