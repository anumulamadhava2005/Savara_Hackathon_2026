-- User Profiles
CREATE POLICY "Users can insert their own profile" ON public.user_profiles
FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
FOR UPDATE USING (auth.uid() = id);

-- Retailers
CREATE POLICY "Users can insert their own retailer profile" ON public.retailers
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own retailer profile" ON public.retailers
FOR UPDATE USING (auth.uid() = user_id);

-- Deals
CREATE POLICY "Retailers can insert deals" ON public.deals
FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM public.retailers WHERE id = retailer_id));

CREATE POLICY "Retailers can update their deals" ON public.deals
FOR UPDATE USING (auth.uid() IN (SELECT user_id FROM public.retailers WHERE id = retailer_id));

-- Claims
CREATE POLICY "Authenticated users can claim deals" ON public.claims
FOR INSERT WITH CHECK (auth.uid() != NULL);

CREATE POLICY "Authenticated users can read their own claims" ON public.claims
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Retailers can update claims for their deals" ON public.claims
FOR UPDATE USING (
  auth.uid() IN (
    SELECT r.user_id FROM public.retailers r 
    JOIN public.deals d ON d.retailer_id = r.id 
    WHERE d.id = deal_id
  )
);

-- Squads
CREATE POLICY "Authenticated users can create squads" ON public.squads
FOR INSERT WITH CHECK (auth.uid() != NULL);

CREATE POLICY "Anyone can view active squads" ON public.squads
FOR SELECT USING (true);
