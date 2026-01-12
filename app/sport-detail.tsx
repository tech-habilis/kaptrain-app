import { useLocalSearchParams, router } from "expo-router";
import { View, ScrollView, Pressable } from "react-native";
import Text from "@/components/text";
import { ColorConst } from "@/constants/theme";
import { ROUTE } from "@/constants/route";
import IcPlus from "@/components/icons/plus";
import BasicScreen from "@/components/basic-screen";
import cn from "@/utilities/cn";
import IcClockRound from "@/components/icons/clock-round";
import IcArrowRight from "@/components/icons/arrow-right";
import ObjectiveDetailModal from "@/components/objective-detail-modal";
import { useRef, useState } from "react";
import { BottomSheetModal as BottomSheetModalType } from "@gorhom/bottom-sheet";

type ObjectiveData = {
  id: string;
  category: string;
  date?: string;
  status?: string;
  title: string;
};

type RecordData = {
  id: string;
  label: string;
  value: string;
};

// Mock data - in production this would come from route params or API
const MOCK_OBJECTIVES: ObjectiveData[] = [
  {
    id: "1",
    category: "Évènement",
    date: "12/11/2025",
    title: "Marathon de Paris 2026",
  },
  {
    id: "2",
    category: "Santé",
    date: "12/010/2025",
    title: "Perdre 5 kg",
  },
  {
    id: "3",
    category: "Évènement",
    status: "Terminé",
    title: "Hyrox Palais de Tokyo",
  },
];

const MOCK_RECORDS: RecordData[] = [
  { id: "1", label: "Semi-marathon", value: "01:38:00" },
  { id: "2", label: "Marathon", value: "03:42:25" },
  { id: "3", label: "Squat - nuque", value: "60 kg" },
  { id: "4", label: "Haltérophilie - Arraché", value: "70 kg" },
];

function ObjectiveCard({
  objective,
  onOpen,
}: {
  objective: ObjectiveData;
  onOpen: () => void;
}) {
  return (
    <Pressable onPress={onOpen}>
      <View className="bg-white border border-stroke rounded-xl p-3">
        <View className="flex flex-col gap-2">
          {/* Category and Date/Status Row */}
          <View className="flex-row items-center justify-between">
            <Text className="text-subtleText text-sm">{objective.category}</Text>
            <View className="flex-row items-center gap-1">
              <IcClockRound size={16} color={ColorConst.subtleText} />
              <Text className="text-subtleText text-sm">
                {`${(objective.date || objective.status)?.toString()}`}
              </Text>
            </View>
          </View>
          {/* Title */}
          <Text className="text-text text-base font-semibold">
            {objective.title}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

function RecordCard({ record }: { record: RecordData }) {
  return (
    <View className="bg-white border border-stroke rounded-xl p-3 flex-row items-center gap-2">
      <View className="flex-1 flex-col gap-2">
        <Text className="text-subtleText text-sm">{record.label}</Text>
        <Text className="text-secondary text-base font-semibold">
          {record.value}
        </Text>
      </View>
      <IcArrowRight size={24} color={ColorConst.accent} />
    </View>
  );
}

export default function SportDetailScreen() {
  const params = useLocalSearchParams();
  const sportName = (params.name as string) || "Course à pied";

  const objectiveModalRef = useRef<BottomSheetModalType>(null);
  const [selectedObjective, setSelectedObjective] =
    useState<ObjectiveData | null>(null);

  const handleOpenObjective = (objective: ObjectiveData) => {
    setSelectedObjective(objective);
    objectiveModalRef.current?.present();
  };

  const handleDelete = () => {
    console.log("Deleting objective:", selectedObjective?.id);
    // TODO: Implement delete logic
  };

  const handleMarkComplete = () => {
    console.log("Marking objective as complete:", selectedObjective?.id);
    // TODO: Implement mark complete logic
  };

  const handleEdit = () => {
    if (selectedObjective) {
      router.push({
        pathname: ROUTE.MODIFY_SPORT_OBJECTIVE,
        params: { id: selectedObjective.id },
      });
    }
  };

  return (
    <BasicScreen title={sportName} headerClassName="bg-light">
      <ScrollView className="flex-1 px-4 pb-32 pt-6">
        {/* Objectives Section */}
        <View className="mb-6">
          <Text className="text-accent text-sm mb-2">Mes objectifs</Text>
          <View className="flex flex-col gap-2">
            {MOCK_OBJECTIVES.map((objective) => (
              <ObjectiveCard
                key={objective.id}
                objective={objective}
                onOpen={() => handleOpenObjective(objective)}
              />
            ))}
            {/* Add Objective Button */}
            <Pressable
              onPress={() => router.push(ROUTE.ADD_SPORT_OBJECTIVE)}
              className={cn(
                "flex-row items-center justify-center",
                "gap-2 px-4 py-2 rounded-2xl",
              )}
            >
              <IcPlus size={24} color={ColorConst.accent} />
              <Text className="text-secondary text-sm font-medium">
                Ajouter un objectif
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Records Section */}
        <View className="mb-safe pb-6">
          <Text className="text-accent text-sm mb-2">Mes records</Text>
          <View className="flex flex-col gap-2">
            {MOCK_RECORDS.map((record) => (
              <RecordCard key={record.id} record={record} />
            ))}
            {/* Add Record Button */}
            <View
              className={cn(
                "flex-row items-center justify-center",
                "gap-2 px-4 py-2 rounded-2xl",
              )}
            >
              <IcPlus size={24} color={ColorConst.accent} />
              <Text className="text-secondary text-sm font-medium">
                Ajouter un record
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Objective Detail Modal */}
      {selectedObjective && (
        <ObjectiveDetailModal
          ref={objectiveModalRef}
          sportName={sportName}
          objective={selectedObjective}
          onDelete={handleDelete}
          onMarkComplete={handleMarkComplete}
          onEdit={handleEdit}
        />
      )}
    </BasicScreen>
  );
}
