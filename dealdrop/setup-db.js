const { Client } = require('pg');

async function main() {
  const connectionString = 'postgresql://postgres:sushanth_lanja@db.edzxxezapktqztlxytsf.supabase.co:5432/postgres';
  
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Connecting to database...');
    await client.connect();

    console.log('Running SQL commands...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.community_posts (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        user_name text NOT NULL,
        avatar text,
        time_display text NOT NULL DEFAULT 'Just now',
        location text,
        content text NOT NULL,
        image text,
        likes integer DEFAULT 0,
        comments integer DEFAULT 0,
        created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
      );

      ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

      -- Drop policies if they exist so we can run this cleanly multiple times
      DROP POLICY IF EXISTS "Enable read access for all users" ON public.community_posts;
      DROP POLICY IF EXISTS "Enable insert for all users" ON public.community_posts;
      DROP POLICY IF EXISTS "Enable update for likes" ON public.community_posts;

      CREATE POLICY "Enable read access for all users" 
      ON public.community_posts FOR SELECT USING (true);

      CREATE POLICY "Enable insert for all users" 
      ON public.community_posts FOR INSERT WITH CHECK (true);

      CREATE POLICY "Enable update for likes" 
      ON public.community_posts FOR UPDATE USING (true);
    `);
    
    console.log('Successfully configured database table!');
  } catch (err) {
    console.error('Error executing query', err.stack);
  } finally {
    await client.end();
  }
}

main();
