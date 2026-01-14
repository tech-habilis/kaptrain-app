-- Create coach_connections table
CREATE TABLE IF NOT EXISTS coach_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  status connection_status DEFAULT 'pending',
  connected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(coach_id, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_coach_connections_coach ON coach_connections(coach_id);
CREATE INDEX IF NOT EXISTS idx_coach_connections_user ON coach_connections(user_id);
