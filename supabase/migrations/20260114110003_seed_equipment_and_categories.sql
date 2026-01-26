-- Seed equipment table
INSERT INTO equipment (id, name, name_fr, icon_name) VALUES
  (gen_random_uuid(), 'No Equipment', 'Sans matériel', 'no-equipment'),
  (gen_random_uuid(), 'Weight', 'Poids', 'weight'),
  (gen_random_uuid(), 'Bench', 'Banc', 'bench'),
  (gen_random_uuid(), 'Bar', 'Barre', 'bar'),
  (gen_random_uuid(), 'Box', 'Boxe', 'box'),
  (gen_random_uuid(), 'Dumbbells', 'Haltères', 'dumbbells'),
  (gen_random_uuid(), 'Kettlebell', 'Kettlebell', 'kettlebell'),
  (gen_random_uuid(), 'Medicine Ball', 'Médecine ball', 'medicine-ball'),
  (gen_random_uuid(), 'Pull-up Bar', 'Barre de traction', 'pullup-bar'),
  (gen_random_uuid(), 'Resistance Bands', 'Élastiques', 'bands'),
  (gen_random_uuid(), 'Skipping Rope', 'Corde à sauter', 'rope'),
  (gen_random_uuid(), 'Swiss Ball', 'Ballon suisse', 'swiss-ball'),
  (gen_random_uuid(), 'Foam Roller', 'Rouleau de massage', 'foam-roller'),
  (gen_random_uuid(), 'Rowing Machine', 'Rameur', 'rowing-machine'),
  (gen_random_uuid(), 'Treadmill', 'Tapis roulant', 'treadmill'),
  (gen_random_uuid(), 'Bike', 'Vélo', 'bike')
ON CONFLICT (name) DO NOTHING;

-- Seed exercise_categories table
INSERT INTO exercise_categories (id, name, name_fr, description, sort_order) VALUES
  (gen_random_uuid(), 'warmup', 'Échauffement', 'Prépare ton corps à l''effort avec des routines ciblées, haut et bas du corps.', 1),
  (gen_random_uuid(), 'handisport', 'Handisport', 'Des séances adaptées pour tous les profils, avec une approche inclusive et performante.', 2),
  (gen_random_uuid(), 'injury_prevention', 'Préparation blessures', 'Renforce les zones sensibles et améliore tes points faibles pour durer dans le temps', 3),
  (gen_random_uuid(), 'maternity', 'Maternité', 'Adapte ton suivi et tes séances à chaque étape de la grossesse ou du post-partum.', 4),
  (gen_random_uuid(), 'core_training', 'Core-training', 'Boost ta sangle abdominale et ton gainage pour un meilleur équilibre et plus de puissance', 5),
  (gen_random_uuid(), 'mobility', 'Mobilité', 'Travaille ta souplesse, ta fluidité et ton amplitude pour des mouvements plus libres et efficaces', 6)
ON CONFLICT (name) DO NOTHING;
