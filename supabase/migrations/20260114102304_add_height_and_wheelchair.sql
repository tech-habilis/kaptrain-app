-- Add height and wheelchair columns to user_profiles
-- Height stored in cm (integer), weight in kg (already exists)
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS height INTEGER,
-- Height in cm (e.g., 180 for 180cm)

ADD COLUMN IF NOT EXISTS in_wheelchair BOOLEAN DEFAULT FALSE;
