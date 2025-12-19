# Welcome to your Kaptrain App 👋

This is an [Expo](https://expo.dev) project with supabase as the backend.

## Get started

1. Install dependencies

   ```bash
   pnpm install
   ```
If install failed, try running `pnpm approve-builds` and approve supabase if it's not approved yet. Then, run `pnpm install` again.

2. Create prebuild

   ```bash
   pnpm dlx expo prebuild
   ```

3. Create database types

   ```bash
   pnpm db:generate --project-id "INSERT_SUPABASE_PROJECT_ID_HERE"
   ```

3. Start the app

   ```bash
   pnpm start
   ```

4. If metro is using expo go, switch to the development build by pressing `s`

5. Build the app for Android or iOS

   ```bash
   pnpm run android
   pnpm run ios
   ```

6. That's it, the app should be running now!

## Deploy

Creating a local .apk file:

```
eas build --local --platform android --profile preview
```
