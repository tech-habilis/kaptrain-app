# Kaptrain Mobile App – Library – Exercises (Acceptance Criteria)

## APP – FR-LIB-EX-OVERVIEW
**Description**  
Provide athletes with access to the exercise library from the bottom navigation, allowing them to browse, search, and filter exercises.

**Actor**  
Athlete

**Priority**  
High

**Acceptance Criteria**
- The Library tab is accessible from the bottom navigation.
- The “Exercises” section is displayed by default when entering the Library.
- The screen loads a list or grid of available exercises.

---

## APP – FR-LIB-EX-LIST-VIEW
**Description**  
Allow users to browse all exercises in a structured list or grid layout.

**Actor**  
Athlete

**Priority**  
High

**Acceptance Criteria**
- Exercises are displayed with a thumbnail, name, and key indicators.
- The user can scroll through the list smoothly.
- The system supports both list and grid layouts if enabled.
- The total number of results is displayed.

---

## APP – FR-LIB-EX-SEARCH
**Description**  
Enable users to search for exercises by name or keyword.

**Actor**  
Athlete

**Priority**  
High

**Acceptance Criteria**
- A search input is visible at the top of the exercises list.
- The user can enter text to filter exercises in real time.
- Search results update dynamically based on the entered keyword.
- An empty state is displayed if no results match the search.

---

## APP – FR-LIB-EX-FILTER-BY-SPORT
**Description**  
Allow users to filter exercises by sport or discipline.

**Actor**  
Athlete

**Priority**  
Medium

**Acceptance Criteria**
- Sport filter chips (e.g., Running, Cycling, Hyrox) are displayed.
- The user can select one or multiple sports.
- The exercise list updates according to selected sports.
- Selected filters are visually highlighted.

---

## APP – FR-LIB-EX-FAVORITES
**Description**  
Allow users to mark exercises as favorites for quick access.

**Actor**  
Athlete

**Priority**  
Medium

**Acceptance Criteria**
- A favorite (heart) icon is visible on each exercise card.
- The user can add or remove an exercise from favorites.
- Favorited exercises are accessible via a “Favorites” filter.
- Favorite state persists across sessions.

---

## APP – FR-LIB-EX-SORTING
**Description**  
Allow users to sort exercises by predefined criteria.

**Actor**  
Athlete

**Priority**  
Low

**Acceptance Criteria**
- A “Sort by” option is available.
- The user can sort exercises alphabetically (A–Z, Z–A).
- The exercise list updates immediately after sorting.

---

## APP – FR-LIB-EX-DETAIL-VIEW
**Description**  
Provide detailed information for a selected exercise.

**Actor**  
Athlete

**Priority**  
High

**Acceptance Criteria**
- Tapping an exercise opens the Exercise Detail screen.
- The detail screen displays a video or visual demonstration.
- The exercise description is clearly visible.
- Targeted muscle groups are displayed using tags or visuals.

---

## APP – FR-LIB-EX-INSTRUCTIONS
**Description**  
Display step-by-step instructions for performing an exercise correctly.

**Actor**  
Athlete

**Priority**  
High

**Acceptance Criteria**
- An “Instructions” tab is available on the exercise detail screen.
- Instructions are displayed in ordered steps.
- Content is readable on small screens without horizontal scrolling.

---

## APP – FR-LIB-EX-METADATA
**Description**  
Show exercise metadata such as equipment and themes.

**Actor**  
Athlete

**Priority**  
Medium

**Acceptance Criteria**
- Required equipment (e.g., kettlebell) is displayed.
- Exercise themes (e.g., strength, yoga) are visible.
- Metadata is presented consistently across exercises.

---

## APP – FR-LIB-EX-NAVIGATION
**Description**  
Ensure smooth navigation between Library and other app sections.

**Actor**  
Athlete

**Priority**  
Medium

**Acceptance Criteria**
- The user can return to the exercise list from the detail view.
- Bottom navigation remains accessible at all times.
- Navigation state is preserved when switching tabs.
