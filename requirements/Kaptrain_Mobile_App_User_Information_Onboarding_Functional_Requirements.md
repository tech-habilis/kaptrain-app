# Kaptrain Mobile App — User Information Onboarding (FR-XXX)

> **Scope**: Mobile app flow displayed **after registration** to complete user profile (“Compléter les dernières étapes”).  
> **Naming convention**: `APP - FR-XXX` (no numeric ID provided).

---

## 1) Overview

This flow collects mandatory/optional profile data after account creation, including:
- Basic identity information (first name, last name, date of birth, gender)
- Current weight (optional with “I prefer not to answer”)
- Sports practice level
- Favorite sports (with selection limit)
- Optional coach invitation code (join a coach or continue without)

The flow ends with a success screen confirming account readiness.

---

## 2) Entry Points

### Entry conditions
- User has successfully registered (account created).
- Email verification step is assumed completed (or the product allows continuing and verifying later—implement according to backend rules).

### Entry triggers
- After registration success screen CTA: **“Compléter mon profil”** (or equivalent).
- From profile/settings: “Complete profile” (optional future enhancement).

---

## 3) Screens & Functional Requirements

### 3.1 Screen: “Compléter les dernières étapes” — Basic profile info (Step 1/5)

**Purpose**
Collect core identity data to create the athlete profile.

**UI elements**
- Avatar placeholder with **Add/Upload** icon
- Inputs:
  - `Prénom` (First name)
  - `Nom` (Last name)
  - `Date de naissance` (DOB) — date format `JJ/MM/AAAA`
  - `Genre` (Gender) — options as displayed (e.g., `Femme`, `Homme`, possibly other per product)
- Step indicator: `Étape 1/5`
- Primary CTA: `Continuer`

**Rules**
- Validate required fields before enabling `Continuer`:
  - First name required
  - Last name required
  - DOB required and must be a valid date (and within allowed age constraints if any)
  - Gender required (unless product supports “Prefer not to say”)
- Avatar:
  - Optional
  - If supported: allow image picker (camera/gallery), crop/preview (implementation choice)
- On `Continuer`: persist locally + send to backend (or batch save at end—define strategy).

**Errors**
- Inline field errors for missing/invalid input
- Global error toast/snackbar if network call fails (if saving per step)

---

### 3.2 Screen: “Indiquer mon poids actuel” — Weight input (Step 2/5)

**Purpose**
Capture current body weight for tracking.

**UI elements**
- Numeric input for weight (kg)
- Unit label: `kg`
- Option/checkbox/button: `Je préfère ne pas répondre`
- Step indicator: `Étape 2/5`
- CTA: `Continuer`
- Numeric keyboard

**Rules**
- Weight is optional:
  - If `Je préfère ne pas répondre` is selected:
    - Disable weight input (or clear it)
    - Allow `Continuer`
- If weight is provided:
  - Must be numeric and within acceptable range (e.g., > 0; exact bounds to be defined by product/medical constraints)
  - Display proper decimal handling (e.g., `00.00` initial placeholder)
- Persist on `Continuer`.

**Errors**
- Invalid range or non-numeric input feedback

---

### 3.3 Screen: “Choisir mon niveau de pratique sportive” — Practice level (Step 3/5)

**Purpose**
Determine training/program recommendations based on the user’s practice level.

**UI elements**
- Selectable list of levels (as shown):
  - `Débutant`
  - `Intermédiaire`
  - `Avancé`
  - `Confirmé`
  - `Expert`
- Each level includes an indicative weekly practice volume (e.g., “1 à 2h par semaine”, etc.)
- Step indicator: `Étape 3/5`
- CTA: `Continuer`

**Rules**
- Exactly one level must be selected to proceed.
- Persist selection on `Continuer`.

---

### 3.4 Screen: “Sélectionner mes sports favoris” — Favorite sports (Step 4/5)

**Purpose**
Let user choose up to a maximum number of sports they practice/like.

**UI elements**
- Search input (filter list)
- Selected sports displayed as chips/tags at the top
- List of sports with checkbox selection (examples shown: Athlétisme, Aviron, Basketball, Crossfit, Cyclisme, Musculation, Yoga, etc.)
- Helper text: `Tu peux sélectionner jusqu'à 5 sports.`
- Step indicator: `Étape 4/5`
- CTA: `Continuer`

**Rules**
- Selection limit: **max 5**
  - When limit reached:
    - Additional unselected items become disabled OR selection attempt shows warning (as in “limite atteinte”)
- Search filters list by name (case-insensitive).
- Allow deselection from list or via chips.
- Persist selection on `Continuer`.

---

### 3.5 Screen: “Tu as déjà un coach ?” — Coach invitation code (Step 5/5)

**Purpose**
Optionally associate the user with a coach via invitation code.

**UI elements**
- Invitation code input (placeholder like `EX : JNKMD701`)
- Primary CTA: `Se connecter à mon coach`
- Secondary action: `Continuer sans coach`
- Step indicator: `Étape 5/5`

**Rules**
- Coach linking is optional:
  - `Continuer sans coach` completes onboarding without link.
- If user submits invitation:
  - Validate code format (e.g., length/charset—define backend rules)
  - Call backend to link athlete to coach
  - On success: proceed to final success screen
  - On failure: show error message (invalid/expired code) and keep user on screen

---

### 3.6 Screen: Success — “Félicitations !”

**Purpose**
Confirm that profile setup is complete and the user can start using the app.

**UI elements**
- Success illustration (background) + check icon
- Message: account is ready
- CTA: `Explorer KAPTRAIN !`

**Rules**
- On CTA: navigate to main app entry (home/dashboard).
- Mark onboarding completion flag (local + backend) to prevent showing onboarding again.

---

## 4) Data Model (Proposed)

**UserProfile**
- `firstName: string`
- `lastName: string`
- `dateOfBirth: string` (ISO date recommended)
- `gender: enum`
- `avatarUrl?: string`
- `weightKg?: number`
- `practiceLevel: enum` (`beginner`, `intermediate`, `advanced`, `confirmed`, `expert`)
- `favoriteSports: string[]` (IDs recommended)
- `coachInvitationCodeUsed?: string`
- `coachId?: string`
- `onboardingCompleted: boolean`

---

## 5) Validation & UX Notes

- Ensure step progress persistence:
  - If app is closed mid-flow, resume at last incomplete step.
- Provide consistent loading states for network calls.
- All copy should support i18n (FR/EN) even if only FR is shown in mocks.

---

## 6) Analytics (Optional but Recommended)

Events:
- `onboarding_started`
- `onboarding_step_completed` (with step index)
- `onboarding_completed`
- `coach_link_attempted` / `coach_link_success` / `coach_link_failed`
- `favorite_sport_selected` / `favorite_sport_removed`

---

## 7) Acceptance Criteria (High-level)

- User can complete all steps and reach success screen.
- Required fields block progression until valid.
- Favorite sports selection enforces max 5.
- Coach invitation code can be applied or skipped.
- After completion, user lands in main app and onboarding does not reappear.

---
