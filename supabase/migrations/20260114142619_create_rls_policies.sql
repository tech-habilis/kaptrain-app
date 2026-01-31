-- ============================================================================
-- Row Level Security (RLS) Policies for Kaptrain Database
-- ============================================================================

-- Helper function to get current user ID from auth.uid()
-- Maps auth.users.id to user_profiles.id

-- ============================================================================
-- user_profiles
-- ============================================================================
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile (during onboarding)
CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users with coach role can view profiles of users who invited them
CREATE POLICY "Coaches can view connected athletes"
  ON user_profiles FOR SELECT
  USING (
    role = 'coach' AND
    EXISTS (
      SELECT 1 FROM coach_connections
      WHERE coach_connections.coach_id = auth.uid()
        AND coach_connections.user_id = user_profiles.id
        AND coach_connections.status = 'accepted'
    )
  );

-- Users can view profiles of their connected coaches
CREATE POLICY "Users can view connected coaches"
  ON user_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM coach_connections
      WHERE coach_connections.user_id = auth.uid()
        AND coach_connections.coach_id = user_profiles.id
        AND coach_connections.status = 'accepted'
    )
  );

-- ============================================================================
-- sports
-- ============================================================================
ALTER TABLE sports ENABLE ROW LEVEL SECURITY;

-- Everyone can view active sports
CREATE POLICY "Everyone can view sports"
  ON sports FOR SELECT
  USING (is_active = true);

-- Only admins can insert sports
CREATE POLICY "Admins can insert sports"
  ON sports FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    )
  );

-- Only admins and creators can update sports
CREATE POLICY "Admins can update sports"
  ON sports FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    )
  );

-- Users can update their own custom sports
CREATE POLICY "Users can update own custom sports"
  ON sports FOR UPDATE
  USING (
    is_custom = true AND created_by = auth.uid()
  );

-- ============================================================================
-- user_sports
-- ============================================================================
ALTER TABLE user_sports ENABLE ROW LEVEL SECURITY;

-- Users can view their own sports
CREATE POLICY "Users can view own sports"
  ON user_sports FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own sports
CREATE POLICY "Users can insert own sports"
  ON user_sports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own sports
CREATE POLICY "Users can update own sports"
  ON user_sports FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own sports
CREATE POLICY "Users can delete own sports"
  ON user_sports FOR DELETE
  USING (auth.uid() = user_id);

-- Coaches can view sports of connected athletes
CREATE POLICY "Coaches can view athlete sports"
  ON user_sports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM coach_connections
      WHERE coach_connections.coach_id = auth.uid()
        AND coach_connections.user_id = user_sports.user_id
        AND coach_connections.status = 'accepted'
    )
  );

-- ============================================================================
-- equipment
-- ============================================================================
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;

-- Everyone can view equipment
CREATE POLICY "Everyone can view equipment"
  ON equipment FOR SELECT
  USING (true);

-- Only admins can manage equipment
CREATE POLICY "Admins can manage equipment"
  ON equipment FOR ALL
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    )
  );

-- ============================================================================
-- exercise_categories
-- ============================================================================
ALTER TABLE exercise_categories ENABLE ROW LEVEL SECURITY;

-- Everyone can view categories
CREATE POLICY "Everyone can view categories"
  ON exercise_categories FOR SELECT
  USING (true);

-- Only admins can manage categories
CREATE POLICY "Admins can manage categories"
  ON exercise_categories FOR ALL
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    )
  );

-- ============================================================================
-- exercise_library
-- ============================================================================
ALTER TABLE exercise_library ENABLE ROW LEVEL SECURITY;

-- Everyone can view public exercises
CREATE POLICY "Everyone can view public exercises"
  ON exercise_library FOR SELECT
  USING (is_public = true);

-- Users can view their own exercises
CREATE POLICY "Users can view own exercises"
  ON exercise_library FOR SELECT
  USING (created_by = auth.uid());

-- Users can insert their own exercises
CREATE POLICY "Users can insert own exercises"
  ON exercise_library FOR INSERT
  WITH CHECK (created_by = auth.uid());

-- Users can update their own exercises
CREATE POLICY "Users can update own exercises"
  ON exercise_library FOR UPDATE
  USING (created_by = auth.uid());

-- Users can delete their own exercises
CREATE POLICY "Users can delete own exercises"
  ON exercise_library FOR DELETE
  USING (created_by = auth.uid());

