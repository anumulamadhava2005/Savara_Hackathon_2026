'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppStore } from '@/store/appStore';

/**
 * AgentBridge — mounted once in root layout.
 *
 * HOW THE LEVRAGE WIDGET FIRES ACTIONS
 * ─────────────────────────────────────
 * When the voice agent triggers a Frontend Action, the widget iframe posts:
 *   window.postMessage({ type: 'nova-agent-rpc', method: '<action_id>', data: { ...params } }, '*')
 *
 * The embed.js relay on the parent page re-dispatches this as a CustomEvent:
 *   window.dispatchEvent(new CustomEvent('nova-agent-rpc', { detail: { method, data } }))
 *
 * We listen to BOTH the CustomEvent AND the raw postMessage (belt-and-suspenders).
 *
 * HOW WE SEND CONTEXT BACK
 * ─────────────────────────
 * window.LevrageWidget.sendPageContext(pageName, pageData, availableActions)
 * window.LevrageWidget.sendAction(actionId, data)  ← tell agent what user just did
 */

// Map Next.js pathname → readable page name + available actions
function getPageContext(pathname: string, claimedCount: number, savedCount: number, unreadCount: number) {
  if (pathname.startsWith('/discover'))    return { page: 'discover',    data: { description: 'Browse nearby deals' }, actions: ['claim_deal', 'save_deal', 'filter_category', 'open_deal', 'search_deals'] };
  if (pathname.startsWith('/map'))         return { page: 'map',         data: { description: 'Ghost Pulse map view' }, actions: ['navigate_to_discover'] };
  if (pathname.startsWith('/deals'))       return { page: 'deal_detail', data: { description: 'Deal detail page' },    actions: ['claim_deal', 'save_deal', 'join_squad'] };
  if (pathname.startsWith('/wallet'))      return { page: 'wallet',      data: { claimed: claimedCount, description: 'Reward points & activity' }, actions: ['redeem_points', 'get_wallet'] };
  if (pathname.startsWith('/passport'))   return { page: 'passport',    data: { description: 'Deal passport & stamps' }, actions: ['get_profile'] };
  if (pathname.startsWith('/saved'))       return { page: 'saved',       data: { saved_count: savedCount }, actions: ['claim_deal', 'unsave_deal'] };
  if (pathname.startsWith('/community'))  return { page: 'community',   data: { description: 'Community posts' }, actions: [] };
  if (pathname.startsWith('/notifications')) return { page: 'notifications', data: { unread: unreadCount }, actions: ['mark_notifications_read'] };
  if (pathname.startsWith('/dashboard'))   return { page: 'dashboard',   data: { description: 'Retailer dashboard' }, actions: ['create_deal', 'get_sales_stats'] };
  if (pathname.startsWith('/create-deal') || pathname.startsWith('/post-deal')) return { page: 'create_deal', data: { description: 'Create a new deal' }, actions: ['fill_deal_form', 'submit_deal'] };
  if (pathname.startsWith('/flash'))       return { page: 'flash',       data: { description: 'Flash mob deals' }, actions: ['join_squad', 'claim_deal'] };
  return { page: pathname, data: {}, actions: [] };
}

