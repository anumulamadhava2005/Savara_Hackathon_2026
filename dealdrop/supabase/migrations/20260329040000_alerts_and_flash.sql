-- Create Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL, -- 'location', 'squad', 'alert', 'system'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  unread BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own notifications" ON public.notifications
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
FOR UPDATE USING (auth.uid() = user_id);

-- Ensure RLS for squads and squad_members is active
ALTER TABLE public.squads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.squad_members ENABLE ROW LEVEL SECURITY;

-- Read policies for deals, squads
CREATE POLICY "Anyone can view squads" ON public.squads FOR SELECT USING (true);
CREATE POLICY "Anyone can view squad members" ON public.squad_members FOR SELECT USING (true);

-- Join squad policy
CREATE POLICY "Users can join squads" ON public.squad_members
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Trigger to auto-create a squad for flash deals
CREATE OR REPLACE FUNCTION public.auto_create_squad_for_flash()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_flash_mob = TRUE THEN
        INSERT INTO public.squads (deal_id, target_count, current_count, status, expires_at)
        VALUES (NEW.id, NEW.flash_mob_target, 0, 'forming', NEW.expiry_time);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_auto_create_squad
AFTER INSERT ON public.deals
FOR EACH ROW
EXECUTE FUNCTION public.auto_create_squad_for_flash();

-- Seed Data for Flash Deals
DO $$
DECLARE
    retailer_id UUID;
    deal_id_1 UUID;
    deal_id_2 UUID;
BEGIN
    SELECT id INTO retailer_id FROM public.retailers LIMIT 1;
    
    IF retailer_id IS NOT NULL THEN
        -- Insert Flash Deal 1
        INSERT INTO public.deals (
            retailer_id, product_name, description, category, original_price, 
            current_price, discount_percent, quantity_total, quantity_remaining, 
            expiry_time, location, image_url, status, is_flash_mob, flash_mob_target, flash_mob_discount
        ) VALUES (
            retailer_id, 'Yeezy Boost 350 – Squad Drop', 'Exclusive squad-powered flash deal.', 'fashion', 220.00, 
            154.00, 30, 15, 15, NOW() + INTERVAL '4 hours', ST_SetSRID(ST_MakePoint(80.2707, 13.0827), 4326), 
            'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=800&auto=format&fit=crop', 'active', TRUE, 15, 30
        ) ON CONFLICT DO NOTHING RETURNING id INTO deal_id_1;

        -- Insert Flash Deal 2
        INSERT INTO public.deals (
            retailer_id, product_name, description, category, original_price, 
            current_price, discount_percent, quantity_total, quantity_remaining, 
            expiry_time, location, image_url, status, is_flash_mob, flash_mob_target, flash_mob_discount
        ) VALUES (
            retailer_id, 'AirPods Pro 2 - Hyper Pulse', 'Last 10 units. Join the squad to lock 60% off!', 'electronics', 249.00, 
            99.00, 60, 10, 10, NOW() + INTERVAL '2 hours', ST_SetSRID(ST_MakePoint(80.2708, 13.0828), 4326), 
            'https://images.unsplash.com/photo-1588423770514-69971842eb3a?q=80&w=800&auto=format&fit=crop', 'active', TRUE, 10, 60
        ) ON CONFLICT DO NOTHING RETURNING id INTO deal_id_2;

        -- Manually insert squads if they weren't created by trigger for some reason (or for existing)
        IF deal_id_1 IS NOT NULL THEN
            INSERT INTO public.squads (deal_id, target_count, current_count, status, expires_at)
            VALUES (deal_id_1, 15, 4, 'forming', NOW() + INTERVAL '4 hours')
            ON CONFLICT DO NOTHING;
        END IF;

        IF deal_id_2 IS NOT NULL THEN
            INSERT INTO public.squads (deal_id, target_count, current_count, status, expires_at)
            VALUES (deal_id_2, 10, 8, 'forming', NOW() + INTERVAL '2 hours')
            ON CONFLICT DO NOTHING;
        END IF;
    END IF;
END $$;

-- Trigger logic for squad status (basic version)
CREATE OR REPLACE FUNCTION public.check_squad_completion()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.squads
    SET current_count = (SELECT count(*) FROM public.squad_members WHERE squad_id = NEW.squad_id)
    WHERE id = NEW.squad_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_squad_completion
AFTER INSERT ON public.squad_members
FOR EACH ROW
EXECUTE FUNCTION public.check_squad_completion();
