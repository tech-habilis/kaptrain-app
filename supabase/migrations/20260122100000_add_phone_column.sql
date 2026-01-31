-- Add phone column to user_profiles
-- Phone number stored as text (varchar)
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
