-- Remove user_id from sessions table
-- Sessions should only be linked to coach_id (the creator)

-- Drop all RLS policies that depend on user_id (on sessions and related tables)
DROP POLICY IF EXISTS "Users can view own sessions" ON public.sessions;
DROP POLICY IF EXISTS "Users can insert own sessions" ON public.sessions;
DROP POLICY IF EXISTS "Users can update own sessions" ON public.sessions;
DROP POLICY IF EXISTS "Users can delete own sessions" ON public.sessions;
DROP POLICY IF EXISTS "Coaches can view athlete sessions" ON public.sessions;

DROP POLICY IF EXISTS "Users can view own session blocks" ON public.session_blocks;
DROP POLICY IF EXISTS "Users can manage own session blocks" ON public.session_blocks;

DROP POLICY IF EXISTS "Users can view own session exercises" ON public.session_exercises;
DROP POLICY IF EXISTS "Users can manage own session exercises" ON public.session_exercises;

DROP POLICY IF EXISTS "Users can view own session notes" ON public.session_notes;
DROP POLICY IF EXISTS "Users can insert own session notes" ON public.session_notes;

DROP POLICY IF EXISTS "Users can view own session timers" ON public.session_timer_configs;
DROP POLICY IF EXISTS "Users can manage own session timers" ON public.session_timer_configs;

-- Drop the foreign key constraint
ALTER TABLE public.sessions
DROP CONSTRAINT IF EXISTS sessions_user_id_fkey;

-- Migrate NULL coach_id to user_id to preserve data
UPDATE public.sessions
SET coach_id = user_id
WHERE coach_id IS NULL;

-- Now drop the user_id column
ALTER TABLE public.sessions
DROP COLUMN IF EXISTS user_id;

-- Add NOT NULL constraint to coach_id since it's now required
ALTER TABLE public.sessions
ALTER COLUMN coach_id SET NOT NULL;

-- Recreate RLS policies for coach_id on sessions
CREATE POLICY "Coaches can view their own sessions"
ON public.sessions
FOR SELECT
TO authenticated
USING (auth.uid() = coach_id);

CREATE POLICY "Coaches can insert their own sessions"
ON public.sessions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = coach_id);

CREATE POLICY "Coaches can update their own sessions"
ON public.sessions
FOR UPDATE
TO authenticated
USING (auth.uid() = coach_id)
WITH CHECK (auth.uid() = coach_id);

CREATE POLICY "Coaches can delete their own sessions"
ON public.sessions
FOR DELETE
TO authenticated
USING (auth.uid() = coach_id);

-- Athletes can view sessions created by their connected coaches
CREATE POLICY "Athletes can view sessions from connected coaches"
ON public.sessions
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id
    FROM public.coach_connections
    WHERE coach_id = sessions.coach_id
    AND status = 'accepted'
  )
);

-- Recreate RLS policies for session_blocks (now filtering through sessions.coach_id)
CREATE POLICY "Coaches can view own session blocks"
ON public.session_blocks
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT coach_id
    FROM public.sessions
    WHERE sessions.id = session_blocks.session_id
  )
);

CREATE POLICY "Coaches can manage own session blocks"
ON public.session_blocks
FOR ALL
TO authenticated
USING (
  auth.uid() IN (
    SELECT coach_id
    FROM public.sessions
    WHERE sessions.id = session_blocks.session_id
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT coach_id
    FROM public.sessions
    WHERE sessions.id = session_blocks.session_id
  )
);

-- Recreate RLS policies for session_exercises (now filtering through sessions.coach_id)
CREATE POLICY "Coaches can view own session exercises"
ON public.session_exercises
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT coach_id
    FROM public.sessions
    JOIN public.session_blocks ON session_blocks.session_id = sessions.id
    WHERE session_blocks.id = session_exercises.session_block_id
  )
);

CREATE POLICY "Coaches can manage own session exercises"
ON public.session_exercises
FOR ALL
TO authenticated
USING (
  auth.uid() IN (
    SELECT coach_id
    FROM public.sessions
    JOIN public.session_blocks ON session_blocks.session_id = sessions.id
    WHERE session_blocks.id = session_exercises.session_block_id
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT coach_id
    FROM public.sessions
    JOIN public.session_blocks ON session_blocks.session_id = sessions.id
    WHERE session_blocks.id = session_exercises.session_block_id
  )
);

-- Recreate RLS policies for session_notes (now filtering through sessions.coach_id)
CREATE POLICY "Coaches can view own session notes"
ON public.session_notes
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT coach_id
    FROM public.sessions
    WHERE sessions.id = session_notes.session_id
  )
);

CREATE POLICY "Coaches can insert own session notes"
ON public.session_notes
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IN (
    SELECT coach_id
    FROM public.sessions
    WHERE sessions.id = session_notes.session_id
  )
);

-- Recreate RLS policies for session_timer_configs (now filtering through sessions.coach_id)
CREATE POLICY "Coaches can view own session timers"
ON public.session_timer_configs
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT coach_id
    FROM public.sessions
    WHERE sessions.id = session_timer_configs.session_id
  )
);

CREATE POLICY "Coaches can manage own session timers"
ON public.session_timer_configs
FOR ALL
TO authenticated
USING (
  auth.uid() IN (
    SELECT coach_id
    FROM public.sessions
    WHERE sessions.id = session_timer_configs.session_id
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT coach_id
    FROM public.sessions
    WHERE sessions.id = session_timer_configs.session_id
  )
);
