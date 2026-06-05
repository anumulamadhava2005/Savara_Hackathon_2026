import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// ──────────────────────────────────────────────────────────────────────────────
// POST /api/agent
//
// Unified action endpoint for the Levrage AI voice agent.
// The agent sends { action, payload } and receives structured JSON back.
//
// Auth: Bearer lev_somMa4MKy2gkVgccMTwrpX5GPyRKs5SgGA_DSL2sotw
//       (same embed-key used in the widget)
// ──────────────────────────────────────────────────────────────────────────────

const AGENT_KEY = process.env.LEVRAGE_AGENT_KEY || 'lev_somMa4MKy2gkVgccMTwrpX5GPyRKs5SgGA_DSL2sotw';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

function bad(msg: string) {
  return NextResponse.json({ error: msg }, { status: 400 });
}

export async function POST(req: NextRequest) {
  // ── 1. Verify agent key ────────────────────────────────────────────────────
  const auth = req.headers.get('Authorization') ?? '';
  if (!auth.startsWith('Bearer ') || auth.slice(7) !== AGENT_KEY) {
    return unauthorized();
  }

  let body: { action: string; payload?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return bad('Invalid JSON body');
  }

  const { action, payload = {} } = body;
  if (!action) return bad('Missing action');

  const supabase = await createClient();

  // ── 2. Dispatch by action ──────────────────────────────────────────────────
  switch (action) {

    // ────────────────────────────────────────────────────────────────────────
    // CUSTOMER ACTIONS
    // ────────────────────────────────────────────────────────────────────────

    /**
     * action: "browse_deals"
     * payload: { lat?, lng?, radius_km?, category? }
     * Returns nearby active deals. Falls back to default Chennai coords.
     */
    case 'browse_deals': {
      const lat  = Number(payload.lat  ?? 13.0827);
      const lng  = Number(payload.lng  ?? 80.2707);
      const radius = Number(payload.radius_km ?? 5);
      const category = payload.category as string | undefined;

      let query = supabase
        .from('deals')
        .select(`
          id, product_name, description, category,
          original_price, current_price, discount_percent,
          quantity_remaining, expiry_time, status,
          retailers ( shop_name, address )
        `)
        .eq('status', 'active')
        .gt('quantity_remaining', 0);

      if (category) query = query.eq('category', category);

      const { data, error } = await query.limit(10);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });

      return NextResponse.json({
        success: true,
        count: data?.length ?? 0,
        deals: data ?? [],
        message: `Found ${data?.length ?? 0} active deals near you.`,
      });
    }

    /**
     * action: "get_deal"
     * payload: { deal_id }
     * Returns full details of a single deal.
     */
    case 'get_deal': {
      const deal_id = payload.deal_id as string;
      if (!deal_id) return bad('Missing deal_id');

      const { data, error } = await supabase
        .from('deals')
        .select(`*, retailers ( shop_name, address, category, rating )`)
        .eq('id', deal_id)
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 404 });
      return NextResponse.json({ success: true, deal: data });
    }

    /**
     * action: "claim_deal"
     * payload: { deal_id, squad_id? }
     * Claims a deal for the currently authenticated user.
     */
    case 'claim_deal': {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

      const deal_id  = payload.deal_id as string;
      const squad_id = payload.squad_id as string | undefined;
      if (!deal_id) return bad('Missing deal_id');

      // Check stock
      const { data: deal } = await supabase
        .from('deals')
        .select('quantity_remaining, product_name')
        .eq('id', deal_id)
        .single();

      if (!deal || deal.quantity_remaining <= 0) {
        return NextResponse.json({ error: 'Deal is sold out', success: false }, { status: 409 });
      }

      const { data: claim, error } = await supabase
        .from('claims')
        .insert({ deal_id, user_id: user.id, squad_id: squad_id ?? null, status: 'pending' })
        .select()
        .single();

      if (error?.code === '23505') {
        return NextResponse.json({ error: 'Already claimed this deal', success: false }, { status: 409 });
      }
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });

      // Decrement stock
      await supabase.rpc('increment_passport_stamps', { uid: user.id });
      await supabase
        .from('deals')
        .update({ quantity_remaining: deal.quantity_remaining - 1 })
        .eq('id', deal_id);

      return NextResponse.json({
        success: true,
        claim_id: claim.id,
        message: `Successfully claimed ${deal.product_name}! Show your claim at the store.`,
      });
    }

    /**
     * action: "get_my_claims"
     * payload: { status? } — 'pending' | 'redeemed' | 'expired'
     * Returns all claims for the authenticated user.
     */
    case 'get_my_claims': {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

      let query = supabase
        .from('claims')
        .select(`id, status, claimed_at, deals ( product_name, current_price, discount_percent, expiry_time, retailers ( shop_name, address ) )`)
        .eq('user_id', user.id)
        .order('claimed_at', { ascending: false });

      if (payload.status) query = query.eq('status', payload.status as string);

      const { data, error } = await query;
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });

      return NextResponse.json({
        success: true,
        count: data?.length ?? 0,
        claims: data ?? [],
      });
    }

    /**
     * action: "get_profile"
     * payload: {}
     * Returns the authenticated user's profile and stats.
     */
    case 'get_profile': {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      return NextResponse.json({ success: true, profile });
    }

    /**
     * action: "join_squad"
     * payload: { squad_id, deal_id }
     * Joins a flash-mob squad for a deal.
     */
    case 'join_squad': {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

      const squad_id = payload.squad_id as string;
      const deal_id  = payload.deal_id  as string;
      if (!squad_id || !deal_id) return bad('Missing squad_id or deal_id');

      const { data: squad } = await supabase
        .from('squads')
        .select('current_count, target_count, status')
        .eq('id', squad_id)
        .single();

      if (!squad || squad.status !== 'forming') {
        return NextResponse.json({ error: 'Squad not available', success: false }, { status: 409 });
      }

      const { error } = await supabase
        .from('squad_members')
        .insert({ squad_id, user_id: user.id });

      if (error?.code === '23505') {
        return NextResponse.json({ error: 'Already in this squad', success: false }, { status: 409 });
      }
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });

      const newCount = squad.current_count + 1;
      const isComplete = newCount >= squad.target_count;

      await supabase
        .from('squads')
        .update({ current_count: newCount, status: isComplete ? 'complete' : 'forming' })
        .eq('id', squad_id);

      return NextResponse.json({
        success: true,
        current_count: newCount,
        target_count: squad.target_count,
        is_complete: isComplete,
        message: isComplete
          ? 'Squad is complete! The deal is now unlocked for all members.'
          : `Joined! ${squad.target_count - newCount} more members needed.`,
      });
    }

    /**
     * action: "navigate"
     * payload: { page } — 'discover' | 'map' | 'wallet' | 'passport' | 'saved' | 'notifications' | 'deals' | 'community' | 'dashboard' | 'create-deal'
     * Instructs the frontend to navigate to a page.
     * The widget JS should listen for window messages and use router.push().
     */
    case 'navigate': {
      const page = payload.page as string;
      const validPages: Record<string, string> = {
        discover: '/discover',
        map: '/map',
        wallet: '/wallet',
        passport: '/passport',
        saved: '/saved',
        notifications: '/notifications',
        deals: '/deals',
        community: '/community',
        dashboard: '/dashboard',
        'create-deal': '/create-deal',
        'post-deal': '/post-deal',
        flash: '/flash',
      };
      const path = validPages[page];
      if (!path) return bad(`Unknown page: "${page}". Valid: ${Object.keys(validPages).join(', ')}`);

      return NextResponse.json({
        success: true,
        action: 'navigate',
        path,
        message: `Navigating to ${page}`,
      });
    }

    // ────────────────────────────────────────────────────────────────────────
    // RETAILER ACTIONS
    // ────────────────────────────────────────────────────────────────────────

    /**
     * action: "create_deal"
     * payload: { product_name, description?, category, original_price, current_price, discount_percent, quantity_total, expiry_hours, lat?, lng? }
     * Creates a new deal for the authenticated retailer.
     */
    case 'create_deal': {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

      const { data: retailer } = await supabase
        .from('retailers')
        .select('id, location')
        .eq('user_id', user.id)
        .single();

      if (!retailer) return NextResponse.json({ error: 'Retailer profile not found' }, { status: 403 });

      const {
        product_name, description, category,
        original_price, current_price, discount_percent,
        quantity_total, expiry_hours = 24,
      } = payload as Record<string, unknown>;

      if (!product_name || !category || !original_price || !current_price || !quantity_total) {
        return bad('Missing required fields: product_name, category, original_price, current_price, quantity_total');
      }

      const expiry_time = new Date(Date.now() + Number(expiry_hours) * 3600000).toISOString();

      const { data: deal, error } = await supabase
        .from('deals')
        .insert({
          retailer_id: retailer.id,
          product_name: product_name as string,
          description: (description as string) ?? null,
          category: category as string,
          original_price: Number(original_price),
          current_price: Number(current_price),
          discount_percent: Number(discount_percent),
          quantity_total: Number(quantity_total),
          quantity_remaining: Number(quantity_total),
          expiry_time,
          location: retailer.location,
          status: 'active',
        })
        .select()
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });

      return NextResponse.json({
        success: true,
        deal_id: deal.id,
        message: `Deal "${product_name}" created and is now live!`,
      });
    }

    /**
     * action: "get_sales_stats"
     * payload: {}
     * Returns deal performance stats for the authenticated retailer.
     */
    case 'get_sales_stats': {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

      const { data: retailer } = await supabase
        .from('retailers')
        .select('id, shop_name')
        .eq('user_id', user.id)
        .single();

      if (!retailer) return NextResponse.json({ error: 'Retailer not found' }, { status: 404 });

      const { data: deals } = await supabase
        .from('deals')
        .select(`id, product_name, status, quantity_total, quantity_remaining, current_price, claims ( id, status )`)
        .eq('retailer_id', retailer.id);

      const stats = (deals ?? []).map(d => ({
        product: d.product_name,
        status: d.status,
        total_claims: (d.claims as unknown[])?.length ?? 0,
        redeemed: (d.claims as { status: string }[])?.filter(c => c.status === 'redeemed').length ?? 0,
        revenue_potential: ((d.claims as unknown[])?.length ?? 0) * d.current_price,
        stock_left: d.quantity_remaining,
      }));

      return NextResponse.json({
        success: true,
        shop: retailer.shop_name,
        deals_count: deals?.length ?? 0,
        stats,
      });
    }

    /**
     * action: "redeem_claim"
     * payload: { claim_id }
     * Marks a customer's claim as redeemed (in-store scan).
     */
    case 'redeem_claim': {
      const claim_id = payload.claim_id as string;
      if (!claim_id) return bad('Missing claim_id');

      const { data, error } = await supabase
        .from('claims')
        .update({ status: 'redeemed' })
        .eq('id', claim_id)
        .eq('status', 'pending')
        .select()
        .single();

      if (error || !data) return NextResponse.json({ error: 'Claim not found or already redeemed' }, { status: 404 });

      return NextResponse.json({
        success: true,
        message: 'Claim marked as redeemed.',
        claim: data,
      });
    }

    // ────────────────────────────────────────────────────────────────────────
    // UTILITY
    // ────────────────────────────────────────────────────────────────────────

    /**
     * action: "get_categories"
     * Returns all deal categories in use.
     */
    case 'get_categories': {
      const { data } = await supabase
        .from('deals')
        .select('category')
        .eq('status', 'active');

      const categories = [...new Set((data ?? []).map(d => d.category))];
      return NextResponse.json({ success: true, categories });
    }

    /**
     * action: "save_deal"
     * payload: { deal_id }
     * Toggles save/unsave a deal for the current user.
     */
    case 'save_deal': {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
      const deal_id = payload.deal_id as string;
      if (!deal_id) return bad('Missing deal_id');

      // Check if already saved (assumes saved_deals table or similar)
      const { data: existing } = await supabase
        .from('saved_deals')
        .select('id')
        .eq('user_id', user.id)
        .eq('deal_id', deal_id)
        .maybeSingle();

      if (existing) {
        await supabase.from('saved_deals').delete().eq('id', existing.id);
        return NextResponse.json({ success: true, saved: false, message: 'Deal removed from saved.' });
      } else {
        await supabase.from('saved_deals').insert({ user_id: user.id, deal_id });
        return NextResponse.json({ success: true, saved: true, message: 'Deal saved!' });
      }
    }

    /**
     * action: "get_wallet"
     * payload: {}
     * Returns points, total_savings, passport level, and recent activity.
     */
    case 'get_wallet': {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('full_name, deal_passport_stamps, passport_level, reward_points, total_savings, preferred_categories')
        .eq('id', user.id)
        .single();

      const { data: activity } = await supabase
        .from('user_activity')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      return NextResponse.json({
        success: true,
        profile,
        activity: activity ?? [],
        message: `You have ${profile?.reward_points ?? 0} points and ${profile?.deal_passport_stamps ?? 0} passport stamps.`,
      });
    }

    /**
     * action: "redeem_points"
     * payload: { points, label }
     * Redeems reward points for a perk/voucher.
     */
    case 'redeem_points': {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

      const points = Number(payload.points);
      const label  = payload.label as string;
      if (!points || !label) return bad('Missing points or label');

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('reward_points')
        .eq('id', user.id)
        .single();

      if (!profile || (profile.reward_points ?? 0) < points) {
        return NextResponse.json({ error: 'Insufficient points', success: false }, { status: 402 });
      }

      const newPoints = (profile.reward_points ?? 0) - points;
      await supabase.from('user_profiles').update({ reward_points: newPoints }).eq('id', user.id);
      await supabase.from('user_activity').insert({
        user_id: user.id, type: 'redeem', label, value: `-${points} pts`,
      });

      return NextResponse.json({
        success: true,
        points_used: points,
        points_remaining: newPoints,
        message: `Redeemed ${points} points for: ${label}. ${newPoints} points remaining.`,
      });
    }

    /**
     * action: "get_notifications"
     * payload: {}
     * Returns latest notifications for the user.
     */
    case 'get_notifications': {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      const unread = (data ?? []).filter((n: { unread?: boolean }) => n.unread).length;

      return NextResponse.json({
        success: true,
        unread_count: unread,
        notifications: data ?? [],
        message: `You have ${unread} unread notification${unread !== 1 ? 's' : ''}.`,
      });
    }

    /**
     * action: "mark_notifications_read"
     * payload: { notification_id? } — omit to mark ALL read
     */
    case 'mark_notifications_read': {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

      let query = supabase.from('notifications').update({ unread: false }).eq('user_id', user.id);
      if (payload.notification_id) query = query.eq('id', payload.notification_id as string);

      const { error } = await query;
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });

      return NextResponse.json({ success: true, message: 'Notifications marked as read.' });
    }

    /**
     * action: "drop_deal"  (Retailer — external agent shortcut)
     * payload: { storeName, item, discount, expiresInHours, pin? }
     * Mirror of POST /api/merchant/drop — creates a flash deal by store name lookup.
     */
    case 'drop_deal': {
      const { storeName, item, discount, expiresInHours = 2 } = payload as Record<string, unknown>;
      if (!storeName || !item || !discount) {
        return bad('Missing storeName, item, or discount');
      }

      const { data: retailer } = await supabase
        .from('retailers')
        .select('id, location')
        .ilike('shop_name', `%${storeName}%`)
        .single();

      if (!retailer) return NextResponse.json({ error: `Store "${storeName}" not found` }, { status: 404 });

      const discountNum = Number(discount);
      const originalPrice = 100;
      const currentPrice  = Math.round(originalPrice * (1 - discountNum / 100));
      const expiry_time   = new Date(Date.now() + Number(expiresInHours) * 3600000).toISOString();

      const { data: deal, error } = await supabase
        .from('deals')
        .insert({
          retailer_id: retailer.id,
          product_name: item as string,
          category: 'General',
          original_price: originalPrice,
          current_price: currentPrice,
          discount_percent: discountNum,
          quantity_total: 50,
          quantity_remaining: 50,
          expiry_time,
          location: retailer.location,
          status: 'active',
          is_flash_mob: true,
        })
        .select('id, product_name, discount_percent, expiry_time')
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });

      return NextResponse.json({
        success: true,
        deal,
        message: `Flash deal "${item}" at ${discountNum}% off is now LIVE at ${storeName}!`,
      });
    }

    /**
     * action: "ping"
     * Health check — use to verify the agent connection is working.
     */
    case 'ping': {
      return NextResponse.json({
        success: true,
        message: 'DealDrop agent endpoint is live.',
        timestamp: new Date().toISOString(),
        available_actions: [
          'ping',
          // Discovery
          'browse_deals', 'get_deal', 'get_categories',
          // Customer
          'claim_deal', 'get_my_claims', 'get_profile',
          'save_deal', 'get_wallet', 'redeem_points',
          'get_notifications', 'mark_notifications_read',
          'join_squad',
          // Navigation
          'navigate',
          // Retailer
          'create_deal', 'drop_deal', 'get_sales_stats', 'redeem_claim',
        ],
      });
    }

    default:
      return NextResponse.json(
        { error: `Unknown action: "${action}"` },
        { status: 400 }
      );
  }
}

