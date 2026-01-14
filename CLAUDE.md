# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kaptrain is a React Native fitness/training mobile application built with Expo and Supabase. The app features workout sessions, exercise libraries, physiological tracking, injury management, and user profiles.

**Tech Stack:**
- React Native 0.81.5 + React 19.1.0
- Expo ~54.0.27 with Expo Router for file-based routing
- TypeScript (strict mode)
- Tailwind CSS v4 with uniwind for styling
- Supabase for backend (auth, database)
- i18next for internationalization (English/French, fallback: French)

## Development Commands

```bash
# Initial setup
pnpm install                  # Install dependencies (may require pnpm approve-builds first)
pnpm dlx expo prebuild        # Generate native files

# Database types generation (required after schema changes)
pnpm db:generate --project-id "PROJECT_ID"
# Outputs to: utilities/supabase/database.types.ts

# Development
pnpm start                    # Start dev server with dev-client
# Press 's' in terminal to switch to development build (not Expo Go)

# Platform builds
pnpm android                  # Run on Android
pnpm ios                      # Run on iOS
pnpm web                      # Run on web

# Linting
pnpm lint                     # Run ESLint
pnpm lint --fix               # Auto-fix linting errors

# Production build
eas build --local --platform android --profile preview
```

## Prerequisites

Before starting development, ensure these files exist in the root directory:

- **`.env`** - Contains `EXPO_PUBLIC_GOOGLE_AUTH_WEB_CLIENT_ID` and Supabase credentials
  - Use the **web** clientId from Google Cloud Console, not the Android one
  - Android clientId must have SHA-1 from `eas credentials` added in Google Cloud Console

- **`credentials.json`** - Secure credential file

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
  }),
  className // optional custom classes
)}
```
- `cn()` only accepts strings (use `clsx()` for conditionals)
- Never pass boolean directly to `cn()`

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

### 5. Routing
**ALWAYS use ROUTE constants** for navigation (never hardcoded strings):
```typescript
import { ROUTE } from "@/constants/route";
import { router } from "expo-router";

// Correct
router.push(ROUTE.CREATE_SESSION);

// Wrong
router.push("/create-session");
```

**When creating a new screen:**
1. Add route name to `ROUTE_NAME` in `constants/route.ts`
2. Add route path to `ROUTE` object
3. Create corresponding file in `/app/`

## Architecture

### File-Based Routing (Expo Router)

All screens live in `/app/` with routes mirroring the filesystem:

```
app/
├── (tabs)/           # Tab navigator (main app sections)
│   ├── _layout.tsx   # Tab bar configuration
│   ├── explore.tsx
│   ├── library.tsx
│   ├── agenda.tsx
│   └── profile.tsx
├── modal/            # Modal routes
├── sign-in.tsx       # Authentication screens
└── _layout.tsx       # Root layout
```

**Route Pattern:**
- Use `ROUTE` constants from `constants/route.ts` for type-safe navigation
- Routes are const assertions: `ROUTE.EXERCISE_LIST` -> `"/exercise-list"`

**Protected Routes:**
- Use `<Stack.Protected>` component from `auth-context.tsx` for authenticated screens
- Authentication state managed via `AuthProvider` context

### State Management

1. **Authentication:** `contexts/auth-context.tsx` - Supabase auth with session persistence
2. **Storage:** `hooks/use-storage-state.ts` - AsyncStorage wrapper with typing
3. **UI State:** Local component state (useState, useReducer)
4. **Server State:** Supabase queries directly in components/hooks

### Directory Structure

```
/components/         # Reusable UI components organized by feature
  ├── icons/        # Icon components (IcIconName pattern)
  ├── agenda/       # Agenda-specific components
  ├── charts/       # Data visualization
  └── session/      # Workout session components
/contexts/           # React contexts (auth, etc.)
/hooks/              # Custom hooks (storage, timers, theme)
/utilities/          # Helper functions
  ├── supabase/     # Database and auth setup
  ├── i18n/         # Internationalization config
  └── cn.ts         # Class name utility
