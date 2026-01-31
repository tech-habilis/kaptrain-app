-- Drop created_by column from sessions table
-- Not needed for now

-- First, drop RLS policies that depend on created_by
DROP POLICY IF EXISTS "Coaches can update created sessions" ON public.sessions;
DROP POLICY IF EXISTS "Coaches can manage created session blocks" ON public.session_blocks;
DROP POLICY IF EXISTS "Coaches can manage created session exercises" ON public.session_exercises;
DROP POLICY IF EXISTS "Coaches can manage created session timers" ON public.session_timer_configs;

-- Now drop the column
ALTER TABLE public.sessions
DROP COLUMN IF EXISTS created_by;
