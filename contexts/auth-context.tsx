import { STORAGE_KEY } from "@/constants/storage-key";
import { useJsonStorageState } from "@/hooks/use-storage-state";
import {
  createContext,
  PropsWithChildren,
  use,
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
import Constants from "expo-constants";

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
  signOut: () => void;
  deleteAccount: () => void;
  setSession: (value: TSession | null) => void;

  session: TSession | null;
  isLoadingSession: boolean;
  isLoggingIn: boolean;
  isLoggedIn: boolean;
  canSignInWithApple: boolean;
  loggingInWith: TSignInMethod | null;
};

const AuthContext = createContext<TAuthContext>({
  signInWithApple: () => {},
  signInWithGoogle: () => {},
  signInWithEmail: () => {},
  signUpWithEmail: () => {},
  signOut: () => {},
  deleteAccount: () => {},
  setSession: () => {},

  session: null,
  isLoadingSession: false,
  isLoggingIn: false,
  isLoggedIn: false,
  canSignInWithApple: false,
  loggingInWith: null,
});

export function useSession() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error("useSession must be wrapped in a <SessionProvider />");
  }
  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoadingSession, session], setSession] =
    useJsonStorageState<TSession>(STORAGE_KEY.SESSION);
  const [loggingInWith, setLoggingInWith] = useState<TSignInMethod | null>(
    null,
  );
  const isLoggingIn = loggingInWith !== null;
  const [canSignInWithApple, setCanSignInWithApple] = useState(false);
  const [fetchingSession, setFetchingSession] = useState(false);

  const signInWithApple = async () => {
    try {
      setLoggingInWith("apple");
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const fullName = (
        (credential.fullName?.givenName || "") +
        " " +
        (credential.fullName?.familyName || "")
      ).trim();

      setSession({
        accessToken: credential.identityToken,
        refreshToken: credential.authorizationCode,
        user: {
          id: credential.user,
          email: credential.email,
          name: fullName.length > 0 ? fullName : null,
        },
      });

      router.replace("/");
    } catch (e: any) {
      if (e.code === "ERR_REQUEST_CANCELED") {
        // handle that the user canceled the sign-in flow
        console.info("User canceled the sign-in flow");
      } else {
        // handle other errors
        console.error(e);
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

    await Promise.all([supabase.auth.signOut(), GoogleSignin.signOut()]);
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
        emailRedirectTo: Constants.expoConfig?.scheme as string,
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
      toast.success("Please check your inbox for email verification!");
      setLoggingInWith(null);
      return;
    }

    setSession(supabaseUtils.toLocalSession(session));
    setLoggingInWith(null);
  };

  const deleteAccount = async () => {
    console.info("This feature is not yet implemented.");
    toast.error("This feature is not yet implemented.");
  };

  useEffect(() => {
    AppleAuthentication.isAvailableAsync().then((supported) => {
      setCanSignInWithApple(supported);
    });
  }, []);

  // Fetch the session once, and subscribe to auth state changes
  useEffect(() => {
    const fetchSession = async () => {
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
    };
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
  }, [setSession]);

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

        session,
        isLoadingSession: isLoadingSession || fetchingSession,
        isLoggingIn,
        isLoggedIn: !!session?.accessToken,
        canSignInWithApple,
        loggingInWith,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