/constants/          # App constants (routes, storage keys, theme)
/types/              # TypeScript type definitions
/assets/             # Static assets
```

## Styling System

### Theme Colors (Tailwind + ColorConst)

```css
--color-primary: #457CE2        /* Blue */
--color-secondary: #06234B      /* Dark blue */
--color-tertiary: #FF9E69       /* Orange */
--color-decorative: #FFD1A7     /* Light orange */
--color-text: #04152D           /* Dark text */
--color-subtleText: #727988     /* Gray text */
--color-stroke: #E5E5EB         /* Border color */
--color-accent: #424F65         /* Accent gray */
--color-light: #EEEFF9          /* Light background */
--color-success: #4FD365        /* Green */
--color-error: #FF604B          /* Red */
```

**Usage:**
- Tailwind: `bg-primary`, `text-secondary`, `border-stroke`
- Inline: `import { ColorConst } from "@/constants/theme"` then `style={{ backgroundColor: ColorConst.primary }}`

### Typography Scale

**IMPORTANT: Text Size Comparison (Tailwind ↔ CSS pixels)**

| Tailwind Class | CSS Size (px) | Usage |
|----------------|---------------|-------|
| `text-xs` | 12px | Tiny labels, metadata |
| `text-sm` | 14px | Subtitles, captions, secondary text |
| `text-base` | 16px | Body text, default |
| `text-lg` | 18px | Large headings |
| `text-xl` | 20px | Extra large headings |
| `text-2xl` | 24px | Display headings |

**Common Usage Patterns:**
- **Headings**: `text-lg font-bold` (18px) or `text-xl font-bold` (20px)
- **Body**: `text-base` (16px, default)
- **Small/Secondary**: `text-sm` (14px) - for subtitles, category labels, dates
- **Extra small**: `text-xs` (12px) - for tiny metadata only
- **Tiny**: `text-[10px]` - for very specific cases
- **Weights**: `font-normal`, `font-medium`, `font-semibold`, `font-bold`

**Note from Figma slicing:** When Figma shows 14px text, use `text-sm` (not `text-xs`). The calendar/category labels in sport detail are 14px → `text-sm`.

### Common Patterns

**Screen Layout:**
```typescript
<View className="flex-1 bg-white">
  <StatusBar style="auto" />
  <ScrollView className="flex-1 pt-safe px-4">
    {/* Content */}
  </ScrollView>
</View>
```

**Activity/Session Card (consistent pattern):**
```typescript
<View className="border border-stroke rounded-xl flex-row items-center justify-between pr-3">
  <View
    className="flex-1 py-1.5 pl-3 rounded-xl"
    style={{ borderLeftWidth: 4, borderLeftColor: activity.color }}
  >
    {/* Title with icon */}
    <View className="flex-row items-center gap-1">
      {icon && <View>{icon}</View>}
      <Text className="font-bold text-sm">{activity.title}</Text>
    </View>
    {/* Description */}
    <Text className="text-subtleText text-xs mt-1">{activity.description}</Text>
    {/* Coach name */}
    <Text className="text-text text-[10px] mt-0.5 italic">{activity.coachName}</Text>
  </View>
  <IcArrowRight size={24} color={ColorConst.accent} />
</View>
```

**Safe Area:** Use `pt-safe` class for top padding that respects notch

## Component Patterns

### Button Components
```typescript
import Button, { ButtonIcon, ButtonLink } from "@/components/button";

// Standard button
<Button
  text="Click me"
  type="primary" | "secondary" | "tertiary" | "link" | "secondaryV2"
  size="small" | "large"
  leftIcon={<Icon />}
  loading={isLoading}
  onPress={handlePress}
/>

// Icon-only
<ButtonIcon size="large" type="primary">
  <IcPlus size={24} />
</ButtonIcon>
```

### Chip Component
```typescript
import { Chip } from "@/components/chip";

<Chip
  text="Label"
  type="default" | "selected" | "disabled" | "uncheck"
  leftIcon={<Icon />}
  className="custom-classes"
