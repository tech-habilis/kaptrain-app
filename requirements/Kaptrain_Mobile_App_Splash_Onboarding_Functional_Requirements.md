# Kaptrain Mobile App – Splash Screen & Onboarding Functional Requirements

## APP – FR-XXX Splash Screen

**Description**  
Display an initial splash screen when the mobile application is launched to reinforce brand identity and provide a smooth entry point before onboarding or authentication.

**Actor**  
User (Athlete / Coach)

**Priority**  
High

**Acceptance Criteria**
- The splash screen is displayed immediately on app launch.
- The Kaptrain logo is centered and clearly visible.
- A short tagline is displayed: *“L’expertise de haut niveau, accessible à tous”*.
- The splash screen respects the brand color palette and visual identity.
- The splash screen is shown for a short predefined duration or until initial app loading is completed.
- After the splash screen, the user is automatically redirected to the onboarding flow (first launch) or the login screen (returning user).

---

## APP – FR-XXX Onboarding – Global Flow

**Description**  
Provide a multi-step onboarding experience to introduce the app’s value proposition and guide new users before authentication.

**Actor**  
User (Athlete / Coach)

**Priority**  
High

**Acceptance Criteria**
- The onboarding consists of 3 distinct screens.
- Each screen contains a full-screen image, a short headline, and a progression indicator.
- Users can navigate sequentially using a primary action button.
- The onboarding is displayed only on first launch (unless reset).
- Progress indicators visually reflect the current onboarding step.

---

## APP – FR-XXX Onboarding – Screen 1

**Description**  
Introduce the app concept and invite the user to start their journey.

**Actor**  
User

**Priority**  
High

**Acceptance Criteria**
- A full-screen background image related to training is displayed.
- Headline text: *“Visualise, comprends, améliore.”*
- A primary action button labeled **“Connexion”** is displayed.
- A progress indicator shows step 1 of 3.
- Tapping **Connexion** navigates the user to the next onboarding screen or authentication entry point, depending on product decision.

---

## APP – FR-XXX Onboarding – Screen 2

**Description**  
Highlight the accessibility and inclusivity of Kaptrain’s sports expertise.

**Actor**  
User

**Priority**  
High

**Acceptance Criteria**
- A full-screen background image representing diversity and inclusivity in sport.
- Headline text: *“L’expertise sportive, accessible à tous.”*
- A primary action button labeled **“Suivant”** is displayed.
- A progress indicator shows step 2 of 3.
- Tapping **Suivant** navigates to the next onboarding screen.

---

## APP – FR-XXX Onboarding – Screen 3

**Description**  
Motivate the user and conclude the onboarding experience.

**Actor**  
User

**Priority**  
High

**Acceptance Criteria**
- A full-screen background image related to movement or progression.
- Headline text: *“Ta progression commence ici.”*
- A primary action button labeled **“Suivant”** is displayed.
- A progress indicator shows step 3 of 3.
- Tapping **Suivant** completes the onboarding flow and redirects the user to the authentication screen (login / signup).

---

## APP – FR-XXX Onboarding – Persistence Rules

**Description**  
Define how onboarding completion is stored and reused.

**Actor**  
System

**Priority**  
Medium

**Acceptance Criteria**
- Once onboarding is completed, the app stores a local flag indicating completion.
- On subsequent app launches, completed onboarding is skipped.
- If the app is reinstalled or local storage is cleared, onboarding is shown again.
