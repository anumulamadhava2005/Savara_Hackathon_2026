import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MOCK_USERS, MOCK_DEALS, MOCK_SQUADS, MOCK_ACTIVITY, MOCK_NOTIFICATIONS } from '@/lib/mock-data';

export type MockUser = typeof MOCK_USERS[0] & { 
  reward_points?: number; 
  total_savings?: number; 
  passport_level?: string; 
  deal_passport_stamps?: number;
};

export interface ActivityItem {
  id: string;
  type: string;
  label: string;
  time: string;
  value: string;
  deal_id?: string;
  created_at?: string;
}

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
  setDeals: (deals: typeof MOCK_DEALS) => void;
  savedDealIds: string[];
  claimedDealIds: string[];
  toggleSave: (dealId: string) => void;
  claimDeal: (dealId: string, squadId?: string) => Promise<void>;
  addActivity: (item: { type: string, label: string, value: string, deal_id?: string }) => void;

  // Squads
  squads: typeof MOCK_SQUADS;
  joinedSquadIds: string[];
  joinSquad: (squadId: string) => void;

  // Notifications
  notifications: typeof MOCK_NOTIFICATIONS;
  markAllRead: () => void;
  unreadCount: () => number;

  // Wallet / Activity
  activity: ActivityItem[];
  syncWallet: () => Promise<void>;
  redeemPoints: (points: number, label: string) => Promise<boolean>;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),

      userLat: 13.0827,
      userLng: 80.2707,
      setUserLocation: (lat, lng) => set({ userLat: lat, userLng: lng }),

      deals: MOCK_DEALS,
      setDeals: (deals) => set({ deals }),
      savedDealIds: [],
      claimedDealIds: [],
      toggleSave: (dealId) => set((s) => ({
        savedDealIds: s.savedDealIds.includes(dealId)
          ? s.savedDealIds.filter(id => id !== dealId)
          : [...s.savedDealIds, dealId]
      })),

      claimDeal: async (dealId, squadId) => {
        try {
          const res = await fetch('/api/claims', {
            method: 'POST',
            body: JSON.stringify({ deal_id: dealId, squad_id: squadId }),
          });
          const data = await res.json();
          if (data.error) throw new Error(data.error);

          const deal = get().deals.find(d => d.id === dealId);
          const savings = (deal?.original_price || 0) - (deal?.current_price || 0);

          set((s) => ({
            claimedDealIds: [...s.claimedDealIds, dealId],
            deals: s.deals.map(d => d.id === dealId
              ? { ...d, quantity_remaining: Math.max(0, d.quantity_remaining - 1) }
              : d),
            currentUser: s.currentUser ? {
              ...s.currentUser,
              total_savings: (s.currentUser.total_savings || 0) + savings,
              reward_points: (s.currentUser.reward_points || 0) + 150,
              deal_passport_stamps: (s.currentUser.deal_passport_stamps || 0) + 1,
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
          }));
        } catch (err) {
          console.error('Claim failed:', err);
        }
      },

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

      syncWallet: async () => {
        try {
          const res = await fetch('/api/customer/wallet');
          const data = await res.json();
          if (data.profile) {
            set((s) => ({
              currentUser: { ...s.currentUser, ...data.profile },
              activity: data.activity || s.activity,
              claimedDealIds: data.claims.map((c: any) => c.deal_id),
            }));
          }
        } catch (err) {
          console.error('Sync failed:', err);
        }
      },

      redeemPoints: async (points: number, label: string) => {
        try {
          const res = await fetch('/api/customer/redeem', {
            method: 'POST',
            body: JSON.stringify({ points, label }),
          });
          const data = await res.json();
          if (data.success) {
            set((s) => ({
               currentUser: s.currentUser ? { ...s.currentUser, reward_points: data.newPoints } : null,
               activity: [
                 {
                   id: `r-${Date.now()}`,
                   type: 'redeem',
                   label: `Redeemed: ${label}`,
                   time: 'Just now',
                   value: `-${points} Pulse PTS`,
                 },
                 ...s.activity
               ]
            }));
            return true;
          }
          return false;
        } catch (err) {
          console.error('Redeem failed:', err);
          return false;
        }
      },

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
      name: 'dealdrop-store-v3', // bumped version
      partialize: (state) => ({
        currentUser: state.currentUser,
        savedDealIds: state.savedDealIds,
        claimedDealIds: state.claimedDealIds,
        joinedSquadIds: state.joinedSquadIds,
        notifications: state.notifications,
        activity: state.activity as any,
        deals: state.deals,
      }),
    }
  )
);
