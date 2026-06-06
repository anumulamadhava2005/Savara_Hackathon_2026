import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://edzxxezapktqztlxytsf.supabase.co';
const supabaseKey = 'sb_publishable_M-9FcovOhrsKa1R6cfLM1Q_8HcazNSW';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const storeName = "Ultimate store";
  const { data: retailer, error } = await supabase
    .from('retailers')
    .select('id, shop_name, description, address, category, rating')
    .ilike('shop_name', `%${storeName}%`)
    .single();

  console.log("Error:", error);
  console.log("Retailer:", retailer);
}

run();
