-- Create wellness_tracking table
CREATE TABLE IF NOT EXISTS wellness_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  tracked_date DATE NOT NULL UNIQUE,
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 5),
  mood_level INTEGER CHECK (mood_level >= 1 AND mood_level <= 5),
  sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 5),
  stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 5),
  muscle_soreness INTEGER CHECK (muscle_soreness >= 1 AND muscle_soreness <= 5),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_wellness_user ON wellness_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_wellness_date ON wellness_tracking(tracked_date);

-- Create trigger
CREATE TRIGGER update_wellness_tracking_updated_at
BEFORE UPDATE ON wellness_tracking
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