// ── GET: Capability manifest (agent discovery) ─────────────────────────────
export async function GET() {
  return NextResponse.json({
    name: 'DealDrop Voice Agent API',
    version: '1.0.0',
    endpoint: '/api/agent',
    auth: 'Bearer <LEVRAGE_AGENT_KEY>',
    actions: {
      ping:            { description: 'Health check', payload: {} },
      browse_deals:    { description: 'Find deals near location', payload: { lat: 'number?', lng: 'number?', radius_km: 'number?', category: 'string?' } },
      get_deal:        { description: 'Get full deal details', payload: { deal_id: 'string' } },
      claim_deal:      { description: 'Claim a deal for the user', payload: { deal_id: 'string', squad_id: 'string?' } },
      get_my_claims:   { description: "Get user's claims", payload: { status: 'pending|redeemed|expired?' } },
      get_profile:     { description: "Get user's profile & stats", payload: {} },
      join_squad:      { description: 'Join a flash-mob squad', payload: { squad_id: 'string', deal_id: 'string' } },
      navigate:        { description: 'Navigate the UI to a page', payload: { page: 'discover|map|wallet|passport|saved|notifications|deals|community|dashboard|create-deal' } },
      create_deal:     { description: 'Create a new deal (retailer)', payload: { product_name: 'string', category: 'string', original_price: 'number', current_price: 'number', discount_percent: 'number', quantity_total: 'number', expiry_hours: 'number?' } },
      get_sales_stats: { description: 'Get sales analytics (retailer)', payload: {} },
      redeem_claim:    { description: 'Mark claim as redeemed (retailer)', payload: { claim_id: 'string' } },
      get_categories:  { description: 'List available deal categories', payload: {} },
    },
  });
}
