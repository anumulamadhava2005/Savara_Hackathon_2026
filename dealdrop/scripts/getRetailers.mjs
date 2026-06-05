import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://edzxxezapktqztlxytsf.supabase.co';
const supabaseKey = 'sb_publishable_M-9FcovOhrsKa1R6cfLM1Q_8HcazNSW';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('retailers').select('id, shop_name, description, address');
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log('--- DUMMY STORES & LOCATIONS ---');
  for (const store of data) {
    let pin;
    if (store.description && store.description.includes('|PIN:')) {
      pin = store.description.match(/\|PIN:(\d{4})/)[1];
    } else {
      pin = store.id.replace(/-/g, '').slice(-4);
    }
    console.log(`Store Name: ${store.shop_name}`);
    console.log(`Voice PIN:  ${pin}`);
    console.log(`Location:   ${store.address}`);
    console.log(`---------------------------`);
  }
}

run();
