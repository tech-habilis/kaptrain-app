import { ThemedView } from "@/components/themed-view";
import { toast } from "@/components/toast";
import { ROUTE } from "@/constants/route";
import { useSession } from "@/contexts/auth-context";
import { supabase } from "@/utilities/supabase";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import * as AppleAuthentication from "expo-apple-authentication";
import { Link } from "expo-router";
import { useState } from "react";
import { Text, Pressable, TextInput, View } from "react-native";
import { signUpWithGoogle } from "react-native-credentials-manager";

export default function SignIn() {
  const {
    canSignInWithApple,
    signInWithApple,
    signInWithGoogle,
    signInWithEmail,
    loggingInWith,
    isLoggingIn,
  } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signInWithGoogleV2 = async () => {
    try {
      const googleCredential = await signUpWithGoogle({
        serverClientId: process.env.EXPO_PUBLIC_GOOGLE_AUTH_WEB_CLIENT_ID!,
        autoSelectEnabled: false,
        // Show all Google accounts for sign-up (default behavior)
        filterByAuthorizedAccounts: false,
      });

      return {
        type: "google",
        token: googleCredential.idToken,
        id: googleCredential.id,
        user: {
          name: googleCredential.displayName,
          givenName: googleCredential.givenName,
          familyName: googleCredential.familyName,
          photo: googleCredential.profilePicture,
        },
      };
    } catch (error) {
      console.log(error);
      toast.error(error as string);
    }
  };

  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
      }}
    >
      <Text className="text-2xl">Sign In</Text>
      <View className="flex flex-col gap-4 w-full p-8">
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          className="h-12 border-2 border-stroke px-4"
          autoCapitalize="none"
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Password"
          className="h-12 border-2 border-stroke px-4"
        />
        <Pressable
          onPress={() =>
            signInWithEmail({
              email,
              password,
            })
          }
          disabled={isLoggingIn}
          className="bg-primary px-4 h-12 flex justify-center items-center"
        >
          <Text className="text-white">
            {loggingInWith === "email"
              ? "Signing in with Email..."
              : "Sign in with Email"}
          </Text>
        </Pressable>

        <Link href={ROUTE.SIGN_UP} className="text-primary text-right">
          Sign up
        </Link>

        <Pressable onPress={async () => {
          const data = await supabase.from('for_example').select("*").limit(1);
          console.log(data);
        }}>
          <Text>get example data</Text>
        </Pressable>
      </View>

      <View className="flex flex-row gap-4 items-center justify-around">
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Icon}
          color={GoogleSigninButton.Color.Dark}
          // onPress={signInWithGoogle}
          onPress={signInWithGoogle}
        />

        {canSignInWithApple && (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={
              AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
            }
            buttonStyle={
              AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
            }
            cornerRadius={5}
            style={{ width: 44, height: 44 }}
            onPress={signInWithApple}
          />
        )}
      </View>
    </ThemedView>
  );
}
