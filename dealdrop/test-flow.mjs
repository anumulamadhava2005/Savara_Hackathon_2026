import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or ANON_KEY.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const BASE_URL = process.argv[2] || 'http://localhost:3000';

async function fetchAPI(endpoint, method, session, body) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

async function runTests() {
  console.log(`\n--- DealDrop Extended Flowchart Validation ---`);

  const pword = 'hackathonDemo2026!';
  const { data: retData } = await supabase.auth.signUp({ email: `rt_${Date.now()}@gmail.com`, password: pword });
  const { data: cusData } = await supabase.auth.signUp({ email: `cst_${Date.now()}@gmail.com`, password: pword });
  
  if (!retData?.session || !cusData?.session) {
    console.error('Auth blocked, check email confirm settings.');
    process.exit(1);
  }

  const rSession = retData.session;
  const cSession = cusData.session;

  console.log(`1. Retailer Setup...`);
  await fetchAPI('/api/retailer/setup', 'POST', rSession, { shop_name: 'Test Retail', address: '123 Ave', category: 'grocery', lat: 10, lng: 10 });

  console.log(`2. Deal Creation...`);
  const dealCreate = await fetchAPI('/api/deals', 'POST', rSession, { product_name: 'Chips', category: 'grocery', original_price: 100, current_price: 50, discount_percent: 50, quantity_total: 10, expiry_hours: 24, lat: 10, lng: 10 });
  const dealId = dealCreate?.deal?.id;

  console.log(`3. Valid Claim...`);
  const c1 = await fetchAPI(`/api/deals/${dealId}/claim`, 'POST', cSession);
  console.log(c1.success ? '   Success' : `   Failed: ${c1.error}`);

  console.log(`4. Testing Double Claim Core Logic Barrier...`);
  const c2 = await fetchAPI(`/api/deals/${dealId}/claim`, 'POST', cSession);
  console.log('   Result:', c2.error ? `Blocked appropriately (${c2.error})` : 'FAILED: Accepted Duplicate');

  console.log(`5. Testing QR Redemption Patch...`);
  // Retailer explicitly queries the client library to intercept their own claim ID for redemption
  const retClient = createClient(SUPABASE_URL, SUPABASE_KEY, { global: { headers: { Authorization: `Bearer ${rSession.access_token}` } }});
  const { data: rClaims } = await retClient.from('claims').select('id').eq('deal_id', dealId);
  const claimId = rClaims?.[0]?.id;
  
  if(claimId) {
    const patchRes = await fetchAPI(`/api/claims/${claimId}`, 'PATCH', rSession, { status: 'redeemed' });
    console.log(patchRes?.claim?.status === 'redeemed' ? '   Redeemed successfully' : `   Failed Patch`);
  } else {
    console.log('   Skipped: Retailer could not read claim IDs (Row Level Security conflict)');
  }

  console.log(`6. Testing Squad Formations...`);
  const sq = await fetchAPI('/api/squad', 'POST', cSession, { deal_id: dealId, target_count: 5 });
  const sqId = sq?.squad?.id;
  console.log(sqId ? `   Squad created` : `   Failed squad create`);

  const { data: cus2Data } = await supabase.auth.signUp({ email: `cs2_${Date.now()}@gmail.com`, password: pword });
  const c2Session = cus2Data?.session;

  console.log(`7. Squad Joining...`);
  const j1 = await fetchAPI(`/api/squad/${sqId}/join`, 'POST', c2Session);
  console.log(j1.success ? `   Joined` : `   Failed`);

  console.log(`8. Squad Double Join Block...`);
  const j2 = await fetchAPI(`/api/squad/${sqId}/join`, 'POST', c2Session);
  console.log(j2.error ? `   Blocked appropriately (${j2.error})` : `   FAILED: Accepted Duplicate`);

  console.log('\n--- Full Validation Complete ---');
}
runTests();
