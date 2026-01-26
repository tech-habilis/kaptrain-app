-- Create additional enums
DO $$ BEGIN
  CREATE TYPE gender AS ENUM ('female', 'male', 'nonbinary', 'prefer_not_to_say');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE sport_level AS ENUM ('beginner', 'intermediate', 'advanced', 'confirmed', 'expert');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE session_note_type AS ENUM ('pre_session', 'post_session', 'coach_note', 'user_note');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE timer_type AS ENUM ('stopwatch', 'countdown', 'emom', 'amrap', 'tabata', 'custom');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE injury_status AS ENUM ('in_progress', 'healed', 'chronic');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE injury_severity AS ENUM ('mild', 'moderate', 'severe');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE physiological_metric AS ENUM ('fc_max', 'vma', 'pma', 'ftp');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE objective_category AS ENUM ('event', 'health', 'performance');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE objective_status AS ENUM ('active', 'completed', 'paused', 'canceled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE subscription_type AS ENUM ('monthly', 'yearly');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE subscription_status AS ENUM ('trial', 'active', 'canceled', 'expired', 'past_due');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE connection_status AS ENUM ('pending', 'accepted', 'declined', 'blocked');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('athlete', 'coach', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
