## APP – FR-AG-030 Timer de séance

**Description**  
Allow athletes to start, configure, pause, resume, and complete different types of training timers (Chronomètre, Minuteur, EMOM, AMRAP, Tabata, Personnalisé) directly from a session or from the home screen.

**Actor**  
Athlete

**Priority**  
High

**Acceptance Criteria**
- Athlete can open the timer from an Agenda session or from the Home screen.
- Athlete can choose a timer type: Chronomètre, Minuteur, EMOM, AMRAP, Tabata, or Personnalisé.
- For configurable timers (Tabata, Personnalisé):
  - Athlete can set effort duration.
  - Athlete can set rest duration.
  - Athlete can set number of rounds.
- System validates timer parameters before starting.
- Athlete can start the timer with a visible countdown.
- System displays current phase (effort / rest), remaining time, and current round.
- Athlete can pause and resume the timer at any time.
- Athlete can stop the timer and is asked for confirmation before closing.
- When all rounds are completed, system displays a completion screen.
- Athlete can terminate the timer manually after completion.
- Timer state is preserved if the athlete navigates back to the session.
- Only one active timer can run at a time.
- Starting a new timer prompts confirmation to replace the current one.
