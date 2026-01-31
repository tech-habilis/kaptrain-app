-- Create user_sports junction table
CREATE TABLE IF NOT EXISTS user_sports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  sport_id UUID NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  started_at DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, sport_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_sports_user ON user_sports(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sports_sport ON user_sports(sport_id);
