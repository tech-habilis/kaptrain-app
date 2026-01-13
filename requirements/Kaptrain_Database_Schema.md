# Kaptrain Database Schema

This document defines the complete database schema for the Kaptrain platform using Supabase (PostgreSQL). Both the CMS and Mobile App (React Native) will connect directly to Supabase.

## Overview

This schema supports a comprehensive fitness coaching platform where:

- **Coaches** create and manage training sessions for their athletes
- **Athletes** track their training, wellness, records, and injuries
- **Admins** manage exercises, sports, materials, and subscription plans
- **Messaging** enables communication between coaches and athletes
- **Subscriptions** control access and feature availability

Each table includes detailed comments explaining its purpose, relationships, and usage patterns.

---

## Table of Contents

1. [Authentication & Users](#authentication--users)
2. [Subscriptions](#subscriptions)
3. [Sports & Materials](#sports--materials)
4. [Exercises & Library](#exercises--library)
5. [Training & Sessions](#training--sessions)
6. [Athlete Data](#athlete-data)
7. [Messaging](#messaging)
8. [Notifications](#notifications)
9. [Admin Features](#admin-features)

---

## Authentication & Users

### `users` (extends Supabase auth.users)

**Purpose**:  
Stores extended user profile information beyond what Supabase auth provides. This table links to `auth.users` and contains all user-specific data used throughout the application.

**Key Relationships**:

- Links to `auth.users` via `id` (Supabase handles authentication)
- Referenced by almost all other tables as `athlete_id`, `coach_id`, or `user_id`
- One user can have multiple roles, but typically one primary role per account

**Usage Notes**:

- When a user signs up via Supabase Auth, create a corresponding row here
- `role` determines what features and data the user can access
- `deleted_at` enables soft deletion (user data preserved but hidden)
- `avatar_url` should point to Supabase Storage bucket `user-avatars`

```sql
CREATE TABLE users (
  -- Primary key that references Supabase auth.users
  -- When auth user is deleted, this profile is also deleted (CASCADE)
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- User's email address (must be unique across all users)
  -- This should match the email in auth.users for consistency
  email TEXT UNIQUE NOT NULL,

  -- User's first name (displayed in UI greetings, messages, etc.)
  first_name TEXT,

  -- User's last name (for full name display)
  last_name TEXT,

  -- Date of birth (used for age calculations, demographic data)
  -- Format: YYYY-MM-DD
  date_of_birth DATE,

  -- Gender identity (for personalization and analytics)
  -- Options: 'male', 'female', 'other', 'prefer_not_to_say'
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),

  -- Phone number (for contact, SMS notifications if needed)
  -- Format: international format recommended (e.g., +33612345678)
  phone_number TEXT,

  -- URL to user's profile picture stored in Supabase Storage
  -- Bucket: 'user-avatars'
  -- Example: 'https://[project].supabase.co/storage/v1/object/public/user-avatars/user-123.jpg'
  avatar_url TEXT,

  -- User's role in the system - determines permissions and UI access
  -- 'athlete': Can view sessions, track wellness, manage records
  -- 'coach': Can create sessions, manage athletes, view dashboards
  -- 'admin': Full system access, manages exercises, sports, materials
  role TEXT NOT NULL CHECK (role IN ('athlete', 'coach', 'admin')),

  -- Date when user completed onboarding/profile setup
  -- Used for analytics and to show onboarding completion status
  onboarding_date TIMESTAMPTZ DEFAULT NOW(),

  -- Timestamp when this profile was created
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Timestamp when this profile was last updated
  -- Automatically updated by trigger (see Functions & Triggers section)
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Soft delete timestamp - if set, user is considered deleted
  -- NULL = active user, TIMESTAMP = deleted at this time
  -- Allows data recovery and maintains referential integrity
  deleted_at TIMESTAMPTZ
);

-- Index for filtering users by role (common query: "get all coaches")
CREATE INDEX idx_users_role ON users(role);

-- Index for email lookups (login, user search)
CREATE INDEX idx_users_email ON users(email);

-- Note: Add RLS policies to ensure users can only read/update their own profile
-- See RLS Policies section below
```

### `athlete_coach_relationships`

**Purpose**:  
Manages the pairing between athletes and coaches, including the invitation workflow. This is a critical table that controls which coaches can create sessions for which athletes.

**Key Relationships**:

- Links `athlete_id` (user with role='athlete') to `coach_id` (user with role='coach')
- Enforces one-to-one relationship per athlete-coach pair (UNIQUE constraint)
- Used by RLS policies to verify coach permissions when creating sessions

**Business Logic**:

- Coaches invite athletes via email or invitation code/link
- Athletes must accept invitations before coaches can create sessions for them
- Status flow: 'pending' → 'accepted' or 'refused'
- Only 'accepted' relationships allow session creation

**Usage Examples**:

- Coach invites athlete → creates row with status='pending', generates invitation_code
- Athlete accepts → updates status='accepted', sets accepted_at
- Query "all athletes for a coach": `SELECT * WHERE coach_id = ? AND status = 'accepted'`
- Query "all coaches for an athlete": `SELECT * WHERE athlete_id = ? AND status = 'accepted'`

```sql
CREATE TABLE athlete_coach_relationships (
  -- Unique identifier for this relationship
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Reference to the athlete user
  -- When athlete is deleted, all their relationships are deleted
  athlete_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Reference to the coach user
  -- When coach is deleted, all their relationships are deleted
  coach_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Current status of the relationship
  -- 'pending': Invitation sent, waiting for athlete response
  -- 'accepted': Athlete accepted, coach can create sessions
  -- 'refused': Athlete declined the invitation
  -- Default is 'pending' when invitation is first created
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'refused')),

  -- Which coach sent the invitation (usually same as coach_id, but could be different if admin)
  -- Allows tracking who initiated the relationship
  invited_by UUID REFERENCES users(id),

  -- Unique invitation code that athlete can use to accept invitation
  -- Format: alphanumeric string (e.g., "ABC123XYZ")
  -- Generated when coach creates invitation, can be shared via any channel
  invitation_code TEXT UNIQUE,

  -- Shareable invitation link (URL)
  -- Format: "https://app.kaptrain.com/invite/ABC123XYZ"
  -- Contains invitation_code in the path
  invitation_link TEXT,

  -- When the invitation was first created/sent
  invited_at TIMESTAMPTZ DEFAULT NOW(),

  -- When athlete accepted the invitation (NULL until accepted)
  -- Used for analytics and relationship history
  accepted_at TIMESTAMPTZ,

  -- When athlete refused the invitation (NULL unless refused)
  -- Used to prevent re-inviting immediately after refusal
  refused_at TIMESTAMPTZ,

  -- When this relationship record was created
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- When this relationship was last updated
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensures one relationship per athlete-coach pair
  -- Prevents duplicate relationships
  UNIQUE(athlete_id, coach_id)
);

-- Index for querying all relationships for a specific athlete
-- Used in: "Show me all my coaches"
CREATE INDEX idx_athlete_coach_athlete ON athlete_coach_relationships(athlete_id);

-- Index for querying all relationships for a specific coach
-- Used in: "Show me all my athletes"
CREATE INDEX idx_athlete_coach_coach ON athlete_coach_relationships(coach_id);

-- Index for filtering by status (common: get pending invitations)
-- Used in: "Show me all pending invitations"
CREATE INDEX idx_athlete_coach_status ON athlete_coach_relationships(status);

-- Index for looking up invitation by code
-- Used when athlete enters invitation code to accept
CREATE INDEX idx_athlete_coach_invitation_code ON athlete_coach_relationships(invitation_code);
```

---

## Subscriptions

### `subscription_plans`

**Purpose**:  
Defines the available subscription tiers that coaches and athletes can purchase. These plans control feature access and capacity limits (e.g., number of athletes a coach can manage).

**Key Relationships**:

- Referenced by `user_subscriptions` to link users to their chosen plan
- Plans are role-specific (coach plans vs athlete plans)

**Business Logic**:

- Admin creates and manages subscription plans
- Plans can be activated/deactivated without deleting them
- `athlete_capacity` limits how many athletes a coach can have (NULL = unlimited)
- Pricing supports both monthly and yearly billing

**Usage Examples**:

- "Coach Starter Plan": monthly_price=29.99, yearly_price=299.99, athlete_capacity=10
- "Coach Pro Plan": monthly_price=99.99, yearly_price=999.99, athlete_capacity=NULL (unlimited)
- Query active plans: `SELECT * WHERE is_active = true AND target_role = 'coach'`

```sql
CREATE TABLE subscription_plans (
  -- Unique identifier for this subscription plan
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Display name of the plan (shown in UI)
  -- Examples: "Coach Starter", "Coach Pro", "Athlete Premium"
  title TEXT NOT NULL,

  -- Which user role this plan targets
  -- 'coach': Plans for coaches (control athlete capacity)
  -- 'athlete': Plans for athletes (future feature, may control program access)
  target_role TEXT NOT NULL CHECK (target_role IN ('coach', 'athlete')),

  -- Monthly billing price in the platform's currency (e.g., EUR, USD)
  -- Format: DECIMAL(10, 2) allows up to 99,999,999.99
  -- Example: 29.99 for €29.99/month
  monthly_price DECIMAL(10, 2) NOT NULL,

  -- Yearly billing price (usually discounted vs monthly)
  -- NULL if yearly billing not available for this plan
  -- Example: 299.99 for €299.99/year (saves ~€60 vs monthly)
  yearly_price DECIMAL(10, 2),

  -- Maximum number of athletes a coach can manage with this plan
  -- NULL means unlimited athletes
  -- Only relevant for coach plans (target_role='coach')
  -- Example: 10 means coach can have max 10 athletes
  athlete_capacity INTEGER,

  -- Flag indicating if this plan has unlimited athlete capacity
  -- TRUE = unlimited (athlete_capacity is ignored)
  -- FALSE = limited by athlete_capacity
  is_unlimited BOOLEAN DEFAULT FALSE,

  -- Whether this plan is currently available for purchase
  -- FALSE = hidden from users, existing subscriptions remain active
  -- Used to deprecate plans without deleting them
  is_active BOOLEAN DEFAULT TRUE,

  -- When this plan was created
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- When this plan was last modified
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for filtering plans by target role
-- Used in: "Show me all coach plans" or "Show me all athlete plans"
CREATE INDEX idx_subscription_plans_target_role ON subscription_plans(target_role);

-- Index for filtering active plans only
-- Used in: "Show available plans for purchase"
CREATE INDEX idx_subscription_plans_active ON subscription_plans(is_active);
```

### `user_subscriptions`

**Purpose**:  
Tracks which users have active subscriptions and links them to Stripe for payment processing. This table is critical for enforcing subscription limits (e.g., athlete capacity).

**Key Relationships**:

- Links `user_id` to `subscription_plan_id`
- Stores Stripe IDs for webhook processing and payment management
- Used to check if user has active subscription before allowing actions

**Business Logic**:

- One user can have multiple subscription records (history), but only one should be 'active' at a time
- Status changes via Stripe webhooks (payment succeeded, failed, cancelled)
- `expires_at` calculated based on `billing_cycle` and `started_at`
- When subscription expires, user loses access to premium features

**Integration Notes**:

- Stripe webhooks update this table when payment events occur
- `stripe_subscription_id` links to Stripe's subscription object
- `stripe_customer_id` links to Stripe's customer object
- Use Stripe Customer Portal for users to manage billing

**Usage Examples**:

- Check coach's athlete capacity: `SELECT athlete_capacity FROM subscription_plans JOIN user_subscriptions ON ... WHERE user_id = ? AND status = 'active'`
- Find expired subscriptions: `SELECT * WHERE status = 'active' AND expires_at < NOW()`
- Update status via webhook: `UPDATE SET status = 'cancelled', cancelled_at = NOW() WHERE stripe_subscription_id = ?`

```sql
CREATE TABLE user_subscriptions (
  -- Unique identifier for this subscription record
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- User who owns this subscription
  -- When user is deleted, their subscriptions are deleted
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Which subscription plan this user has purchased
  -- References subscription_plans table
  subscription_plan_id UUID NOT NULL REFERENCES subscription_plans(id),

  -- Billing frequency for this subscription
  -- 'monthly': User pays every month
  -- 'yearly': User pays once per year (usually discounted)
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')),

  -- Stripe subscription ID (from Stripe API)
  -- Format: "sub_xxxxxxxxxxxxx"
  -- Used to identify subscription in Stripe webhooks and API calls
  -- UNIQUE ensures one database record per Stripe subscription
  stripe_subscription_id TEXT UNIQUE,

  -- Stripe customer ID (from Stripe API)
  -- Format: "cus_xxxxxxxxxxxxx"
  -- Links to Stripe customer object (one customer can have multiple subscriptions)
  stripe_customer_id TEXT,

  -- Current status of the subscription
  -- 'active': Subscription is active, user has access
  -- 'cancelled': User cancelled, access until expires_at
  -- 'expired': Subscription expired, no access
  -- 'past_due': Payment failed, grace period active
  -- Updated via Stripe webhooks
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'past_due')),

  -- When this subscription started
  -- Used to calculate expires_at and billing periods
  started_at TIMESTAMPTZ DEFAULT NOW(),

  -- When this subscription expires (if not renewed)
  -- Calculated: started_at + (billing_cycle duration)
  -- NULL for active subscriptions that auto-renew
  expires_at TIMESTAMPTZ,

  -- When user cancelled this subscription
  -- NULL if subscription is still active
  -- Used for analytics and reactivation offers
  cancelled_at TIMESTAMPTZ,

  -- When this subscription record was created
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- When this subscription record was last updated
  -- Updated by Stripe webhooks when payment events occur
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for querying all subscriptions for a user
-- Used in: "Show my subscription history"
CREATE INDEX idx_user_subscriptions_user ON user_subscriptions(user_id);

-- Index for filtering by status
-- Used in: "Find all active subscriptions" or "Find expired subscriptions"
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(status);

-- Index for Stripe webhook lookups
-- Used when Stripe sends webhook: find subscription by stripe_subscription_id
CREATE INDEX idx_user_subscriptions_stripe ON user_subscriptions(stripe_subscription_id);
```

---

## Sports & Materials

### `sports`

**Purpose**:  
Master catalog of all sports/disciplines available in the platform. Sports are used to categorize exercises, sessions, and identify what athletes practice.

**Key Relationships**:

- Referenced by `exercises` (via `exercise_sports`) - exercises can belong to multiple sports
- Referenced by `sessions` (via `session_sports`) - sessions can target multiple sports
- Referenced by `user_sports` - athletes can practice multiple sports
- Referenced by `records` - records are sport-specific

**Business Logic**:

- Admin-only creation/modification (coaches can only view)
- Supports multi-language (default 'fr' for French)
- `keywords` array enables search functionality (e.g., ["running", "course", "jogging"])
- Soft delete preserves historical data

**Usage Examples**:

- Examples: "Musculation", "Crossfit", "Aviron", "Hyrox", "Cyclisme"
- Filter exercises by sport: `SELECT exercises JOIN exercise_sports WHERE sport_id = ?`
- Show athlete's sports: `SELECT sports JOIN user_sports WHERE user_id = ?`

```sql
CREATE TABLE sports (
  -- Unique identifier for this sport
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Name of the sport (displayed in UI)
  -- Must be unique across all sports
  -- Examples: "Musculation", "Crossfit", "Aviron", "Hyrox"
  name TEXT NOT NULL UNIQUE,

  -- Language code for this sport name
  -- Default 'fr' (French), but can support 'en', 'es', etc.
  -- Allows same sport in multiple languages
  language TEXT DEFAULT 'fr',

  -- Array of search keywords for this sport
  -- Enables flexible search (e.g., ["running", "course", "jogging"])
  -- Used in search/filter functionality
  keywords TEXT[],

  -- Optional description of the sport
  -- Can include rules, characteristics, etc.
  description TEXT,

  -- URL to sport icon/image stored in Supabase Storage
  -- Bucket: 'sport-icons'
  -- Displayed in UI lists and filters
  icon_url TEXT,

  -- When this sport was created
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- When this sport was last updated
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Soft delete timestamp
  -- NULL = active sport, TIMESTAMP = deleted
  -- Preserves historical data in exercises/sessions
  deleted_at TIMESTAMPTZ
);

-- Index for sport name lookups and sorting
CREATE INDEX idx_sports_name ON sports(name);

-- Index for filtering by language
CREATE INDEX idx_sports_language ON sports(language);
```

### `materials`

**Purpose**:  
Catalog of equipment and materials needed for exercises. Helps athletes know what equipment they need before starting an exercise.

**Key Relationships**:

- Referenced by `exercises` (via `exercise_materials`) - exercises can require multiple materials
- Many-to-many relationship: one exercise can need multiple materials, one material can be used by multiple exercises

**Business Logic**:

- Admin-only creation/modification
- Supports multi-language
- Materials are reusable across exercises
- Soft delete preserves historical associations

**Usage Examples**:

- Examples: "Haltères", "Barre de traction", "Kettlebell", "Tapis de sol", "Élastique"
- Filter exercises by material: `SELECT exercises JOIN exercise_materials WHERE material_id = ?`
- Show required materials for exercise: `SELECT materials JOIN exercise_materials WHERE exercise_id = ?`

```sql
CREATE TABLE materials (
  -- Unique identifier for this material
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Name of the material/equipment
  -- Must be unique across all materials
  -- Examples: "Haltères", "Barre de traction", "Kettlebell"
  name TEXT NOT NULL UNIQUE,

  -- Language code for this material name
  -- Default 'fr' (French)
  language TEXT DEFAULT 'fr',

  -- URL to material icon/image stored in Supabase Storage
  -- Bucket: 'material-icons'
  -- Displayed in exercise detail views
  icon_url TEXT,

  -- When this material was created
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- When this material was last updated
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Soft delete timestamp
  -- NULL = active material, TIMESTAMP = deleted
  deleted_at TIMESTAMPTZ
);

-- Index for material name lookups
CREATE INDEX idx_materials_name ON materials(name);
```

### `user_sports`

**Purpose**:  
Junction table linking athletes to the sports they practice. Enables filtering and personalization based on athlete's sports.

**Key Relationships**:

- Links `user_id` (athlete) to `sport_id`
- Many-to-many: athletes can practice multiple sports, sports can have multiple athletes

**Business Logic**:

- Athletes can add/remove sports from their profile
- Used to filter exercises, sessions, and records by sport
- Coaches can see which sports their athletes practice

**Usage Examples**:

- Add sport to athlete: `INSERT INTO user_sports (user_id, sport_id) VALUES (?, ?)`
- Get athlete's sports: `SELECT sports JOIN user_sports WHERE user_id = ?`
- Filter records by athlete's sports: `SELECT records WHERE sport_id IN (SELECT sport_id FROM user_sports WHERE user_id = ?)`

```sql
CREATE TABLE user_sports (
  -- Unique identifier for this association
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Athlete user (must have role='athlete')
  -- When athlete is deleted, their sport associations are deleted
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Sport that this athlete practices
  -- When sport is deleted, associations are deleted
  sport_id UUID NOT NULL REFERENCES sports(id) ON DELETE CASCADE,

  -- When this association was created
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensures one association per athlete-sport pair
  -- Prevents duplicate entries
  UNIQUE(user_id, sport_id)
);

-- Index for querying all sports for an athlete
CREATE INDEX idx_user_sports_user ON user_sports(user_id);

-- Index for querying all athletes for a sport
CREATE INDEX idx_user_sports_sport ON user_sports(sport_id);
```

---

## Exercises & Library

### `muscle_groups`

**Purpose**:  
Taxonomy of muscle groups used to classify exercises. Helps users find exercises targeting specific muscles and understand exercise anatomy.

**Key Relationships**:

- Referenced by `exercise_muscle_groups` - exercises target primary and/or secondary muscle groups
- Many-to-many: exercises can target multiple muscles, muscles can be targeted by multiple exercises

**Business Logic**:

- Admin-only creation (static taxonomy)
- Used for filtering and search ("show me chest exercises")
- Supports multi-language

**Usage Examples**:

- Examples: "Pectoraux", "Quadriceps", "Deltoïdes", "Biceps", "Triceps"
- Filter exercises by muscle: `SELECT exercises JOIN exercise_muscle_groups WHERE muscle_group_id = ? AND type = 'primary'`
- Show targeted muscles for exercise: `SELECT muscle_groups JOIN exercise_muscle_groups WHERE exercise_id = ? ORDER BY type, name`

```sql
CREATE TABLE muscle_groups (
  -- Unique identifier for this muscle group
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Name of the muscle group
  -- Must be unique
  -- Examples: "Pectoraux", "Quadriceps", "Deltoïdes"
  name TEXT NOT NULL UNIQUE,

  -- Language code for this muscle group name
  language TEXT DEFAULT 'fr',

  -- When this muscle group was created
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_muscle_groups_name ON muscle_groups(name);
```

### `themes`

**Purpose**:  
Thematic categories for organizing exercises and sessions (e.g., "Endurance", "Force", "Mobilité", "Récupération"). Provides another dimension for filtering and organization.

**Key Relationships**:

- Referenced by `exercises` (via `exercise_themes`) - exercises can have multiple themes
- Referenced by `sessions` (via `session_themes`) - sessions can target multiple themes

**Business Logic**:

- Admin-only creation
- Themes are reusable across exercises and sessions
- Supports multi-language

**Usage Examples**:

- Examples: "Endurance", "Force", "Mobilité", "Récupération", "Cardio", "Renforcement"
- Filter exercises by theme: `SELECT exercises JOIN exercise_themes WHERE theme_id = ?`
- Filter sessions by theme: `SELECT sessions JOIN session_themes WHERE theme_id = ?`

```sql
CREATE TABLE themes (
  -- Unique identifier for this theme
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Name of the theme
  -- Must be unique
  -- Examples: "Endurance", "Force", "Mobilité"
  name TEXT NOT NULL UNIQUE,

  -- Language code for this theme name
  language TEXT DEFAULT 'fr',

  -- When this theme was created
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_themes_name ON themes(name);
```

### `exercises`

**Purpose**:  
Core exercise library containing all exercises available in the platform. Each exercise includes video, description, and metadata for coaches and athletes to use in training sessions.

**Key Relationships**:

- Created by admin (`created_by`)
- Has multiple instructions (`exercise_instructions`)
- Can belong to multiple sports (`exercise_sports`)
- Can require multiple materials (`exercise_materials`)
- Can target multiple muscle groups (`exercise_muscle_groups`)
- Can have multiple themes (`exercise_themes`)
- Can be favorited by users (`exercise_favorites`)
- Can be linked to sessions (`session_exercises`)
- Can have records (`records`)

**Business Logic**:

- Admin-only creation/modification (coaches can view and favorite)
- Video is REQUIRED (not optional) - every exercise must have a demonstration video
- Soft delete preserves historical associations
- Supports multi-language

**Usage Examples**:

- Examples: "Développé couché", "Squat", "Burpee", "Planche"
- Create exercise: Admin uploads video, adds name, description, selects sports/materials/muscles
- Search exercises: `SELECT * WHERE name ILIKE '%squat%' OR description ILIKE '%squat%'`
- Filter by sport: `SELECT exercises JOIN exercise_sports WHERE sport_id = ?`

```sql
CREATE TABLE exercises (
  -- Unique identifier for this exercise
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Name of the exercise (displayed in UI)
  -- Examples: "Développé couché", "Squat", "Burpee"
  name TEXT NOT NULL,

  -- Language code for this exercise name/description
  language TEXT DEFAULT 'fr',

  -- Textual description of the exercise
  -- Can include objectives, benefits, form cues, etc.
  description TEXT,

  -- URL to exercise video stored in Supabase Storage
  -- Bucket: 'exercise-videos'
  -- REQUIRED: Every exercise must have a video demonstration
  -- Format: MP4, WebM, or other video formats
  video_url TEXT NOT NULL,

  -- URL to exercise thumbnail/preview image
  -- Bucket: 'exercise-thumbnails'
  -- Used in exercise lists and cards
  -- Optional but recommended for better UX
  thumbnail_url TEXT,

  -- Admin user who created this exercise
  -- Tracks who added exercises to the library
  created_by UUID REFERENCES users(id),

  -- When this exercise was created
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- When this exercise was last updated
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Soft delete timestamp
  -- NULL = active exercise, TIMESTAMP = deleted
  -- Preserves historical data in sessions and records
  deleted_at TIMESTAMPTZ
);

-- Index for exercise name searches
CREATE INDEX idx_exercises_name ON exercises(name);

-- Index for filtering by language
CREATE INDEX idx_exercises_language ON exercises(language);

-- Index for tracking who created exercises
CREATE INDEX idx_exercises_created_by ON exercises(created_by);
```

### `exercise_instructions`

**Purpose**:  
Step-by-step instructions for performing an exercise. Provides detailed guidance beyond the video, broken into numbered steps.

**Key Relationships**:

- Belongs to one exercise (`exercise_id`)
- Ordered by `step_number` for sequential display

**Business Logic**:

- Instructions are ordered sequentially (step_number 1, 2, 3, ...)
- Each exercise can have multiple instruction steps
- Steps are displayed in order in the UI
- UNIQUE constraint ensures no duplicate step numbers per exercise

**Usage Examples**:

- Exercise "Squat" might have steps:
  - Step 1: "Stand with feet shoulder-width apart"
  - Step 2: "Lower your body by bending knees..."
  - Step 3: "Push through heels to return to start"
- Query ordered steps: `SELECT * WHERE exercise_id = ? ORDER BY step_number`

```sql
CREATE TABLE exercise_instructions (
  -- Unique identifier for this instruction step
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Exercise this instruction belongs to
  -- When exercise is deleted, all instructions are deleted
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,

  -- Step number (1, 2, 3, ...) for ordering
  -- Must be unique per exercise
  step_number INTEGER NOT NULL,

  -- Text content of this instruction step
  -- Can include form cues, safety tips, etc.
  instruction_text TEXT NOT NULL,

  -- When this instruction was created
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensures sequential step numbers per exercise
  -- Prevents duplicate step numbers (e.g., two "step 1"s)
  UNIQUE(exercise_id, step_number)
);

-- Index for querying all instructions for an exercise
CREATE INDEX idx_exercise_instructions_exercise ON exercise_instructions(exercise_id);
```

### `exercise_sports`

**Purpose**:  
Junction table linking exercises to sports. Enables filtering exercises by sport (e.g., "show me all Musculation exercises").

**Key Relationships**:

- Links `exercise_id` to `sport_id`
- Many-to-many: exercises can belong to multiple sports, sports can have multiple exercises

**Business Logic**:

- One exercise can be associated with multiple sports
- Used for filtering: "Show exercises for Musculation"
- UNIQUE constraint prevents duplicate associations

**Usage Examples**:

- Exercise "Squat" might belong to: "Musculation", "Crossfit"
- Filter exercises by sport: `SELECT exercises JOIN exercise_sports WHERE sport_id = ?`
- Get all sports for an exercise: `SELECT sports JOIN exercise_sports WHERE exercise_id = ?`

```sql
CREATE TABLE exercise_sports (
  -- Unique identifier for this association
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Exercise that belongs to this sport
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,

  -- Sport this exercise belongs to
  sport_id UUID NOT NULL REFERENCES sports(id) ON DELETE CASCADE,

  -- When this association was created
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevents duplicate exercise-sport associations
  UNIQUE(exercise_id, sport_id)
);

-- Index for querying all exercises for a sport
CREATE INDEX idx_exercise_sports_exercise ON exercise_sports(exercise_id);

-- Index for querying all sports for an exercise
CREATE INDEX idx_exercise_sports_sport ON exercise_sports(sport_id);
```

### `exercise_materials`

**Purpose**:  
Junction table linking exercises to required materials/equipment. Helps athletes know what equipment they need.

**Key Relationships**:

- Links `exercise_id` to `material_id`
- Many-to-many: exercises can require multiple materials, materials can be used by multiple exercises

**Business Logic**:

- Shows required equipment for each exercise
- Used in exercise detail view: "Required: Haltères, Banc"
- UNIQUE constraint prevents duplicate associations

**Usage Examples**:

- Exercise "Développé couché" requires: "Haltères", "Banc"
- Filter exercises by material: `SELECT exercises JOIN exercise_materials WHERE material_id = ?`
- Get required materials: `SELECT materials JOIN exercise_materials WHERE exercise_id = ?`

```sql
CREATE TABLE exercise_materials (
  -- Unique identifier for this association
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Exercise that requires this material
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,

  -- Material/equipment required for this exercise
  material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,

  -- When this association was created
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevents duplicate exercise-material associations
  UNIQUE(exercise_id, material_id)
);

CREATE INDEX idx_exercise_materials_exercise ON exercise_materials(exercise_id);
CREATE INDEX idx_exercise_materials_material ON exercise_materials(material_id);
```

### `exercise_muscle_groups`

**Purpose**:  
Junction table linking exercises to muscle groups they target, with distinction between primary and secondary muscles.

**Key Relationships**:

- Links `exercise_id` to `muscle_group_id`
- Includes `type` to distinguish primary vs secondary muscles
- Many-to-many: exercises can target multiple muscles, muscles can be targeted by multiple exercises

**Business Logic**:

- `type='primary'`: Main muscle group worked (e.g., Squat → Quadriceps)
- `type='secondary'`: Secondary muscle groups involved (e.g., Squat → Glutes, Core)
- Used for filtering: "Show me chest exercises"
- UNIQUE constraint includes type to allow same muscle as both primary and secondary (rare but possible)

**Usage Examples**:

- Exercise "Développé couché":
  - Primary: "Pectoraux"
  - Secondary: "Deltoïdes", "Triceps"
- Filter by primary muscles: `SELECT exercises JOIN exercise_muscle_groups WHERE muscle_group_id = ? AND type = 'primary'`
- Show all targeted muscles: `SELECT muscle_groups JOIN exercise_muscle_groups WHERE exercise_id = ? ORDER BY type`

```sql
CREATE TABLE exercise_muscle_groups (
  -- Unique identifier for this association
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Exercise that targets this muscle group
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,

  -- Muscle group targeted by this exercise
  muscle_group_id UUID NOT NULL REFERENCES muscle_groups(id) ON DELETE CASCADE,

  -- Whether this is a primary or secondary muscle group
  -- 'primary': Main muscle group worked
  -- 'secondary': Supporting muscle groups involved
  type TEXT NOT NULL CHECK (type IN ('primary', 'secondary')),

  -- When this association was created
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevents duplicate exercise-muscle-type combinations
  -- Allows same muscle as both primary and secondary (rare)
  UNIQUE(exercise_id, muscle_group_id, type)
);

CREATE INDEX idx_exercise_muscle_groups_exercise ON exercise_muscle_groups(exercise_id);
CREATE INDEX idx_exercise_muscle_groups_muscle ON exercise_muscle_groups(muscle_group_id);
```

### `exercise_themes`

**Purpose**:  
Junction table linking exercises to thematic categories. Provides another filtering dimension beyond sports.

**Key Relationships**:

- Links `exercise_id` to `theme_id`
- Many-to-many: exercises can have multiple themes, themes can apply to multiple exercises

**Business Logic**:

- Used for filtering: "Show me endurance exercises"
- Themes complement sports (e.g., exercise can be "Musculation" sport + "Force" theme)
- UNIQUE constraint prevents duplicate associations

**Usage Examples**:

- Exercise "Squat" might have themes: "Force", "Renforcement"
- Filter by theme: `SELECT exercises JOIN exercise_themes WHERE theme_id = ?`
- Get exercise themes: `SELECT themes JOIN exercise_themes WHERE exercise_id = ?`

```sql
CREATE TABLE exercise_themes (
  -- Unique identifier for this association
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Exercise that has this theme
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,

  -- Theme category for this exercise
  theme_id UUID NOT NULL REFERENCES themes(id) ON DELETE CASCADE,

  -- When this association was created
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevents duplicate exercise-theme associations
  UNIQUE(exercise_id, theme_id)
);

CREATE INDEX idx_exercise_themes_exercise ON exercise_themes(exercise_id);
CREATE INDEX idx_exercise_themes_theme ON exercise_themes(theme_id);
```

### `exercise_favorites`

**Purpose**:  
Tracks which exercises users have marked as favorites. Enables quick access to frequently used exercises.

**Key Relationships**:

- Links `user_id` to `exercise_id`
- Many-to-many: users can favorite multiple exercises, exercises can be favorited by multiple users

**Business Logic**:

- Coaches and athletes can favorite exercises
- Used in UI: "My Favorites" filter
- UNIQUE constraint prevents duplicate favorites

**Usage Examples**:

- Coach favorites: "Développé couché", "Squat", "Planche"
- Toggle favorite: `INSERT` to add, `DELETE` to remove
- Get user favorites: `SELECT exercises JOIN exercise_favorites WHERE user_id = ?`

```sql
CREATE TABLE exercise_favorites (
  -- Unique identifier for this favorite
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- User who favorited this exercise
  -- Can be coach or athlete
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Exercise that was favorited
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,

  -- When this exercise was favorited
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevents duplicate favorites (user can't favorite same exercise twice)
  UNIQUE(user_id, exercise_id)
);

-- Index for querying all favorites for a user
CREATE INDEX idx_exercise_favorites_user ON exercise_favorites(user_id);

-- Index for querying all users who favorited an exercise (analytics)
CREATE INDEX idx_exercise_favorites_exercise ON exercise_favorites(exercise_id);
```

---

## Training & Sessions

### `sessions`

**Purpose**:  
Core table storing training sessions created by coaches for athletes. Sessions contain the workout plan, completion data, and athlete feedback. This is one of the most important tables in the system.

**Key Relationships**:

- Belongs to one athlete (`athlete_id`) and one coach (`coach_id`)
- Has multiple training blocks (`training_blocks`) - structured workout content
- Can have multiple sports (`session_sports`) - multi-sport sessions
- Can have multiple themes (`session_themes`) - categorized sessions
- Can have linked exercises (`session_exercises`) - exercise references
- Can have athlete notes (`session_notes`) - post-session notes
- Can have timers (`timers`) - session timers

**Business Logic**:

- Status workflow: 'draft' → 'published' → 'completed' or 'cancelled'
- Coaches create sessions in 'draft', then 'publish' to make visible to athletes
- Athletes complete sessions and provide RPE (Rate of Perceived Exertion) feedback
- `duration_minutes` = planned duration, `actual_duration_minutes` = actual time taken
- RPE values: 0-10 scale for physical, cognitive, and general effort
- Only coaches with 'accepted' relationship can create sessions (enforced by RLS)

**Status Flow**:

1. Coach creates session → status='draft' (not visible to athlete)
2. Coach publishes → status='published', `published_at` set (visible to athlete)
3. Athlete completes → status='completed', `completed_at` set, RPE values filled
4. Coach/athlete cancels → status='cancelled'

**Usage Examples**:

- Create session: Coach creates draft session with date, title, blocks
- Publish week: `UPDATE sessions SET status='published', published_at=NOW() WHERE session_date BETWEEN ? AND ?`
- Complete session: `UPDATE sessions SET status='completed', completed_at=NOW(), actual_duration_minutes=?, physical_rpe=?, general_rpe=? WHERE id=?`
- Get athlete's upcoming sessions: `SELECT * WHERE athlete_id=? AND session_date >= CURRENT_DATE AND status IN ('published', 'completed') ORDER BY session_date`

```sql
CREATE TABLE sessions (
  -- Unique identifier for this session
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Athlete this session is assigned to
  -- Must have role='athlete'
  -- When athlete is deleted, all their sessions are deleted
  athlete_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Coach who created this session
  -- Must have role='coach'
  -- When coach is deleted, all their sessions are deleted
  coach_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Optional session title/name
  -- Examples: "Entraînement Force", "Cardio Intensif", "Récupération Active"
  -- If NULL, system may generate default title from sports/themes
  title TEXT,

  -- Date when this session is scheduled
  -- Format: YYYY-MM-DD
  -- Used for calendar views and filtering
  session_date DATE NOT NULL,

  -- Planned duration in minutes
  -- Set by coach when creating session
  -- Example: 60 = 1 hour planned session
  duration_minutes INTEGER,

  -- Actual duration in minutes (filled after completion)
  -- Set by athlete when completing session
  -- Can differ from planned duration
  actual_duration_minutes INTEGER,

  -- Current status of the session
  -- 'draft': Created but not published, not visible to athlete
  -- 'published': Published and visible to athlete, ready to perform
  -- 'completed': Athlete completed the session, feedback provided
  -- 'cancelled': Session was cancelled, not performed
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'completed', 'cancelled')),

  -- Overall session rating (0-10 scale)
  -- Set by athlete after completion
  -- Example: 8.5 = athlete rated session 8.5/10
  overall_rating DECIMAL(3, 1),

  -- Physical RPE (Rate of Perceived Exertion) - 0-10 scale
  -- How physically demanding the session felt
  -- 0 = no effort, 10 = maximal effort
  -- Set by athlete during completion flow
  physical_rpe INTEGER CHECK (physical_rpe >= 0 AND physical_rpe <= 10),

  -- Cognitive RPE - 0-10 scale
  -- How mentally demanding the session felt
  -- Used for sessions requiring focus/concentration
  cognitive_rpe INTEGER CHECK (cognitive_rpe >= 0 AND cognitive_rpe <= 10),

  -- General RPE - 0-10 scale
  -- Overall perceived effort rating
  -- Alternative to physical_rpe for simpler rating
  general_rpe INTEGER CHECK (general_rpe >= 0 AND general_rpe <= 10),

  -- Written feedback from athlete about the session
  -- Free-form text describing how session felt, what went well, etc.
  -- Example: "Session difficile mais efficace, j'ai bien progressé"
  athlete_feedback TEXT,

  -- When coach published this session
  -- NULL until session is published
  -- Used for analytics and tracking publication timing
  published_at TIMESTAMPTZ,

  -- When athlete completed this session
  -- NULL until session is completed
  -- Used for completion tracking and analytics
  completed_at TIMESTAMPTZ,

  -- When this session was created
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- When this session was last updated
  -- Updated when status changes, RPE added, etc.
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for querying all sessions for an athlete
-- Used in: "Show my sessions"
CREATE INDEX idx_sessions_athlete ON sessions(athlete_id);

-- Index for querying all sessions created by a coach
-- Used in: "Show sessions I created"
CREATE INDEX idx_sessions_coach ON sessions(coach_id);

-- Index for filtering sessions by date
-- Used in: "Show sessions for this week/month"
CREATE INDEX idx_sessions_date ON sessions(session_date);

-- Index for filtering by status
-- Used in: "Show published sessions" or "Show completed sessions"
CREATE INDEX idx_sessions_status ON sessions(status);

-- Composite index for common query pattern
-- Used in: "Show athlete's sessions for a date range"
CREATE INDEX idx_sessions_athlete_date ON sessions(athlete_id, session_date);
```

### `session_sports`

Many-to-many relationship between sessions and sports.

```sql
CREATE TABLE session_sports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  sport_id UUID NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, sport_id)
);

CREATE INDEX idx_session_sports_session ON session_sports(session_id);
CREATE INDEX idx_session_sports_sport ON session_sports(sport_id);
```

### `session_themes`

Many-to-many relationship between sessions and themes.

```sql
CREATE TABLE session_themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  theme_id UUID NOT NULL REFERENCES themes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, theme_id)
);

CREATE INDEX idx_session_themes_session ON session_themes(session_id);
CREATE INDEX idx_session_themes_theme ON session_themes(theme_id);
```

### `session_exercises`

Exercises linked to sessions.

```sql
CREATE TABLE session_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, exercise_id, order_index)
);

CREATE INDEX idx_session_exercises_session ON session_exercises(session_id);
CREATE INDEX idx_session_exercises_exercise ON session_exercises(exercise_id);
```

### `training_blocks`

Training blocks within sessions.

```sql
CREATE TABLE training_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT, -- rich text content/instructions
  intensity_reference TEXT, -- e.g., VMA, FTP
  intensity_zone TEXT, -- Z1-Z5
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_training_blocks_session ON training_blocks(session_id);
CREATE INDEX idx_training_blocks_order ON training_blocks(session_id, order_index);
```

### `training_block_models`

Reusable training block templates created by coaches.

```sql
CREATE TABLE training_block_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT, -- rich text content
  intensity_reference TEXT,
  intensity_zone TEXT,
  training_objective TEXT, -- e.g., endurance, strength, mobility
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_training_block_models_coach ON training_block_models(coach_id);
```

### `training_block_model_exercises`

Exercises associated with training block models.

```sql
CREATE TABLE training_block_model_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  training_block_model_id UUID NOT NULL REFERENCES training_block_models(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(training_block_model_id, exercise_id, order_index)
);

CREATE INDEX idx_training_block_model_exercises_block ON training_block_model_exercises(training_block_model_id);
CREATE INDEX idx_training_block_model_exercises_exercise ON training_block_model_exercises(exercise_id);
```

### `training_cycle_models`

Reusable training cycle templates.

```sql
CREATE TABLE training_cycle_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  duration_weeks INTEGER NOT NULL,
  sessions_per_week INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_training_cycle_models_coach ON training_cycle_models(coach_id);
```

### `planning_notes`

Planning notes that span multiple dates.

```sql
CREATE TABLE planning_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  coach_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  CHECK (end_date >= start_date)
);

CREATE INDEX idx_planning_notes_athlete ON planning_notes(athlete_id);
CREATE INDEX idx_planning_notes_coach ON planning_notes(coach_id);
CREATE INDEX idx_planning_notes_dates ON planning_notes(start_date, end_date);
```

### `session_notes`

Athlete notes on completed sessions.

```sql
CREATE TABLE session_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  athlete_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  note_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_session_notes_session ON session_notes(session_id);
CREATE INDEX idx_session_notes_athlete ON session_notes(athlete_id);
```

### `coach_notes`

Private notes coaches write about athletes.

```sql
CREATE TABLE coach_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  athlete_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_coach_notes_coach ON coach_notes(coach_id);
CREATE INDEX idx_coach_notes_athlete ON coach_notes(athlete_id);
CREATE INDEX idx_coach_notes_created ON coach_notes(created_at DESC);
```

---

## Athlete Data

### `records`

**Purpose**:  
Stores athlete performance records (Personal Records/PRs) for exercises. Tracks progress over time with both weight-based (kg) and time-based records.

**Key Relationships**:

- Belongs to one athlete (`athlete_id`)
- References one exercise (`exercise_id`) - the exercise performed
- References one sport (`sport_id`) - sport context for the record
- Many records per athlete-exercise combination (historical tracking)

**Business Logic**:

- Records are sport-specific (same exercise can have different records per sport)
- Weight-based records: use `value_numeric` (e.g., 100.5 kg for bench press)
- Time-based records: use `value_time` (e.g., 00:15:30 for a 15m30s run)
- Only one field should be populated per record (not both)
- `record_date` allows tracking when PR was achieved (can be historical)
- Soft delete allows athletes to remove incorrect entries

**Usage Examples**:

- Add weight record: "Développé couché", 100 kg, 2024-01-15
- Add time record: "5km run", 00:20:15, 2024-02-01
- Get athlete's records by sport: `SELECT * WHERE athlete_id=? AND sport_id=? ORDER BY record_date DESC`
- Get exercise history: `SELECT * WHERE athlete_id=? AND exercise_id=? ORDER BY record_date DESC`
- Find latest PR: `SELECT * WHERE athlete_id=? AND exercise_id=? ORDER BY record_date DESC LIMIT 1`

```sql
CREATE TABLE records (
  -- Unique identifier for this record
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Athlete who achieved this record
  -- When athlete is deleted, all their records are deleted
  athlete_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Exercise this record is for
  -- Examples: "Développé couché", "Squat", "5km run"
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,

  -- Sport context for this record
  -- Same exercise can have different records per sport
  -- Example: "Squat" in "Musculation" vs "Crossfit"
  sport_id UUID NOT NULL REFERENCES sports(id) ON DELETE CASCADE,

  -- Numeric value for weight-based records
  -- Used for strength exercises (kg or lbs)
  -- Example: 100.50 = 100.5 kg bench press
  -- NULL for time-based records
  value_numeric DECIMAL(10, 2),

  -- Time value for time-based records
  -- Used for endurance exercises (running, cycling, etc.)
  -- Format: PostgreSQL INTERVAL (e.g., '00:15:30' = 15 minutes 30 seconds)
  -- NULL for weight-based records
  value_time INTERVAL,

  -- Date when this record was achieved
  -- Can be historical (athlete can add past records)
  -- Format: YYYY-MM-DD
  record_date DATE NOT NULL,

  -- When this record was created in the system
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- When this record was last updated
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Soft delete timestamp
  -- NULL = active record, TIMESTAMP = deleted
  -- Allows athletes to remove incorrect entries
  deleted_at TIMESTAMPTZ
);

-- Index for querying all records for an athlete
CREATE INDEX idx_records_athlete ON records(athlete_id);

-- Index for querying records by exercise
CREATE INDEX idx_records_exercise ON records(exercise_id);

-- Index for filtering by sport
CREATE INDEX idx_records_sport ON records(sport_id);

-- Index for chronological ordering (newest first)
CREATE INDEX idx_records_date ON records(record_date DESC);

-- Composite index for exercise history queries
-- Used in: "Show my history for this exercise"
CREATE INDEX idx_records_athlete_exercise ON records(athlete_id, exercise_id);
```

### `injuries`

Athlete injury tracking.

```sql
CREATE TABLE injuries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body_area TEXT NOT NULL, -- e.g., "shoulder", "knee", "lower_back"
  injury_name TEXT NOT NULL,
  description TEXT,
  injury_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'treated')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_injuries_athlete ON injuries(athlete_id);
CREATE INDEX idx_injuries_status ON injuries(status);
CREATE INDEX idx_injuries_date ON injuries(injury_date DESC);
```

### `physiological_data`

Athlete physiological reference data (FC Max, VMA, FTP, etc.).

```sql
CREATE TABLE physiological_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL CHECK (metric_type IN ('fc_max', 'vma', 'vitesse_brute', 'pma', 'ftp', 'weight')),
  value DECIMAL(10, 2) NOT NULL,
  unit TEXT NOT NULL, -- 'bpm', 'km/h', 'W', 'kg'
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(athlete_id, metric_type)
);

CREATE INDEX idx_physiological_data_athlete ON physiological_data(athlete_id);
CREATE INDEX idx_physiological_data_type ON physiological_data(metric_type);
```

### `wellness_entries`

**Purpose**:  
Tracks daily wellness metrics for athletes. Coaches use this data to understand athlete readiness, recovery, and overall form. Supports training periodization and injury prevention.

**Key Relationships**:

- Belongs to one athlete (`athlete_id`)
- One entry per athlete per day (UNIQUE constraint)
- Used in athlete dashboard charts and analytics

**Business Logic**:

- Athletes log daily wellness scores (0-10 scale)
- All scores are optional - athletes can log partial data
- `overall_form_score` can be calculated (average) or manually set
- UNIQUE constraint ensures one entry per day per athlete
- Used for trend analysis and correlation with performance

**Wellness Categories**:

- **Sleep**: Quality and duration of sleep (0=poor, 10=excellent)
- **Energy**: Energy levels throughout the day
- **Nutrition**: Quality of nutrition/hydration
- **Hydration**: Hydration levels
- **Pain**: Pain/discomfort levels (0=none, 10=severe)
- **Stress**: Stress/anxiety levels

**Usage Examples**:

- Log today's wellness: `INSERT INTO wellness_entries (athlete_id, entry_date, sleep_score, energy_score, ...) VALUES (?, CURRENT_DATE, 8, 7, ...)`
- Get wellness history: `SELECT * WHERE athlete_id=? ORDER BY entry_date DESC LIMIT 30`
- Calculate average form: `SELECT AVG(overall_form_score) WHERE athlete_id=? AND entry_date >= ?`
- Show wellness chart: `SELECT entry_date, sleep_score, energy_score, overall_form_score WHERE athlete_id=? AND entry_date BETWEEN ? AND ? ORDER BY entry_date`

```sql
CREATE TABLE wellness_entries (
  -- Unique identifier for this wellness entry
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Athlete who logged this wellness data
  -- When athlete is deleted, all their wellness entries are deleted
  athlete_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Date this wellness entry is for
  -- Format: YYYY-MM-DD
  -- UNIQUE per athlete ensures one entry per day
  entry_date DATE NOT NULL,

  -- Sleep quality score (0-10)
  -- 0 = very poor sleep, 10 = excellent sleep
  -- NULL if not logged
  sleep_score INTEGER CHECK (sleep_score >= 0 AND sleep_score <= 10),

  -- Energy level score (0-10)
  -- 0 = very low energy, 10 = very high energy
  -- NULL if not logged
  energy_score INTEGER CHECK (energy_score >= 0 AND energy_score <= 10),

  -- Nutrition quality score (0-10)
  -- 0 = poor nutrition, 10 = excellent nutrition
  -- NULL if not logged
  nutrition_score INTEGER CHECK (nutrition_score >= 0 AND nutrition_score <= 10),

  -- Hydration level score (0-10)
  -- 0 = very dehydrated, 10 = well hydrated
  -- NULL if not logged
  hydration_score INTEGER CHECK (hydration_score >= 0 AND hydration_score <= 10),

  -- Pain/discomfort level (0-10)
  -- 0 = no pain, 10 = severe pain
  -- Used for injury tracking and recovery monitoring
  -- NULL if not logged
  pain_score INTEGER CHECK (pain_score >= 0 AND pain_score <= 10),

  -- Stress/anxiety level (0-10)
  -- 0 = no stress, 10 = very high stress
  -- NULL if not logged
  stress_score INTEGER CHECK (stress_score >= 0 AND stress_score <= 10),

  -- Overall form/readiness score (0-10)
  -- Can be calculated as average of other scores or manually set
  -- Used in dashboard "Form" indicators
  -- Example: 8.5 = athlete feels 8.5/10 ready
  overall_form_score DECIMAL(3, 1),

  -- When this entry was created
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- When this entry was last updated
  -- Updated when athlete modifies their wellness data
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensures one wellness entry per athlete per day
  -- Prevents duplicate entries, allows upsert operations
  UNIQUE(athlete_id, entry_date)
);

-- Index for querying all wellness entries for an athlete
CREATE INDEX idx_wellness_entries_athlete ON wellness_entries(athlete_id);

-- Index for chronological ordering
CREATE INDEX idx_wellness_entries_date ON wellness_entries(entry_date DESC);

-- Composite index for athlete date range queries
-- Used in: "Show wellness chart for last 30 days"
CREATE INDEX idx_wellness_entries_athlete_date ON wellness_entries(athlete_id, entry_date DESC);
```

---

## Messaging

### `conversations`

Message conversations between coaches and athletes.

```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  athlete_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(coach_id, athlete_id)
);

CREATE INDEX idx_conversations_coach ON conversations(coach_id);
CREATE INDEX idx_conversations_athlete ON conversations(athlete_id);
CREATE INDEX idx_conversations_last_message ON conversations(last_message_at DESC);
```

### `messages`

Individual messages within conversations.

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
CREATE INDEX idx_messages_unread ON messages(conversation_id, is_read) WHERE is_read = FALSE;
```

---

## Notifications

### `notifications`

System notifications for users.

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('urgent', 'important', 'neutral', 'athlete_invitation', 'session_published', 'message_received')),
  title TEXT NOT NULL,
  message TEXT,
  related_entity_type TEXT, -- 'session', 'message', 'athlete', etc.
  related_entity_id UUID,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);
CREATE INDEX idx_notifications_type ON notifications(type);
```

---

## Admin Features

### `programmations`

Admin-created programmations (subscription-based training programs).

```sql
CREATE TABLE programmations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  target_level TEXT CHECK (target_level IN ('beginner', 'intermediate', 'confirmed', 'all')),
  monthly_price DECIMAL(10, 2) NOT NULL,
  cover_image_url TEXT,
  subscriber_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_consulted_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_programmations_target_level ON programmations(target_level);
CREATE INDEX idx_programmations_created ON programmations(created_at DESC);
```

### `programmes`

Admin-created programmes (individual training programs).

```sql
CREATE TABLE programmes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  target_level TEXT CHECK (target_level IN ('beginner', 'intermediate', 'confirmed', 'all')),
  price DECIMAL(10, 2) NOT NULL,
  cover_image_url TEXT,
  subscriber_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_programmes_target_level ON programmes(target_level);
CREATE INDEX idx_programmes_created ON programmes(created_at DESC);
```

---

## Timers

### `timers`

Timer functionality for sessions.

```sql
CREATE TABLE timers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  timer_type TEXT NOT NULL CHECK (timer_type IN ('work', 'rest', 'interval', 'custom')),
  duration_seconds INTEGER NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_timers_athlete ON timers(athlete_id);
CREATE INDEX idx_timers_session ON timers(session_id);
```

---

## Row Level Security (RLS) Policies

**What is RLS?**  
Row Level Security (RLS) is a PostgreSQL feature that Supabase uses to enforce data access control at the database level. Instead of relying solely on application-level permissions, RLS policies ensure that users can only access data they're authorized to see, even if they bypass your application code.

**How it Works**:

- `auth.uid()` returns the UUID of the currently authenticated user
- Policies use `USING` clauses to filter rows users can SELECT/UPDATE/DELETE
- Policies use `WITH CHECK` clauses to validate data on INSERT/UPDATE
- If no policy allows access, the operation is denied

**Important Notes**:

- **Always enable RLS** on tables containing sensitive data
- Policies are additive - if ANY policy allows access, user can access
- Test policies thoroughly - incorrect policies can lock users out or expose data
- Use service role key for admin operations that bypass RLS

### Users

**Purpose**:  
Ensure users can only view and update their own profile data.

**Policy Explanation**:

- `SELECT` policy: Users can only see rows where `id` matches their authenticated user ID
- `UPDATE` policy: Users can only update their own profile
- No `INSERT` policy needed - handled by Supabase Auth triggers
- No `DELETE` policy - use soft delete (`deleted_at`) instead

```sql
-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
-- auth.uid() returns the authenticated user's UUID
-- Only returns rows where id matches the authenticated user
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
-- Only allows updates to rows where id matches authenticated user
-- Prevents users from modifying other users' profiles
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Note: Consider adding policies for coaches/admins to view athlete profiles
-- Example: Coaches can view their athletes' profiles
-- CREATE POLICY "Coaches can view athlete profiles"
--   ON users FOR SELECT
--   USING (
--     auth.uid() = id OR
--     (role = 'athlete' AND EXISTS (
--       SELECT 1 FROM athlete_coach_relationships
--       WHERE athlete_id = users.id
--       AND coach_id = auth.uid()
--       AND status = 'accepted'
--     ))
--   );
```

### Athlete-Coach Relationships

```sql
ALTER TABLE athlete_coach_relationships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Athletes can view their coach relationships"
  ON athlete_coach_relationships FOR SELECT
  USING (auth.uid() = athlete_id);

CREATE POLICY "Coaches can view their athlete relationships"
  ON athlete_coach_relationships FOR SELECT
  USING (auth.uid() = coach_id);

CREATE POLICY "Coaches can create athlete relationships"
  ON athlete_coach_relationships FOR INSERT
  WITH CHECK (auth.uid() = coach_id);
```

### Sessions

**Purpose**:  
Control access to training sessions so athletes only see their own sessions and coaches only see sessions for their athletes.

**Policy Explanation**:

- **SELECT for athletes**: Athletes can view sessions where they are the `athlete_id`
- **SELECT for coaches**: Coaches can view sessions where they are the `coach_id`
- **INSERT for coaches**: Coaches can create sessions, but only for athletes they have an 'accepted' relationship with
- The `WITH CHECK` clause validates the relationship before allowing INSERT

**Security Note**:  
The INSERT policy prevents coaches from creating sessions for athletes they're not connected to, even if they somehow bypass the application UI.

```sql
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Athletes can view their own sessions
-- Returns sessions where athlete_id matches authenticated user
-- Allows athletes to see all their sessions (draft, published, completed)
CREATE POLICY "Athletes can view their sessions"
  ON sessions FOR SELECT
  USING (auth.uid() = athlete_id);

-- Policy: Coaches can view sessions they created
-- Returns sessions where coach_id matches authenticated user
-- Allows coaches to see all sessions for their athletes
CREATE POLICY "Coaches can view their athletes' sessions"
  ON sessions FOR SELECT
  USING (auth.uid() = coach_id);

-- Policy: Coaches can create sessions for their athletes
-- WITH CHECK validates data BEFORE insert
-- Ensures: 1) Coach is creating the session, 2) Relationship exists and is accepted
-- Prevents coaches from creating sessions for athletes they're not connected to
CREATE POLICY "Coaches can create sessions for their athletes"
  ON sessions FOR INSERT
  WITH CHECK (
    auth.uid() = coach_id AND
    EXISTS (
      SELECT 1 FROM athlete_coach_relationships
      WHERE athlete_id = sessions.athlete_id
      AND coach_id = sessions.coach_id
      AND status = 'accepted'
    )
  );

-- Additional policies you may want to add:
-- Policy: Coaches can update their sessions (before completion)
-- CREATE POLICY "Coaches can update their sessions"
--   ON sessions FOR UPDATE
--   USING (auth.uid() = coach_id AND status IN ('draft', 'published'));

-- Policy: Athletes can update completed sessions (add RPE, feedback)
-- CREATE POLICY "Athletes can complete their sessions"
--   ON sessions FOR UPDATE
--   USING (auth.uid() = athlete_id AND status = 'published')
--   WITH CHECK (auth.uid() = athlete_id);
```

### Messages

**Purpose**:  
Ensure users can only view and send messages in conversations they're part of. Prevents users from accessing other users' private messages.

**Policy Explanation**:

- **SELECT**: Users can view messages if they're either the coach OR athlete in the conversation
- **INSERT**: Users can send messages if: 1) They're the sender, 2) They're part of the conversation
- Uses EXISTS subquery to check conversation membership

**Security Note**:  
These policies ensure end-to-end privacy - even if someone knows a message ID, they can't access it unless they're part of the conversation.

```sql
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view messages in their conversations
-- Checks if authenticated user is either coach or athlete in the conversation
-- Returns messages from conversations where user participates
CREATE POLICY "Users can view messages in their conversations"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND (conversations.coach_id = auth.uid() OR conversations.athlete_id = auth.uid())
    )
  );

-- Policy: Users can send messages in their conversations
-- WITH CHECK ensures: 1) User is the sender, 2) User is part of conversation
-- Prevents users from sending messages as someone else or to conversations they're not in
CREATE POLICY "Users can send messages in their conversations"
  ON messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND (conversations.coach_id = auth.uid() OR conversations.athlete_id = auth.uid())
    )
  );

-- Additional policy you may want to add:
-- Policy: Users can update their own messages (edit/delete)
-- CREATE POLICY "Users can update their own messages"
--   ON messages FOR UPDATE
--   USING (auth.uid() = sender_id)
--   WITH CHECK (auth.uid() = sender_id);
```

---

## Functions & Triggers

**What are Triggers?**  
Triggers are database functions that automatically execute when certain events occur (INSERT, UPDATE, DELETE, SELECT). They're useful for maintaining data consistency, updating related records, and enforcing business rules at the database level.

**Trigger Types**:

- **BEFORE**: Executes before the operation (can modify data before it's saved)
- **AFTER**: Executes after the operation (useful for updating related tables)
- **FOR EACH ROW**: Executes once per row affected
- **FOR EACH STATEMENT**: Executes once per statement

### Update `updated_at` timestamp

**Purpose**:  
Automatically update the `updated_at` column whenever a row is modified. This ensures accurate tracking of when records were last changed without requiring application code to set it.

**How it Works**:

- Function runs BEFORE UPDATE
- Sets `NEW.updated_at` to current timestamp
- Returns `NEW` to allow the update to proceed
- Must be applied to each table with an `updated_at` column

**Usage**:  
Apply this trigger to all tables that have an `updated_at` column. This is a common pattern for audit trails and cache invalidation.

```sql
-- Function: Automatically update updated_at timestamp
-- Returns: Modified row with updated_at set to NOW()
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  -- Set updated_at to current timestamp
  -- NEW represents the row being updated
  NEW.updated_at = NOW();

  -- Return the modified row
  -- This allows the UPDATE to proceed with the new timestamp
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Update users.updated_at before any UPDATE
-- Runs BEFORE UPDATE so timestamp is set before row is saved
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Update sessions.updated_at before any UPDATE
CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply similar triggers to other tables with updated_at:
-- - athlete_coach_relationships
-- - subscription_plans
-- - user_subscriptions
-- - exercises
-- - training_blocks
-- - training_block_models
-- - training_cycle_models
-- - planning_notes
-- - session_notes
-- - coach_notes
-- - records
-- - injuries
-- - physiological_data
-- - wellness_entries
-- - conversations
```

### Update conversation `last_message_at`

**Purpose**:  
Automatically update the `last_message_at` timestamp in the `conversations` table whenever a new message is sent. This enables efficient sorting of conversations by most recent activity.

**How it Works**:

- Trigger fires AFTER INSERT on `messages` table
- Updates the parent `conversation` record with the new message's timestamp
- Ensures conversation list always shows most recent message time

**Performance Note**:  
This trigger adds a small overhead to message inserts, but it's worth it for the convenience of having `last_message_at` always accurate.

```sql
-- Function: Update conversation's last_message_at when new message is sent
-- Returns: The inserted message row (unchanged)
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the conversation record with the new message's timestamp
  -- NEW.created_at is the timestamp of the message just inserted
  UPDATE conversations
  SET last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;

  -- Return the message row (unchanged)
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Update conversation after message insert
-- Runs AFTER INSERT so message is already saved
CREATE TRIGGER update_conversation_on_message
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_last_message();

-- Usage: When a message is inserted, conversation.last_message_at is automatically updated
-- This enables efficient queries like:
-- SELECT * FROM conversations ORDER BY last_message_at DESC;
```

### Mark messages as read when conversation is viewed

**Purpose**:  
Automatically mark messages as read when a user views a conversation. This provides a better UX by automatically tracking read status.

**Important Note**:  
PostgreSQL doesn't support triggers on SELECT operations directly. This example shows the concept, but you'll need to implement this logic in your application code or use a different approach (e.g., call a function when opening a conversation).

**Alternative Implementation**:  
Instead of a SELECT trigger, create a function that your application calls when a user opens a conversation:

```sql
-- Function: Mark messages as read when conversation is viewed
-- Call this function from your application when user opens a conversation
CREATE OR REPLACE FUNCTION mark_conversation_messages_as_read(conversation_uuid UUID)
RETURNS void AS $$
BEGIN
  -- Mark all unread messages in this conversation as read
  -- Exclude messages sent by the current user (they're already "read")
  UPDATE messages
  SET is_read = TRUE, read_at = NOW()
  WHERE conversation_id = conversation_uuid
  AND sender_id != auth.uid()  -- Don't mark own messages
  AND is_read = FALSE;  -- Only update unread messages
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Usage in application:
-- SELECT mark_conversation_messages_as_read('conversation-uuid-here');
-- Then fetch messages:
-- SELECT * FROM messages WHERE conversation_id = 'conversation-uuid-here';
```

**Note on SELECT Triggers**:  
The example below shows the concept, but PostgreSQL doesn't support SELECT triggers. Use the function approach above instead.

```sql
-- ⚠️ This is a conceptual example - PostgreSQL doesn't support SELECT triggers
-- Use the function approach above instead

-- Function: Mark messages as read (conceptual)
CREATE OR REPLACE FUNCTION mark_messages_as_read()
RETURNS TRIGGER AS $$
BEGIN
  -- This would mark messages as read, but SELECT triggers don't exist
  -- Use the function approach above instead
  UPDATE messages
  SET is_read = TRUE, read_at = NOW()
  WHERE conversation_id = NEW.id
  AND sender_id != auth.uid()
  AND is_read = FALSE;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ⚠️ This trigger won't work - SELECT triggers don't exist in PostgreSQL
-- CREATE TRIGGER mark_read_on_conversation_view
--   AFTER SELECT ON conversations
--   FOR EACH ROW EXECUTE FUNCTION mark_messages_as_read();
```

### Additional Useful Functions

Here are more functions you might want to create:

```sql
-- Function: Calculate overall_form_score from wellness metrics
-- Automatically calculates average of wellness scores
CREATE OR REPLACE FUNCTION calculate_overall_form_score()
RETURNS TRIGGER AS $$
DECLARE
  score_count INTEGER := 0;
  score_sum DECIMAL := 0;
BEGIN
  -- Count and sum non-null scores
  IF NEW.sleep_score IS NOT NULL THEN
    score_count := score_count + 1;
    score_sum := score_sum + NEW.sleep_score;
  END IF;
  IF NEW.energy_score IS NOT NULL THEN
    score_count := score_count + 1;
    score_sum := score_sum + NEW.energy_score;
  END IF;
  -- ... repeat for other scores

  -- Calculate average if we have scores
  IF score_count > 0 THEN
    NEW.overall_form_score := ROUND(score_sum / score_count, 1);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-calculate overall_form_score
CREATE TRIGGER calculate_wellness_form_score
  BEFORE INSERT OR UPDATE ON wellness_entries
  FOR EACH ROW
  EXECUTE FUNCTION calculate_overall_form_score();

-- Function: Check athlete capacity before creating session
-- Prevents coaches from exceeding subscription limits
CREATE OR REPLACE FUNCTION check_athlete_capacity()
RETURNS TRIGGER AS $$
DECLARE
  current_count INTEGER;
  capacity_limit INTEGER;
BEGIN
  -- Get coach's current athlete count
  SELECT COUNT(*) INTO current_count
  FROM athlete_coach_relationships
  WHERE coach_id = NEW.coach_id
  AND status = 'accepted';

  -- Get coach's subscription capacity
  SELECT athlete_capacity INTO capacity_limit
  FROM subscription_plans sp
  JOIN user_subscriptions us ON sp.id = us.subscription_plan_id
  WHERE us.user_id = NEW.coach_id
  AND us.status = 'active'
  LIMIT 1;

  -- Check if capacity would be exceeded
  IF capacity_limit IS NOT NULL AND current_count >= capacity_limit THEN
    RAISE EXCEPTION 'Athlete capacity limit reached for this subscription plan';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Check capacity before accepting athlete relationship
CREATE TRIGGER check_capacity_on_athlete_add
  BEFORE UPDATE ON athlete_coach_relationships
  FOR EACH ROW
  WHEN (NEW.status = 'accepted' AND OLD.status != 'accepted')
  EXECUTE FUNCTION check_athlete_capacity();
```

---

## Storage Buckets (Supabase Storage)

### `exercise-videos`

Store exercise video files.

```sql
-- Create bucket via Supabase Dashboard or API
-- Bucket: exercise-videos
-- Public: false (authenticated access only)
-- Allowed MIME types: video/*
```

### `exercise-thumbnails`

Store exercise thumbnail images.

```sql
-- Bucket: exercise-thumbnails
-- Public: true (for faster loading)
-- Allowed MIME types: image/*
```

### `user-avatars`

Store user profile pictures.

```sql
-- Bucket: user-avatars
-- Public: true
-- Allowed MIME types: image/jpeg, image/png
```

### `sport-icons`

Store sport icon images.

```sql
-- Bucket: sport-icons
-- Public: true
-- Allowed MIME types: image/*
```

### `material-icons`

Store material icon images.

```sql
-- Bucket: material-icons
-- Public: true
-- Allowed MIME types: image/*
```

### `programmation-covers`

Store programmation cover images.

```sql
-- Bucket: programmation-covers
-- Public: true
-- Allowed MIME types: image/*
```

---

## Indexes Summary

All tables have appropriate indexes for:

- Foreign keys
- Frequently queried columns (dates, statuses, user IDs)
- Composite indexes for common query patterns
- Partial indexes for filtered queries (e.g., unread messages)

---

## Implementation Notes & Best Practices

### 1. Soft Deletes

**Why Use Soft Deletes?**  
Many tables use `deleted_at` for soft deletion instead of hard deletes (`DELETE FROM table`) to:

- **Preserve data integrity**: Maintain referential integrity with foreign keys
- **Enable recovery**: Allow accidental deletions to be undone
- **Audit trail**: Track when and what was deleted
- **Historical data**: Keep historical records for analytics

**Implementation Pattern**:

```sql
-- Soft delete: Set deleted_at timestamp
UPDATE users SET deleted_at = NOW() WHERE id = ?;

-- Query active records: Filter out deleted
SELECT * FROM users WHERE deleted_at IS NULL;

-- Restore deleted record: Clear deleted_at
UPDATE users SET deleted_at = NULL WHERE id = ?;
```

**Tables Using Soft Deletes**:

- `users`, `sports`, `materials`, `exercises`
- `training_block_models`, `training_cycle_models`
- `planning_notes`, `coach_notes`
- `records`, `injuries`
- `programmations`, `programmes`

### 2. Timestamps

**Why TIMESTAMPTZ?**  
All tables use `TIMESTAMPTZ` (timestamp with timezone) instead of `TIMESTAMP` because:

- **Timezone awareness**: Stores UTC internally, displays in user's timezone
- **Consistency**: All timestamps are comparable regardless of server timezone
- **Best practice**: Recommended for applications with users in multiple timezones

**Common Timestamp Columns**:

- `created_at`: When record was created (set once, never changes)
- `updated_at`: When record was last modified (auto-updated by trigger)
- `deleted_at`: When record was soft-deleted (NULL = active)
- `published_at`, `completed_at`, etc.: Business-specific timestamps

### 3. UUIDs as Primary Keys

**Why UUIDs?**  
All primary keys use UUIDs (`gen_random_uuid()`) instead of auto-incrementing integers because:

- **Security**: Don't expose sequential IDs (prevents enumeration attacks)
- **Distributed systems**: Can generate IDs without database round-trip
- **Merge-friendly**: No conflicts when merging databases
- **Privacy**: Harder to guess or enumerate user IDs

**Trade-offs**:

- **Storage**: UUIDs use 16 bytes vs 4-8 bytes for integers
- **Index size**: Slightly larger indexes
- **Performance**: Minimal impact, usually acceptable

### 4. Data Integrity Constraints

**Check Constraints**:  
Ensure data validity at the database level:

- Status values: `CHECK (status IN ('draft', 'published', 'completed'))`
- Score ranges: `CHECK (score >= 0 AND score <= 10)`
- Date validation: `CHECK (end_date >= start_date)`

**Foreign Key Constraints**:

- `ON DELETE CASCADE`: When parent is deleted, children are deleted
- `ON DELETE SET NULL`: When parent is deleted, foreign key is set to NULL
- `ON DELETE RESTRICT`: Prevents deletion if children exist

**Unique Constraints**:  
Prevent duplicate data:

- `UNIQUE(email)`: One email per user
- `UNIQUE(athlete_id, coach_id)`: One relationship per pair
- `UNIQUE(athlete_id, entry_date)`: One wellness entry per day

### 5. Row Level Security (RLS)

**Critical for Security**:  
RLS policies enforce access control at the database level, preventing:

- Data leaks if application code has bugs
- Direct database access bypassing application
- SQL injection attacks from accessing unauthorized data

**Best Practices**:

- **Enable RLS** on all tables with sensitive data
- **Test thoroughly**: Incorrect policies can lock users out
- **Use service role** for admin operations that need to bypass RLS
- **Document policies**: Explain what each policy allows/denies
- **Review regularly**: As features change, update policies

**Common Patterns**:

- Users can only access their own data: `USING (auth.uid() = user_id)`
- Coaches can access their athletes' data: `USING (EXISTS (SELECT 1 FROM athlete_coach_relationships WHERE ...))`
- Public read, authenticated write: Separate SELECT and INSERT policies

### 6. Supabase Storage

**Storage Buckets**:  
Media files are stored in Supabase Storage, not the database:

- **Videos**: `exercise-videos` bucket (private, authenticated access)
- **Images**: `exercise-thumbnails`, `user-avatars`, `sport-icons`, etc. (public for performance)
- **URLs stored in DB**: Database stores URLs pointing to storage objects

**Implementation**:

```sql
-- Upload file to storage (via Supabase client)
const { data } = await supabase.storage
  .from('user-avatars')
  .upload('user-123.jpg', file);

-- Get public URL
const url = supabase.storage
  .from('user-avatars')
  .getPublicUrl('user-123.jpg');

-- Store URL in database
UPDATE users SET avatar_url = ? WHERE id = ?;
```

### 7. Stripe Integration

**Subscription Management**:

- Store Stripe IDs (`stripe_subscription_id`, `stripe_customer_id`) for webhook processing
- Webhooks update `user_subscriptions` table when payment events occur
- Use Stripe Customer Portal for users to manage billing

**Webhook Handling**:

```javascript
// Example webhook handler
if (event.type === "customer.subscription.updated") {
  await supabase
    .from("user_subscriptions")
    .update({
      status: event.data.object.status,
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", event.data.object.id);
}
```

### 8. Real-time Subscriptions

**Enable Real-time**:  
Supabase supports real-time subscriptions for live updates:

```javascript
// Listen for new messages
const subscription = supabase
  .channel("messages")
  .on(
    "postgres_changes",
    {
      event: "INSERT",
      schema: "public",
      table: "messages",
      filter: `conversation_id=eq.${conversationId}`,
    },
    (payload) => {
      console.log("New message:", payload.new);
    }
  )
  .subscribe();

// Cleanup
subscription.unsubscribe();
```

**Recommended Real-time Tables**:

- `messages`: Live chat updates
- `notifications`: Instant notification delivery
- `sessions`: Session status changes (published, completed)
- `wellness_entries`: Real-time wellness tracking

### 9. Full-text Search

**Consider Adding**:  
For better search performance, add full-text search indexes:

```sql
-- Create full-text search index for exercises
CREATE INDEX idx_exercises_search ON exercises
USING gin(to_tsvector('french', name || ' ' || COALESCE(description, '')));

-- Search query
SELECT * FROM exercises
WHERE to_tsvector('french', name || ' ' || COALESCE(description, ''))
@@ plainto_tsquery('french', 'squat');
```

**Tables That Benefit**:

- `exercises`: Name and description search
- `messages`: Message content search
- `coach_notes`: Note content search
- `sports`, `materials`: Name search

### 10. Performance Optimization

**Indexing Strategy**:

- **Foreign keys**: Always indexed (PostgreSQL does this automatically)
- **Frequently queried columns**: Date ranges, status filters, user lookups
- **Composite indexes**: For common query patterns (e.g., `(athlete_id, session_date)`)
- **Partial indexes**: For filtered queries (e.g., `WHERE is_read = FALSE`)

**Query Optimization**:

- Use `EXPLAIN ANALYZE` to identify slow queries
- Add indexes based on actual query patterns (not assumptions)
- Consider materialized views for complex aggregations
- Use connection pooling (Supabase handles this)

**Monitoring**:

- Track query performance in Supabase Dashboard
- Monitor index usage (unused indexes waste space)
- Review slow query logs regularly

### 11. Migration Strategy

**Supabase Migrations**:  
Use Supabase migration files for schema changes:

```sql
-- migrations/20240101000000_create_users_table.sql
CREATE TABLE users (
  -- ... table definition
);

-- migrations/20240102000000_add_rls_policies.sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY ...;
```

**Best Practices**:

- **Version control**: All migrations in git
- **Idempotent**: Migrations should be safe to run multiple times
- **Test locally**: Test migrations before deploying
- **Backup first**: Always backup before major migrations
- **Rollback plan**: Have a plan to rollback if needed

### 12. Common Query Patterns

**Get Athlete's Upcoming Sessions**:

```sql
SELECT s.*, sp.name as sport_name
FROM sessions s
LEFT JOIN session_sports ss ON s.id = ss.session_id
LEFT JOIN sports sp ON ss.sport_id = sp.id
WHERE s.athlete_id = ?
AND s.session_date >= CURRENT_DATE
AND s.status IN ('published', 'completed')
ORDER BY s.session_date ASC;
```

**Get Coach's Athletes with Recent Activity**:

```sql
SELECT u.*,
       COUNT(DISTINCT s.id) as session_count,
       MAX(s.completed_at) as last_session_date
FROM users u
JOIN athlete_coach_relationships acr ON u.id = acr.athlete_id
LEFT JOIN sessions s ON u.id = s.athlete_id
WHERE acr.coach_id = ?
AND acr.status = 'accepted'
GROUP BY u.id
ORDER BY last_session_date DESC NULLS LAST;
```

**Get Exercise with All Related Data**:

```sql
SELECT e.*,
       array_agg(DISTINCT s.name) as sports,
       array_agg(DISTINCT m.name) as materials,
       array_agg(DISTINCT mg.name) FILTER (WHERE emg.type = 'primary') as primary_muscles
FROM exercises e
LEFT JOIN exercise_sports es ON e.id = es.exercise_id
LEFT JOIN sports s ON es.sport_id = s.id
LEFT JOIN exercise_materials em ON e.id = em.exercise_id
LEFT JOIN materials m ON em.material_id = m.id
LEFT JOIN exercise_muscle_groups emg ON e.id = emg.exercise_id
LEFT JOIN muscle_groups mg ON emg.muscle_group_id = mg.id
WHERE e.id = ?
GROUP BY e.id;
```

### 13. Security Checklist

Before going to production, ensure:

- ✅ RLS enabled on all sensitive tables
- ✅ RLS policies tested for all user roles
- ✅ Service role key secured (never expose to client)
- ✅ API keys rotated regularly
- ✅ Database backups configured
- ✅ Webhook endpoints secured (Stripe, etc.)
- ✅ Input validation at application level (in addition to DB constraints)
- ✅ Rate limiting on API endpoints
- ✅ CORS configured correctly
- ✅ Environment variables secured

### 14. Testing Recommendations

**Unit Tests**:

- Test RLS policies with different user roles
- Test constraint violations (e.g., duplicate emails)
- Test trigger functions

**Integration Tests**:

- Test complete workflows (create session → publish → complete)
- Test subscription limits (athlete capacity)
- Test message delivery and read status

**Performance Tests**:

- Load test with realistic data volumes
- Test query performance with indexes
- Test real-time subscription performance

---

## Summary

This schema provides a comprehensive foundation for the Kaptrain platform with:

- **40+ tables** covering all functional requirements
- **Detailed relationships** between entities
- **Security** via RLS policies
- **Data integrity** via constraints and triggers
- **Performance** via strategic indexing
- **Scalability** via UUIDs and proper normalization

**Next Steps**:

1. Review and customize RLS policies for your specific needs
2. Add any additional indexes based on your query patterns
3. Set up Supabase Storage buckets
4. Configure Stripe webhooks
5. Implement application-level validation
6. Set up monitoring and alerts
7. Create migration files for version control
8. Test thoroughly before production deployment
