-- Add weight column to user_profiles (optional field)
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS weight NUMERIC(5, 2);
-- NUMERIC(5,2) allows values up to 999.99 kg
