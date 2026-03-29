-- Retailer product catalog
CREATE TABLE IF NOT EXISTS public.retailer_items (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  retailer_id uuid REFERENCES public.retailers(id) ON DELETE CASCADE NOT NULL,
  name        text NOT NULL,
  description text,
  category    text NOT NULL DEFAULT 'general',
  base_price  numeric NOT NULL,
  image_url   text,
  is_active   boolean DEFAULT true,
  created_at  timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_retailer_items_retailer ON retailer_items(retailer_id);

ALTER TABLE public.retailer_items ENABLE ROW LEVEL SECURITY;

-- Retailers manage their own items
CREATE POLICY "Retailer manages own items"
  ON public.retailer_items FOR ALL
  USING (
    retailer_id IN (
      SELECT id FROM public.retailers WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    retailer_id IN (
      SELECT id FROM public.retailers WHERE user_id = auth.uid()
    )
  );

-- Anyone can view items (for discovery)
CREATE POLICY "Anyone reads items"
  ON public.retailer_items FOR SELECT USING (true);
