import { ThemedView } from "@/components/themed-view";
import { ROUTE } from "@/constants/route";
import { useSession } from "@/contexts/auth-context";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import * as AppleAuthentication from "expo-apple-authentication";
import { Link } from "expo-router";
import { useState } from "react";
import { Text, Pressable, TextInput, View, Platform } from "react-native";

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
      </View>

      {/* only support android for now */}
      {Platform.OS === "android" && (
        <View className="flex flex-row gap-4 items-center justify-around">
          <GoogleSigninButton
            size={GoogleSigninButton.Size.Standard}
            color={GoogleSigninButton.Color.Dark}
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
      )}
    </ThemedView>
  );
}
