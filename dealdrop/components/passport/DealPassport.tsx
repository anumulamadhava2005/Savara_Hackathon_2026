'use client';
import { PassportLevel } from '@/types';

interface DealPassportProps {
  stamps: number;
  level: PassportLevel;
  fullName?: string;
}

export function DealPassport({ stamps, level, fullName }: DealPassportProps) {
  const levelConfig = {
    newcomer: { color: 'bg-gray-100 text-gray-700', icon: '🐣', next: 5 },
    explorer: { color: 'bg-blue-100 text-blue-700', icon: '🗺️', next: 20 },
    hunter:   { color: 'bg-orange-100 text-orange-700', icon: '🎯', next: 50 },
    hero:     { color: 'bg-red-100 text-red-700', icon: '🏆', next: 100 },
  };

  const config = levelConfig[level];
  const progress = Math.min((stamps / config.next) * 100, 100);

  return (
    <div className="bg-white rounded-2xl border-4 border-double border-indigo-100 p-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 z-0" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-indigo-900 uppercase tracking-tighter italic">Deal Passport</h2>
            <p className="text-xs text-indigo-500 font-bold uppercase tracking-widest">{fullName || 'Verified Hunter'}</p>
          </div>
          <span className="text-4xl">{config.icon}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-indigo-50 rounded-xl p-3 text-center">
            <p className="text-xs text-indigo-400 font-bold uppercase">Stamps</p>
            <p className="text-3xl font-black text-indigo-900">{stamps}</p>
          </div>
          <div className={`rounded-xl p-3 text-center ${config.color}`}>
            <p className="text-xs font-bold uppercase opacity-70">Level</p>
            <p className="text-xl font-black uppercase tracking-tight">{level}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-indigo-400 uppercase">
            <span>Progress to next rank</span>
            <span>{stamps} / {config.next}</span>
          </div>
          <div className="w-full h-4 bg-indigo-50 rounded-full border border-indigo-100 overflow-hidden p-0.5">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`w-10 h-10 rounded-full flex-shrink-0 border-2 border-dashed flex items-center justify-center text-xs ${
                i < stamps ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'border-gray-200 text-gray-300'
              }`}
            >
              {i < stamps ? '✓' : i + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
