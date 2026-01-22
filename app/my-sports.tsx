import { Stack, router } from "expo-router";
import { View, ScrollView, Pressable } from "react-native";
import Text from "@/components/text";
import { ROUTE } from "@/constants/route";
import { ColorConst } from "@/constants/theme";
import IcArrowRight from "@/components/icons/arrow-right";
import IcCycling from "@/components/icons/cycling";
import IcLightning from "@/components/icons/lightning";
import BasicScreen from "@/components/basic-screen";
import Button from "@/components/button";
import IcClock from "@/components/icons/clock";
import IcTennisBall from "@/components/icons/tennis-ball";

type RecordCard = {
  label: string;
  value: string;
};

type ObjectiveCard = {
  category: string;
  daysLeft?: string;
  status?: string;
  title: string;
};

type SportCardData = {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  records?: RecordCard[];
  objectives?: ObjectiveCard[];
};

// Using IcLightning as placeholder for: running, volleyball, tennis
const MOCK_SPORTS: SportCardData[] = [
  {
    id: "1",
    name: "Course à pied",
    icon: <IcLightning size={24} color={ColorConst.accent} />,
    color: ColorConst.primary,
    records: [
      { label: "Semi-marathon", value: "01:38:00" },
      { label: "Marathon", value: "03:42:25" },
    ],
    objectives: [
      {
        category: "Évènement",
        daysLeft: "J-21",
        title: "Marathon de Paris 2026",
      },
      {
        category: "Santé",
        daysLeft: "J-64",
        title: "Perdre 5 kg",
      },
      {
        category: "Évènement",
        status: "Terminé",
        title: "Hyrox Palais de Tokyo",
      },
    ],
  },
  {
    id: "2",
    name: "Cyclisme",
    icon: <IcCycling size={24} />,
    color: ColorConst.tertiary,
    records: [
      { label: "Puissance 20 min", value: "270 W" },
      { label: "Sortie 100 km", value: "03:25:00" },
    ],
  },
  {
    id: "3",
    name: "Volleyball",
    icon: <IcLightning size={24} color={ColorConst.accent} />,
    color: ColorConst.decorative,
  },
  {
    id: "4",
    name: "Tennis",
    icon: <IcTennisBall size={24} color={ColorConst.accent} />,
    color: ColorConst.secondary,
  },
];

function SportCard({ sport }: { sport: SportCardData }) {
  const hasRecords = sport.records && sport.records.length > 0;
  const hasObjectives = sport.objectives && sport.objectives.length > 0;

  return (
    <Pressable
      className="bg-white rounded-2xl p-3 mb-3"
      style={{ borderLeftWidth: 4, borderLeftColor: sport.color }}
      onPress={() =>
        router.push({
          pathname: ROUTE.SPORT_DETAIL,
          params: { name: sport.name },
        })
      }
    >
      {/* Header */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-1.5 flex-1">
          {sport.icon}
          <Text className="text-text text-base font-semibold">
            {sport.name}
          </Text>
        </View>
        <IcArrowRight size={24} color={ColorConst.accent} />
      </View>

      {/* Records Section */}
      {hasRecords && (
        <View className="mt-3">
          <Text className="text-accent text-sm mb-1.5">
            Derniers records
          </Text>
          <View className="flex flex-row gap-1.5">
            {sport.records!.map((record, index) => (
              <View
                key={index}
                className="flex-1 bg-white border border-stroke rounded-xl px-3 py-2"
              >
                <Text className="text-subtleText text-sm mb-1">
                  {record.label}
                </Text>
                <Text className="text-text text-sm font-medium">
                  {record.value}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Objectives Section */}
      {hasObjectives && (
        <View className="mt-3">
          <Text className="text-accent text-sm mb-1.5">
            Objectif(s) personnel
          </Text>
          <View className="flex flex-col gap-1">
            {sport.objectives!.map((objective, index) => (
              <View
                key={index}
                className="bg-white border border-stroke rounded-xl px-3 py-2"
              >
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-subtleText text-sm">
                    {objective.category}
                  </Text>
                  <View className="flex-row items-center gap-1">
                    <IcClock size={16} color={ColorConst.subtleText} />
                    <Text className="text-subtleText text-sm">
                      {`${objective.daysLeft || objective.status}`}
                    </Text>
                  </View>
                </View>
                <Text className="text-text text-sm font-medium">
                  {objective.title}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </Pressable>
  );
}

export default function MySportsScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <BasicScreen
        title="Mes sports"
        headerClassName="bg-light"
      >
        <View className="flex-1 bg-light">
          {/* Content */}
          <ScrollView className="flex-1 px-4 pb-32">
            {MOCK_SPORTS.map((sport) => (
              <SportCard key={sport.id} sport={sport} />
            ))}
          </ScrollView>

          {/* CTA */}
          <View className="absolute bottom-0 left-0 right-0 px-4 pb-6 pt-8 bg-linear-to-t from-light via-light to-transparent">
            <Button
              text="Modifier mes sports"
              onPress={() => router.push(ROUTE.MODIFY_MY_SPORTS)}
              className="h-14"
            />
          </View>
        </View>
      </BasicScreen>
    </>
  );
}