-- Coaches can view exercises of connected athletes
CREATE POLICY "Coaches can view athlete exercises"
  ON exercise_library FOR SELECT
  USING (
    created_by IN (
      SELECT user_id FROM coach_connections
      WHERE coach_id = auth.uid() AND status = 'accepted'
    )
  );

-- ============================================================================
-- exercise_category_assignments
-- ============================================================================
ALTER TABLE exercise_category_assignments ENABLE ROW LEVEL SECURITY;

-- Everyone can view category assignments (for public exercises)
CREATE POLICY "Everyone can view category assignments"
  ON exercise_category_assignments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM exercise_library
      WHERE exercise_library.id = exercise_category_assignments.exercise_id
        AND (exercise_library.is_public = true OR exercise_library.created_by = auth.uid())
    )
  );

-- Users can manage categories for their own exercises
CREATE POLICY "Users can manage own exercise categories"
  ON exercise_category_assignments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM exercise_library
      WHERE exercise_library.id = exercise_category_assignments.exercise_id
        AND exercise_library.created_by = auth.uid()
    )
  );

-- ============================================================================
-- exercise_equipment_assignments
-- ============================================================================
ALTER TABLE exercise_equipment_assignments ENABLE ROW LEVEL SECURITY;

-- Everyone can view equipment assignments (for public exercises)
CREATE POLICY "Everyone can view equipment assignments"
  ON exercise_equipment_assignments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM exercise_library
      WHERE exercise_library.id = exercise_equipment_assignments.exercise_id
        AND (exercise_library.is_public = true OR exercise_library.created_by = auth.uid())
    )
  );

-- Users can manage equipment for their own exercises
CREATE POLICY "Users can manage own exercise equipment"
  ON exercise_equipment_assignments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM exercise_library
      WHERE exercise_library.id = exercise_equipment_assignments.exercise_id
        AND exercise_library.created_by = auth.uid()
    )
  );

-- ============================================================================
-- programs
-- ============================================================================
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

-- Everyone can view published programs
CREATE POLICY "Everyone can view published programs"
  ON programs FOR SELECT
  USING (is_published = true AND is_active = true);

-- Coaches can view their own programs (draft or published)
CREATE POLICY "Coaches can view own programs"
  ON programs FOR SELECT
  USING (created_by = auth.uid());

-- Coaches can insert their own programs
CREATE POLICY "Coaches can insert own programs"
  ON programs FOR INSERT
  WITH CHECK (
    created_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'coach'
    )
  );

-- Coaches can update their own programs
CREATE POLICY "Coaches can update own programs"
  ON programs FOR UPDATE
  USING (created_by = auth.uid());

-- Coaches can delete their own programs
CREATE POLICY "Coaches can delete own programs"
  ON programs FOR DELETE
  USING (created_by = auth.uid());

-- ============================================================================
-- program_enrollments
-- ============================================================================
ALTER TABLE program_enrollments ENABLE ROW LEVEL SECURITY;

-- Users can view their own enrollments
CREATE POLICY "Users can view own enrollments"
  ON program_enrollments FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own enrollments
CREATE POLICY "Users can insert own enrollments"
  ON program_enrollments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own enrollments
CREATE POLICY "Users can update own enrollments"
  ON program_enrollments FOR UPDATE
  USING (auth.uid() = user_id);

-- Coaches can view enrollments in their programs
CREATE POLICY "Coaches can view program enrollments"
  ON program_enrollments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM programs
      WHERE programs.id = program_enrollments.program_id
        AND programs.created_by = auth.uid()
    )
  );

-- ============================================================================
-- training_blocks
-- ============================================================================
ALTER TABLE training_blocks ENABLE ROW LEVEL SECURITY;

-- Everyone can view public training blocks
CREATE POLICY "Everyone can view public training blocks"
  ON training_blocks FOR SELECT
  USING (is_public = true);

-- Users can view their own training blocks
CREATE POLICY "Users can view own training blocks"
  ON training_blocks FOR SELECT
  USING (created_by = auth.uid());

-- Users can insert their own training blocks
CREATE POLICY "Users can insert own training blocks"
  ON training_blocks FOR INSERT
  WITH CHECK (created_by = auth.uid());

-- Users can update their own training blocks
CREATE POLICY "Users can update own training blocks"
  ON training_blocks FOR UPDATE
  USING (created_by = auth.uid());

-- Users can delete their own training blocks
CREATE POLICY "Users can delete own training blocks"
  ON training_blocks FOR DELETE
  USING (created_by = auth.uid());

-- ============================================================================
-- training_block_exercises
-- ============================================================================
ALTER TABLE training_block_exercises ENABLE ROW LEVEL SECURITY;

