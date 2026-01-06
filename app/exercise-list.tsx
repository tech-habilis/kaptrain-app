import IcArrowLeft from "@/components/icons/arrow-left";
import Text from "@/components/text";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, Image, Pressable, View } from "react-native";
import Input from "@/components/input";
import IcSearch from "@/components/icons/search";
import Button from "@/components/button";
import IcFilter from "@/components/icons/filter";
import Dropdown from "@/components/dropdown";
import IcLove from "@/components/icons/love";
import { ColorConst } from "@/constants/theme";
import { Chip } from "@/components/chip";
import IcGridV from "@/components/icons/grid-v";
import IcGrid from "@/components/icons/grid";
import IcWeight from "@/components/icons/weight";

export default function ExerciseList() {
  const sorts = [
    {
      text: "Ordre alphabétique (A à Z)",
    },
    {
      text: "Ordre alphabétique (Z à A)",
    },
  ];
  const [selectedSort, setSelectedSort] = useState(sorts[0]);

  const exercises = [
    {
      title: "Abods flèches",
      image: require("../assets/images/exercise-example-1.png"),
    },
    {
      title: "Abmat sit up",
      image: require("../assets/images/exercise-example-1.png"),
    },
    {
      title: "Arch",
      image: require("../assets/images/exercise-example-1.png"),
    },
    {
      title: "Abaisseur unilatéral élastique",
      image: require("../assets/images/exercise-example-1.png"),
    },
    {
      title: "Arch extension",
      image: require("../assets/images/exercise-example-1.png"),
    },
    {
      title: "Abaisseur unilatéral élastique",
      image: require("../assets/images/exercise-example-1.png"),
    },
    {
      title: "Abmat sit up",
      image: require("../assets/images/exercise-example-1.png"),
    },
    {
      title: "Abaisseur unilatéral élastique",
      image: require("../assets/images/exercise-example-1.png"),
      icon: <IcWeight />,
    },
  ];

  return (
    <View className="bg-white flex-1">
      <View className="px-4 bg-light pt-safe pb-4">
        <View className="flex flex-row gap-1 items-center mb-6">
          <Pressable onPress={router.back}>
            <IcArrowLeft />
          </Pressable>
          <Text className="font-bold text-lg">Tous les exercices</Text>
        </View>

        <Input leftIcon={<IcSearch />} />

        <View className="gap-2 flex-row mt-2">
          <Button
            text="1"
            leftIcon={<IcFilter />}
            type="secondaryV2"
            className="bg-white rounded-lg"
            size="small"
          />
          <Dropdown
            label="Trier par"
            options={sorts}
            selectedOption={selectedSort}
            onSelect={(choice) => {
              setSelectedSort(choice);
            }}
            className="flex-1 justify-between bg-white rounded-lg"
            size="small"
            textClassName="font-medium"
            modalTitle="Trier par"
            rightIcon={
              <View className="-rotate-90">
                <IcArrowLeft />
              </View>
            }
          />

          <Button
            text="Favoris"
            type="secondaryV2"
            className="bg-white rounded-lg"
            size="small"
            rightIcon={<IcLove color={ColorConst.accent} />}
          />
        </View>

        <View className="flex-row gap-2 mt-2 flex-wrap">
          <Chip text="Athlétisme" type="selected" />
          <Chip text="Cyclisme" type="selected" />
        </View>
      </View>

      <View className="flex-row items-center px-4 pt-6 gap-2">
        <Text className="text-sm text-subtleText font-medium flex-1">
          50 résultats
        </Text>

        <IcGridV />
        <IcGrid />
      </View>

      <FlatList
        data={exercises}
        keyExtractor={(_, index) => index.toString()}
        contentContainerClassName="p-4 gap-4"
        renderItem={({ item }) => (
          <View className="rounded-2xl flex-row items-center gap-4 border border-stroke overflow-hidden pr-2">
            <Image source={item.image} />
            <Text className="text-text font-semibold text-sm flex-1">
              {item.title}
            </Text>
            <View className="rotate-180"><IcArrowLeft /></View>
          </View>
        )}
      />
    </View>
  );
}
