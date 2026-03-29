-- saved_deals table: stores which deals a customer has bookmarked
CREATE TABLE IF NOT EXISTS saved_deals (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  deal_id     uuid NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  created_at  timestamptz DEFAULT now(),
  UNIQUE (user_id, deal_id)   -- prevent duplicates
);

-- Index for fast per-user lookups
CREATE INDEX IF NOT EXISTS idx_saved_deals_user ON saved_deals(user_id);

-- RLS: users can only see/manage their own saved deals
ALTER TABLE saved_deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own saved" ON saved_deals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own saved" ON saved_deals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own saved" ON saved_deals
  FOR DELETE USING (auth.uid() = user_id);
