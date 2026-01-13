## APP – FR-XXX Suivi de poids (Weight Tracking)

**Description**  
Allow users to view, add, and edit their weight measurements over time via a chart and an editable history list.

**Actor**  
Athlete

**Priority**  
Medium

**Acceptance Criteria**
- User can access the **Suivi de poids** widget from the Statistics/Widgets area.
- The widget displays a weight trend chart for the selected time range.
- User can switch chart time ranges: **1M**, **6M**, **1A**, **Tout**.
- Selecting a time range refreshes both the chart and the history list to match the same period.
- User can tap **Aujourd’hui** to quickly focus the view on the current date (if relevant to the selected range).
- The widget displays a **Historique** list of weight entries (value + date) in reverse chronological order.
- User can tap **Ajouter un poids** to open the “Ajoute une nouvelle mesure de poids” modal.
- In the add modal, user can input:
  - **Poids** (numeric) with **kg** unit displayed
  - **Jour de la pesée** (date picker)
- The system validates weight input:
  - Weight must be a valid number
  - Weight must be > 0
  - If the value is out of allowed range, an error message is displayed and submission is blocked.
- The system prevents adding an entry without a date.
- User can submit the add modal by tapping **Ajouter**.
- On successful creation:
  - The new entry appears in **Historique**
  - The chart is updated accordingly
  - The modal is closed
- User can edit an existing weight entry from **Historique** (via the edit icon).
- When editing an entry, the system allows updating weight and/or date and applies the same validations as creation.
- On successful update:
  - The edited entry is updated in **Historique**
  - The chart is updated accordingly
- If no weight data exists for the selected time range, the widget displays an explicit empty state (e.g., “Aucune donnée enregistrée”) and still provides access to **Ajouter un poids**.
- If a network or sync error occurs during create/update, the system shows a clear error message and the user’s changes are not silently lost.
