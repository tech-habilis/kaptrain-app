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

A reusable card component for displaying activity sessions. Used in both the home screen and agenda tab.

**Props:**
- `title: string` - Activity title
- `description: string` - Activity description
- `coachName: string` - Coach/creator name
- `borderColor?: string` - Left border color (default: ColorConst.primary)
- `icon?: React.ReactNode` - Optional icon to display next to title
- `status?: ActivityStatus` - Activity status: "completed" or "pending" (default: "pending")
- `completedIcon?: React.ReactNode` - Icon to show when status is "completed"
- `onPress?: () => void` - Optional callback when card is pressed

**Features:**
- Displays activity with colored left border
- Shows icon or completed icon based on status
- Includes title, description, and coach name
- Clickable with press feedback

**Usage:**
```tsx
import { ActivityCard } from "@/components/agenda";
import IcHyrox from "@/components/icons/hyrox";
import IcCheckCircleFilled from "@/components/icons/check-circle-filled";
import { ColorConst } from "@/constants/theme";

<ActivityCard
  title="Hyrox"
  description="Hyrox Paris Grand palais"
  coachName="Par Enguerrand Aucher"
  borderColor={ColorConst.primary}
  icon={<IcHyrox size={16} />}
  status="completed"
  completedIcon={<IcCheckCircleFilled size={16} />}
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
   - Activity cards using the ActivityCard component
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

## Component Reuse

Both the `Day` and `ActivityCard` components are now used in:
- `app/(tabs)/index.tsx` - Home screen (week view calendar and today's sessions)
- `app/(tabs)/agenda.tsx` - Agenda screen (monthly calendar and daily activities)

This ensures consistent UI patterns across the app.

## Related Files

- `app/(tabs)/agenda.tsx` - Main agenda screen implementation
- `app/(tabs)/index.tsx` - Home screen using the same components
- `components/icons/arrow-right.tsx` - Arrow icon for navigation
- `constants/theme.ts` - Color definitions