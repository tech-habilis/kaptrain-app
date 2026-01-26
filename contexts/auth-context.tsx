import { STORAGE_KEY } from "@/constants/storage-key";
import {
  useJsonStorageState,
  useStorageState,
} from "@/hooks/use-storage-state";
import {
  createContext,
  PropsWithChildren,
  use,
  useCallback,
  useEffect,
  useState,
} from "react";
import * as AppleAuthentication from "expo-apple-authentication";
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { toast } from "@/components/toast";
import { supabase, supabaseUtils } from "@/utilities/supabase";
import { getUserProfile } from "@/utilities/supabase/profile";
import { TSession } from "@/types";
import { ROUTE, ROUTE_NAME } from "@/constants/route";
import { useTranslation } from "react-i18next";
import { appScheme } from "@/constants/misc";
import { AuthError } from "@supabase/auth-js";
import { useProfileStore } from "@/stores/profile-store";

type TEmailSignIn = {
  email: string;
  password: string;
};

type TEmailSignUp = TEmailSignIn & {
  name: string;
  confirmPassword: string;
};

type TSignInMethod = "email" | "google" | "apple";

type TAuthContext = {
  signInWithApple: () => void;
  signInWithGoogle: () => void;
  signInWithEmail: (payload: TEmailSignIn) => void;
  signUpWithEmail: (payload: TEmailSignUp) => void;
  signOut: () => Promise<[{ error: AuthError | null }, null]>;
  deleteAccount: () => void;
  setSession: (value: TSession | null) => void;
  setFirstOpenTimestamp: () => void;
  verifyEmail: (email: string, otp: string) => void;
  resendEmailVerification: (email: string) => void;
  resetPassword: (email: string) => void;
  verifyPasswordResetOtp: (email: string, otp: string) => void;
  updatePassword: (newPassword: string) => void;
  loadProfile: () => void;

  session: TSession | null;
  isLoadingSession: boolean;
  isLoggingIn: boolean;
  isLoggedIn: boolean;
  canSignInWithApple: boolean;
  loggingInWith: TSignInMethod | null;
  isFirstOpen: boolean;
  showCompleteProfileForm: boolean;
  isResettingPassword: boolean;
  isUpdatingPassword: boolean;
  isCheckingProfileCompletion: boolean;
};

const AuthContext = createContext<TAuthContext>({
  signInWithApple: () => {},
  signInWithGoogle: () => {},
  signInWithEmail: () => {},
  signUpWithEmail: () => {},
  signOut: () => Promise.resolve([{ error: null }, null]),
  deleteAccount: () => {},
  setSession: () => {},
  setFirstOpenTimestamp: () => {},
  verifyEmail: (email: string, otp: string) => {},
  resendEmailVerification: (email: string) => {},
  resetPassword: (email: string) => {},
  verifyPasswordResetOtp: (email: string, otp: string) => {},
  updatePassword: (newPassword: string) => {},
  loadProfile: () => {},

  session: null,
  isLoadingSession: false,
  isLoggingIn: false,
  isLoggedIn: false,
  canSignInWithApple: false,
  loggingInWith: null,
  isFirstOpen: false,
  showCompleteProfileForm: false,
  isResettingPassword: false,
  isUpdatingPassword: false,
  isCheckingProfileCompletion: false,
});

// Helper function to sync auth metadata from database profile
// This ensures that if user has updated their profile in the database,
// those values take precedence over social provider data on re-login
const syncAuthMetadataFromProfile = async (userId: string) => {
  try {
    const profile = await getUserProfile(userId);

    // Only update if user has completed onboarding and has profile data
    if (profile.onboarding_date) {
      const metadataUpdates: Record<string, string | null> = {};

      // Use name from database if available, otherwise don't override
      if (profile.first_name || profile.last_name) {
        metadataUpdates.name =
          `${profile.first_name || ""} ${profile.last_name || ""}`.trim();
      }

      // Use avatar from database if available, otherwise don't override
      if (profile.avatar_url) {
        metadataUpdates.avatar_url = profile.avatar_url;
      }

      // Only update if we have something to update
      if (Object.keys(metadataUpdates).length > 0) {
        await supabase.auth.updateUser({
          data: metadataUpdates,
        });
      }
    }
  } catch (error) {
    console.error("Error syncing auth metadata from profile:", error);
    // Don't fail sign-in if sync fails
  }
};

