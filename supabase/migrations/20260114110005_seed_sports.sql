-- Seed sports table
INSERT INTO sports (id, name, name_fr, icon_name, color, description, is_active, is_custom) VALUES
  -- Core sports from mock data
  (gen_random_uuid(), 'athletics', 'Athlétisme', 'athletics', '#457CE2', 'Track and field sports', true, false),
  (gen_random_uuid(), 'rowing', 'Aviron', 'rowing', '#457CE2', 'Rowing sports', true, false),
  (gen_random_uuid(), 'basketball', 'Basketball', 'basketball', '#FF9E69', 'Basketball', true, false),
  (gen_random_uuid(), 'crossfit', 'Crossfit', 'crossfit', '#424F65', 'Crossfit training', true, false),
  (gen_random_uuid(), 'cycling', 'Cyclisme', 'cycling', '#457CE2', 'Cycling sports', true, false),
  (gen_random_uuid(), 'bodybuilding', 'Musculation', 'bodybuilding', '#FF9E69', 'Bodybuilding & strength', true, false),
  (gen_random_uuid(), 'running', 'Course à pied', 'running', '#457CE2', 'Running & jogging', true, false),
  (gen_random_uuid(), 'yoga', 'Yoga', 'yoga', '#3FA951', 'Yoga & flexibility', true, false),
  -- Additional sports from app usage
  (gen_random_uuid(), 'hyrox', 'Hyrox', 'hyrox', '#457CE2', 'Hyrox fitness competitions', true, false),
  (gen_random_uuid(), 'physical_preparation', 'Préparation physique', 'physical-prep', '#FF9E69', 'Physical preparation & conditioning', true, false),
  -- Other common sports
  (gen_random_uuid(), 'swimming', 'Natation', 'swimming', '#457CE2', 'Swimming', true, false),
  (gen_random_uuid(), 'football', 'Football', 'football', '#424F65', 'Football/soccer', true, false),
  (gen_random_uuid(), 'tennis', 'Tennis', 'tennis', '#FF9E69', 'Tennis', true, false),
  (gen_random_uuid(), 'volleyball', 'Volleyball', 'volleyball', '#457CE2', 'Volleyball', true, false),
  (gen_random_uuid(), 'climbing', 'Escalade', 'climbing', '#424F65', 'Rock climbing', true, false),
  (gen_random_uuid(), 'triathlon', 'Triathlon', 'triathlon', '#457CE2', 'Triathlon', true, false),
  (gen_random_uuid(), 'martial_arts', 'Arts martiaux', 'martial-arts', '#FF9E69', 'Martial arts', true, false),
  (gen_random_uuid(), 'gymnastics', 'Gymnastique', 'gymnastics', '#3FA951', 'Gymnastics', true, false),
  (gen_random_uuid(), 'boxing', 'Boxe', 'boxing', '#424F65', 'Boxing', true, false),
  (gen_random_uuid(), 'pilates', 'Pilates', 'pilates', '#3FA951', 'Pilates', true, false)
ON CONFLICT (name) DO NOTHING;
