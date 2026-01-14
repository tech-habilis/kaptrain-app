-- Create sports table
CREATE TABLE IF NOT EXISTS sports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  name_fr TEXT NOT NULL,
  icon_name TEXT,
  color TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  is_custom BOOLEAN DEFAULT false,
  created_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_sports_name ON sports(name);
CREATE INDEX IF NOT EXISTS idx_sports_active ON sports(is_active);
CREATE INDEX IF NOT EXISTS idx_sports_created_by ON sports(created_by);

-- Create trigger to update updated_at
CREATE TRIGGER update_sports_updated_at
BEFORE UPDATE ON sports
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
