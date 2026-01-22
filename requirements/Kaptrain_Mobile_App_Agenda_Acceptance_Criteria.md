## APP – FR-XXX Agenda (Calendar & Session Overview)

**Description**  
Allow athletes and coaches to view, navigate, and manage scheduled training sessions through a calendar-based agenda.

**Actor**  
Athlete, Coach

**Priority**  
High

**Acceptance Criteria**
- User can access the Agenda from the bottom navigation.
- Agenda displays a monthly calendar view by default.
- Current day is visually highlighted in the calendar.
- Days containing scheduled sessions show visual indicators.
- User can navigate between months.
- User can return to the current date using an “Aujourd’hui” action.
- Selecting a date displays the list of sessions scheduled for that day.
- Each session card displays:
  - Session name
  - Sport or thematic type
  - Coach name
- User can tap a session to access session details.
- If no session exists for a selected date, an empty state is displayed.
- Floating action button (+) is visible to create a new session.

---

## APP – FR-XXX Create Training Session

**Description**  
Allow coaches to create and schedule a new training session from the agenda.

**Actor**  
Coach

**Priority**  
High

**Acceptance Criteria**
- Coach can initiate session creation from the Agenda using the (+) button.
- Creation flow is presented as a step-by-step process.
- Coach can select a thematic category (e.g., Sports, Mobility & Stretching).
- Coach can select one or more sports.
- Coach can add a custom sport if not listed.
- Coach can define session date and start/end time.
- System validates that end time is after start time.
- Coach can enter a session name.
- Coach can add one or more training blocks to the session.
- Each block can be edited after creation.
- Coach can remove a block before validation.
- Coach can validate and save the session.
- Upon validation, the session appears in the Agenda on the selected date.
- User receives visual confirmation that the session has been created.
