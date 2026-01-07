# AI Assistant Implementation Checklist

Quick reference checklist for implementing new features in the Kaptrain mobile app.

## Before Starting

- [ ] Read `CODEBASE_GUIDE.md` for detailed patterns and conventions
- [ ] Check the Figma design for all visual specifications
- [ ] Identify reusable components in the existing codebase
- [ ] Search for similar patterns in `app/(tabs)/index.tsx` or other screens

## Component Creation

- [ ] Use PascalCase for component names (e.g., `ActivityCard.tsx`)
- [ ] Place in appropriate directory:
  - `components/` for shared components
  - `components/[screen-name]/` for screen-specific components
  - `components/icons/` for icon components
- [ ] Define TypeScript interfaces for all props
- [ ] Export component and types from `index.ts` if creating a new directory

## Styling Checklist

- [ ] Use Tailwind CSS classes (not inline styles unless dynamic)
- [ ] Import `cn` from `@/utilities/cn` for class merging
- [ ] Import `clsx` from `clsx` for conditional classes
- [ ] Use pattern: `className={cn("base-classes", clsx({ "conditional": condition }))}`
- [ ] Use color classes: `bg-primary`, `text-secondary`, `border-stroke`
- [ ] Use `ColorConst` for inline style colors: `import { ColorConst } from "@/constants/theme"`

## Common Patterns

- [ ] Use custom `Text` component (not React Native's): `import Text from "@/components/text"`
- [ ] Add `<StatusBar style="auto" />` to screens
- [ ] Use `pt-safe` class for safe area top padding
- [ ] Use `className="pt-safe px-4"` for screen containers
- [ ] Wrap content in `<ScrollView>` for scrollable screens
- [ ] Use `flex-1` for full height containers

## Icons

- [ ] Check if icon already exists in `components/icons/`
- [ ] Use naming convention: `IcIconName` (e.g., `IcArrowLeft`, `IcPlus`)
- [ ] Default props: `{ size = 24, color = "#424F65" }`
- [ ] Use `react-native-svg` components: `Svg`, `Path`, `G`, etc.

## Buttons

- [ ] Use `Button` for standard buttons with text
- [ ] Use `ButtonIcon` for icon-only buttons
- [ ] Use `ButtonLink` for navigation links
- [ ] Import: `import Button, { ButtonIcon, ButtonLink } from "@/components/button"`
- [ ] Available types: `primary`, `secondary`, `tertiary`, `link`, `secondaryV2`
- [ ] Available sizes: `small`, `large`

## Activity/Session Cards

- [ ] Use consistent pattern with left border color
- [ ] Structure: Title with icon → Description → Coach name
- [ ] Include arrow icon on the right
- [ ] Border: `border border-stroke rounded-xl`
- [ ] Left border: `borderLeftWidth: 4` with dynamic color

## TypeScript

- [ ] Define all prop interfaces
- [ ] Export types when needed
- [ ] Use proper typing for callbacks: `onPress?: () => void`
- [ ] Use union types for variants: `type?: "primary" | "secondary"`
- [ ] Add optional `?` for non-required props

## Imports

- [ ] Always use `@/` alias imports (never relative paths)
- [ ] Order imports: React → Libraries → Components → Constants → Utilities
- [ ] Group related imports together

## Testing

- [ ] Run diagnostics to check for TypeScript errors
- [ ] Verify no unused imports or variables
- [ ] Check that all colors match the theme
- [ ] Ensure responsive behavior
- [ ] Test with mock data if needed

## Common Mistakes to Avoid

- [ ] ❌ Don't use React Native's `Text` component directly
- [ ] ❌ Don't pass boolean directly to `cn()` - use `clsx()` instead
- [ ] ❌ Don't use relative imports - use `@/` alias
- [ ] ❌ Don't hardcode colors - use theme colors
- [ ] ❌ Don't forget `StatusBar` component on screens
- [ ] ❌ Don't forget to add TypeScript types for props
- [ ] ❌ Don't create new components if similar ones exist

## File Template

### Component Template

```typescript
import { View, Pressable } from "react-native";
import Text from "@/components/text";
import cn from "@/utilities/cn";
import { clsx } from "clsx";

interface ComponentNameProps {
  title: string;
  type?: "primary" | "secondary";
  onPress?: () => void;
  className?: string;
}

export function ComponentName({
  title,
  type = "primary",
  onPress,
  className = "",
}: ComponentNameProps) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        "base-classes",
        clsx({
          "primary-classes": type === "primary",
          "secondary-classes": type === "secondary",
        }),
        className
      )}
    >
      <Text className="font-bold">{title}</Text>
    </Pressable>
  );
}
```

### Screen Template

```typescript
import { StatusBar } from "expo-status-bar";
import { ScrollView, View } from "react-native";
import Text from "@/components/text";

export default function ScreenName() {
  return (
    <View className="flex-1 bg-white">
      <StatusBar style="auto" />
      <ScrollView className="flex-1 pt-safe px-4">
        <Text className="text-lg font-bold">Screen Title</Text>
        {/* Content */}
      </ScrollView>
    </View>
  );
}
```

### Icon Template

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

## Quick Color Reference

- Primary: `#457CE2` (Blue) - `bg-primary` / `ColorConst.primary`
- Secondary: `#06234B` (Dark blue) - `bg-secondary` / `ColorConst.secondary`
- Tertiary: `#FF9E69` (Orange) - `bg-tertiary` / `ColorConst.tertiary`
- Text: `#04152D` - `text-text` / `ColorConst.text`
- Subtle Text: `#727988` - `text-subtleText` / `ColorConst.subtleText`
- Stroke: `#E5E5EB` - `border-stroke` / `ColorConst.stroke`
- Accent: `#424F65` - `text-accent` / `ColorConst.accent`

## Resources

- Full guide: `CODEBASE_GUIDE.md`
- Theme colors: `constants/theme.ts`
- Mock data: `constants/mock.ts`
- Existing patterns: `app/(tabs)/index.tsx`
