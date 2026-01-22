# Kaptrain Mobile Codebase Guide

This guide provides essential information about the Kaptrain mobile app codebase for AI assistants to maintain consistency when implementing new features.

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (via `uniwind` and `tailwindcss`)
- **Navigation**: Expo Router (file-based routing)
- **Internationalization**: react-i18next
- **State Management**: React hooks and context
- **Utilities**: 
  - `clsx` - for conditional class names
  - `tailwind-merge` - for merging Tailwind classes
  - `tailwind-variants` - for component variants

## Project Structure

```
kaptrain-mobile/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── _layout.tsx    # Tab bar configuration
│   │   ├── index.tsx      # Home screen
│   │   ├── agenda.tsx     # Agenda/Calendar screen
│   │   └── library.tsx    # Library screen
│   └── [other-screens].tsx
├── components/            # Reusable components
│   ├── icons/            # Icon components (SVG)
│   ├── home/             # Home screen specific components
│   ├── agenda/           # Agenda screen specific components
│   ├── ui/               # UI components
│   └── [shared-components].tsx
├── constants/            # App constants
│   ├── theme.ts          # Colors and fonts
│   ├── route.ts          # Route names
│   └── mock.ts           # Mock data
├── contexts/             # React contexts
├── hooks/                # Custom hooks
├── utilities/            # Utility functions
│   └── cn.ts            # Class name utility
├── assets/               # Images and static assets
└── global.css           # Global Tailwind CSS theme
```

## Styling System

### Tailwind CSS Configuration

The app uses Tailwind CSS v4 with custom color tokens defined in `global.css`:

```css
@theme {
  --color-primary: #457CE2;        /* Blue */
  --color-secondary: #06234B;      /* Dark blue */
  --color-tertiary: #FF9E69;       /* Orange */
  --color-decorative: #FFD1A7;     /* Light orange */
  --color-text: #04152D;           /* Dark text */
  --color-subtleText: #727988;     /* Gray text */
  --color-stroke: #E5E5EB;         /* Border color */
  --color-accent: #424F65;         /* Accent gray */
  --color-light: #EEEFF9;          /* Light background */
  --color-warmLight: #FFF7F3;      /* Warm light background */
  --color-success: #4FD365;        /* Green */
  --color-error: #FF604B;          /* Red */
  --color-secondary-500: #1A1C1E;
  --color-secondary-grey: #BABABA;
}
```

### Using Colors

Access colors in two ways:

1. **Tailwind classes**: `bg-primary`, `text-secondary`, `border-stroke`
2. **ColorConst object** (for inline styles):

```typescript
import { ColorConst } from "@/constants/theme";

style={{ backgroundColor: ColorConst.primary }}
```

### Class Name Utilities

#### `cn()` - For merging Tailwind classes

```typescript
import cn from "@/utilities/cn";

// Only accepts strings
className={cn("base-class", "additional-class")}
```

#### `clsx()` - For conditional classes

```typescript
import { clsx } from "clsx";

// Use for conditional logic
className={cn(
  "base-class",
  clsx({
    "active-class": isActive,
    "disabled-class": isDisabled,
  })
)}
```

**Pattern**: Combine `cn()` and `clsx()` for conditional Tailwind classes:

```typescript
className={cn(
  "w-8 h-8 rounded-full",
  clsx({
    "bg-primary": isActive,
    "opacity-60": isDisabled,
  })
)}
```

## Component Patterns

### Text Component

**Always use the custom `Text` component** (supports i18n):

```typescript
import Text from "@/components/text";

<Text className="font-bold text-lg">My text</Text>
```

### Button Components

Three button variants available:

```typescript
import Button, { ButtonIcon, ButtonLink } from "@/components/button";

// Standard button
<Button
  text="Click me"
  type="primary" | "secondary" | "tertiary" | "link" | "secondaryV2"
  size="small" | "large"
  leftIcon={<Icon />}
  rightIcon={<Icon />}
  loading={isLoading}
  onPress={handlePress}
/>

// Icon-only button
<ButtonIcon size="large" type="primary">
  <IcPlus size={24} />
</ButtonIcon>

// Link button
<ButtonLink href="/path" text="Go" size="small" />
```

### Chip Component

```typescript
import { Chip } from "@/components/chip";

<Chip
  text="Label"
  type="default" | "selected" | "disabled" | "uncheck"
  leftIcon={<Icon />}
  onLeftSidePress={(isClose) => {}}
  className="custom-classes"
/>
```

### Icons

All icons are in `components/icons/` and follow this pattern:

```typescript
import * as React from "react";
import Svg, { Path } from "react-native-svg";

const IcIconName = ({ size = 24, color = "#424F65" }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="..." stroke={color} strokeWidth={2} />
    </Svg>
  );
};

export default IcIconName;
```

**Icon naming convention**: `IcIconName` (e.g., `IcArrowLeft`, `IcPlus`, `IcHyrox`)

## Common Patterns

### Screen Layout

```typescript
import { StatusBar } from "expo-status-bar";
import { ScrollView, View } from "react-native";
import Text from "@/components/text";

export default function ScreenName() {
  return (
    <View className="flex-1 bg-white">
      <StatusBar style="auto" />
      <ScrollView className="flex-1 pt-safe px-4">
        {/* Content */}
      </ScrollView>
    </View>
  );
}
```

### Safe Area

Use `pt-safe` class for top padding that respects safe area:

