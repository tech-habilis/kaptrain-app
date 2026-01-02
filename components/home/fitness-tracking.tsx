import { ROUTE } from "@/constants/route";
import { router } from "expo-router";
import { View, ScrollView } from "react-native";
import WellnessTrackingChart from "@/components/home/wellness-tracking-chart";
import { Chip } from "@/components/chip";
import IcAppleFood from "@/components/icons/apple-food";
import IcLightning from "@/components/icons/lightning";
import IcMoon from "@/components/icons/moon";
import IcTeardrop from "@/components/icons/teardrop";
import Text from "@/components/text";
import Button from "@/components/button";

const FitnessTracking = () => {
  const chips = [
    { title: "Sommeil", icon: <IcMoon size={16} /> },
    { title: "Energie", icon: <IcLightning size={16} /> },
    { title: "Nutrition", icon: <IcAppleFood size={16} /> },
    { title: "Hydratation", icon: <IcTeardrop size={16} /> },
  ];

  return (
    <View className="bg-white py-4 gap-4">
      <View className="flex-row justify-between items-center mx-4">
        <Text className="font-bold text-base text-secondary">
          Mon suivi de forme
        </Text>
        <Button text="Aujourd’hui" type="secondaryV2" size="small" />
      </View>

      {/* area chart */}
      <WellnessTrackingChart
        data={[
          {
            date: new Date(2026, 0, 1),
            score: 6.5,
          },
          {
            date: new Date(2026, 0, 2),
            score: 6,
          },
          {
            date: new Date(2026, 0, 3),
            score: 7,
          },
          {
            date: new Date(2026, 0, 4),
            score: 8,
          },
          {
            date: new Date(2026, 0, 5),
            score: 6.5,
          },
          {
            date: new Date(2026, 0, 6),
            score: 7.5,
          },
          {
            date: new Date(2026, 0, 7),
            score: 8.5,
          },
        ]}
      />

      {/* chips */}
      <ScrollView horizontal contentContainerClassName="gap-2 px-4">
        {chips.map((chip, index) => (
          <Chip
            type="uncheck"
            text={chip.title}
            leftIcon={chip.icon}
            key={index}
          />
        ))}
      </ScrollView>

      <Button
        type="secondary"
        size="small"
        text="Renseigner ma forme du jour"
        className="mx-4"
        onPress={() => router.push(ROUTE.WELLNESS)}
      />
    </View>
  );
};

export default FitnessTracking;
