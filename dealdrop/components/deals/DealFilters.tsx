'use client';
import { DealCategory } from '@/types';

const categories: { value: DealCategory | 'all'; label: string; emoji: string }[] = [
  { value: 'all', label: 'All', emoji: '🛒' },
  { value: 'grocery', label: 'Grocery', emoji: '🥫' },
  { value: 'bakery', label: 'Bakery', emoji: '🍞' },
  { value: 'dairy', label: 'Dairy', emoji: '🥛' },
  { value: 'produce', label: 'Produce', emoji: '🥬' },
  { value: 'general', label: 'General', emoji: '📦' },
];

interface DealFiltersProps {
  selectedCategory: DealCategory | null;
  onCategoryChange: (cat: DealCategory | null) => void;
  radiusKm: number;
  onRadiusChange: (km: number) => void;
}

export function DealFilters({ selectedCategory, onCategoryChange, radiusKm, onRadiusChange }: DealFiltersProps) {
  return (
    <div className="space-y-3">
      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => onCategoryChange(cat.value === 'all' ? null : cat.value)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              (cat.value === 'all' && !selectedCategory) || selectedCategory === cat.value
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Radius Slider */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500 whitespace-nowrap">📍 {radiusKm}km</span>
        <input
          type="range"
          min={0.5}
          max={10}
          step={0.5}
          value={radiusKm}
          onChange={(e) => onRadiusChange(parseFloat(e.target.value))}
          className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
      </div>
    </div>
  );
}
