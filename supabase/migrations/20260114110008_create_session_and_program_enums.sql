-- Create enums for program_type, session_type, and session_status
DO $$ BEGIN
  CREATE TYPE program_type AS ENUM ('program', 'programmation', 'session_template');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE session_type AS ENUM ('program', 'individual', 'programmation', 'personal');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE session_status AS ENUM ('upcoming', 'in_progress', 'completed', 'skipped', 'canceled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
