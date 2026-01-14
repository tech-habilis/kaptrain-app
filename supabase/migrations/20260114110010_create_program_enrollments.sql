-- Create program_enrollments table
CREATE TABLE IF NOT EXISTS program_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  completion_percentage INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, program_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON program_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_program ON program_enrollments(program_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_active ON program_enrollments(user_id, is_active);
