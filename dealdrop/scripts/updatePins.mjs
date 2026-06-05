import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://edzxxezapktqztlxytsf.supabase.co';
const supabaseKey = 'sb_publishable_M-9FcovOhrsKa1R6cfLM1Q_8HcazNSW';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const updates = [
    { name: 'Ultimate store', pin: '5555' },
    { name: 'Bella flower shop', pin: '6666' },
    { name: 'Alice beauty parlour', pin: '7777' },
    { name: 'charlie chocolate store', pin: '8888' },
    { name: 'madhava housing ', pin: '9999' }
  ];

  for (const store of updates) {
    const { data: retailer } = await supabase
      .from('retailers')
      .select('id, description')
      .eq('shop_name', store.name)
      .single();

    if (retailer) {
      // Clean up old PINs if any
      const oldDesc = (retailer.description || '').replace(/\|PIN:\w+/, '');
      const newDesc = `${oldDesc}|PIN:${store.pin}`;
      
      const { error } = await supabase
        .from('retailers')
        .update({ description: newDesc })
        .eq('id', retailer.id);
        
      if (!error) {
        console.log(`Updated ${store.name} -> PIN: ${store.pin}`);
      } else {
        console.error(`Failed to update ${store.name}:`, error);
      }
    }
  }
}

run();