```typescript
<ScrollView className="pt-safe px-4">
```

### Activity/Session Cards

Consistent pattern for displaying activities:

```typescript
<View className="border border-stroke rounded-xl flex-row items-center justify-between pr-3">
  <View
    className="flex-1 py-1.5 pl-3 rounded-xl"
    style={{
      borderLeftWidth: 4,
      borderLeftColor: activity.color,
    }}
  >
    {/* Title with icon */}
    <View className="flex-row items-center gap-1">
      {icon && <View>{icon}</View>}
      <Text className="font-bold text-sm">{activity.title}</Text>
    </View>

    {/* Description */}
    <Text className="text-subtleText text-xs mt-1">
      {activity.description}
    </Text>

    {/* Coach name */}
    <Text className="text-text text-[10px] mt-0.5 italic">
      {activity.coachName}
    </Text>
  </View>

  {/* Arrow icon */}
  <IcArrowRight size={24} color={ColorConst.accent} />
</View>
```

### Calendar Day Component

Pattern for calendar days with activity indicators:

```typescript
<View className="w-8 h-8 items-center justify-center rounded-full relative">
  {/* Activity indicators (colored dots) */}
  <View className="absolute top-0 flex-row gap-0.75">
    {activities.map((activity, index) => (
      <View
        key={index}
        className="w-1.75 h-1.75 rounded-full border border-light"
        style={{ backgroundColor: activity.color }}
      />
    ))}
  </View>

  {/* Day number */}
  <Text className="text-sm font-medium">{day}</Text>
</View>
```

## Typography Scale

Common text styles used in the app:

- **Headings**: `text-lg font-bold` or `text-xl font-bold`
- **Body text**: `text-base` (default)
- **Small text**: `text-sm`
- **Extra small**: `text-xs`
- **Tiny text**: `text-[10px]`

**Font weights**:
- `font-normal` (400)
- `font-medium` (500)
- `font-semibold` (600)
- `font-bold` (700)

## Spacing Scale

Common gaps and padding:

- `gap-1` to `gap-4` (0.25rem increments)
- `p-4` for screen padding (1rem)
- `px-4` for horizontal padding
- `py-2` to `py-4` for vertical padding
- `mt-1`, `mt-2`, `mt-3`, etc. for margins

## Border Radius

- `rounded-sm` - Small (2px)
- `rounded-lg` - Large (8px)
- `rounded-xl` - Extra large (12px)
- `rounded-2xl` - 2X large (16px)
- `rounded-full` - Circle

## Component Variants with tailwind-variants

For components with multiple variants, use `tailwind-variants`:

```typescript
import { tv, VariantProps } from "tailwind-variants";

const component = tv({
  base: "base-classes",
  variants: {
    type: {
      primary: "bg-primary text-white",
      secondary: "bg-light text-secondary",
    },
    size: {
      small: "px-3 py-2",
      large: "px-4 py-4",
    },
  },
  defaultVariants: {
    type: "primary",
    size: "large",
  },
});

type ComponentVariants = VariantProps<typeof component>;
```

## File Organization

### When to create a new component

1. **Reusable across multiple screens** → Place in `components/`
2. **Screen-specific** → Place in `components/[screen-name]/`
3. **Icon** → Place in `components/icons/`

### Naming Conventions

- **Components**: PascalCase (e.g., `ActivityCard.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useColorScheme.ts`)
- **Utilities**: camelCase (e.g., `cn.ts`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `ROUTE_NAME`)

## Internationalization

The app uses react-i18next. The custom `Text` component automatically translates:

```typescript
// Automatically translated
<Text>menu.agenda</Text>

// Without translation
<Text>{someVariable}</Text>
```

## Mock Data Structure

When creating mock data, follow patterns in `constants/mock.ts`:

```typescript
const mockActivity = {
  title: "Activity name",
  sessionTitle: "Session description",
  coachName: "Par Coach Name",
  color: ColorConst.primary,
  icon: <IcIcon size={16} />,
  status: "completed" | "pending",
};
```

## Best Practices

1. **Always import from `@/` aliases** instead of relative paths
2. **Use TypeScript interfaces** for component props
3. **Extract inline styles** to `style` prop when using dynamic values
4. **Combine Tailwind with inline styles** when needed (border colors, backgrounds)
5. **Use `clsx` for conditionals**, `cn` for merging
6. **Follow existing patterns** for consistency
7. **Check existing components** before creating new ones
8. **Use ColorConst** for programmatic color access
9. **Always use the custom `Text` component**, not React Native's `Text`
10. **Add StatusBar** to screens: `<StatusBar style="auto" />`

## Common Component Props Pattern

```typescript
interface ComponentProps {
  // Required props first
  title: string;
  
  // Optional props with defaults
  size?: "small" | "large";
  type?: "primary" | "secondary";
  
  // Optional callbacks
  onPress?: () => void;
  
  // Optional custom styling
  className?: string;
  
  // Optional React nodes
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export function Component({
  title,
  size = "large",
  type = "primary",
  onPress,
  className = "",
  icon,
  children,
}: ComponentProps) {
  // Implementation
}
```

## Testing New Implementations

After creating new components:

1. Check for TypeScript errors: `diagnostics` tool
2. Ensure consistent naming with existing patterns
3. Verify color usage matches theme
4. Test with the existing app flow
5. Ensure responsive behavior on different screen sizes

---

**Note**: This guide should be used as a reference when implementing new features to maintain consistency across the codebase.