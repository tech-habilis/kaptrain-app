-- Create themes table
CREATE TABLE IF NOT EXISTS themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  language TEXT DEFAULT 'fr',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_themes_name ON themes(name);

-- Seed themes data
INSERT INTO themes (name, language) VALUES
  ('Sports', 'fr'),
  ('Mobilité & Stretching', 'fr'),
  ('Préparation physique', 'fr'),
  ('Kinésithérapie & Réaltérisation', 'fr')
ON CONFLICT (name) DO NOTHING;

-- Enable RLS
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;

-- Everyone can view themes
CREATE POLICY "Everyone can view themes"
  ON themes FOR SELECT
  USING (true);

-- Only admins can insert themes
CREATE POLICY "Admins can insert themes"
  ON themes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    )
  );

-- Only admins can update themes
CREATE POLICY "Admins can update themes"
  ON themes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    )
  );

-- Only admins can delete themes
CREATE POLICY "Admins can delete themes"
  ON themes FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    )
  );
