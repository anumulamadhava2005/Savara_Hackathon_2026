-- ============================================================
-- DealDrop Demo Seed Data — Bangalore
-- Paste & Run in Supabase Dashboard → SQL Editor
-- Creates 4 retailers + 8 deals (active, ~4-8hrs expiry)
-- ============================================================

-- 1. Demo Retailers (no auth.users dependency — nullable user_id)
ALTER TABLE public.retailers ALTER COLUMN user_id DROP NOT NULL;

INSERT INTO public.retailers (id, shop_name, description, address, category, rating, avatar_url, is_verified, location)
VALUES
  (
    'a1b2c3d4-0001-0001-0001-000000000001',
    'Spice Garden Bistro',
    'Authentic South Indian cuisine with modern twists',
    '12 MG Road, Bangalore',
    'food', 4.7,
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200',
    true,
    ST_GeogFromText('SRID=4326;POINT(77.6011 12.9757)')
  ),
  (
    'a1b2c3d4-0002-0002-0002-000000000002',
    'Pulse Wellness Hub',
    'Premium yoga & wellness studio in the heart of Koramangala',
    '5th Block, Koramangala, Bangalore',
    'wellness', 4.9,
    'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=200',
    true,
    ST_GeogFromText('SRID=4326;POINT(77.6245 12.9352)')
  ),
  (
    'a1b2c3d4-0003-0003-0003-000000000003',
    'ThreadCraft Fashion',
    'Curated ethnic and fusion wear, Indiranagar',
    '100 Feet Road, Indiranagar, Bangalore',
    'fashion', 4.5,
    'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=200',
    true,
    ST_GeogFromText('SRID=4326;POINT(77.6408 12.9784)')
  ),
  (
    'a1b2c3d4-0004-0004-0004-000000000004',
    'FreshMart Grocery',
    'Organic & fresh produce, farm-to-fork',
    'HSR Layout Sector 1, Bangalore',
    'grocery', 4.3,
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200',
    true,
    ST_GeogFromText('SRID=4326;POINT(77.6370 12.9116)')
  )
ON CONFLICT (id) DO UPDATE SET
  shop_name = EXCLUDED.shop_name,
  rating = EXCLUDED.rating,
  avatar_url = EXCLUDED.avatar_url,
  location = EXCLUDED.location;

-- 2. Demo Deals (expire in 3-8 hours from NOW)
INSERT INTO public.deals
  (retailer_id, product_name, description, category,
   original_price, current_price, discount_percent,
   quantity_total, quantity_remaining, expiry_time,
   image_url, status, is_flash_mob, location)
VALUES
  -- Spice Garden Bistro – Food
  (
    'a1b2c3d4-0001-0001-0001-000000000001',
    'Masala Dosa Combo',
    'Crispy masala dosa with sambar, 3 chutneys & filter coffee. Classic Bangalore breakfast.',
    'food', 220, 121, 45, 30, 30,
    NOW() + INTERVAL '5 hours',
    'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600',
    'active', false,
    ST_GeogFromText('SRID=4326;POINT(77.6011 12.9757)')
  ),
  (
    'a1b2c3d4-0001-0001-0001-000000000001',
    'Thali Lunch Special',
    'Full South Indian thali — 6 curries, rice, roti, dessert & buttermilk. Limited seats per session.',
    'food', 380, 247, 35, 20, 20,
    NOW() + INTERVAL '4 hours',
    'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=600',
    'active', false,
    ST_GeogFromText('SRID=4326;POINT(77.6011 12.9757)')
  ),

  -- Pulse Wellness – Wellness
  (
    'a1b2c3d4-0002-0002-0002-000000000002',
    'Power Yoga Session',
    '60-min power yoga class with certified instructor. Mats & props provided. All levels welcome.',
    'wellness', 800, 400, 50, 12, 12,
    NOW() + INTERVAL '6 hours',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600',
    'active', false,
    ST_GeogFromText('SRID=4326;POINT(77.6245 12.9352)')
  ),
  (
    'a1b2c3d4-0002-0002-0002-000000000002',
    'Detox Smoothie Bowl',
    'Cold-pressed detox smoothie bowl with superfoods, granola & seasonal fruits. Vegan & gluten-free.',
    'wellness', 350, 245, 30, 25, 25,
    NOW() + INTERVAL '3 hours',
    'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=600',
    'active', false,
    ST_GeogFromText('SRID=4326;POINT(77.6245 12.9352)')
  ),

  -- ThreadCraft – Fashion
  (
    'a1b2c3d4-0003-0003-0003-000000000003',
    'Kurta Flash Drop',
    'Hand-block printed cotton kurta. Limited sizes. Festival-ready ethnic wear at an unbeatable price.',
    'fashion', 1299, 520, 60, 8, 8,
    NOW() + INTERVAL '4 hours',
    'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600',
    'active', true,
    ST_GeogFromText('SRID=4326;POINT(77.6408 12.9784)')
  ),
  (
    'a1b2c3d4-0003-0003-0003-000000000003',
    'Fusion Co-ord Set',
    'Trendy fusion co-ord set — crop top + palazzo. Lightweight summer fabric. S/M/L available.',
    'fashion', 1899, 1139, 40, 5, 5,
    NOW() + INTERVAL '7 hours',
    'https://images.unsplash.com/photo-1520367631006-c5e383c5d2f2?w=600',
    'active', false,
    ST_GeogFromText('SRID=4326;POINT(77.6408 12.9784)')
  ),

  -- FreshMart – Grocery
  (
    'a1b2c3d4-0004-0004-0004-000000000004',
    'Organic Veggie Box',
    'Curated seasonal organic vegetables — 2kg assorted box. Farm-to-fork, zero pesticides, same-day delivery.',
    'grocery', 250, 188, 25, 40, 40,
    NOW() + INTERVAL '8 hours',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600',
    'active', false,
    ST_GeogFromText('SRID=4326;POINT(77.6370 12.9116)')
  ),
  (
    'a1b2c3d4-0004-0004-0004-000000000004',
    'Cold-Press Juice Pack',
    'Pack of 4 cold-pressed juices — beetroot, ginger-lemon, watermelon, green detox. No sugar added.',
    'grocery', 480, 312, 35, 20, 20,
    NOW() + INTERVAL '5 hours',
    'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600',
    'active', false,
    ST_GeogFromText('SRID=4326;POINT(77.6370 12.9116)')
  );

-- Verify
SELECT d.product_name, d.discount_percent || '%' AS disc, d.quantity_remaining AS qty,
       r.shop_name, d.expiry_time
FROM public.deals d
JOIN public.retailers r ON r.id = d.retailer_id
WHERE d.status = 'active'
ORDER BY d.created_at DESC;
