## APP – FR-XXX Nombre de pas (Widget – suivi des pas)

**Description**  
Allow users to view their step count and progress versus a daily step goal across Today / Week / Month timeframes.

**Actor**  
Athlete (primary), Coach (if coach-mode includes athlete self-view)

**Priority**  
Medium

**Acceptance Criteria**
- User can access the **“Nombre de pas”** widget from **Mes statistiques** (statistics list).
- The widget displays step data in three tabs: **Aujourd’hui**, **Semaine**, **Mois**.
- The widget shows the current step count for the selected timeframe (e.g., ring + value).
- The widget shows the **daily goal** and a **progress indicator** (e.g., “8416 / 10 000 pas” with progress bar).
- If step data is unavailable (not authorized / no data), the UI displays an empty-state message and a clear call-to-action.

---

## APP – FR-XXX Synchroniser avec Health Connect (Consent / permissions)

**Description**  
Allow users to grant the application permission to read step count data via Health Connect (or equivalent health data provider).

**Actor**  
Athlete

**Priority**  
High

**Acceptance Criteria**
- If the user has not granted permissions yet, the app displays a **consent screen** explaining why step data is needed (privacy notice included).
- User can confirm consent by tapping **“J’ai lu et j’accepte”**.
- Upon consent, the app triggers the OS/provider permission flow to grant access to step data.
- If the user declines permissions, the app keeps the widget accessible but shows an empty-state (no step values) and allows retry.
- Step data is used only for in-app tracking and is not shared with third parties as stated in the consent copy.

---

## APP – FR-XXX Nombre de pas – vue “Aujourd’hui”

**Description**  
Display today’s steps and progress to the daily goal.

**Actor**  
Athlete

**Priority**  
High

**Acceptance Criteria**
- When **Aujourd’hui** tab is selected, the widget shows:
  - Today’s total steps (numeric value).
  - A circular progress indicator (ring) proportional to goal completion.
  - The daily goal progress text (e.g., “8416 / 10 000 pas”).
- The widget updates when new step data is received (foreground refresh or next sync).
- If today’s steps exceed the goal, the UI still displays the full value and a “100%+” style progress (or a capped ring) without breaking layout.

---

## APP – FR-XXX Nombre de pas – modifier l’objectif quotidien

**Description**  
Allow users to set/update their daily step goal.

**Actor**  
Athlete

**Priority**  
Medium

**Acceptance Criteria**
- User can tap **“Modifier mon objectif”** to open the goal editor.
- The goal editor displays a large numeric target (e.g., “15 000”) with a slider/selector to adjust the value.
- User can confirm changes by tapping **“Valider”**.
- After validation, the updated goal is reflected:
  - On the **Aujourd’hui** progress bar and ring.
  - On **Semaine** and **Mois** screens wherever the daily goal indicator is displayed.
- The app validates the goal value:
  - Prevents empty/invalid values.
  - Enforces a reasonable min/max range (product-defined; default example: 1,000–50,000 steps).
- If saving fails (network/storage error), the app shows an error message and keeps the previous goal.

---

## APP – FR-XXX Nombre de pas – vue “Semaine”

**Description**  
Allow users to view step totals over a selected week.

**Actor**  
Athlete

**Priority**  
Medium

**Acceptance Criteria**
- When **Semaine** tab is selected, the widget shows:
  - A week range label (e.g., “Du 14 avril au 20 avril”).
  - A bar chart of daily step totals for the week.
  - The daily goal progress component (goal + progress bar) for the current day (as shown in design).
- User can navigate to previous/next week via arrows.
- If a day has no data, the chart displays a 0/empty bar while keeping axis alignment.
- The chart remains readable on small devices (no overlapping labels; scrolling or abbreviated labels if needed).

---

## APP – FR-XXX Nombre de pas – vue “Mois”

**Description**  
Allow users to view step totals over a selected month.

**Actor**  
Athlete

**Priority**  
Medium

**Acceptance Criteria**
- When **Mois** tab is selected, the widget shows:
  - The selected month label (e.g., “Avril”).
  - A month calendar view highlighting days with available step data.
  - The daily goal progress component (goal + progress bar) for the selected day (or today by default).
- User can navigate to previous/next month via arrows.
- Selecting a day updates the displayed step count context (e.g., day selection state).
- If no data exists for the month, the UI displays an empty-state while still allowing month navigation.

---

## APP – FR-XXX Nombre de pas – erreurs & états limites

**Description**  
Ensure robust behavior for missing data, permission issues, and sync failures.

**Actor**  
Athlete

**Priority**  
High

**Acceptance Criteria**
- If permissions are revoked after previously being granted, the widget returns to the consent/empty-state and offers re-enable.
- If the health provider is unavailable/not installed, the app provides guidance to install/enable it (platform-specific).
- If data retrieval fails (timeout/API error), the app:
  - Shows a non-blocking error message.
  - Keeps the last known values (if any) with a “last updated” concept if available.
- Loading states are displayed while fetching step data (skeletons/spinners) without blocking navigation.
