-- Add reward points and total savings to user_profiles
ALTER TABLE IF EXISTS public.user_profiles 
ADD COLUMN IF NOT EXISTS reward_points INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_savings NUMERIC DEFAULT 0;

-- Create user_activity table
CREATE TABLE IF NOT EXISTS public.user_activity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL, -- 'claim', 'squad', 'redeem', 'level_up'
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  deal_id UUID REFERENCES public.deals ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for user_activity
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_activity
CREATE POLICY "Users can insert their own activity" ON public.user_activity
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own activity" ON public.user_activity
FOR SELECT USING (auth.uid() = user_id);

-- Migration index for performance
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON public.user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON public.user_activity(created_at DESC);