/>
```

### Icons
All icons in `components/icons/` follow `IcIconName` pattern:
```typescript
const IcIconName = ({ size = 24, color = "#424F65" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="..." stroke={color} strokeWidth={2} />
  </Svg>
);
```

### Component Variants (tailwind-variants)
```typescript
import { tv, VariantProps } from "tailwind-variants";

const component = tv({
  base: "base-classes",
  variants: {
    type: {
      primary: "bg-primary text-white",
      secondary: "bg-light text-secondary",
    },
  },
  defaultVariants: { type: "primary" },
});

type ComponentVariants = VariantProps<typeof component>;
```

## TypeScript Props Pattern

```typescript
interface ComponentProps {
  // Required props first
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
}: ComponentProps) {
  // Implementation
}
```

## Internationalization

The app uses react-i18next. The custom `Text` component automatically translates:
```typescript
// Automatically translated
<Text>menu.agenda</Text>

// Without translation
<Text>{someVariable}</Text>
```

Language preference persisted in secure storage. Fallback: French.

## Database

- Supabase client in `utilities/supabase/client.ts`
- Auto-generated types in `utilities/supabase/database.types.ts`
- Regenerate types with `pnpm db:generate` after schema changes

## Common Mistakes to Avoid

**CRITICAL Workflow Rules**

**1. Always Run Lint After Editing Files**
- **After every file edit**, run: `pnpm lint --fix path/to/file.tsx`
- For Expo projects, `pnpm lint` already includes TypeScript type checking
- If `--fix` doesn't resolve the errors, fix them manually
- This prevents accumulating linting errors and maintains code quality

**2. Always Check Existing Components First**
- **Before creating custom components**, search `components/` directory thoroughly
- **Ask if unsure** whether an existing component can fulfill the Figma design
- Repeated pattern: creating custom components when `Choices`, `Input`, `Button`, etc. already exist

**Screen Setup Mistakes**
- **Do NOT add `<Stack.Screen options={{ headerShown: false }} />`** to individual screens
- This is already configured globally in `app/_layout.tsx` at the root Stack level
- Adding it to every screen is redundant and unnecessary

**Other Common Mistakes**
- Using React Native's `Text` directly (use custom `Text` component)
- Passing boolean to `cn()` without `clsx()`
- Using relative imports instead of `@/` alias
- Hardcoding colors instead of using theme
- Forgetting `StatusBar` on screens
- Missing TypeScript types for props
- Creating duplicate components
- Hardcoding route strings instead of using `ROUTE` constants

## File Organization

- **Shared components** → `components/`
- **Screen-specific** → `components/[screen-name]/`
- **Icons** → `components/icons/` (naming: `IcIconName`)
- **Screens** → `app/` or `app/(tabs)/`
- **Hooks** → `hooks/` (naming: `useHookName`)

## Naming Conventions

- **Components**: PascalCase (`ActivityCard.tsx`)
- **Icons**: `IcIconName` (`IcArrowLeft`, `IcPlus`)
- **Hooks**: camelCase with `use` prefix (`useColorScheme.ts`)
- **Utilities**: camelCase (`cn.ts`)
- **Constants**: SCREAMING_SNAKE_CASE (`ROUTE_NAME`)

---

## Lessons Learned: Form Validation & Authentication

### 1. Use Dedicated States for Async Operations

**Problem:** Reusing generic states like `loggingInWith` for different operations causes confusion and bugs.

**Solution:** Create dedicated loading states for each operation:

```typescript
// contexts/auth-context.tsx
const [isResettingPassword, setIsResettingPassword] = useState(false);
const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

const resetPassword = async (email: string) => {
  setIsResettingPassword(true);
  // ... operation
  setIsResettingPassword(false);
};

const updatePassword = async (newPassword: string) => {
  setIsUpdatingPassword(true);
  // ... operation
  setIsUpdatingPassword(false);
};
```

**Why:** Makes code intent explicit, prevents bugs where one operation's loading state affects another.

### 2. Form Validation with Zod + i18n

**Pattern:** Create validation schemas with translation keys, then translate error messages:

```typescript
// utilities/validation/schema.ts
export const passwordSchema = z
  .string()
  .min(1, "validation.passwordRequired")
  .min(8, "validation.passwordMinLength")
  .regex(/[A-Z]/, "validation.passwordUppercase")
  .regex(/[0-9]/, "validation.passwordNumber")
  .regex(/[^A-Za-z0-9]/, "validation.passwordSpecial");

