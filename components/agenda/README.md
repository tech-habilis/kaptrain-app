# Agenda Components

This directory contains components specific to the Agenda tab of the Kaptrain mobile app.

## Components

### `Day` Component

A calendar day component that displays a day number with optional activity indicators.

**Props:**
- `day: string` - Day number to display
- `isCurrentMonth?: boolean` - Whether the day belongs to the current month (default: true)
- `isToday?: boolean` - Whether this is today's date (default: false)
- `activities?: ActivityStatus[]` - Array of activity statuses to display as colored dots (max 3)
- `onPress?: () => void` - Optional callback when day is pressed

**Activity Status Types:**
- `"orange"` - Orange indicator (#FF9E69)
- `"blue"` - Blue indicator (#457CE2)
- `"green"` - Green indicator (#3FA951)
- `"grey"` - Grey indicator (#424F65)

**Features:**
- Shows up to 3 activity indicators as colored dots above the day number
- Highlights today with blue background
- Reduces opacity for days outside current month
- Responsive to press events

**Usage:**
```tsx
import { Day } from "@/components/agenda";

<Day
  day="19"
  isToday={true}
  isCurrentMonth={true}
  activities={["orange", "blue"]}
  onPress={() => console.log("Day pressed")}
/>
```

### `ActivityCard` Component

A reusable card component for displaying activity sessions (Note: Currently not used in the agenda tab as we follow the existing pattern from index.tsx).

**Props:**
- `title: string` - Activity title
- `description: string` - Activity description
- `coachName: string` - Coach/creator name
- `activityType?: ActivityType` - Type of activity (default: "sport")
- `borderColor?: string` - Custom left border color (overrides activityType color)
- `icon?: React.ReactNode` - Optional icon to display next to title
- `onPress?: () => void` - Optional callback when card is pressed

**Activity Types:**
- `"sport"` - Blue border (#457CE2)
- `"preparation"` - Orange border (#FF9E69)
- `"other"` - Grey border (#424F65)

**Usage:**
```tsx
import { ActivityCard } from "@/components/agenda";
import IcHyrox from "@/components/icons/hyrox";

<ActivityCard
  title="Hyrox"
  description="Hyrox Paris Grand palais"
  coachName="Par Enguerrand Aucher"
  activityType="sport"
  icon={<IcHyrox size={16} />}
  onPress={() => {}}
/>
```

## Implementation in Agenda Tab

The agenda tab (`app/(tabs)/agenda.tsx`) implements:

1. **Header Section**
   - Month/Year display
   - "Aujourd'hui" (Today) chip button
   - Previous/Next month navigation arrows

2. **Calendar Grid**
   - Week day headers (LUN, MAR, MER, JEU, VEN, SAM, DIM)
   - 5-week calendar view
   - Day components with activity indicators
   - Today highlighting

3. **Daily Activities List**
   - Date header
   - Activity cards following the existing pattern from home screen
   - Left-colored borders matching activity type
   - Coach information

4. **Floating Action Button**
   - Plus icon button for adding new activities
   - Positioned at bottom-right

## Styling

All components use:
- Tailwind CSS classes for styling
- `cn()` utility for merging classes
- `clsx()` for conditional classes
- ColorConst from theme for programmatic colors

## Related Files

- `app/(tabs)/agenda.tsx` - Main agenda screen implementation
- `components/icons/arrow-right.tsx` - Arrow icon for navigation
- `constants/theme.ts` - Color definitions
- `app/(tabs)/index.tsx` - Reference implementation for activity cards pattern