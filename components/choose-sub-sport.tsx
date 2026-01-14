import { router } from "expo-router";
import { View, ScrollView, Pressable } from "react-native";
import Text from "@/components/text";
import { ColorConst } from "@/constants/theme";
import { ROUTE } from "@/constants/route";
import IcArrowRight from "@/components/icons/arrow-right";
import IcSearch from "@/components/icons/search";
import Dropdown from "@/components/dropdown";
import Input from "@/components/input";
import { useState } from "react";
import { TChoice } from "@/types";
import IcChevronDown from "@/components/icons/chevron-down";
import IcMuscular from "@/components/icons/muscular";
import IcCrossfit from "@/components/icons/crossfit";
import IcRowing from "@/components/icons/rowing";
import IcHyrox from "@/components/icons/hyrox";

type RecordCardData = {
  id: string;
  label: string;
  value: string;
};

type CategorySectionData = {
  category: string;
  records: RecordCardData[];
};

const SORT_OPTIONS: TChoice[] = [
  { text: "Derniers records ajoutés" },
  { text: "Ordre alphabétique (A à Z)" },
  { text: "Ordre alphabétique (Z à A)" },
  { text: "Sous-catégorie" },
];

// Mock data for Musculation - in production this would come from API based on sport param
const MOCK_MUSCULATION_RECORDS: CategorySectionData[] = [
  {
    category: "Press",
    records: [
      { id: "1", label: "Développé couché", value: "80 kg" },
      { id: "2", label: "Développé militaire", value: "50 kg" },
    ],
  },
  {
    category: "Squat",
    records: [
      { id: "3", label: "Nuque", value: "60 kg" },
      { id: "4", label: "Overhead", value: "70 kg" },
      { id: "5", label: "Clavicule", value: "Aucun record" },
    ],
  },
  {
    category: "Haltérophilie",
    records: [
      { id: "6", label: "Épaulé", value: "Aucun record" },
      { id: "7", label: "Arraché", value: "70 kg" },
    ],
  },
  {
    category: "Autres",
    records: [
      { id: "8", label: "Soulevé de terre", value: "Aucun record" },
      { id: "9", label: "Soulevé de terre roumain", value: "Aucun record" },
    ],
  },
];

const SPORT_ICONS: Record<string, React.ReactNode> = {
  musculation: <IcMuscular size={24} />,
  crossfit: <IcCrossfit size={24} />,
  aviron: <IcRowing size={24} />,
  hyrox: <IcHyrox size={24} />,
};

function RecordCard({
  record,
  sportId,
}: {
  record: RecordCardData;
  sportId: string;
}) {
  return (
    <Pressable
      className="bg-white border border-stroke rounded-2xl p-4 flex-row items-center gap-2"
      onPress={() =>
        router.push({
          pathname: ROUTE.RECORD_DETAIL_ITEM,
          params: { recordId: record.id, sport: sportId, label: record.label },
        })
      }
    >
      <View className="flex-1 flex-col gap-2">
        <Text className="text-subtleText text-sm">{record.label}</Text>
        <Text className="text-secondary text-base font-semibold">
          {record.value}
        </Text>
      </View>
      <IcArrowRight size={24} color={ColorConst.accent} />
    </Pressable>
  );
}

export default function ChooseSubSport({ sportId }: { sportId: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSort, setSelectedSort] = useState<TChoice>(SORT_OPTIONS[0]);

  // Get sport name from ID (in production, this would come from API)
  const sportName = sportId.charAt(0).toUpperCase() + sportId.slice(1);
  const sportIcon = SPORT_ICONS[sportId] || SPORT_ICONS.musculation;

  return (
    <ScrollView className="flex-1" contentContainerClassName="pb-38">
      {/* Sport name header */}
      <View className="flex-row items-center gap-2 mb-6">
        {sportIcon}
        <Text className="text-text text-base font-bold">{sportName}</Text>
      </View>

      {/* Search bar */}
      <View className="mb-3">
        <Input
          placeholder="Rechercher un record"
          leftIcon={<IcSearch size={16} />}
          value={searchQuery}
          onChangeText={setSearchQuery}
          inputClassName="text-sm"
        />
      </View>

      {/* Sort dropdown */}
      <View className="mb-6">
        <Dropdown
          label="Trier par"
          options={SORT_OPTIONS}
          selectedOption={selectedSort}
          onSelect={setSelectedSort}
          modalTitle="Trier par"
          itemType="radio"
          className="justify-between self-start gap-4"
          rightIcon={<IcChevronDown size={24} />}
        />
      </View>

      {/* Records grouped by category */}
      {MOCK_MUSCULATION_RECORDS.map((section) => (
        <View key={section.category} className="mb-6">
          <Text className="text-accent text-sm mb-2">{section.category}</Text>
          <View className="flex flex-col gap-3">
            {section.records.map((record) => (
              <RecordCard key={record.id} record={record} sportId={sportId} />
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
