-- Add sport level column to user_profiles
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS sport_level TEXT CHECK (sport_level IN ('beginner', 'intermediate', 'advanced', 'confirmed', 'expert'));

-- Update preferences column to ensure it can store sports preferences
-- The preferences JSON column already exists, we'll store:
-- {"selectedSports": ["sports.athletics", "sports.basketball", ...]}
