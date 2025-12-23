import { ImageBackground, Text } from "react-native";

export default function CustomSplash() {
  return (
    <ImageBackground
      source={require("../assets/images/onboarding-0.png")}
      className="w-full h-full flex items-center justify-center"
    >
      <Text className="text-white text-[44px] font-bold mb-4">KAPTRAIN</Text>
      <Text className="text-white font-medium">
        L’Expertise de haut niveau,
      </Text>
      <Text className="text-white font-medium"> accessible à tous</Text>
    </ImageBackground>
  );
}
