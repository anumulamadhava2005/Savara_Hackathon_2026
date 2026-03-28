'use client';
import { useDealPulse } from '@/hooks/useDealPulse';

export function DealPulse() {
  const { events, connected } = useDealPulse();

  if (!connected || events.length === 0) return null;

  const typeConfig = {
    claim: { emoji: '🎯', color: 'text-green-600' },
    new_deal: { emoji: '🆕', color: 'text-blue-600' },
    squad_join: { emoji: '👥', color: 'text-purple-600' },
  };

  return (
    <div className="bg-gray-50 rounded-xl p-3 space-y-2">
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Live Activity</h4>
      <div className="space-y-1.5 max-h-32 overflow-y-auto">
        {events.slice(0, 5).map((event, i) => {
          const config = typeConfig[event.type];
          return (
            <div key={i} className={`text-sm ${config.color} flex items-center gap-1.5`}>
              <span>{config.emoji}</span>
              <span className="truncate">{event.message}</span>
              {event.distance_m && (
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {event.distance_m}m away
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
