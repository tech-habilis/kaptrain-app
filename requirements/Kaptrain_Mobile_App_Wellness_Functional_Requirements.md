# Kaptrain Mobile App – Wellness Functional Requirements

## APP – FR-XXX Daily Wellness Check-In

**Description**  
Allow users to report their daily wellness status through a structured, multi-criteria questionnaire. The wellness check-in helps personalize training recommendations, recovery guidance, and overall user experience.

**Actor**  
Athlete (Mobile App User)

**Trigger**  
- Automatically displayed once per day on app launch (default behavior)  
- Can also be accessed manually from the Home screen if available

---

## Wellness Criteria

The wellness check-in consists of **6 parameters**, each rated on a scale of **1 to 7** using sliders:

1. **Sommeil (Sleep)**  
   - Scale: Très mauvais (1) → Excellent (7)  
   - Note: This scale is **reversed** for scoring purposes

2. **Énergie (Energy)**  
   - Scale: Très mauvais (1) → Je pète la forme (7)

3. **Nutrition de la veille (Previous Day Nutrition)**  
   - Scale: Très mauvaise (1) → Très saine (7)

4. **Hydratation de la veille (Previous Day Hydration)**  
   - Scale: -1L (1) → +3L (7)

5. **Douleurs (Pain)**  
   - Scale: Aucune (1) → Très importante (7)  
   - Note: This scale is **reversed** for scoring purposes

6. **Stress**  
   - Scale: Aucun (1) → Très important (7)

---

## Scoring Logic

### Step 1 – Normalize Scores
- Each parameter produces a value between **1 and 7**
- For **Sleep** and **Pain**, values must be reversed:
  - Reversed score = `8 - selected value`

### Step 2 – Average
- Add all 6 normalized scores
- Divide the total by **6** to get an average

### Step 3 – Scale to /10
- Multiply the average by **1.429**
- Final Wellness Score range: **0 to 10**

**Formula**
```
WellnessScore = ((Σ normalized_scores / 6) * 1.429)
```

---

## Wellness Condition Mapping

The final score determines the user’s condition tag shown on the Home screen:

| Score Range | Condition Label       |
|------------|----------------------|
| 8 – 10     | Excellent condition  |
| 6 – 7.9    | Good condition       |
| 4 – 5.9    | Average condition    |
| 3 – 4.9    | Low condition        |
| 0 – 2.9    | Very low condition   |

The Home page CTA or visual indicator adapts based on the condition level.

---

## User Actions

- Adjust sliders for each parameter
- Tap **Valider** to submit the daily wellness
- Access settings icon to manage wellness reminders

---

## Disable Daily Reminder

**Description**  
Users may choose to disable the daily wellness reminder.

**Behavior**
- A confirmation modal explains:
  - Purpose of wellness tracking
  - Impact on personalization and recovery
- Two actions:
  - **Désactiver quand même**
  - **Conserver le rappel**
- If disabled:
  - Wellness prompt no longer appears automatically
  - User can re-enable it later from Profile settings

---

## Validation & Constraints

- All 6 parameters must be filled before submission
- Data is saved per day (one entry per calendar day)
- Editing past entries is not allowed (unless specified later)

---

## Acceptance Criteria

- User can complete and submit a daily wellness check-in
- Score calculation follows the defined formula
- Sleep and Pain scores are correctly reversed
- Final score is scaled to /10
- Correct condition label is displayed on Home screen
- User can disable or keep daily reminder
- Submitted data is stored and associated with the correct date

---

## Non-Functional Requirements

- Smooth slider interaction (mobile optimized)
- Submission latency < 500ms
- Offline handling: cache locally and sync when online
