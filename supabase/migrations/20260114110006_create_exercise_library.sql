-- Create exercise_library table
CREATE TABLE IF NOT EXISTS exercise_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  instructions TEXT,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'confirmed', 'expert')),
  sport_id UUID REFERENCES sports(id),
  image_url TEXT,
  video_url TEXT,
  demonstration_url TEXT,
  default_sets INTEGER,
  default_reps INTEGER,
  default_duration_seconds INTEGER,
  default_rest_seconds INTEGER,
  created_by UUID REFERENCES user_profiles(id),
  is_public BOOLEAN DEFAULT false,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_exercise_library_sport ON exercise_library(sport_id);
CREATE INDEX IF NOT EXISTS idx_exercise_library_created_by ON exercise_library(created_by);
CREATE INDEX IF NOT EXISTS idx_exercise_library_public ON exercise_library(is_public);
CREATE INDEX IF NOT EXISTS idx_exercise_library_difficulty ON exercise_library(difficulty_level);

-- Create trigger
CREATE TRIGGER update_exercise_library_updated_at
BEFORE UPDATE ON exercise_library
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
