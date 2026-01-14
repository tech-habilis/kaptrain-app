-- Create injuries table
CREATE TABLE IF NOT EXISTS injuries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  body_part TEXT,
  injury_date DATE NOT NULL,
  recovery_date DATE,
  status injury_status DEFAULT 'in_progress',
  severity injury_severity,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_injuries_user ON injuries(user_id);
CREATE INDEX IF NOT EXISTS idx_injuries_status ON injuries(status);
CREATE INDEX IF NOT EXISTS idx_injuries_dates ON injuries(injury_date, recovery_date);

-- Create trigger
CREATE TRIGGER update_injuries_updated_at
BEFORE UPDATE ON injuries
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
