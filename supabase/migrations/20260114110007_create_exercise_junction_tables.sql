-- Create junction tables for exercise categories and equipment
CREATE TABLE IF NOT EXISTS exercise_category_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_id UUID NOT NULL REFERENCES exercise_library(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES exercise_categories(id) ON DELETE CASCADE,
  UNIQUE(exercise_id, category_id)
);

CREATE TABLE IF NOT EXISTS exercise_equipment_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_id UUID NOT NULL REFERENCES exercise_library(id) ON DELETE CASCADE,
  equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  UNIQUE(exercise_id, equipment_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_exercise_cat_exercise ON exercise_category_assignments(exercise_id);
CREATE INDEX IF NOT EXISTS idx_exercise_cat_category ON exercise_category_assignments(category_id);
CREATE INDEX IF NOT EXISTS idx_exercise_eq_exercise ON exercise_equipment_assignments(exercise_id);
CREATE INDEX IF NOT EXISTS idx_exercise_eq_equipment ON exercise_equipment_assignments(equipment_id);
