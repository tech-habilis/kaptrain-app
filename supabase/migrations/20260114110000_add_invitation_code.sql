-- Add invitation_code to user_profiles for coach connections
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS invitation_code TEXT UNIQUE;

-- Create index for fast invitation code lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_invitation_code
ON user_profiles(invitation_code)
WHERE invitation_code IS NOT NULL;
