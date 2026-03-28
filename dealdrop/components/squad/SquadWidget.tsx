'use client';
import { Squad } from '@/types';
import { SquadTimer } from './SquadTimer';

interface SquadWidgetProps {
  squad: Squad;
  onJoin: () => void;
}

export function SquadWidget({ squad, onJoin }: SquadWidgetProps) {
  const percent = Math.min((squad.current_count / squad.target_count) * 100, 100);

  return (
    <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3 text-purple-900 font-bold">
        <span>⚡ Flash Mob Squad</span>
        <SquadTimer expiresAt={squad.expires_at} />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-purple-700 font-medium">
          <span>{squad.current_count} joined</span>
          <span>Target: {squad.target_count}</span>
        </div>
        <div className="w-full h-3 bg-purple-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-600 transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="text-xs text-purple-600 text-center mt-2 italic">
          {squad.target_count - squad.current_count} more people needed for the squad deal!
        </p>
      </div>

      <button
        onClick={onJoin}
        disabled={squad.status !== 'forming'}
        className="w-full mt-4 bg-purple-600 text-white py-2 rounded-lg font-bold hover:bg-purple-700 transition-colors disabled:opacity-50"
      >
        {squad.status === 'forming' ? 'Join Squad' : 'Squad Complete!'}
      </button>
    </div>
  );
}
