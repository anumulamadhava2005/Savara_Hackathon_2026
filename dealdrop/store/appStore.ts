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
  addActivity: (item: { type: string, label: string, value: string, deal_id?: string }) => void;

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
        
        const deal = s.deals.find(d => d.id === dealId);
        const savings = (deal?.original_price || 0) - (deal?.current_price || 0);

        return {
          claimedDealIds: [...s.claimedDealIds, dealId],
          deals: s.deals.map(d => d.id === dealId
            ? { ...d, quantity_remaining: Math.max(0, d.quantity_remaining - 1) }
            : d),
          currentUser: s.currentUser ? {
            ...s.currentUser,
            total_savings: s.currentUser.total_savings + savings,
            reward_points: s.currentUser.reward_points + 150, // standard claim points
            deal_passport_stamps: s.currentUser.deal_passport_stamps + 1,
          } : null,
          activity: [
            {
              id: `a-${Date.now()}`,
              type: 'claim',
              label: `Claimed '${deal?.product_name || 'Pulse Item'}'`,
              time: 'Just now',
              value: `+$${savings.toFixed(2)} saved`,
              deal_id: dealId,
            },
            ...s.activity,
          ]
        };
      }),

      addActivity: (item) => set((s) => ({
        activity: [
          { 
            id: `a-${Date.now()}`, 
            time: 'Just now', 
            deal_id: item.deal_id || '',
            ...item 
          },
          ...s.activity
        ]
      })),

      squads: MOCK_SQUADS,
      joinedSquadIds: [],
      joinSquad: (squadId) => set((s) => {
        const already = s.joinedSquadIds.includes(squadId);
        if (already) return s;
        
        const squad = s.squads.find(sq => sq.id === squadId);
        const deal = s.deals.find(d => d.id === squad?.deal_id);

        return {
          joinedSquadIds: [...s.joinedSquadIds, squadId],
          squads: s.squads.map(sq => sq.id === squadId
            ? { ...sq, current_count: sq.current_count + 1 }
            : sq),
          activity: [
            {
              id: `a-${Date.now()}`,
              type: 'squad',
              label: `Joined '${deal?.product_name || 'Squad drop'}'`,
              time: 'Just now',
              value: 'Pending Sync',
              deal_id: squad?.deal_id || '',
            },
            ...s.activity,
          ]
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
      name: 'dealdrop-store-v2', // bumped version
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
