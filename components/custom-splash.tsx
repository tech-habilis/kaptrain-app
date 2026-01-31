import { appName } from "@/constants/misc";
import Text from "./text";
import IcKaptrain from "./icons/kaptrain";
import { FadeIn, FadeOut } from "react-native-reanimated";
import { AnimatedImageBackground } from "./animated";

export default function CustomSplash() {
  return (
    <AnimatedImageBackground
      source={require("../assets/images/onboarding-0.png")}
      className="w-full h-full flex items-center justify-center"
      entering={FadeIn}
      exiting={FadeOut}
    >
      <IcKaptrain />
      <Text className="text-white text-[44px] font-ls-extrabold mb-4 mt-3.5 uppercase">
        {appName}
      </Text>
      <Text className="text-white font-medium">L'Expertise de haut niveau,</Text>
      <Text className="text-white font-medium">accessible à tous</Text>
    </AnimatedImageBackground>
  );
}
