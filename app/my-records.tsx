import { router } from "expo-router";
import { View, ScrollView, Pressable } from "react-native";
import Text from "@/components/text";
import { ColorConst } from "@/constants/theme";
import { ROUTE } from "@/constants/route";
import BasicScreen from "@/components/basic-screen";
import IcArrowRight from "@/components/icons/arrow-right";
import IcCrossfit from "@/components/icons/crossfit";
import Button from "@/components/button";
import IcRowing from "@/components/icons/rowing";
import IcMuscular from "@/components/icons/muscular";
import IcHyrox from "@/components/icons/hyrox";

type SportRecordCardData = {
  id: string;
  name: string;
  icon: React.ReactNode;
  recordCount: number;
};

// Using IcLightning as placeholder for missing sport icons
const MOCK_SPORT_RECORDS: SportRecordCardData[] = [
  {
    id: "musculation",
    name: "Musculation",
    icon: <IcMuscular size={24} />,
    recordCount: 5,
  },
  {
    id: "crossfit",
    name: "Crossfit",
    icon: <IcCrossfit size={24} />,
    recordCount: 4,
  },
  {
    id: "aviron",
    name: "Aviron",
    icon: <IcRowing size={24} />,
    recordCount: 2,
  },
  {
    id: "hyrox",
    name: "Hyrox",
    icon: <IcHyrox size={24} />,
    recordCount: 0,
  },
];

function SportRecordCard({ sport }: { sport: SportRecordCardData }) {
  return (
    <Pressable
      className="bg-white border border-stroke rounded-xl p-3 flex-row items-center gap-2"
      onPress={() =>
        router.push({
          pathname: ROUTE.RECORD_DETAIL,
          params: { sport: sport.id },
        })
      }
    >
      <View className="flex-1 flex-col gap-1">
        <View className="flex-row items-center gap-1.5">
          {sport.icon}
          <Text className="text-secondary text-base font-semibold">
            {sport.name}
          </Text>
        </View>
        <Text className="text-subtleText text-sm">
          {sport.recordCount > 0
            ? `${sport.recordCount} records enregistrés`
            : "Aucun record"}
        </Text>
      </View>
      <IcArrowRight size={24} color={ColorConst.accent} />
    </Pressable>
  );
}

export default function MyRecordsScreen() {
  return (
    <BasicScreen
      title="Mes records"
      description="Consulte ou ajoute un record pour suivre ta progression au fil du temps"
      headerClassName="bg-light"
    >
      <ScrollView className="flex-1 px-4 pt-6 pb-48">
        <View className="flex flex-col gap-2">
          {MOCK_SPORT_RECORDS.map((sport) => (
            <SportRecordCard key={sport.id} sport={sport} />
          ))}
        </View>
      </ScrollView>

      {/* CTA with gradient overlay */}
      <View className="absolute bottom-0 left-0 right-0 px-4 pb-safe pt-8 bg-linear-to-t from-white via-white to-transparent">
        <Button
          type="secondary"
          text="Ajouter un record"
          onPress={() => router.push(ROUTE.ADD_RECORD)}
          className="mb-6"
        />
      </View>
    </BasicScreen>
  );
}
