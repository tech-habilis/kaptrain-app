import { STORAGE_KEY } from "@/constants/storage-key";
import { useJsonStorageState } from "@/hooks/use-storage-state";
import { createContext, PropsWithChildren, use, useEffect, useState } from "react";
import * as AppleAuthentication from "expo-apple-authentication";
import { GoogleSignin, isErrorWithCode, isSuccessResponse, statusCodes } from "@react-native-google-signin/google-signin";
import { router } from "expo-router";

type TSession = {
  accessToken?: string | null;
  refreshToken?: string | null;
  user?: {
    id: string;
    email: string | null;
    name: string | null;
    // ... add other user data here
  };
};

type TAuthContext = {
  signInWithApple: () => void;
  signInWithGoogle: () => void;
  signOut: () => void;
  session: TSession | null;
  isLoadingSession: boolean;
  isLoggingIn: boolean;
  isLoggedIn: boolean;
  canSignInWithApple: boolean;
};

const AuthContext = createContext<TAuthContext>({
  signInWithApple: () => {},
  signInWithGoogle: () => {},
  signOut: () => {},
  session: null,
  isLoadingSession: false,
  isLoggingIn: false,
  isLoggedIn: false,
  canSignInWithApple: false,
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
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [canSignInWithApple, setCanSignInWithApple] = useState(false);

  const signInWithApple = async () => {
    try {
      setIsLoggingIn(true);
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
      setIsLoggingIn(false);
    }
  };

  const signInWithGoogle = async () => {
    console.error('Google sign-in is not implemented yet')
  };

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
        signOut: () => setSession(null),
        session,
        isLoadingSession,
        isLoggingIn,
        isLoggedIn: !!session?.accessToken,
        canSignInWithApple,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
