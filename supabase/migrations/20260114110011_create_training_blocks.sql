-- Create training_blocks table
CREATE TABLE IF NOT EXISTS training_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  color TEXT,
  created_by UUID NOT NULL REFERENCES user_profiles(id),
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_training_blocks_created_by ON training_blocks(created_by);

-- Create trigger
CREATE TRIGGER update_training_blocks_updated_at
BEFORE UPDATE ON training_blocks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
