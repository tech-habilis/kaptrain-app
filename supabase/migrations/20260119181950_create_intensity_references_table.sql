-- Drop any existing intensity columns from previous migration (if they exist)
ALTER TABLE session_blocks
DROP COLUMN IF EXISTS intensity_id,
DROP COLUMN IF EXISTS intensity_name;

-- Drop old index if it exists
DROP INDEX IF EXISTS idx_session_blocks_intensity;

-- Create intensity_references table
CREATE TABLE intensity_references (
  id text PRIMARY KEY,
  name_fr text NOT NULL,
  name_en text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0
);

-- Insert intensity options
INSERT INTO intensity_references (id, name_fr, name_en, sort_order) VALUES
  ('id-Aucun', 'Aucun', 'None', 1),
  ('id-FORCE', 'FORCE (%RM)', 'FORCE (%RM)', 2),
  ('id-Cardiaque', 'Cardiaque (%FC Max)', 'Cardiac (%FC Max)', 3),
  ('id-pma', 'Puissance (%PMA)', 'Power (%PMA)', 4),
  ('id-ftp', 'Puissance (%FTP)', 'Power (%FTP)', 5),
  ('id-vma', 'Vitesse (%VMA)', 'Speed (%VMA)', 6),
  ('id-Vitesse', 'Vitesse (Vitesse brute)', 'Speed (Raw speed)', 7),
  ('id-physique', 'Ressenti (RPE physique)', 'Feeling (RPE physical)', 8),
  ('id-cognitif', 'Ressenti (RPE cognitif)', 'Feeling (RPE cognitive)', 9);

-- Add foreign key to session_blocks
ALTER TABLE session_blocks
ADD COLUMN intensity_id text REFERENCES intensity_references(id);

-- Create index for faster lookups
CREATE INDEX idx_session_blocks_intensity_ref ON session_blocks(intensity_id);

-- Add comments
COMMENT ON TABLE intensity_references IS 'Reference table for intensity types used in training blocks';
COMMENT ON COLUMN intensity_references.id IS 'Unique identifier for the intensity reference';
COMMENT ON COLUMN intensity_references.name_fr IS 'French name of the intensity reference';
COMMENT ON COLUMN intensity_references.name_en IS 'English name of the intensity reference';
COMMENT ON COLUMN intensity_references.is_active IS 'Whether this intensity reference is active';
COMMENT ON COLUMN intensity_references.sort_order IS 'Display order for sorting';

-- Enable Row Level Security
ALTER TABLE intensity_references ENABLE ROW LEVEL SECURITY;

-- Create policy: Everyone can read active intensity references
CREATE POLICY "Anyone can view active intensity references"
  ON intensity_references
  FOR SELECT
  USING (is_active = true);
