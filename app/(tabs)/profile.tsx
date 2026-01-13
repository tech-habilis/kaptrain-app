import { Chip } from "@/components/chip";
import SingleFab from "@/components/fab";
import IcArrowRight from "@/components/icons/arrow-right";
import IcChat from "@/components/icons/chat";
import IcCheckCircleFilled from "@/components/icons/check-circle-filled";
import IcCog from "@/components/icons/cog";
import IcDashedCircle from "@/components/icons/dashed-circle";
import IcLightning from "@/components/icons/lightning";
import IcLightningFilled from "@/components/icons/lightning-filled";
import Text from "@/components/text";
import { mockWeeklyTracking } from "@/constants/mock";
import { ROUTE } from "@/constants/route";
import { ColorConst } from "@/constants/theme";
import { useSession } from "@/contexts/auth-context";
import { useCompleteProfileStore } from "@/stores/complete-profile-store";
import { clsx } from "clsx";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, Image, ImageBackground, Pressable } from "react-native";

const profileMenu = [
  {
    icon: <IcLightning size={24} />,
    text: "Mes sports",
    onPress: () => router.push(ROUTE.MY_SPORTS),
  },
  {
    icon: <IcLightning size={24} />,
    text: "Mon coach",
    onPress: () => router.push(ROUTE.MY_COACH),
  },
  {
    icon: <IcLightning size={24} />,
    text: "Mes records",
    onPress: () => router.push(ROUTE.MY_RECORDS),
  },
  {
    icon: <IcLightning size={24} />,
    text: "Mes blessure(s)",
    onPress: () => router.push(ROUTE.INJURIES),
  },
  {
    icon: <IcLightning size={24} />,
    text: "Mes données physiologiques",
    onPress: () => router.push(ROUTE.PHYSIOLOGICAL_DATA),
  },
];

export default function ProfileScreen() {
  const { session } = useSession();
  const { setCurrentStep } = useCompleteProfileStore();
  return (
    <View className="flex-1">
      <StatusBar style="light" />
      <ImageBackground source={require("../../assets/images/profile-hero.png")}>
        <View className="px-4 pt-safe pb-6 flex-row gap-3 items-center">
          <Image
            source={require("../../assets/images/sample-avatar.png")}
            className="rounded-lg border border-white size-14"
          />

          <View className="gap-1.5 flex-1">
            <Text className="text-white text-xl font-bold" numberOfLines={1}>
              {session?.user?.name || session?.user?.email || "User"}
            </Text>
            <Pressable onPress={() => router.push(ROUTE.SUBSCRIPTION)}>
              <Chip
                text="Premium"
                className="border-white bg-linear-to-b from-secondary to-primary self-start text-white py-1"
                textClassName="text-white text-[10px] font-bold"
              />
            </Pressable>
          </View>

          <View className="flex-row items-center">
            <Pressable
              className="p-2"
              onPress={() => router.push(ROUTE.SETTINGS)}
            >
              <IcCog color="white" />
            </Pressable>
          </View>
        </View>
      </ImageBackground>

      <View className="bg-white p-4 rounded-2xl">
        <Text className="font-bold text-base text-text py-2">
          Suivi de forme
        </Text>

        <View className="flex-row gap-1 mt-2">
          {mockWeeklyTracking.map((x, index) => (
            <View
              key={index}
              className={clsx(
                "py-1.5 px-2.5 justify-center items-center gap-1.5 rounded-lg grow",
                {
                  "bg-light": x.doing,
                },
              )}
            >
              {x.doing ? (
                <IcCheckCircleFilled size={24} color={ColorConst.primary} />
              ) : (
                <IcDashedCircle />
              )}
              <Text
                className={clsx("font-medium text-xs", {
                  "text-primary": x.doing,
                  "text-accent": !x.doing,
                })}
              >
                {x.text}
              </Text>
            </View>
          ))}
        </View>

        <View className="border-b border-stroke border-dashed h-1 my-3" />

        <View className="flex-row items-center">
          <IcLightningFilled color={ColorConst.tertiary} />
          <Text className="text-sm text-text font-medium flex-1">
            Streak actuel
          </Text>

          <Text className="text-sm text-text font-medium">4 jours</Text>
        </View>
      </View>

      <View className="pt-6 px-4 gap-2">
        {profileMenu.map((x, index) => (
          <Pressable
            key={index}
            className="bg-white p-4 flex-row items-center  rounded-2xl gap-1.5 border border-stroke"
            onPress={x.onPress}
          >
            {x.icon}
            <Text className="text-text text-base font-bold flex-1">
              {x.text}
            </Text>
            <IcArrowRight />
          </Pressable>
        ))}
      </View>

      <SingleFab
        onPress={() => {
          setCurrentStep(1);
          router.push(ROUTE.COMPLETE_PROFILE);
        }}
        icon={<IcChat size={32} />}
      />
    </View>
  );
}
