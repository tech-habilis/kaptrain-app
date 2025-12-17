# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   pnpm install
   ```
   
2. Create prebuild

   ```bash
   pnpm dlx expo prebuild
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