-- Users can view exercises from their own or public blocks
CREATE POLICY "Users can view accessible block exercises"
  ON training_block_exercises FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM training_blocks
      WHERE training_blocks.id = training_block_exercises.training_block_id
        AND (training_blocks.is_public = true OR training_blocks.created_by = auth.uid())
    )
  );

-- Users can manage exercises in their own blocks
CREATE POLICY "Users can manage own block exercises"
  ON training_block_exercises FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM training_blocks
      WHERE training_blocks.id = training_block_exercises.training_block_id
        AND training_blocks.created_by = auth.uid()
    )
  );

-- ============================================================================
-- sessions
-- ============================================================================
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Users can view their own sessions
CREATE POLICY "Users can view own sessions"
  ON sessions FOR SELECT
  USING (auth.uid() = user_id);

-- Coaches can view sessions of their connected athletes
CREATE POLICY "Coaches can view athlete sessions"
  ON sessions FOR SELECT
  USING (
    auth.uid() = coach_id AND
    EXISTS (
      SELECT 1 FROM coach_connections
      WHERE coach_connections.coach_id = auth.uid()
        AND coach_connections.user_id = sessions.user_id
        AND coach_connections.status = 'accepted'
    )
  );

-- Users can insert their own sessions
CREATE POLICY "Users can insert own sessions"
  ON sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own sessions
CREATE POLICY "Users can update own sessions"
  ON sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- Coaches can update sessions they created for athletes
CREATE POLICY "Coaches can update created sessions"
  ON sessions FOR UPDATE
  USING (
    auth.uid() = coach_id AND
    created_by = 'coach'
  );

-- Users can delete their own sessions
CREATE POLICY "Users can delete own sessions"
  ON sessions FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- session_blocks
-- ============================================================================
ALTER TABLE session_blocks ENABLE ROW LEVEL SECURITY;

-- Users can view blocks from their own sessions
CREATE POLICY "Users can view own session blocks"
  ON session_blocks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = session_blocks.session_id
        AND sessions.user_id = auth.uid()
    )
  );

-- Coaches can view blocks from their athletes' sessions
CREATE POLICY "Coaches can view athlete session blocks"
  ON session_blocks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = session_blocks.session_id
        AND sessions.coach_id = auth.uid()
    )
  );

-- Users can manage blocks in their own sessions
CREATE POLICY "Users can manage own session blocks"
  ON session_blocks FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = session_blocks.session_id
        AND sessions.user_id = auth.uid()
    )
  );

-- Coaches can manage blocks in sessions they created
CREATE POLICY "Coaches can manage created session blocks"
  ON session_blocks FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = session_blocks.session_id
        AND sessions.coach_id = auth.uid()
        AND sessions.created_by = 'coach'
    )
  );

-- ============================================================================
-- session_exercises
-- ============================================================================
ALTER TABLE session_exercises ENABLE ROW LEVEL SECURITY;

-- Users can view exercises from their own sessions
CREATE POLICY "Users can view own session exercises"
  ON session_exercises FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM session_blocks
      JOIN sessions ON sessions.id = session_blocks.session_id
      WHERE session_blocks.id = session_exercises.session_block_id
        AND sessions.user_id = auth.uid()
    )
  );

-- Coaches can view exercises from their athletes' sessions
CREATE POLICY "Coaches can view athlete session exercises"
  ON session_exercises FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM session_blocks
      JOIN sessions ON sessions.id = session_blocks.session_id
      WHERE session_blocks.id = session_exercises.session_block_id
        AND sessions.coach_id = auth.uid()
    )
  );

-- Users can manage exercises in their own sessions
CREATE POLICY "Users can manage own session exercises"
  ON session_exercises FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM session_blocks
      JOIN sessions ON sessions.id = session_blocks.session_id
      WHERE session_blocks.id = session_exercises.session_block_id
        AND sessions.user_id = auth.uid()
    )
  );

-- Coaches can manage exercises in sessions they created
CREATE POLICY "Coaches can manage created session exercises"
  ON session_exercises FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM session_blocks
      JOIN sessions ON sessions.id = session_blocks.session_id
      WHERE session_blocks.id = session_exercises.session_block_id
        AND sessions.coach_id = auth.uid()
        AND sessions.created_by = 'coach'
    )
  );

-- ============================================================================
-- session_notes
-- ============================================================================
ALTER TABLE session_notes ENABLE ROW LEVEL SECURITY;

