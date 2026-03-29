-- Apply unique constraints to enforce limited user reservations mapping in Core Logic
ALTER TABLE public.claims ADD CONSTRAINT claims_deal_user_unq UNIQUE (deal_id, user_id);
ALTER TABLE public.squad_members ADD CONSTRAINT squad_members_squad_user_unq UNIQUE (squad_id, user_id);

-- Adding Retailer SELECT policy over claims so they can accurately process redemptions
CREATE POLICY "Retailers can read claims for their deals" ON public.claims
FOR SELECT USING (
  auth.uid() IN (
    SELECT r.user_id FROM public.retailers r 
    JOIN public.deals d ON d.retailer_id = r.id 
    WHERE d.id = deal_id
  )
);
