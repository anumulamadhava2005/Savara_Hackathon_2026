import { create } from 'zustand';
import { Deal, GeoPoint, DealCategory } from '@/types';

interface DealStore {
  deals: Deal[];
  userLocation: GeoPoint | null;
  selectedCategory: DealCategory | null;
  radiusKm: number;
  setDeals: (deals: Deal[]) => void;
  setUserLocation: (loc: GeoPoint) => void;
  setCategory: (cat: DealCategory | null) => void;
  setRadius: (km: number) => void;
}

export const useDealStore = create<DealStore>((set) => ({
  deals: [],
  userLocation: null,
  selectedCategory: null,
  radiusKm: 2,
  setDeals: (deals) => set({ deals }),
  setUserLocation: (userLocation) => set({ userLocation }),
  setCategory: (selectedCategory) => set({ selectedCategory }),
  setRadius: (radiusKm) => set({ radiusKm }),
}));
