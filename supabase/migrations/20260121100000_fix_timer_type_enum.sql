-- Fix session_timer_configs.timer_type to use timer_type enum instead of TEXT with CHECK constraint
-- This provides better type safety and consistency with the schema

-- First, drop the CHECK constraint that's preventing the type conversion
ALTER TABLE session_timer_configs
  DROP CONSTRAINT IF EXISTS session_timer_configs_timer_type_check;

-- Now alter the column to use the timer_type enum
-- The USING clause casts the existing text values to the enum type
ALTER TABLE session_timer_configs
  ALTER COLUMN timer_type
  TYPE timer_type
  USING timer_type::text::timer_type;
