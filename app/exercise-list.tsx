import IcArrowLeft from "@/components/icons/arrow-left";
import Text from "@/components/text";
import { router, useLocalSearchParams } from "expo-router";
import { ReactNode, useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  View,
} from "react-native";
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
import IcLoveFilled from "@/components/icons/love-filled";
import clsx from "clsx";

type ExerciseItem = {
  title: string;
  image: any;
  icon?: ReactNode;
  isFavorite: boolean;
};

const ExerciseListCard = ({ item }: { item: ExerciseItem }) => {
  return (
    <View className="rounded-2xl flex-row items-center gap-4 border border-stroke overflow-hidden pr-2">
      <Image source={item.image} />
      <View className="flex-1 gap-2">
        <Text className="text-text font-semibold text-sm">{item.title}</Text>
        {item.icon}
      </View>
      <View className="rotate-180">
        <IcArrowLeft />
      </View>
    </View>
  );
};

const ExerciseGridCard = ({ item }: { item: ExerciseItem }) => {
  return (
    <ImageBackground
      source={item.image}
      className="rounded-xl gap-4 border border-stroke aspect-square flex-1 overflow-hidden"
    >
      <View className="flex-1 gap-1.5 p-3 h-full bg-linear-to-t from-black via-[#35353540] to-[#66666600] justify-end">
        <View className="flex-row gap-1">
          {item.isFavorite && <IcLoveFilled size={16} />}
          {item.icon}
        </View>
        <Text className="text-white font-semibold text-sm">{item.title}</Text>
      </View>
    </ImageBackground>
  );
};

export default function ExerciseList() {
  const { mode } = useLocalSearchParams();
  const [isFavScreen, setIsFavScreen] = useState(mode === "favorite");
  const [isGridView, setIsGridView] = useState(false);

  const sorts = [
    {
      text: "Ordre alphabétique (A à Z)",
    },
    {
      text: "Ordre alphabétique (Z à A)",
    },
  ];
  const [selectedSort, setSelectedSort] = useState(sorts[0]);

  const exercises: ExerciseItem[] = [
    {
      title: "Abods flèches",
      image: require("../assets/images/exercise-example-1.png"),
      isFavorite: false,
    },
    {
      title: "Abmat sit up",
      image: require("../assets/images/exercise-example-1.png"),
      isFavorite: true,
    },
    {
      title: "Arch",
      image: require("../assets/images/exercise-example-1.png"),
      isFavorite: true,
    },
    {
      title: "Abaisseur unilatéral élastique",
      image: require("../assets/images/exercise-example-1.png"),
      isFavorite: false,
    },
    {
      title: "Arch extension",
      image: require("../assets/images/exercise-example-1.png"),
      isFavorite: true,
    },
    {
      title: "Abaisseur unilatéral élastique",
      image: require("../assets/images/exercise-example-1.png"),
      isFavorite: false,
    },
    {
      title: "Abmat sit up",
      image: require("../assets/images/exercise-example-1.png"),
      isFavorite: true,
    },
    {
      title: "Abaisseur unilatéral élastique",
      image: require("../assets/images/exercise-example-1.png"),
      icon: <IcWeight color={isGridView ? "white" : ColorConst.accent} />,
      isFavorite: true,
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
            className={clsx("bg-white rounded-lg", {
              "bg-warmLight border-tertiary": isFavScreen,
            })}
            size="small"
            rightIcon={
              isFavScreen ? (
                <IcLoveFilled />
              ) : (
                <IcLove color={ColorConst.accent} />
              )
            }
            onPress={() => {
              setIsFavScreen(!isFavScreen);
            }}
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

        <Pressable onPress={() => setIsGridView(false)}>
          <IcGridV
            color={isGridView ? ColorConst.subtleText : ColorConst.text}
          />
        </Pressable>
        <Pressable onPress={() => setIsGridView(true)}>
          <IcGrid
            color={isGridView ? ColorConst.text : ColorConst.subtleText}
          />
        </Pressable>
      </View>

      <FlatList
        numColumns={isGridView ? 2 : 1}
        key={`grid-${isGridView}`}
        data={exercises.filter((x) => (isFavScreen ? x.isFavorite : true))}
        keyExtractor={(_, index) => index.toString()}
        contentContainerClassName="p-4 gap-4"
        columnWrapperClassName="gap-4"
        renderItem={({ item }) =>
          isGridView ? (
            <ExerciseGridCard item={item} />
          ) : (
            <ExerciseListCard item={item} />
          )
        }
      />
    </View>
  );
}