// Component usage
const validateForm = () => {
  const result = schema.safeParse({ email, password });
  if (!result.success) {
    result.error.issues.forEach((issue) => {
      errors[issue.path[0]] = t(issue.message); // Translate the key
    });
  }
};
```

**Key Points:**
- Define schemas in `utilities/validation/schema.ts`
- Export both schema and inferred types
- Use `result.error.issues` (not `result.error.errors`)
- Clear errors when user starts typing

### 3. Input Component Error Handling

**Pattern:** Add `error` prop to Input component for consistent error display:

```typescript
// components/input.tsx
interface InputProps {
  error?: string;
  // ... other props
}

// Usage
<Input
  value={email}
  onChangeText={(text) => {
    setEmail(text);
    if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
  }}
  error={errors.email}
/>
```

### 4. React Hooks: Preventing Infinite Loops

**Problem:** Including context functions in `useEffect` dependencies causes infinite re-renders.

**Solution:** Use refs to track operation state and exclude unstable dependencies:

```typescript
const isVerifyingRef = useRef(false);

useEffect(() => {
  if (otp.length === OTP_LENGTH && !isVerifyingRef.current) {
    isVerifyingRef.current = true;
    verifyOtp(email, otp).finally(() => {
      isVerifyingRef.current = false;
    });
  }
}, [otp, email]); // Exclude verifyOtp from deps
/* eslint-disable react-hooks/exhaustive-deps */
```

**When to use this pattern:**
- Context functions that are recreated on every render
- Preventing race conditions in auto-triggering effects
- When you need to track if an operation is in progress

### 5. Button Disabled State Logic

**Pattern:** Disable button when form is incomplete or loading:

```typescript
<Button
  disabled={!email || !password || isSubmitting}
  loading={isSubmitting}
  onPress={handleSubmit}
/>
```

**Best practice:** Check both form completeness (`!email || !password`) AND loading state.

---

## Figma Design Slicing Guidelines

### Session Reflections (My Sports Feature)

When converting Figma designs to code, follow these critical rules:

### 1. Use BasicScreen for All Screens
**ALWAYS use the `BasicScreen` component** for consistent layout and navigation:
```typescript
import BasicScreen from "@/components/basic-screen";

<BasicScreen
  title="Screen Title"
  description="Optional description text"
  headerClassName="bg-light" // Optional custom header styling
>
  {/* Screen content */}
</BasicScreen>
```

**Why:** Provides consistent header with back button, StatusBar, and `pt-safe` automatically.

### 2. Maintain High Design Fidelity
For slicing tasks, match the Figma design exactly:
- **Padding/spacing:** Verify all `p-`, `px-`, `py-`, `pt-` values match the design
- **Gap values:** Use exact `gap-1`, `gap-2`, `gap-3`, etc. from Figma
- **Border radius:** Match `rounded-xl` (14px), `rounded-2xl` (20px), etc.
- **Border widths:** Verify `border`, `border-2` matches Figma specifications

**Example:** Figma shows 24px top padding → use `pt-6` (not default or arbitrary values)

### 3. Icon Handling for New Designs
When encountering icons that don't exist in `components/icons/`:
1. **Use `IcLightning` as a temporary placeholder**
2. **Document needed icons** in the session summary
3. **NEVER create new icon files** without explicit approval (custom icons may appear incorrect)

```typescript
import IcLightning from "@/components/icons/lightning";

// Document: TODO: Replace IcLightning with proper IcRunning icon
const sports = [
  { name: "Running", icon: <IcLightning size={24} color={ColorConst.accent} /> }
];
```

### 4. Common Slicing Pattern Checklist

For each screen from Figma:
- [ ] Use `BasicScreen` component
- [ ] Verify `pt-safe` is applied (via BasicScreen)
- [ ] Match all padding values exactly (`px-4 pt-6 pb-32`, etc.)
- [ ] Use existing icons only (placeholder with `IcLightning` if needed)
- [ ] Follow color tokens (`ColorConst.primary`, `bg-primary`, etc.)
- [ ] Use custom `Text` component (only use RN's `Text` if the Text children is not a string / complex)
- [ ] Use `ROUTE` constants for navigation
- [ ] Use `cn()` + `clsx()` for conditional classes

### 5. Design System Reference

Additional design system rules are documented in `.cursor/rules/design_system_rules.mdc` including:
- Complete color token mapping
- Component patterns
- Typography scale
- Asset management
- Icon system
