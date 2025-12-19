import { AppState, Platform } from "react-native";
import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, processLock, Session } from "@supabase/supabase-js";
import { TSession } from "@/types";
import { ParsedURL } from "expo-linking";
import { Database } from "./database.types";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (supabaseUrl === undefined || supabaseAnonKey === undefined) {
  throw new Error("ENV NOT CONFIGURED PROPERLY! [1]");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    ...(Platform.OS !== "web" ? { storage: AsyncStorage } : {}),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    lock: processLock,
  },
});

export const supabaseUtils = {
  toLocalSession: (session: Session | null) => {
    if (!session) return null;

    return {
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.user_metadata["name"],
        avatarUrl: session.user.user_metadata["avatar_url"],
      },
    } as TSession;
  },
  createSessionFromUrl: async ({ queryParams }: ParsedURL) => {
    const access_token = queryParams?.["access_token"];
    const refresh_token = queryParams?.["refresh_token"];

    if (!access_token) {
      return;
    }

    if (
      typeof access_token !== "string" ||
      typeof refresh_token !== "string" ||
      access_token.length <= 0 ||
      refresh_token.length <= 0
    ) {
      return;
    }

    console.log("refresh token", refresh_token);

    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });
    if (error) throw error;
    return data.session;
  },
};

// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is added, you will continue
// to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// `SIGNED_OUT` event if the user's session is terminated. This should
// only be registered once.
if (Platform.OS !== "web") {
  AppState.addEventListener("change", (state) => {
    if (state === "active") {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}