-- Users can view notes from their own sessions or notes they created
CREATE POLICY "Users can view own session notes"
  ON session_notes FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = session_notes.session_id
        AND sessions.user_id = auth.uid()
    )
  );

-- Coaches can view notes from their athletes' sessions or notes they created
CREATE POLICY "Coaches can view athlete session notes"
  ON session_notes FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = session_notes.session_id
        AND sessions.coach_id = auth.uid()
    )
  );

-- Users can insert notes for their own sessions
CREATE POLICY "Users can insert own session notes"
  ON session_notes FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = session_notes.session_id
        AND (sessions.user_id = auth.uid() OR sessions.coach_id = auth.uid())
    )
  );

-- Users can update their own notes
CREATE POLICY "Users can update own notes"
  ON session_notes FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own notes
CREATE POLICY "Users can delete own notes"
  ON session_notes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- session_timer_configs
-- ============================================================================
ALTER TABLE session_timer_configs ENABLE ROW LEVEL SECURITY;

-- Users can view timers from their own sessions
CREATE POLICY "Users can view own session timers"
  ON session_timer_configs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = session_timer_configs.session_id
        AND sessions.user_id = auth.uid()
    )
  );

-- Coaches can view timers from their athletes' sessions
CREATE POLICY "Coaches can view athlete session timers"
  ON session_timer_configs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = session_timer_configs.session_id
        AND sessions.coach_id = auth.uid()
    )
  );

-- Users can manage timers in their own sessions
CREATE POLICY "Users can manage own session timers"
  ON session_timer_configs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = session_timer_configs.session_id
        AND sessions.user_id = auth.uid()
    )
  );

-- Coaches can manage timers in sessions they created
CREATE POLICY "Coaches can manage created session timers"
  ON session_timer_configs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = session_timer_configs.session_id
        AND sessions.coach_id = auth.uid()
        AND sessions.created_by = 'coach'
    )
  );

-- ============================================================================
-- injuries
-- ============================================================================
ALTER TABLE injuries ENABLE ROW LEVEL SECURITY;

-- Users can view their own injuries
CREATE POLICY "Users can view own injuries"
  ON injuries FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own injuries
CREATE POLICY "Users can insert own injuries"
  ON injuries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own injuries
CREATE POLICY "Users can update own injuries"
  ON injuries FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own injuries
CREATE POLICY "Users can delete own injuries"
  ON injuries FOR DELETE
  USING (auth.uid() = user_id);

-- Coaches can view injuries of connected athletes
CREATE POLICY "Coaches can view athlete injuries"
  ON injuries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM coach_connections
      WHERE coach_connections.coach_id = auth.uid()
        AND coach_connections.user_id = injuries.user_id
        AND coach_connections.status = 'accepted'
    )
  );

-- ============================================================================
-- physiological_data
-- ============================================================================
ALTER TABLE physiological_data ENABLE ROW LEVEL SECURITY;

-- Users can view their own physiological data
CREATE POLICY "Users can view own physiological data"
  ON physiological_data FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own physiological data
CREATE POLICY "Users can insert own physiological data"
  ON physiological_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own physiological data
CREATE POLICY "Users can update own physiological data"
  ON physiological_data FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own physiological data
CREATE POLICY "Users can delete own physiological data"
  ON physiological_data FOR DELETE
  USING (auth.uid() = user_id);

-- Coaches can view physiological data of connected athletes
CREATE POLICY "Coaches can view athlete physiological data"
  ON physiological_data FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM coach_connections
      WHERE coach_connections.coach_id = auth.uid()
        AND coach_connections.user_id = physiological_data.user_id
        AND coach_connections.status = 'accepted'
    )
  );

-- ============================================================================
-- records
-- ============================================================================
ALTER TABLE records ENABLE ROW LEVEL SECURITY;

-- Users can view their own records
CREATE POLICY "Users can view own records"
  ON records FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own records
CREATE POLICY "Users can insert own records"
  ON records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own records
CREATE POLICY "Users can update own records"
  ON records FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own records
CREATE POLICY "Users can delete own records"
  ON records FOR DELETE
  USING (auth.uid() = user_id);

-- Coaches can view records of connected athletes
CREATE POLICY "Coaches can view athlete records"
  ON records FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM coach_connections
      WHERE coach_connections.coach_id = auth.uid()
        AND coach_connections.user_id = records.user_id
        AND coach_connections.status = 'accepted'
    )
  );

-- ============================================================================
-- sport_objectives
-- ============================================================================
ALTER TABLE sport_objectives ENABLE ROW LEVEL SECURITY;

