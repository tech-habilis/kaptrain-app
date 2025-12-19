/// <reference types="expo/env" />

declare namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_SUPABASE_URL: string | undefined;
    EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY: string | undefined;
    EXPO_PUBLIC_GOOGLE_AUTH_WEB_CLIENT_ID: string | undefined;
  }
}
