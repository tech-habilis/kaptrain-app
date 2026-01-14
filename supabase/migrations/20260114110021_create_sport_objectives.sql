-- Create sport_objectives table
CREATE TABLE IF NOT EXISTS sport_objectives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  sport_id UUID NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  objective_category objective_category NOT NULL,
  target_date DATE,
  status objective_status DEFAULT 'active',
  progress_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_objectives_user ON sport_objectives(user_id);
CREATE INDEX IF NOT EXISTS idx_objectives_sport ON sport_objectives(sport_id);
CREATE INDEX IF NOT EXISTS idx_objectives_status ON sport_objectives(status);
