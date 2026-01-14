-- Create session_exercises table
CREATE TABLE IF NOT EXISTS session_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_block_id UUID NOT NULL REFERENCES session_blocks(id) ON DELETE CASCADE,
  exercise_library_id UUID REFERENCES exercise_library(id),
  name TEXT NOT NULL,
  description TEXT,
  sets INTEGER,
  reps INTEGER,
  duration_seconds INTEGER,
  distance_meters INTEGER,
  weight_kg NUMERIC(10,2),
  rest_seconds INTEGER,
  sequence_order INTEGER NOT NULL,
  is_completed BOOLEAN DEFAULT false
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_session_exercises_block ON session_exercises(session_block_id);
CREATE INDEX IF NOT EXISTS idx_session_exercises_order ON session_exercises(session_block_id, sequence_order);
