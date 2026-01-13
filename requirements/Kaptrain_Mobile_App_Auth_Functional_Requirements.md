# Kaptrain Mobile App – Authentication & Account Recovery
## APP – FR-XXX Connexion (Login)

**Description**  
Allow users to authenticate into the mobile application using email/password or third‑party providers.

**Actor**  
Athlete, Coach

**Priority**  
High

**Acceptance Criteria**
- User can enter an email and password.
- System validates credentials.
- User can toggle password visibility.
- Error message is displayed for invalid credentials.
- User can authenticate using Google.
- User can authenticate using Apple.
- Successful login redirects user to the app home.
- “Mot de passe oublié” link redirects to password recovery flow.


## APP – FR-XXX Inscription (Registration)

**Description**  
Allow new users to create an account using email and password.

**Actor**  
Athlete, Coach

**Priority**  
High

**Acceptance Criteria**
- User can input email, password, and password confirmation.
- Password rules are clearly displayed (min length, uppercase, lowercase, number, special character).
- System validates email format.
- Password and confirmation must match.
- User must accept Terms of Use and Privacy Policy.
- Account creation triggers email verification.
- Error messages are displayed for invalid inputs.


## APP – FR-XXX Vérification d’email

**Description**  
Ensure that the user verifies ownership of their email address via a verification code.

**Actor**  
Athlete, Coach

**Priority**  
High

**Acceptance Criteria**
- System sends a verification code to the user’s email.
- User can enter a multi‑digit verification code.
- Countdown timer is displayed before allowing resend.
- User can request code resend after timer expires.
- Invalid code displays an error.
- Successful verification redirects to success screen.
- Verified status is stored in the system.


## APP – FR-XXX Succès de vérification

**Description**  
Confirm successful email verification and guide user to next step.

**Actor**  
Athlete, Coach

**Priority**  
Medium

**Acceptance Criteria**
- Success message is displayed.
- Visual confirmation icon is shown.
- “Compléter mon profil” button is available.
- User is redirected to profile completion flow.


## APP – FR-XXX Mot de passe oublié – Demande

**Description**  
Allow users to request a password reset link via email.

**Actor**  
Athlete, Coach

**Priority**  
High

**Acceptance Criteria**
- User can enter their registered email.
- System validates email format.
- Reset email is sent if email exists.
- Confirmation screen is displayed.
- Countdown timer prevents immediate resend.
- Error message is displayed for invalid email.


## APP – FR-XXX Mot de passe oublié – Email envoyé

**Description**  
Inform the user that a password reset email has been sent.

**Actor**  
Athlete, Coach

**Priority**  
Medium

**Acceptance Criteria**
- Confirmation message is displayed.
- User is instructed to check inbox and spam.
- Resend option is disabled until timer ends.
- User can navigate back to login.


## APP – FR-XXX Création d’un nouveau mot de passe

**Description**  
Allow users to securely define a new password after reset.

**Actor**  
Athlete, Coach

**Priority**  
High

**Acceptance Criteria**
- User can input a new password and confirmation.
- Password rules are enforced.
- Validation errors are clearly displayed.
- Password and confirmation must match.
- Successful reset updates credentials.
- User is redirected to success screen.


## APP – FR-XXX Mot de passe réinitialisé – Succès

**Description**  
Confirm successful password update and return user to login.

**Actor**  
Athlete, Coach

**Priority**  
Medium

**Acceptance Criteria**
- Success confirmation message is displayed.
- Visual confirmation icon is shown.
- “Se connecter” button redirects to login screen.
