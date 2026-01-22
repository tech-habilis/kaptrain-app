# Session Ended Form - Fill Duration Screen

## Overview
This screen is the first step (1/2) of the end-of-session flow where users can input the actual duration of their completed training session.

## File Location
`kaptrain-mobile/app/session-ended-form.tsx`

## Design Reference
Figma: [Agenda-séance-RPE](https://www.figma.com/design/EPN2EkGCJqySe8D969drQz/Untitled-Unmastered?node-id=951-12807)

## Features

### 1. Header Section
- **Back Button**: Arrow-left icon to navigate back
- **Title**: "Remplir la durée de séance"
- **Description**: Explains the importance of accuracy for data analysis
- **Stepper**: Shows progress (1/2) indicating this is the first of two steps

### 2. Duration Picker
- **Interactive Circular Progress**: 
  - Displays current duration value (default: 30 min)
  - Maximum duration: 240 minutes (4 hours)
  - Users can tap or drag on the circle to adjust duration
  - Shows value in format: `XX min`


### 3. CTAs (Call-to-Actions)
- **Primary Button**: "Suivant" - Proceeds to step 2 (session evaluation)
- **Tertiary Button**: "Remplir plus tard" - Skips the form

## Components Used

### Core Components
- `Button` - Primary and tertiary styled buttons
- `Text` - Typography component
- `CircularProgress` - Interactive circular duration picker
- `IcArrowLeft` - Back navigation icon

### Custom Components
- `Stepper` - Progress indicator (1/2, 2/2)

## State Management
```typescript
const [duration, setDuration] = useState<number>(30);
const maxDuration = 240; // 4 hours max
```

## Navigation
- **Back**: Returns to previous screen
- **Suivant**: Should navigate to session evaluation screen (step 2/2)
- **Remplir plus tard**: Skips form and returns to previous screen

## Route Constants
Added to `kaptrain-mobile/constants/route.ts`:
- `ROUTE_NAME.SESSION_ENDED_FORM`: "session-ended-form"
- `ROUTE.SESSION_ENDED_FORM`: "/session-ended-form"

## Color Scheme
- Primary: #457CE2 (blue)
- Secondary: #06234B (dark blue)
- Light: #F6F7FC (light background)
- Subtle Text: #727988 (gray)

## Design Specifications from Figma

### Layout
- Container: 375x812px (mobile frame)
- Padding: 24px horizontal, 16px vertical
- Gap between sections: 24px

### Typography
- Title: Futura Bold, 18px, line-height 1.4em
- Description: Inter Regular, 16px, line-height 1.21em, letter-spacing 1.875%
- Duration Value: Inter Bold, 48px

### Circular Progress
- Size: 280x280px
- Stroke width: 20px
- Progress color: #457CE2
- Uses default background color from CircularProgress component

### Buttons
- Large size: 16px padding, 16px border-radius
- Primary: #457CE1 background, white text
- Tertiary: Transparent background, secondary text

## Next Steps
1. Implement step 2/2: Session evaluation screen
2. Connect duration data to session storage/API
3. Add validation for minimum duration (if required)
4. Implement navigation to evaluation screen on "Suivant" click

## Notes
- The screen uses the existing `CircularProgress` component which provides gesture handling for duration selection
- Implementation matches the pattern used in `CircularValueModal` component
- StatusBar is set to "auto" to adapt to system theme
- Bottom CTAs are positioned absolutely to stay fixed at the bottom