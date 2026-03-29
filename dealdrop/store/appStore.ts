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

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  unread: boolean;
  time: string;
  created_at: string;
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
  syncDeals: () => Promise<void>;
  savedDealIds: string[];
  claimedDealIds: string[];
  toggleSave: (dealId: string) => void;
  claimDeal: (dealId: string, squadId?: string) => Promise<void>;
  addActivity: (item: { type: string, label: string, value: string, deal_id?: string }) => void;

  // Squads
  squads: typeof MOCK_SQUADS;
  syncSquads: () => Promise<void>;
  joinedSquadIds: string[];
  joinSquad: (squadId: string, dealId: string) => Promise<void>;

  // Notifications
  notifications: NotificationItem[];
  syncNotifications: () => Promise<void>;
  markAllRead: () => Promise<void>;
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
      syncDeals: async () => {
        try {
          const res = await fetch('/api/deals?lat=' + get().userLat + '&lng=' + get().userLng);
          const data = await res.json();
          if (data.deals) set({ deals: data.deals });
        } catch (err) { console.error('Sync deals failed:', err); }
      },
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
          }));
          get().syncWallet();
          get().syncNotifications();
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
          // Unified session sync first
          const sRes = await fetch('/api/auth/session');
          const sData = await sRes.json();
          if (sData.profile) {
            set((s) => ({
              currentUser: { ...s.currentUser, ...sData.profile },
            }));
          }

          // Then wallet-specific totals (only for customers)
          if (sData.role === 'customer') {
            const res = await fetch('/api/customer/wallet');
            const data = await res.json();
            if (data.profile) {
              set((s) => ({
                currentUser: { ...s.currentUser, ...data.profile },
                activity: data.activity || s.activity,
                claimedDealIds: data.claims.map((c: any) => c.deal_id),
              }));
            }
          }
        } catch (err) {
          console.error('Sync wallet/session failed:', err);
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
            get().syncWallet();
            get().syncNotifications();
            return true;
          }
          return false;
        } catch (err) {
          console.error('Redeem failed:', err);
          return false;
        }
      },

      squads: MOCK_SQUADS,
      syncSquads: async () => {
        try {
          const res = await fetch('/api/squads');
          const data = await res.json();
          if (data.squads) set({ squads: data.squads });
        } catch (err) { console.error('Sync squads failed:', err); }
      },
      joinedSquadIds: [],
      joinSquad: async (squadId, dealId) => {
        try {
          const res = await fetch('/api/squads/join', {
            method: 'POST',
            body: JSON.stringify({ squad_id: squadId, deal_id: dealId }),
          });
          const data = await res.json();
          if (data.success) {
            set((s) => ({
              joinedSquadIds: [...s.joinedSquadIds, squadId],
            }));
            if (data.isComplete) {
              set((s) => ({
                claimedDealIds: [...s.claimedDealIds, dealId],
              }));
              get().syncWallet();
            }
            get().syncSquads();
            get().syncNotifications();
          }
        } catch (err) {
          console.error('Join squad failed:', err);
        }
      },

      notifications: [],
      syncNotifications: async () => {
        try {
          const res = await fetch('/api/customer/notifications');
          const data = await res.json();
          if (data.notifications) {
            const formatted = data.notifications.map((n: any) => ({
               ...n,
               time: new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }));
            set({ notifications: formatted });
          }
        } catch (err) { console.error('Sync notifications failed:', err); }
      },
      markAllRead: async () => {
        try {
          await fetch('/api/customer/notifications/mark-read', {
            method: 'POST',
            body: JSON.stringify({ all: true }),
          });
          get().syncNotifications();
        } catch (err) { console.error('Mark all read failed:', err); }
      },
      unreadCount: () => get().notifications.filter(n => n.unread).length,

      activity: MOCK_ACTIVITY,
    }),
    {
      name: 'dealdrop-store-v4', // bumped version
      partialize: (state) => ({
        currentUser: state.currentUser,
        savedDealIds: state.savedDealIds,
        claimedDealIds: state.claimedDealIds,
        joinedSquadIds: state.joinedSquadIds,
        notifications: state.notifications,
        activity: state.activity as any,
        deals: state.deals,
        squads: state.squads,
      }),
    }
  )
);