-- Users can view their own objectives
CREATE POLICY "Users can view own objectives"
  ON sport_objectives FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own objectives
CREATE POLICY "Users can insert own objectives"
  ON sport_objectives FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own objectives
CREATE POLICY "Users can update own objectives"
  ON sport_objectives FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own objectives
CREATE POLICY "Users can delete own objectives"
  ON sport_objectives FOR DELETE
  USING (auth.uid() = user_id);

-- Coaches can view objectives of connected athletes
CREATE POLICY "Coaches can view athlete objectives"
  ON sport_objectives FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM coach_connections
      WHERE coach_connections.coach_id = auth.uid()
        AND coach_connections.user_id = sport_objectives.user_id
        AND coach_connections.status = 'accepted'
    )
  );

-- ============================================================================
-- wellness_tracking
-- ============================================================================
ALTER TABLE wellness_tracking ENABLE ROW LEVEL SECURITY;

-- Users can view their own wellness data
CREATE POLICY "Users can view own wellness data"
  ON wellness_tracking FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own wellness data
CREATE POLICY "Users can insert own wellness data"
  ON wellness_tracking FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own wellness data
CREATE POLICY "Users can update own wellness data"
  ON wellness_tracking FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own wellness data
CREATE POLICY "Users can delete own wellness data"
  ON wellness_tracking FOR DELETE
  USING (auth.uid() = user_id);

-- Coaches can view wellness data of connected athletes
CREATE POLICY "Coaches can view athlete wellness data"
  ON wellness_tracking FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM coach_connections
      WHERE coach_connections.coach_id = auth.uid()
        AND coach_connections.user_id = wellness_tracking.user_id
        AND coach_connections.status = 'accepted'
    )
  );

-- ============================================================================
-- subscriptions
-- ============================================================================
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own subscriptions
CREATE POLICY "Users can insert own subscriptions"
  ON subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own subscriptions
CREATE POLICY "Users can update own subscriptions"
  ON subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- Admins can view all subscriptions
CREATE POLICY "Admins can view all subscriptions"
  ON subscriptions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    )
  );

-- Admins can manage all subscriptions
CREATE POLICY "Admins can manage subscriptions"
  ON subscriptions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    )
  );

-- ============================================================================
-- coach_connections
-- ============================================================================
ALTER TABLE coach_connections ENABLE ROW LEVEL SECURITY;

-- Users can view their own connections (as athlete or coach)
CREATE POLICY "Users can view own connections"
  ON coach_connections FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = coach_id);

-- Users can insert connection requests to coaches
CREATE POLICY "Users can insert connection requests"
  ON coach_connections FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = coach_id AND user_profiles.role = 'coach'
    )
  );

-- Coaches can update connection status
CREATE POLICY "Coaches can update connection status"
  ON coach_connections FOR UPDATE
  USING (
    auth.uid() = coach_id AND
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'coach'
    )
  );

-- Users can delete their own connections
CREATE POLICY "Users can delete own connections"
  ON coach_connections FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- messages
-- ============================================================================
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users can view messages in their connections
CREATE POLICY "Users can view own messages"
  ON messages FOR SELECT
  USING (
    auth.uid() = sender_id OR
    EXISTS (
      SELECT 1 FROM coach_connections
      WHERE coach_connections.id = messages.coach_connection_id
        AND (coach_connections.user_id = auth.uid() OR coach_connections.coach_id = auth.uid())
    )
  );

-- Users can insert messages in their connections
CREATE POLICY "Users can insert messages"
  ON messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM coach_connections
      WHERE coach_connections.id = messages.coach_connection_id
        AND (coach_connections.user_id = auth.uid() OR coach_connections.coach_id = auth.uid())
    )
  );

-- Users can update their own messages (mark as read)
CREATE POLICY "Users can update own messages"
  ON messages FOR UPDATE
  USING (auth.uid() = sender_id);

-- Users can delete their own messages
CREATE POLICY "Users can delete own messages"
  ON messages FOR DELETE
  USING (auth.uid() = sender_id);

-- Recipients can update read status
CREATE POLICY "Recipients can mark messages as read"
  ON messages FOR UPDATE
  USING (
    auth.uid() != sender_id AND
    EXISTS (
      SELECT 1 FROM coach_connections
      WHERE coach_connections.id = messages.coach_connection_id
        AND (coach_connections.user_id = auth.uid() OR coach_connections.coach_id = auth.uid())
    )
  );
