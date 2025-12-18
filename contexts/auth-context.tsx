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
import { supabase } from "@/utilities/supabase";
import { TSession } from "@/types";

type TEmailSignIn = {
  email: string;
  password: string;
};

type TSignInMethod = "email" | "google" | "apple";

type TAuthContext = {
  signInWithApple: () => void;
  signInWithGoogle: () => void;
  signInWithEmail: (payload: TEmailSignIn) => void;
  signOut: () => void;
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
  signOut: () => {},
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
  const [loggingInWith, setLoggingInWith] = useState<TSignInMethod | null>(null);
  const isLoggingIn = loggingInWith !== null;
  const [canSignInWithApple, setCanSignInWithApple] = useState(false);

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
        setSession({
          accessToken: response.data.idToken,
          user: response.data.user,
        });
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
            toast.warning("Failed to sign in with Google: " + error.message, {
              id: "google-sign-in-error",
            });
            break;
        }
      } else {
        // an error that's not related to google sign in occurred
        toast.error("Failed to sign in with Google", {
          id: "google-sign-in-error",
        });
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

    setSession(supabase.toLocalSession(session));
    setLoggingInWith(null);
  };

  const signOut = () => {
    setSession(null);
    supabase.auth.signOut();
  }

  useEffect(() => {
    AppleAuthentication.isAvailableAsync().then((supported) => {
      setCanSignInWithApple(supported);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signInWithApple,
        signInWithGoogle,
        signInWithEmail,
        signOut,
        setSession,

        session,
        isLoadingSession,
        isLoggingIn,
        isLoggedIn: !!session?.accessToken,
        canSignInWithApple,
        loggingInWith
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
