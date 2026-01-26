-- Create additional session-related tables
CREATE TABLE IF NOT EXISTS session_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id),
  note_type TEXT NOT NULL CHECK (note_type IN ('pre_session', 'post_session', 'coach_note', 'user_note')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for session_notes
CREATE INDEX IF NOT EXISTS idx_session_notes_session ON session_notes(session_id);
CREATE INDEX IF NOT EXISTS idx_session_notes_user ON session_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_session_notes_type ON session_notes(note_type);

-- Create session_timer_configs table
CREATE TABLE IF NOT EXISTS session_timer_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  timer_type TEXT NOT NULL CHECK (timer_type IN ('stopwatch', 'countdown', 'emom', 'amrap', 'tabata', 'custom')),
  duration_seconds INTEGER,
  work_seconds INTEGER,
  rest_seconds INTEGER,
  rounds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
