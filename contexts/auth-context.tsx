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
import { TSession } from "@/types";
import { ROUTE, ROUTE_NAME } from "@/constants/route";
import { useTranslation } from "react-i18next";
import { appScheme } from "@/constants/misc";
import { AuthError } from "@supabase/auth-js";

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
  setProfileCompleted: () => void;
  verifyEmail: (email: string, otp: string) => void;
  resendEmailVerification: (email: string) => void;
  resetPassword: (email: string) => void;
  verifyPasswordResetOtp: (email: string, otp: string) => void;
  updatePassword: (newPassword: string) => void;

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
  setProfileCompleted: () => {},
  verifyEmail: (email: string, otp: string) => {},
  resendEmailVerification: (email: string) => {},
  resetPassword: (email: string) => {},
  verifyPasswordResetOtp: (email: string, otp: string) => {},
  updatePassword: (newPassword: string) => {},

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
});

export function useSession() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error("useSession must be wrapped in a <SessionProvider />");
  }
  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
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
  const [
    [isLoadingFirstOpenTimestamp, firstOpenTimestamp],
    setFirstOpenTimestamp,
  ] = useStorageState(STORAGE_KEY.FIRST_OPEN_TIMESTAMP);
  const isFirstOpen =
    !isLoadingFirstOpenTimestamp && firstOpenTimestamp === null;

  const [
    [isLoadingProfileCompletedAt, profileCompletedAt],
    setProfileCompletedAt,
  ] = useStorageState(STORAGE_KEY.PROFILE_COMPLETED_AT);

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

      // Apple only provides the user's name the first time they sign in
      // If it's available, update the user metadata with it
      if (credential.fullName) {
        const nameParts = [];
        if (credential.fullName.givenName)
          nameParts.push(credential.fullName.givenName);
        if (credential.fullName.middleName)
          nameParts.push(credential.fullName.middleName);
        if (credential.fullName.familyName)
          nameParts.push(credential.fullName.familyName);
        const fullName = nameParts.join(" ");
        await supabase.auth.updateUser({
          data: {
            name: fullName,
            display_name: fullName,
            first_name: credential.fullName.givenName,
            last_name: credential.fullName.familyName,
          },
        });
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
      toast.success("OTP verified successfully");
      router.dismissAll();
      router.push(ROUTE.EMAIL_VERIFIED);
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
      setSession(supabaseUtils.toLocalSession(session));
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [fetchSession, setSession]);

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
        setProfileCompleted: () => {
          const timestamp = Date.now();
          setProfileCompletedAt(timestamp.toString());
        },
        verifyEmail,
        resendEmailVerification,
        resetPassword,
        verifyPasswordResetOtp,
        updatePassword,

        session,
        isLoadingSession:
          isLoadingSession ||
          fetchingSession ||
          isLoadingFirstOpenTimestamp ||
          isLoadingProfileCompletedAt,
        isLoggingIn,
        isLoggedIn: !!session?.accessToken,
        canSignInWithApple,
        loggingInWith,
        isFirstOpen,
        showCompleteProfileForm: profileCompletedAt === null,
        isResettingPassword,
        isUpdatingPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
