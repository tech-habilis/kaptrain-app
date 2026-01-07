# AI Assistant Prompt for Kaptrain Mobile Development

Use this prompt when working with AI assistants to ensure consistent implementation across the Kaptrain mobile codebase.

---

## Context

You are working on the **Kaptrain Mobile** app, a React Native application built with Expo. Your task is to implement features that match the existing codebase patterns and styling conventions.

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript (strictly typed)
- **Styling**: Tailwind CSS v4 via `uniwind` and `tailwindcss`
- **Navigation**: Expo Router (file-based routing)
- **Internationalization**: react-i18next
- **Icons**: SVG components using `react-native-svg`
- **Utilities**: `clsx` for conditionals, `tailwind-merge` for class merging, `tailwind-variants` for component variants

## Critical Rules

### 1. Text Component
**ALWAYS use the custom `Text` component** (never React Native's `Text`):
```typescript
import Text from "@/components/text";
<Text className="font-bold text-lg">My text</Text>
```

### 2. Class Name Utilities
Combine `cn()` and `clsx()` for conditional Tailwind classes:
```typescript
import cn from "@/utilities/cn";
import { clsx } from "clsx";

// Pattern to follow:
className={cn(
  "base-classes",
  clsx({
    "conditional-class": condition,
    "another-class": anotherCondition,
  })
)}
```

**Important**: 
- `cn()` only accepts strings
- Use `clsx()` for conditional logic
- Combine them as shown above

### 3. Imports
Always use `@/` alias imports (never relative paths):
```typescript
import Text from "@/components/text";
import { ColorConst } from "@/constants/theme";
import cn from "@/utilities/cn";
```

### 4. StatusBar
Add to every screen:
```typescript
import { StatusBar } from "expo-status-bar";
<StatusBar style="auto" />
```

## Color System

### Theme Colors
```css
primary: #457CE2        /* Blue */
secondary: #06234B      /* Dark blue */
tertiary: #FF9E69       /* Orange */
decorative: #FFD1A7     /* Light orange */
text: #04152D           /* Dark text */
subtleText: #727988     /* Gray text */
stroke: #E5E5EB         /* Border color */
accent: #424F65         /* Accent gray */
light: #EEEFF9          /* Light background */
success: #4FD365        /* Green */
error: #FF604B          /* Red */
```

### Using Colors
1. **Tailwind classes**: `bg-primary`, `text-secondary`, `border-stroke`
2. **Inline styles**: 
```typescript
import { ColorConst } from "@/constants/theme";
style={{ backgroundColor: ColorConst.primary }}
```

## Component Patterns

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
        <Text className="text-lg font-bold text-secondary">Title</Text>
        {/* Content */}
      </ScrollView>
    </View>
  );
}
```

### Activity/Session Card Pattern
**Follow this exact pattern** (from `app/(tabs)/index.tsx`):
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

### Button Components
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
```

### Icon Component Pattern
```typescript
import * as React from "react";
import Svg, { Path } from "react-native-svg";

const IcIconName = ({ size = 24, color = "#424F65" }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M..."
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default IcIconName;
```

### Chip Component
```typescript
import { Chip } from "@/components/chip";

<Chip
  text="Label"
  type="default" | "selected" | "disabled" | "uncheck"
  leftIcon={<Icon />}
  className="border border-stroke"
/>
```

## Typography

- **Headings**: `text-lg font-bold` or `text-xl font-bold`
- **Body**: `text-base` (default)
- **Small**: `text-sm`
- **Extra small**: `text-xs`
- **Tiny**: `text-[10px]`

**Font weights**: `font-normal`, `font-medium`, `font-semibold`, `font-bold`

## Common Classes

- **Spacing**: `gap-1` to `gap-4`, `p-4`, `px-4`, `py-2`, `mt-1` to `mt-4`
- **Border radius**: `rounded-sm`, `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-full`
- **Safe area**: `pt-safe` (top padding that respects notch/status bar)
- **Flex**: `flex-1`, `flex-row`, `items-center`, `justify-between`

## TypeScript Props Pattern

```typescript
interface ComponentProps {
  // Required first
  title: string;
  
  // Optional with defaults
  size?: "small" | "large";
  type?: "primary" | "secondary";
  
  // Optional callbacks
  onPress?: () => void;
  
  // Custom styling
  className?: string;
  
  // React nodes
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

## Before You Start

1. **Search for existing components** - Check if similar components exist in:
   - `components/` (shared components)
   - `components/icons/` (icon library)
   - `app/(tabs)/index.tsx` (reference patterns)

2. **Check Figma design** for:
   - Exact colors (match to theme)
   - Spacing and sizing
   - Border radius
   - Typography

3. **Reuse patterns** from existing screens whenever possible

## Common Mistakes to Avoid

❌ Using React Native's `Text` directly
❌ Passing boolean to `cn()` without `clsx()`
❌ Using relative imports instead of `@/` alias
❌ Hardcoding colors instead of using theme
❌ Forgetting `StatusBar` on screens
❌ Missing TypeScript types for props
❌ Creating duplicate components

## File Organization

- **Shared components** → `components/`
- **Screen-specific** → `components/[screen-name]/`
- **Icons** → `components/icons/`
- **Screens** → `app/` or `app/(tabs)/`

## Naming Conventions

- **Components**: PascalCase (`ActivityCard.tsx`)
- **Icons**: `IcIconName` (`IcArrowLeft`, `IcPlus`)
- **Hooks**: camelCase with `use` prefix (`useColorScheme.ts`)
- **Utilities**: camelCase (`cn.ts`)

## Testing Checklist

After implementation:
- [ ] Run diagnostics to check TypeScript errors
- [ ] Verify no unused imports
- [ ] Check color consistency with theme
- [ ] Ensure StatusBar is present
- [ ] Verify responsive behavior
- [ ] Follow existing patterns

## Quick Reference Files

- **Full guide**: `CODEBASE_GUIDE.md`
- **Checklist**: `AI_ASSISTANT_CHECKLIST.md`
- **Theme**: `constants/theme.ts`
- **Mock data**: `constants/mock.ts`
- **Reference**: `app/(tabs)/index.tsx`

---

## Instructions for AI Assistant

When implementing a new feature:

1. Read the Figma design carefully
2. Search the codebase for similar existing components
3. Follow the patterns above strictly
4. Reuse existing components when possible
5. Use TypeScript with proper typing
6. Test with diagnostics
7. Maintain consistency with the existing codebase

**Remember**: Consistency is key. Always check existing implementations before creating new components.