export default function AgentBridge() {
  const router   = useRouter();
  const pathname = usePathname();
  const { claimedDealIds, savedDealIds, unreadCount, claimDeal, toggleSave } = useAppStore();

  // ── Send page context whenever the route changes ─────────────────────────
  useEffect(() => {
    const ctx = getPageContext(pathname, claimedDealIds.length, savedDealIds.length, unreadCount());
    const widget = (window as Window & { LevrageWidget?: { sendPageContext: (p: string, d: object, a: string[]) => void } }).LevrageWidget;
    if (widget?.sendPageContext) {
      widget.sendPageContext(ctx.page, ctx.data, ctx.actions);
    }
  }, [pathname, claimedDealIds.length, savedDealIds.length]);

  // ── Handle agent-triggered frontend actions ───────────────────────────────
  useEffect(() => {
    async function handleAction(method: string, data: Record<string, unknown>) {
      const w = window as Window & {
        LevrageWidget?: { sendAction: (id: string, d: object) => void };
      };

      switch (method) {
        // ── NAVIGATION ──────────────────────────────────────────────────
        case 'navigate_to_discover':   router.push('/discover');      break;
        case 'navigate_to_map':        router.push('/map');           break;
        case 'navigate_to_wallet':     router.push('/wallet');        break;
        case 'navigate_to_passport':   router.push('/passport');      break;
        case 'navigate_to_saved':      router.push('/saved');         break;
        case 'navigate_to_notifications': router.push('/notifications'); break;
        case 'navigate_to_community':  router.push('/community');     break;
        case 'navigate_to_dashboard':  router.push('/dashboard');     break;
        case 'navigate_to_create_deal': router.push('/create-deal'); break;
        case 'navigate_to_flash':      router.push('/flash');         break;

        // ── DEAL ACTIONS ─────────────────────────────────────────────────
        case 'claim_deal': {
          const dealId = data.deal_id as string;
          if (!dealId) break;
          try {
            await claimDeal(dealId, data.squad_id as string | undefined);
            w.LevrageWidget?.sendAction('deal_claimed', { deal_id: dealId, success: true });
            router.push(`/claim/${dealId}`);
          } catch {
            w.LevrageWidget?.sendAction('deal_claim_failed', { deal_id: dealId });
          }
          break;
        }

        case 'open_deal': {
          const dealId = data.deal_id as string;
          if (dealId) router.push(`/deals/${dealId}`);
          break;
        }

        case 'save_deal': {
          const dealId = data.deal_id as string;
          if (dealId) {
            toggleSave(dealId);
            // Sync to backend
            fetch('/api/customer/saved', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ deal_id: dealId }),
            });
            const isSaved = !savedDealIds.includes(dealId);
            w.LevrageWidget?.sendAction('deal_saved', { deal_id: dealId, saved: isSaved });
          }
          break;
        }

        case 'filter_category': {
          const category = data.category as string;
          if (category) {
            router.push(`/discover?category=${encodeURIComponent(category)}`);
          }
          break;
        }

        case 'search_deals': {
          const query = data.query as string;
          if (query) {
            router.push(`/discover?search=${encodeURIComponent(query)}`);
          }
          break;
        }

        // ── SQUAD / FLASH MOB ────────────────────────────────────────────
        case 'join_squad': {
          const { squad_id, deal_id } = data as { squad_id: string; deal_id: string };
          if (squad_id && deal_id) {
            const { joinSquad } = useAppStore.getState();
            await joinSquad(squad_id, deal_id);
            w.LevrageWidget?.sendAction('squad_joined', { squad_id, deal_id });
          }
          break;
        }

        // ── FORM FILL (create-deal page) ─────────────────────────────────
        case 'fill_deal_form': {
          // The embed.js `fill_form` built-in fills by element id/name.
          // We trigger it here so the agent can pre-populate the form.
          const fields = data.fields as Record<string, string> | undefined;
          if (fields) {
            const iframe = document.querySelector('iframe[title="Nova Agent"]') as HTMLIFrameElement | null;
            iframe?.contentWindow?.postMessage(
              { type: 'nova-agent-rpc', method: 'fill_form', data: { action_id: 'fill_form', fields } },
              '*'
            );
          }
          break;
        }

        // ── WALLET ───────────────────────────────────────────────────────
        case 'redeem_points': {
          const { points, label } = data as { points: number; label: string };
          if (points && label) {
            const res = await fetch('/api/agent', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer lev_somMa4MKy2gkVgccMTwrpX5GPyRKs5SgGA_DSL2sotw` },
              body: JSON.stringify({ action: 'redeem_points', payload: { points, label } }),
            });
            const result = await res.json();
            w.LevrageWidget?.sendAction('points_redeemed', result);
          }
          break;
        }

        // ── NOTIFICATIONS ────────────────────────────────────────────────
        case 'mark_notifications_read': {
          await fetch('/api/customer/notifications/mark-read', {
            method: 'POST',
            body: JSON.stringify({ all: true }),
          });
          w.LevrageWidget?.sendAction('notifications_cleared', {});
          break;
        }

        // ── RETAILER ─────────────────────────────────────────────────────
        case 'get_sales_stats': {
          const res = await fetch('/api/agent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer lev_somMa4MKy2gkVgccMTwrpX5GPyRKs5SgGA_DSL2sotw` },
            body: JSON.stringify({ action: 'get_sales_stats', payload: {} }),
          });
          const result = await res.json();
          w.LevrageWidget?.sendAction('sales_stats_result', result);
          break;
        }

        default:
          console.debug('[AgentBridge] Unhandled action:', method, data);
      }
    }

    // Listen for CustomEvent dispatched by embed.js relay
    const onCustomEvent = (e: Event) => {
      const { method, data } = (e as CustomEvent<{ method: string; data: Record<string, unknown> }>).detail;
      if (method) handleAction(method, data ?? {});
    };

    // Also listen for raw postMessage (fallback if relay hasn't set up yet)
    const onMessage = (e: MessageEvent) => {
      if (!e.data || typeof e.data !== 'object') return;
      if (e.data.type !== 'nova-agent-rpc') return;
      const { method, data } = e.data as { method: string; data: Record<string, unknown> };
      // action_id is the Frontend Action ID from Studio; method is the built-in
      const actionId = (data?.action_id as string) || method;
      if (actionId) handleAction(actionId, data ?? {});
    };

    window.addEventListener('nova-agent-rpc', onCustomEvent);
    window.addEventListener('message', onMessage);
    return () => {
      window.removeEventListener('nova-agent-rpc', onCustomEvent);
      window.removeEventListener('message', onMessage);
    };
  }, [router, claimedDealIds, savedDealIds, claimDeal, toggleSave]);

  return null;
}

