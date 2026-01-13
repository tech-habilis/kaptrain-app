# Kaptrain Mobile App – Blessure (Injury) Functional Requirements

## APP – FR-XXX View Injuries List
**Description**  
Allow users to view a list of all declared injuries with their current status.

**Actor**  
Athlete

**Acceptance Criteria**
- Display all injuries (active and treated).
- Show injury name, status (En cours / Soignée), and start date.
- User can access injury detail from the list.
- Empty state is shown when no injury exists.

---

## APP – FR-XXX Add Injury – Step 1: Select Injury Area
**Description**  
Allow the user to select the injured body area via list or human body view.

**Actor**  
Athlete

**Acceptance Criteria**
- User can switch between *List* and *Human Body* views.
- Selecting a body part highlights it visually.
- Only one injury area can be selected per injury.
- User must select an area to proceed.

---

## APP – FR-XXX Add Injury – Step 2: Injury Date
**Description**  
Allow the user to define when the injury started.

**Actor**  
Athlete

**Acceptance Criteria**
- User can select a date using a date picker.
- Date cannot be in the future.
- Step cannot be skipped.

---

## APP – FR-XXX Add Injury – Step 3: Injury Description
**Description**  
Allow the user to describe the injury and define its status.

**Actor**  
Athlete

**Acceptance Criteria**
- User can input injury name.
- User can describe how the injury occurred.
- User can select injury status: *En cours* or *Soignée*.
- Injury is saved upon validation.

---

## APP – FR-XXX View Injury Detail
**Description**  
Allow users to consult detailed information about an injury.

**Actor**  
Athlete

**Acceptance Criteria**
- Display injury name, description, date, and status.
- Show highlighted body area.
- Provide action to mark injury as treated.
- Provide edit option.

---

## APP – FR-XXX Edit Injury
**Description**  
Allow users to modify an existing injury.

**Actor**  
Athlete

**Acceptance Criteria**
- User can edit injury name, description, status, and body area.
- Changes are saved only after confirmation.
- Updated data is reflected immediately.

---

## APP – FR-XXX Delete Injury
**Description**  
Allow users to permanently delete an injury.

**Actor**  
Athlete

**Acceptance Criteria**
- User can trigger deletion from injury edit screen.
- Confirmation modal is required.
- Injury is permanently removed after confirmation.
- Deleted injury no longer appears in the list.