export function useSession() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error("useSession must be wrapped in a <SessionProvider />");
  }
  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const { loadProfile } = useProfileStore();
  const { t } = useTranslation();
  const [[isLoadingSession, session], setSession] =
    useJsonStorageState<TSession>(STORAGE_KEY.SESSION);
  const [loggingInWith, setLoggingInWith] = useState<TSignInMethod | null>(
    null,
  );
  const isLoggingIn = loggingInWith !== null;
  const [canSignInWithApple, setCanSignInWithApple] = useState(false);
  const [fetchingSession, setFetchingSession] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isCheckingProfileCompletion, setIsCheckingProfileCompletion] =
    useState(false);
  const [showCompleteProfileForm, setShowCompleteProfileForm] = useState(false);
  const [
    [isLoadingFirstOpenTimestamp, firstOpenTimestamp],
    setFirstOpenTimestamp,
  ] = useStorageState(STORAGE_KEY.FIRST_OPEN_TIMESTAMP);
  const isFirstOpen =
    !isLoadingFirstOpenTimestamp && firstOpenTimestamp === null;

  // Function to check if user has completed onboarding
  const checkProfileCompletion = useCallback(async (userId: string) => {
    if (!userId) {
      setShowCompleteProfileForm(true);
      return;
    }

    setIsCheckingProfileCompletion(true);
    try {
      const profile = await getUserProfile(userId);
      // Show complete profile form if onboarding_date is not set
      setShowCompleteProfileForm(!profile.onboarding_date);
    } catch (error) {
      console.error("Error checking profile completion:", error);
      // If error fetching profile, assume not completed and show the form
      setShowCompleteProfileForm(true);
    } finally {
      setIsCheckingProfileCompletion(false);
    }
  }, []);

  const signInWithApple = async () => {
    try {
      setLoggingInWith("apple");
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "apple",
        token: credential.identityToken!,
      });

      if (error) {
        toast.error(error.message);
        setLoggingInWith(null);
        return;
      }

      // Only update metadata from Apple for NEW users (first time sign-up)
      // For returning users, sync from database to preserve their changes
      if (data.session?.user && credential.fullName) {
        try {
          const profile = await getUserProfile(data.session.user.id);

          // If user hasn't completed onboarding, save Apple's name
          if (!profile.onboarding_date && credential.fullName) {
            const nameParts = [];
            if (credential.fullName.givenName)
              nameParts.push(credential.fullName.givenName);
            if (credential.fullName.middleName)
              nameParts.push(credential.fullName.middleName);
            if (credential.fullName.familyName)
              nameParts.push(credential.fullName.familyName);
            const fullName = nameParts.join(" ");

            if (fullName) {
              await supabase.auth.updateUser({
                data: {
                  name: fullName,
                  display_name: fullName,
                  first_name: credential.fullName.givenName,
                  last_name: credential.fullName.familyName,
                },
              });
            }
          } else {
            // Returning user - sync metadata from database to preserve their changes
            await syncAuthMetadataFromProfile(data.session.user.id);
          }
        } catch (profileError) {
          console.error(
            "Error checking profile during Apple sign-in:",
            profileError,
          );
          // Continue with sign-in even if profile check fails
        }
      }

      setSession(supabaseUtils.toLocalSession(data.session));
      router.replace(ROUTE.ROOT);
    } catch (e: any) {
      if (e.code === "ERR_REQUEST_CANCELED") {
        // handle that the user canceled the sign-in flow
        console.info("User canceled the sign-in flow");
      } else {
        // handle other errors
        console.error(e);
        toast.error("Failed to sign in with Apple: " + e.message);
      }
    } finally {
      setLoggingInWith(null);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoggingInWith("google");
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        const { data } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: response.data.idToken || "",
        });

        // Sync metadata from database to preserve user's changes
        // This ensures that if user updated their name/avatar in the app,
        // those values are restored instead of using the old Google data
        if (data.session?.user) {
          try {
            await syncAuthMetadataFromProfile(data.session.user.id);
          } catch (profileError) {
            console.error(
              "Error syncing profile during Google sign-in:",
              profileError,
            );
            // Continue with sign-in even if sync fails
          }
        }

        setSession(supabaseUtils.toLocalSession(data.session));
        router.replace(ROUTE.ROOT);
      } else {
        // sign in was cancelled by user
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // Android only, play services not available or outdated
            break;
          default:
            // some other error happened
            console.log(error);
            toast.warning("Failed to sign in with Google: " + error.message);
            break;
        }
      } else {
        // an error that's not related to google sign in occurred
        toast.error("Failed to sign in with Google");
      }
    } finally {
      setLoggingInWith(null);
    }
  };

  const signInWithEmail = async ({ email, password }: TEmailSignIn) => {
    if (!email || !password) {
      toast.error(t("error.emailAndPasswordRequired"));
      return;
    }

    setLoggingInWith("email");

    const {
      data: { session },
      error,
    } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      toast.error(error.message);
      setLoggingInWith(null);
      return;
    }

    if (!session) {
      toast.success("Please check your inbox for email verification!");
      setLoggingInWith(null);
      return;
    }

    setSession(supabaseUtils.toLocalSession(session));
    setLoggingInWith(null);
  };

  const signOut = async () => {
    setSession(null);
    return await Promise.all([supabase.auth.signOut(), GoogleSignin.signOut()]);
  };

  const signUpWithEmail = async ({
    email,
    password,
    name,
    confirmPassword,
  }: TEmailSignUp) => {
    setLoggingInWith("email");

    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: appScheme + ROUTE_NAME.SIGN_IN, // will redirect to appSheme://sign-in
        data: {
          name: name,
        },
      },
    });

    if (error) {
      toast.error(error.message);
      setLoggingInWith(null);
      return;
    }

    if (!session) {
      router.push({
        pathname: ROUTE.VERIFY_EMAIL,
        params: { email },
      });
      setLoggingInWith(null);
      return;
    }

    setSession(supabaseUtils.toLocalSession(session));
    setLoggingInWith(null);
  };

  const resendEmailVerification = async (email: string) => {
    const result = await supabase.auth.resend({
      email,
      type: "signup",
      options: {
        emailRedirectTo: appScheme + ROUTE_NAME.SIGN_IN, // will redirect to appSheme://sign-in
      },
    });

    if (result.error) {
      toast.error(result.error.message);
    } else {
      toast.success("OTP resent successfully");
    }
  };

  const deleteAccount = async () => {
    console.info("This feature is not yet implemented.");
    toast.error("This feature is not yet implemented.");
  };

  const verifyEmail = async (email: string, otp: string) => {
    const result = await supabase.auth.verifyOtp({
      token: otp,
      email,
      type: "email",
    });

    if (result.error) {
      toast.error(result.error.message);
    } else {
      setSession(supabaseUtils.toLocalSession(result.data.session));
      router.replace(ROUTE.EMAIL_VERIFIED);
    }
  };

  const resetPassword = async (email: string) => {
    setIsResettingPassword(true);
    const result = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: appScheme + ROUTE_NAME.RESET_PASSWORD,
    });

    if (result.error) {
      toast.error(result.error.message);
      setIsResettingPassword(false);
    } else {
      setIsResettingPassword(false);
      router.push({ pathname: ROUTE.PASSWORD_RESET_SENT, params: { email } });
    }
  };

  const verifyPasswordResetOtp = async (email: string, otp: string) => {
    setIsResettingPassword(true);
    const result = await supabase.auth.verifyOtp({
      token: otp,
      email,
      type: "email",
    });

    if (result.error) {
      toast.error(result.error.message);
      setIsResettingPassword(false);
      return { error: result.error };
    } else {
      setSession(supabaseUtils.toLocalSession(result.data.session));
      setIsResettingPassword(false);
      router.push(ROUTE.RESET_PASSWORD);
      return { error: null };
    }
  };

  const updatePassword = async (newPassword: string) => {
    setIsUpdatingPassword(true);
    const result = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (result.error) {
      setIsUpdatingPassword(false);
    } else {
      setIsUpdatingPassword(false);
      router.dismissAll();
      router.push(ROUTE.PASSWORD_CHANGED);
    }
  };

  const fetchSession = useCallback(async () => {
    setFetchingSession(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) {
      console.error("Error fetching session:", error);
    }
    setSession(supabaseUtils.toLocalSession(session));
    setFetchingSession(false);
  }, [setSession]);

  useEffect(() => {
    AppleAuthentication.isAvailableAsync().then((supported) => {
      setCanSignInWithApple(supported);
    });
  }, []);

  // Fetch the session once, and subscribe to auth state changes
  useEffect(() => {
    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", { event: _event, session });
      const localSession = supabaseUtils.toLocalSession(session);
      setSession(localSession);
      if (localSession?.user) {
        loadProfile(localSession.user.id);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [fetchSession, loadProfile, setSession]);

  // Check profile completion when session user ID changes
  useEffect(() => {
    if (session?.user?.id) {
      checkProfileCompletion(session.user.id);
    } else {
      setShowCompleteProfileForm(false);
    }
  }, [session?.user?.id, checkProfileCompletion]);

  return (
    <AuthContext.Provider
      value={{
        signInWithApple,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        deleteAccount,
        setSession,
        setFirstOpenTimestamp: () => {
          const timestamp = Date.now();
          setFirstOpenTimestamp(timestamp.toString());
        },
        verifyEmail,
        resendEmailVerification,
        resetPassword,
        verifyPasswordResetOtp,
        updatePassword,
        loadProfile: () => {
          if (session?.user?.id) {
            loadProfile(session.user.id);
          }
        },

        session,
        isLoadingSession:
          isLoadingSession ||
          fetchingSession ||
          isLoadingFirstOpenTimestamp ||
          isCheckingProfileCompletion,
        isLoggingIn,
        isLoggedIn: !!session?.accessToken,
        canSignInWithApple,
        loggingInWith,
        isFirstOpen,
        showCompleteProfileForm,
        isResettingPassword,
        isUpdatingPassword,
        isCheckingProfileCompletion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
