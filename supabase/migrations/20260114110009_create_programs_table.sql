-- Create programs table
CREATE TABLE IF NOT EXISTS programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  price NUMERIC(10,2) DEFAULT 0.00,
  duration_weeks INTEGER,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'confirmed', 'expert')),
  program_type program_type NOT NULL,
  sport_id UUID REFERENCES sports(id),
  created_by UUID NOT NULL REFERENCES user_profiles(id),
  is_published BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  enrollment_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_programs_sport ON programs(sport_id);
CREATE INDEX IF NOT EXISTS idx_programs_created_by ON programs(created_by);
CREATE INDEX IF NOT EXISTS idx_programs_type ON programs(program_type);
CREATE INDEX IF NOT EXISTS idx_programs_published ON programs(is_published) WHERE is_published = true;

-- Create trigger
CREATE TRIGGER update_programs_updated_at
BEFORE UPDATE ON programs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
