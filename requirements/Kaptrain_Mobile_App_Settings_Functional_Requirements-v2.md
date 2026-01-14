# Kaptrain Mobile App — Paramètres (Settings)

## APP – FR-SET-001 Paramètres

---

## APP – FR-SET-001.1 Accès aux paramètres

**Description**  
Allow users to access and navigate all application settings.

**Actor**  
Athlete

**Priority**  
High

**Acceptance Criteria**

- User can access Settings from the main navigation.
- Settings sections are clearly grouped (Profile, Training, Application, Legal).
- Back navigation returns user to the previous screen.
- Settings are loaded with current user values.

---

## APP – FR-SET-002 Gestion du profil

**Description**  
Allow users to view and update their personal profile information.

**Actor**  
Athlete

**Priority**  
High

**Acceptance Criteria**

- User can edit first name and last name.
- User can update date of birth.
- User can select gender (Femme, Homme, Non binaire).
- User can update height and weight.
- User can select practice level (Débutant → Expert).
- User can toggle wheelchair mode.
- Changes are not saved until user taps “Enregistrer les modifications”.
- Success feedback is shown after saving.
- Validation prevents empty mandatory fields.

---

## APP – FR-SET-003 Photo de profil

**Description**  
Allow users to update and crop their profile picture.

**Actor**  
Athlete

**Priority**  
Medium

**Acceptance Criteria**

- User can tap avatar to change profile photo.
- User can select a photo from device.
- User can crop and reposition the image.
- User can cancel or confirm photo changes.
- Confirmed photo replaces previous avatar.

---

## APP – FR-SET-004 Suppression du compte

**Description**  
Allow users to permanently delete their account.

**Actor**  
Athlete

**Priority**  
High

**Acceptance Criteria**

- User can access “Supprimer mon compte” from profile.
- A confirmation modal explains irreversible action.
- User can cancel deletion.
- User must explicitly confirm deletion.
- Account and associated data are deleted after confirmation.

---

## APP – FR-SET-005 Sécurité – Mot de passe

**Description**  
Allow users to update their account password.

**Actor**  
Athlete

**Priority**  
High

**Acceptance Criteria**

- User can enter current password.
- User can enter and confirm a new password.
- Password must meet minimum length requirements.
- Error is shown if confirmation does not match.
- Password visibility can be toggled.
- Success message is displayed after update.

---

## APP – FR-SET-006 Déconnexion

**Description**  
Allow users to log out from the application.

**Actor**  
Athlete

**Priority**  
High

**Acceptance Criteria**

- User can initiate logout from Settings.
- Confirmation modal is displayed.
- User can cancel logout.
- Confirmed logout redirects to login screen.

---

## APP – FR-SET-007 Ressenti & suivi de forme

**Description**  
Allow users to configure how wellness and effort feedback is collected.

**Actor**  
Athlete

**Priority**  
Medium

**Acceptance Criteria**

- User can choose global RPE or physical + cognitive RPE.
- Selection is saved per user.
- User can enable or disable daily wellness prompt.
- Recommended option is highlighted by default.

---

## APP – FR-SET-008 Unités de mesure

**Description**  
Allow users to select preferred measurement units.

**Actor**  
Athlete

**Priority**  
Medium

**Acceptance Criteria**

- User can select weight unit (kg or lbs).
- User can select height unit (cm or ft/in).
- Selection is persisted and applied across the app.
- Changes require explicit save.

---

## APP – FR-SET-009 Langue de l’application

**Description**  
Allow users to change application language.

**Actor**  
Athlete

**Priority**  
Medium

**Acceptance Criteria**

- User can select French or English.
- Only one language can be active.
- Language change is applied immediately after save.

---

## APP – FR-SET-010 Notifications

**Description**  
Allow users to manage training notifications.

**Actor**  
Athlete

**Priority**  
Low

**Acceptance Criteria**

- User can enable or disable training notifications.
- Toggle reflects current system permission state.
- Changes are persisted.

---

## APP – FR-SET-011 Support & informations légales

**Description**  
Provide access to legal documents and support contact.

**Actor**  
Athlete

**Priority**  
Low

**Acceptance Criteria**

- User can view Conditions d’utilisation.
- User can view Politique de confidentialité.
- User can access support phone number.
- User can send support email via default mail app.

---

## Non-Functional Requirements

- All destructive actions require confirmation.
- Settings changes must be persisted per user.
- UI provides immediate feedback on save or error.
- Accessibility standards are respected.
