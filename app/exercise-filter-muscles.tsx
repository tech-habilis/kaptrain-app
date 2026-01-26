import Button from "@/components/button";
import { Chip } from "@/components/chip";
import { Choices } from "@/components/choices";
import { TChoice } from "@/types";
import IcAbmat from "@/components/icons/abmat";
import IcArrowLeft from "@/components/icons/arrow-left";
import IcBar from "@/components/icons/bar";
import IcBench from "@/components/icons/bench";
import IcBox from "@/components/icons/box";
import IcClose from "@/components/icons/close";
import IcCrossfit from "@/components/icons/crossfit";
import IcHedges from "@/components/icons/hedges";
import IcMassageBall from "@/components/icons/massage-ball";
import IcMassageRoller from "@/components/icons/massage-roller";
import IcMedicineBall from "@/components/icons/medicine-ball";
import IcPullUpBar from "@/components/icons/pull-up-bar";
import IcPulley from "@/components/icons/pulley";
import IcRings from "@/components/icons/rings";
import IcSearch from "@/components/icons/search";
import IcSkippingRope from "@/components/icons/skipping-rope";
import IcStair from "@/components/icons/stair";
import IcSwissBall from "@/components/icons/swiss-ball";
import IcWeight from "@/components/icons/weight";
import IcWithoutEquipment from "@/components/icons/without-equipment";
import Input from "@/components/input";
import ManMuscleMap from "@/components/man-muscle-map";
import Tabs from "@/components/tabs";
import Text from "@/components/text";
import { ColorConst } from "@/constants/theme";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

const muscleChoices: TChoice[] = [
  { text: "Sans matériel", leftIcon: <IcWithoutEquipment /> },
  { text: "Abmat", leftIcon: <IcAbmat /> },
  { text: "Anneaux", leftIcon: <IcRings /> },
  { text: "Balle de massage", leftIcon: <IcMassageBall /> },
  { text: "Banc", leftIcon: <IcBench /> },
  { text: "Barre", leftIcon: <IcBar /> },
  { text: "Barre de traction", leftIcon: <IcPullUpBar /> },
  { text: "Box", leftIcon: <IcBox /> },
  { text: "Corde à sauter", leftIcon: <IcSkippingRope /> },
  { text: "Échelle de rythme", leftIcon: <IcStair /> },
  { text: "Élastique", leftIcon: <IcStair /> },
  { text: "Haies", leftIcon: <IcHedges /> },
  { text: "Haltère", leftIcon: <IcWeight /> },
  { text: "Kettlebell", leftIcon: <IcCrossfit /> },
  { text: "Médecine ball", leftIcon: <IcMedicineBall /> },
  { text: "Poulie", leftIcon: <IcPulley /> },
  { text: "Rouleau de massage", leftIcon: <IcMassageRoller /> },
  { text: "Swiss ball", leftIcon: <IcSwissBall /> },
];

const choices = [
  { text: "Abdominaux" },
  { text: "Adducteurs" },
  { text: "Avant bras" },
  { text: "Avant Bras Droit" },
  { text: "Avant Bras Gauche" },
];

export default function ExerciseFilterMuscles() {
  const [selectedMuscle, setSelectedMuscle] = useState<TChoice>();
  const [showDetail, setShowDetail] = useState(false);

  const tabs = ["Liste", "Corps humain"];
  const [detailTab, setDetailTab] = useState(tabs[0]);

  const [search, setSearch] = useState<string>("");

  const [selectedMuscles, setSelectedMuscles] = useState<TChoice[]>([]);

  const clearSearch = () => {
    setSearch("");
    // TODO: blur input when search is cleared
    // currently cannot do this because cannot access ref from Input component
  };

  const renderTabContent = () => {
    if (detailTab === "Liste") {
      return (
        <Choices
          numColumns={1}
          data={choices}
          selectedChoices={selectedMuscles}
          onChangeMultiple={setSelectedMuscles}
          type="multipleChoice"
          className="mt-4"
        />
      );
    }

    return (
      <>
        <ManMuscleMap className="my-4" />

        <View className="gap-2">
          <Text className="text-subtleText text-base">
            Zone(s) sélectionnée(s)
          </Text>

          <View className="flex-row flex-wrap gap-2">
            {choices.slice(0, 3).map((x, index) => (
              <Chip key={index} text={x.text} type="selected" />
            ))}
          </View>
        </View>
      </>
    );
  };

  const renderContent = () => {
    if (!showDetail) {
      return (
        <Choices
          numColumns={3}
          data={muscleChoices}
          selectedChoice={selectedMuscle}
          onChange={setSelectedMuscle}
          itemClassName="aspect-square"
          itemTextClassName="text-center"
          className="pb-24"
        />
      );
    }

    return (
      <View>
        <Tabs tabs={tabs} selected={detailTab} onSelected={setDetailTab} />

        <View className="flex-row gap-4 mt-6 items-center">
          <Input
            leftIcon={<IcSearch size={16} />}
            className="flex-1"
            value={search}
            onChangeText={setSearch}
          />
          <Pressable onPress={clearSearch}>
            <IcClose color={ColorConst.accent} />
          </Pressable>
        </View>

        {renderTabContent()}
      </View>
    );
  };

  return (
    <>
      <ScrollView
        className="bg-white flex-1 pt-safe px-4"
        contentContainerClassName="pb-24"
      >
        <View className="flex flex-row gap-1 items-center">
          <Pressable onPress={router.back}>
            <IcArrowLeft />
          </Pressable>
          <Text className="font-ls-bold text-lg flex-1">Muscles</Text>
          <Text className="text-sm text-secondary font-medium">
            Tout effacer
          </Text>
        </View>

        <Text className="text-subtleText text-base mt-1">
          Sélectionne le(s) muscle(s) à filtrer
        </Text>

        <View className="mt-4 gap-6">{renderContent()}</View>
      </ScrollView>
      <Button
        text="Filtrer"
        className="absolute bottom-0 left-0 right-0 mb-safe mx-4"
        onPress={() => {
          setShowDetail(!showDetail);
        }}
      />
    </>
  );
}
