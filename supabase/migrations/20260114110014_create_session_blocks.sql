-- Create session_blocks table
CREATE TABLE IF NOT EXISTS session_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  color TEXT,
  sequence_order INTEGER NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_session_blocks_session ON session_blocks(session_id);
CREATE INDEX IF NOT EXISTS idx_session_blocks_order ON session_blocks(session_id, sequence_order);
