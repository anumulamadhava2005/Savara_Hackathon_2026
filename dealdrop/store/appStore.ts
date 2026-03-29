import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MOCK_USERS, MOCK_DEALS, MOCK_SQUADS, MOCK_ACTIVITY, MOCK_NOTIFICATIONS } from '@/lib/mock-data';

export type MockUser = typeof MOCK_USERS[0];

interface AppStore {
  // Auth
  currentUser: MockUser | null;
  setCurrentUser: (user: MockUser | null) => void;

  // Location
  userLat: number;
  userLng: number;
  setUserLocation: (lat: number, lng: number) => void;

  // Deals
  deals: typeof MOCK_DEALS;
  savedDealIds: string[];
  claimedDealIds: string[];
  toggleSave: (dealId: string) => void;
  claimDeal: (dealId: string) => void;

  // Squads
  squads: typeof MOCK_SQUADS;
  joinedSquadIds: string[];
  joinSquad: (squadId: string) => void;

  // Notifications
  notifications: typeof MOCK_NOTIFICATIONS;
  markAllRead: () => void;
  unreadCount: () => number;

  // Activity
  activity: typeof MOCK_ACTIVITY;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      currentUser: MOCK_USERS[0],
      setCurrentUser: (user) => set({ currentUser: user }),

      userLat: 13.0827,
      userLng: 80.2707,
      setUserLocation: (lat, lng) => set({ userLat: lat, userLng: lng }),

      deals: MOCK_DEALS,
      savedDealIds: [],
      claimedDealIds: [],
      toggleSave: (dealId) => set((s) => ({
        savedDealIds: s.savedDealIds.includes(dealId)
          ? s.savedDealIds.filter(id => id !== dealId)
          : [...s.savedDealIds, dealId]
      })),
      claimDeal: (dealId) => set((s) => {
        const already = s.claimedDealIds.includes(dealId);
        if (already) return s;
        return {
          claimedDealIds: [...s.claimedDealIds, dealId],
          // Decrement quantity_remaining in deals
          deals: s.deals.map(d => d.id === dealId
            ? { ...d, quantity_remaining: Math.max(0, d.quantity_remaining - 1) }
            : d),
          // Add to activity
          activity: [
            {
              id: `a-${Date.now()}`,
              type: 'claim',
              label: `Claimed '${s.deals.find(d => d.id === dealId)?.product_name || 'Deal'}'`,
              time: 'Just now',
              value: `+$${((s.deals.find(d => d.id === dealId)?.original_price || 0) - (s.deals.find(d => d.id === dealId)?.current_price || 0)).toFixed(2)} saved`,
              deal_id: dealId,
            },
            ...s.activity,
          ]
        };
      }),

      squads: MOCK_SQUADS,
      joinedSquadIds: [],
      joinSquad: (squadId) => set((s) => {
        const already = s.joinedSquadIds.includes(squadId);
        if (already) return s;
        return {
          joinedSquadIds: [...s.joinedSquadIds, squadId],
          squads: s.squads.map(sq => sq.id === squadId
            ? { ...sq, current_count: sq.current_count + 1 }
            : sq),
        };
      }),

      notifications: MOCK_NOTIFICATIONS,
      markAllRead: () => set((s) => ({
        notifications: s.notifications.map(n => ({ ...n, unread: false }))
      })),
      unreadCount: () => get().notifications.filter(n => n.unread).length,

      activity: MOCK_ACTIVITY,
    }),
    {
      name: 'dealdrop-store',
      partialize: (state) => ({
        currentUser: state.currentUser,
        savedDealIds: state.savedDealIds,
        claimedDealIds: state.claimedDealIds,
        joinedSquadIds: state.joinedSquadIds,
        notifications: state.notifications,
        activity: state.activity,
        deals: state.deals,
      }),
    }
  )
);
