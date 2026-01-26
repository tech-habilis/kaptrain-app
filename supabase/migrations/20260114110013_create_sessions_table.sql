-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  coach_id UUID REFERENCES user_profiles(id),
  program_id UUID REFERENCES programs(id),
  program_enrollment_id UUID REFERENCES program_enrollments(id),
  title TEXT NOT NULL,
  description TEXT,
  session_type session_type NOT NULL,
  session_status session_status DEFAULT 'upcoming',
  scheduled_date DATE NOT NULL,
  scheduled_time TIME,
  duration_seconds INTEGER,
  sport_id UUID REFERENCES sports(id),
  activity_color TEXT,
  rpe_rating INTEGER CHECK (rpe_rating >= 1 AND rpe_rating <= 10),
  user_feedback TEXT,
  created_by user_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_sessions_user_date ON sessions(user_id, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_sessions_program ON sessions(program_id);
CREATE INDEX IF NOT EXISTS idx_sessions_enrollment ON sessions(program_enrollment_id);
CREATE INDEX IF NOT EXISTS idx_sessions_sport ON sessions(sport_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(session_status);
CREATE INDEX IF NOT EXISTS idx_sessions_type_status ON sessions(session_type, session_status);
CREATE INDEX IF NOT EXISTS idx_sessions_calendar ON sessions(user_id, scheduled_date, session_status);

-- Create trigger
CREATE TRIGGER update_sessions_updated_at
BEFORE UPDATE ON sessions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
