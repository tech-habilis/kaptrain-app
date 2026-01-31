-- Create physiological_data table
CREATE TABLE IF NOT EXISTS physiological_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  metric_type physiological_metric NOT NULL,
  value NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  measured_at DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_physiological_user ON physiological_data(user_id);
CREATE INDEX IF NOT EXISTS idx_physiological_type ON physiological_data(metric_type);
CREATE INDEX IF NOT EXISTS idx_physiological_date ON physiological_data(measured_at);
