-- Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. user_profiles
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  location GEOGRAPHY(POINT),
  preferred_radius_km NUMERIC DEFAULT 5,
  preferred_categories TEXT[] DEFAULT '{}',
  deal_passport_stamps INT DEFAULT 0,
  passport_level TEXT DEFAULT 'Bronze',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. retailers
CREATE TABLE public.retailers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  shop_name TEXT NOT NULL,
  description TEXT,
  location GEOGRAPHY(POINT) NOT NULL,
  address TEXT NOT NULL,
  category TEXT NOT NULL,
  rating NUMERIC DEFAULT 0,
  total_ratings INT DEFAULT 0,
  fulfillment_rate NUMERIC DEFAULT 100,
  response_time_mins INT DEFAULT 15,
  is_verified BOOLEAN DEFAULT FALSE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. deals
CREATE TABLE public.deals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  retailer_id UUID REFERENCES public.retailers ON DELETE CASCADE NOT NULL,
  product_name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  original_price NUMERIC NOT NULL,
  current_price NUMERIC NOT NULL,
  discount_percent NUMERIC NOT NULL,
  quantity_total INT NOT NULL,
  quantity_remaining INT NOT NULL,
  expiry_time TIMESTAMPTZ NOT NULL,
  location GEOGRAPHY(POINT) NOT NULL,
  image_url TEXT,
  status TEXT DEFAULT 'active',
  is_flash_mob BOOLEAN DEFAULT FALSE,
  flash_mob_target INT,
  flash_mob_discount NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. claims
CREATE TABLE public.claims (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deal_id UUID REFERENCES public.deals ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  claimed_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending',
  squad_id UUID
);

-- 5. squads
CREATE TABLE public.squads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deal_id UUID REFERENCES public.deals ON DELETE CASCADE NOT NULL,
  target_count INT NOT NULL,
  current_count INT DEFAULT 1,
  status TEXT DEFAULT 'forming',
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. squad_members
CREATE TABLE public.squad_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  squad_id UUID REFERENCES public.squads ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key reference for claims.squad_id
ALTER TABLE public.claims ADD CONSTRAINT claims_squad_id_fkey FOREIGN KEY (squad_id) REFERENCES public.squads(id) ON DELETE SET NULL;

-- Create PostGIS RPC function for getting nearby deals
CREATE OR REPLACE FUNCTION public.get_nearby_deals(
  user_lat double precision,
  user_lng double precision,
  radius_km double precision DEFAULT 2
)
RETURNS SETOF public.deals AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.deals
  WHERE status = 'active' 
    AND expiry_time > NOW()
    AND quantity_remaining > 0
    AND location IS NOT NULL
    AND ST_DWithin(
      location,
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
      radius_km * 1000 -- Convert km to meters
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create increment stamps function
CREATE OR REPLACE FUNCTION public.increment_passport_stamps(uid UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.user_profiles
  SET deal_passport_stamps = deal_passport_stamps + 1
  WHERE id = uid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retailers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.squads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.squad_members ENABLE ROW LEVEL SECURITY;

-- Optional: Basic read policies so the API can fetch deals
CREATE POLICY "Anyone can view active deals" ON public.deals FOR SELECT USING (true);
CREATE POLICY "Anyone can view retailers" ON public.retailers FOR SELECT USING (true);
CREATE POLICY "Anyone can view user profile" ON public.user_profiles FOR SELECT USING (true);
