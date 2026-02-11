import AsyncStorage from "@react-native-async-storage/async-storage";
import { Session, createClient, processLock } from "@supabase/supabase-js";
import { ParsedURL } from "expo-linking";
import { AppState, Platform } from "react-native";
import Config from "../../constants/config";
import { getUserProfile } from "../../services/auth.service";

export const supabaseClient = createClient(Config.SUPABASE_URL, Config.SUPABASE_ANON_KEY, {
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
  
      getUserProfile({ userId: session.user.id }).then((user) => {
        return {
          accessToken: session.access_token,
          refreshToken: session.refresh_token,
          user: user,
        };
      }).catch((error) => {throw error});
    },
    createSessionFromUrl: async ({ queryParams }: ParsedURL) => {
      const access_token = queryParams?.["access_token"];
      const refresh_token = queryParams?.["refresh_token"];
  
      if (!access_token) 
        return;
  
      if (
        typeof access_token !== "string" ||
        typeof refresh_token !== "string" ||
        access_token.length <= 0 ||
        refresh_token.length <= 0
      ) 
        return;
  
      const { data, error } = await supabaseClient.auth.setSession({
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
        supabaseClient.auth.startAutoRefresh();
      } else {
        supabaseClient.auth.stopAutoRefresh();
      }
    });
  }