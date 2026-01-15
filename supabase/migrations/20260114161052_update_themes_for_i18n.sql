-- Drop old themes table and recreate with i18n support
DROP TABLE IF EXISTS themes CASCADE;

-- Create new themes table with name_fr and name_en columns
CREATE TABLE themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  name_fr TEXT NOT NULL,
  name_en TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_themes_key ON themes(key);
CREATE INDEX IF NOT EXISTS idx_themes_active ON themes(is_active, sort_order);

-- Seed themes with translations
INSERT INTO themes (key, name_fr, name_en, sort_order, is_active) VALUES
  ('sports', 'Sports', 'Sports', 1, true),
  ('mobility_stretching', 'Mobilité & Stretching', 'Mobility & Stretching', 2, true),
  ('physical_preparation', 'Préparation physique', 'Physical Preparation', 3, true),
  ('physio_rehabilitation', 'Kinésithérapie & Réaltérisation', 'Physiotherapy & Rehabilitation', 4, true)
ON CONFLICT (key) DO NOTHING;

-- Enable RLS
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view active themes"
  ON themes FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can insert themes"
  ON themes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update themes"
  ON themes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete themes"
  ON themes FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    )
  );
