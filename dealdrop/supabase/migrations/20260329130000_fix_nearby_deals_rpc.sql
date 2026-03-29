-- Fix get_nearby_deals to return retailer info + distance, and remove the
-- strict location filter so deals without geolocation still show up.

CREATE OR REPLACE FUNCTION public.get_nearby_deals(
  user_lat double precision,
  user_lng double precision,
  radius_km double precision DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  product_name TEXT,
  description TEXT,
  category TEXT,
  original_price NUMERIC,
  current_price NUMERIC,
  discount_percent NUMERIC,
  quantity_remaining INT,
  expiry_time TIMESTAMPTZ,
  image_url TEXT,
  is_flash_mob BOOLEAN,
  status TEXT,
  created_at TIMESTAMPTZ,
  distance_km FLOAT,
  retailers JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id,
    d.product_name,
    d.description,
    d.category,
    d.original_price,
    d.current_price,
    d.discount_percent,
    d.quantity_remaining,
    d.expiry_time,
    d.image_url,
    d.is_flash_mob,
    d.status,
    d.created_at,
    CASE
      WHEN d.location IS NOT NULL THEN
        ROUND(
          (ST_Distance(
            d.location,
            ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
          ) / 1000.0)::numeric, 2
        )::float
      ELSE 0.0
    END AS distance_km,
    jsonb_build_object(
      'shop_name', r.shop_name,
      'address',   r.address,
      'avatar_url', r.avatar_url,
      'rating',    r.rating
    ) AS retailers
  FROM public.deals d
  JOIN public.retailers r ON r.id = d.retailer_id
  WHERE
    d.status = 'active'
    AND d.expiry_time > NOW()
    AND d.quantity_remaining > 0
    AND (
      -- Include deals within radius if they have a location, OR all deals if no location set
      d.location IS NULL
      OR ST_DWithin(
        d.location,
        ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
        radius_km * 1000
      )
    )
  ORDER BY
    CASE WHEN d.location IS NOT NULL THEN
      ST_Distance(d.location, ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography)
    ELSE 99999999 END ASC,
    d.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
