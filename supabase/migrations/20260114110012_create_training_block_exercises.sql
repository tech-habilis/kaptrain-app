-- Create training_block_exercises table
CREATE TABLE IF NOT EXISTS training_block_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  training_block_id UUID NOT NULL REFERENCES training_blocks(id) ON DELETE CASCADE,
  exercise_library_id UUID REFERENCES exercise_library(id),
  name TEXT NOT NULL,
  description TEXT,
  sets INTEGER,
  reps INTEGER,
  duration_seconds INTEGER,
  distance_meters INTEGER,
  weight_kg NUMERIC(10,2),
  rest_seconds INTEGER,
  sequence_order INTEGER NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_training_block_exercises_block ON training_block_exercises(training_block_id);
CREATE INDEX IF NOT EXISTS idx_training_block_exercises_order ON training_block_exercises(training_block_id, sequence_order);
