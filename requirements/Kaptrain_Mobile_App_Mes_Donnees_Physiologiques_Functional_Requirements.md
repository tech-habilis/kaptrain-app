# Kaptrain Mobile App — Mes données physiologiques (APP - FR-XXX)

## Overview
This screen allows users to manage their **physiological reference data**, which is used to personalize training zones, intensity percentages, and in-session calculations.

Status: **To be discussed / subject to validation**

---

## Functional Scope

### Data Categories
The user can view and manage the following physiological metrics:

#### Cardio
- **FC Max (bpm)**
  - Numeric input
  - Last updated date displayed
  - Used for heart-rate based zones

#### Speed
- **VMA (km/h)** – Vitesse Maximale Aérobie
- **Vitesse brute (km/h)**
  - Used for pace and speed zones

#### Power
- **PMA (W)** – Puissance Maximale Aérobie
- **FTP (W)** – Functional Threshold Power
  - Used for cycling and power-based sessions

---

## Main Screen — Mes données
- List of physiological cards grouped by category
- Each card displays:
  - Metric name
  - Current value
  - Unit
  - Last update date
  - Edit icon
- CTA when missing data:
  - “Renseigner ma FC max”

---

## Add / Edit Measurement

### Add new measurement
- Triggered when data is missing or via add action
- Bottom sheet / modal
- Fields:
  - Numeric input
  - Unit displayed (km/h, bpm, W)
- Primary CTA: **Enregistrer**

### Edit measurement
- Pre-filled with existing value
- Same validation and save behavior

---

## Validation Rules
- Numeric values only
- Acceptable physiological ranges (to be defined)
- If incoherent value detected:
  - Error message:
    > “Cette valeur semble trop élevée, vérifie ta saisie.”

---

## Usage in App
- These values are used automatically in:
  - Training zones
  - Percentages
  - Session intensity calculations
- No manual activation required

---

## UX & Behavior
- Changes are saved instantly after confirmation
- Last updated date refreshed on save
- Modal can be dismissed without saving

---

## Open Questions / To Discuss
- Exact min/max thresholds per metric
- Manual vs auto-calculated values
- Coach visibility / override permissions
- Sync with external devices (future)

---

## Naming Convention
**APP - FR-XXX — Mes données physiologiques**
