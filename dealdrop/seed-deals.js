const { Client } = require('pg');

const connectionString = 'postgresql://postgres:sushanth_lanja@db.edzxxezapktqztlxytsf.supabase.co:5432/postgres';

async function main() {
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log('Connected!');

  // 1. Upsert demo retailers in Bangalore
  const retailers = [
    {
      id: 'a1b2c3d4-0001-0001-0001-000000000001',
      user_id: null,
      shop_name: 'Spice Garden Bistro',
      description: 'Authentic South Indian cuisine with modern twists',
      address: '12 MG Road, Bangalore',
      category: 'food',
      rating: 4.7,
      avatar_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200',
      is_verified: true,
      lat: 12.9757, lng: 77.6011,
    },
    {
      id: 'a1b2c3d4-0002-0002-0002-000000000002',
      user_id: null,
      shop_name: 'Pulse Wellness Hub',
      description: 'Premium yoga & wellness studio in the heart of Koramangala',
      address: '5th Block, Koramangala, Bangalore',
      category: 'wellness',
      rating: 4.9,
      avatar_url: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=200',
      is_verified: true,
      lat: 12.9352, lng: 77.6245,
    },
    {
      id: 'a1b2c3d4-0003-0003-0003-000000000003',
      user_id: null,
      shop_name: 'ThreadCraft Fashion',
      description: 'Curated ethnic and fusion wear, Indiranagar',
      address: '100 Feet Road, Indiranagar, Bangalore',
      category: 'fashion',
      rating: 4.5,
      avatar_url: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=200',
      is_verified: true,
      lat: 12.9784, lng: 77.6408,
    },
    {
      id: 'a1b2c3d4-0004-0004-0004-000000000004',
      user_id: null,
      shop_name: 'FreshMart Grocery',
      description: 'Organic & fresh produce delivered to your door',
      address: 'HSR Layout Sector 1, Bangalore',
      category: 'grocery',
      rating: 4.3,
      avatar_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200',
      is_verified: true,
      lat: 12.9116, lng: 77.6370,
    },
  ];

  for (const r of retailers) {
    const point = `SRID=4326;POINT(${r.lng} ${r.lat})`;
    await client.query(`
      INSERT INTO public.retailers (id, shop_name, description, address, category, rating, avatar_url, is_verified, location)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,ST_GeogFromText($9))
      ON CONFLICT (id) DO UPDATE SET
        shop_name=EXCLUDED.shop_name, rating=EXCLUDED.rating,
        avatar_url=EXCLUDED.avatar_url, is_verified=EXCLUDED.is_verified,
        location=EXCLUDED.location;
    `, [r.id, r.shop_name, r.description, r.address, r.category, r.rating, r.avatar_url, r.is_verified, point]);
    console.log(`✓ Retailer: ${r.shop_name}`);
  }

  // 2. Seed deals (expire in 4-8 hours)
  const now = new Date();
  const h = (hrs) => new Date(now.getTime() + hrs * 3600000).toISOString();

  const deals = [
    // Spice Garden Bistro
    { rid: retailers[0].id, lat: retailers[0].lat, lng: retailers[0].lng,
      name: 'Masala Dosa Combo', desc: 'Crispy masala dosa with sambar, 3 chutneys & filter coffee. Bangalore breakfast staple.', cat: 'food',
      orig: 220, disc: 45, qty: 30, hours: 5,
      img: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600' },
    { rid: retailers[0].id, lat: retailers[0].lat, lng: retailers[0].lng,
      name: 'Thali Lunch Special', desc: 'Full South Indian thali — 6 curries, rice, roti, dessert & buttermilk.', cat: 'food',
      orig: 380, disc: 35, qty: 20, hours: 4,
      img: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=600' },

    // Pulse Wellness
    { rid: retailers[1].id, lat: retailers[1].lat, lng: retailers[1].lng,
      name: 'Power Yoga Session', desc: '60-min power yoga class with certified instructor. Mats provided. Ideal for all fitness levels.', cat: 'wellness',
      orig: 800, disc: 50, qty: 12, hours: 6,
      img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600' },
    { rid: retailers[1].id, lat: retailers[1].lat, lng: retailers[1].lng,
      name: 'Detox Smoothie Bowl', desc: 'Cold-pressed detox smoothie bowl with superfoods, granola & seasonal fruits.', cat: 'wellness',
      orig: 350, disc: 30, qty: 25, hours: 3,
      img: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=600' },

    // ThreadCraft Fashion
    { rid: retailers[2].id, lat: retailers[2].lat, lng: retailers[2].lng,
      name: 'Kurta Flash Drop', desc: 'Hand-block printed cotton kurta. Limited sizes. Festival-ready ethnic wear.', cat: 'fashion',
      orig: 1299, disc: 60, qty: 8, hours: 4,
      img: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600' },
    { rid: retailers[2].id, lat: retailers[2].lat, lng: retailers[2].lng,
      name: 'Fusion Co-ord Set', desc: 'Trendy fusion co-ord set — crop top + palazzo. Lightweight summer fabric.', cat: 'fashion',
      orig: 1899, disc: 40, qty: 5, hours: 7,
      img: 'https://images.unsplash.com/photo-1520367631006-c5e383c5d2f2?w=600' },

    // FreshMart Grocery
    { rid: retailers[3].id, lat: retailers[3].lat, lng: retailers[3].lng,
      name: 'Organic Veggie Box', desc: 'Curated seasonal organic vegetables — 2kg assorted box. Farm-to-fork, zero pesticides.', cat: 'grocery',
      orig: 250, disc: 25, qty: 40, hours: 8,
      img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600' },
    { rid: retailers[3].id, lat: retailers[3].lat, lng: retailers[3].lng,
      name: 'Cold-Press Juice Pack', desc: 'Pack of 4 cold-pressed juices — beetroot, ginger-lemon, watermelon, green detox.', cat: 'grocery',
      orig: 480, disc: 35, qty: 20, hours: 5,
      img: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600' },
  ];

  for (const d of deals) {
    const current = parseFloat((d.orig - d.orig * d.disc / 100).toFixed(2));
    const expiry = h(d.hours);
    const point = `SRID=4326;POINT(${d.lng} ${d.lat})`;

    await client.query(`
      INSERT INTO public.deals
        (retailer_id, product_name, description, category,
         original_price, current_price, discount_percent,
         quantity_total, quantity_remaining, expiry_time,
         image_url, status, is_flash_mob, location)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$8,$9,$10,'active',false,ST_GeogFromText($11))
    `, [d.rid, d.name, d.desc, d.cat, d.orig, current, d.disc, d.qty, expiry, d.img, point]);
    console.log(`✓ Deal: ${d.name} (${d.disc}% off)`);
  }

  console.log('\n✅ Seed complete — 4 retailers, 8 deals added in Bangalore.');
  await client.end();
}

main().catch(e => { console.error('SEED ERROR:', e.message); process.exit(1); });
