import BottomSheetModal from "@/components/bottom-sheet-modal";
import Button from "@/components/button";
import { Choices } from "@/components/choices";
import { TChoice } from "@/types";
import IcArrowLeft from "@/components/icons/arrow-left";
import IcBasketball from "@/components/icons/basketball";
import IcBodybuilding from "@/components/icons/bodybuilding";
import IcClose from "@/components/icons/close";
import IcCrossfit from "@/components/icons/crossfit";
import IcCycling from "@/components/icons/cycling";
import IcPlus from "@/components/icons/plus";
import IcRowing from "@/components/icons/rowing";
import IcSearch from "@/components/icons/search";
import IcYoga from "@/components/icons/yoga";
import Input from "@/components/input";
import Text from "@/components/text";
import { ColorConst } from "@/constants/theme";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Pressable, View } from "react-native";
import { BottomSheetModal as BottomSheetModalType } from "@gorhom/bottom-sheet";
import { Chip } from "@/components/chip";
import { clsx } from "clsx";
import { mockSports } from "@/constants/mock";

const sportChoices: TChoice[] = [
  {
    text: "sports.athletics",
    leftIcon: <IcCycling />,
  },
  {
    text: "sports.rowing",
    leftIcon: <IcRowing />,
  },
  {
    text: "sports.basketball",
    leftIcon: <IcBasketball />,
  },
  {
    text: "sports.crossfit",
    leftIcon: <IcCrossfit />,
  },
  {
    text: "sports.cycling",
    leftIcon: <IcCycling />,
  },
  {
    text: "sports.bodybuilding",
    leftIcon: <IcBodybuilding />,
  },
  {
    text: "sports.yoga",
    leftIcon: <IcYoga />,
  },
];

export default function ExerciseFilterSports() {
  const [selectedSport, setSelectedSport] = useState<TChoice>();
  const [selectedChoices, setSelectedChoices] = useState<TChoice[]>([
    sportChoices[0],
  ]);
  const [search, setSearch] = useState<string>("");
  const addSportModalRef = useRef<BottomSheetModalType>(null);

  return (
    <View className="bg-white flex-1 py-safe px-4">
      <View className="flex flex-row gap-1 items-center">
        <Pressable onPress={router.back}>
          <IcArrowLeft />
        </Pressable>
        <Text className="font-bold text-lg flex-1">Sports</Text>
        <Text className="text-sm text-secondary font-medium">Tout effacer</Text>
      </View>

      <View className="mt-6 gap-3">
        <Choices
          numColumns={2}
          data={mockSports}
          selectedChoice={selectedSport}
          onChange={setSelectedSport}
        />
        <Button
          text="Ajouter un sport"
          leftIcon={<IcPlus color={ColorConst.accent} size={24} />}
          type="tertiary"
          onPress={() => addSportModalRef.current?.present()}
        />
      </View>

      <BottomSheetModal
        ref={addSportModalRef}
        name="add-sport-modal"
        snapPoints={["88%"]}
        className="pb-safe"
      >
        <View className="flex-row gap-4 items-center">
          <Input
            leftIcon={<IcSearch size={16} />}
            className="flex-1"
            value={search}
            onChangeText={setSearch}
          />
          <Pressable onPress={() => {}}>
            <IcClose color={ColorConst.accent} />
          </Pressable>
        </View>

        <View
          className={clsx("flex-row flex-wrap gap-2", {
            "mt-6": selectedChoices.length > 0,
          })}
        >
          {selectedChoices.map((choice, index) => (
            <Chip
              key={index}
              text={choice.text}
              type="selected"
              onLeftSidePress={() => {
                setSelectedChoices(
                  selectedChoices.filter((c) => c.text !== choice.text),
                );
              }}
            />
          ))}
        </View>

        <Choices
          numColumns={1}
          data={sportChoices}
          type="multipleChoice"
          selectedChoices={selectedChoices}
          onChangeMultiple={setSelectedChoices}
          className="mt-4"
        />
      </BottomSheetModal>
    </View>
  );
}
