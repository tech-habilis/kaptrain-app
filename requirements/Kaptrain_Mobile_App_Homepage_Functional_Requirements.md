# Kaptrain Mobile App – Homepage (Accueil)

**Document ID:** APP-FR-ACCUEIL  
**Platform:** Mobile App (iOS / Android)

---

## 1. Overview

The **Homepage (Accueil)** is the main entry point after user login.  
It provides a quick overview of:

- Daily sessions
- Wellness / fitness status
- Training statistics
- Quick actions (wellness input, timer)

---

## 2. Header Section

### Elements

- User avatar
- Greeting message (e.g. _Bonjour Marie !_)
- Current wellness status badge (e.g. _Forme excellente_)
- Message icon (shortcut to messaging)
- Notification icon (unread indicator supported)

### Functional Rules

- Greeting uses user's first name
- Wellness badge reflects the latest wellness score
- Notification icon shows unread count (if any)

---

## 3. Calendar Strip

### Elements

- Horizontal calendar (Monday → Sunday)
- Highlight current day
- Indicators for days with sessions or wellness entries

### Functional Rules

- Tapping a date updates the content below
- Only current week is displayed (swipe optional)

---

## 4. Today’s Sessions (Aujourd’hui)

### Elements

- List of scheduled sessions for selected day
- Each session card includes:
  - Sport type (e.g. Hyrox, Cyclisme)
  - Session title
  - Coach name
  - Status indicator (completed / pending)

### Functional Rules

- If no session → empty state
- Tap session → navigate to session detail

---

## 5. Wellness Tracking (Mon suivi de forme)

### Elements

- Line chart (score from 0 to 10)
- Time range selector (default: Today)
- Category filters:
  - Sommeil
  - Énergie
  - Nutrition
  - Hydratation
  - Douleurs
  - Stress

### Functional Rules

- Graph updates when filter changes
- If today’s wellness not filled:
  - Show CTA **“Renseigner ma forme du jour”**

---

## 6. Statistics Section (Mes statistiques)

### Cards

1. **Répartition d’activité**
   - Donut chart by sport
   - Percentages per activity

2. **Volume d’entraînement**
   - Bar chart (last 7 days)
   - Total duration displayed (e.g. 13h20)

### Functional Rules

- “Tout voir” navigates to full statistics page
- Data updates based on selected date range

---

## 7. Timer Shortcut

### Elements

- Callout card: _Besoin d’un timer ?_
- CTA button: **Choisir un timer**

### Functional Rules

- Opens timer selection / creation screen
- Timer can be linked to a session or used standalone

---

## 8. Bottom Navigation

### Tabs

- Home
- Library - Exercise
- Agenda
- Profile

### Functional Rules

- Persistent across app
- Current tab highlighted

---

## 9. Edge Cases & States

- **No wellness data** → prompt input
- **No sessions today** → empty state
- **Offline mode** → cached data only, sync later

---

## 10. Analytics & Tracking (Optional)

- Homepage viewed
- Wellness CTA clicked
- Timer launched
- Session opened

---

## 11. Permissions & Dependencies

- Requires authenticated user
- Depends on:
  - Wellness service
  - Training schedule service
  - Notification service

---

## 12. Future Enhancements (Out of Scope)

- Multi-week calendar
- Personalized tips based on wellness score
- Coach announcements on homepage
