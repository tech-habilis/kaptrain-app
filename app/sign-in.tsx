import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useSession } from "@/contexts/auth-context";
import * as AppleAuthentication from "expo-apple-authentication";
import { Pressable } from "react-native";

export default function SignIn() {
  const { canSignInWithApple, signInWithApple, signInWithGoogle } =
    useSession();

  return (
    <ThemedView
      style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 24 }}
    >
      <Pressable onPress={signInWithGoogle}>
        <ThemedText>
          Sign in with Google
        </ThemedText>
      </Pressable>

      {canSignInWithApple && (
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={5}
          style={{ width: 200, height: 44 }}
          onPress={signInWithApple}
        />
      )}
    </ThemedView>
  );
}
