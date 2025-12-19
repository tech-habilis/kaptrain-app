import { useSession } from "@/contexts/auth-context";
import { useState } from "react";
import { Text, Pressable, TextInput, View } from "react-native";

export default function SignIn() {
  const {
    signUpWithEmail,
    loggingInWith
  } = useSession();

  const [name, setName] = useState('');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View className="flex flex-col gap-4 p-8 py-safe justify-center flex-1 bg-light">
      <Text className="text-2xl">Sign Up</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name"
        className="h-12 border-2 border-stroke px-4"
        autoCapitalize="none"
      />
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
          signUpWithEmail({
            name,
            email,
            password,
            confirmPassword: password
          })
        }
        disabled={loggingInWith === 'email'}
        className="bg-primary px-4 h-12 flex justify-center items-center"
      >
        <Text className="text-white">
          {loggingInWith === "email"
            ? "Signing up with Email..."
            : "Sign up with Email"}
        </Text>
      </Pressable>
    </View>
  );
}
