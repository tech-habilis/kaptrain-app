# Welcome to your Kaptrain App 👋

This is an [Expo](https://expo.dev) project with supabase as the backend.

## Get started

0. Prepare your environment

Make sure the following files are present in the root directory:

- .env
  - In google cloud console, make sure these `androic clientId` and `web clientId` exists.
  - In the android clientId, add the SHA-1 from `eas credentials`.
  - in the .env, pass the web clientId to `EXPO_PUBLIC_GOOGLE_AUTH_WEB_CLIENT_ID`, not the android one.

- credentials.json

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

4. Start the app

   ```bash
   pnpm start
   ```

5. If metro is using expo go, switch to the development build by pressing `s`

6. Build the app for Android or iOS

   ```bash
   pnpm android
   pnpm ios
   ```

7. That's it, the app should be running now!

## Deploy

Creating a local .apk file:

```
eas build --local --platform android --profile preview
```
