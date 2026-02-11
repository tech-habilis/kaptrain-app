import Button from "@/components/button";
import IcClose from "@/components/icons/close";
import IcCog from "@/components/icons/cog";
import IcMuscular from "@/components/icons/muscular";
import IcVeryDissatisfied from "@/components/icons/very-dissatisfied";
import { Slider } from "@/components/slider";
import Text from "@/components/text";
import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import { Pressable, View } from "react-native";
import { BottomSheetModal as BottomSheetModalType } from "@gorhom/bottom-sheet";
import BottomSheetModal from "@/components/bottom-sheet-modal";
import { router } from "expo-router";

export default function Wellness() {
  const [sommeil, setSommeil] = useState(0);
  const [energie, setEnergie] = useState(0);
  const [nutrition, setNutrition] = useState(0);
  const [hydratation, setHydratation] = useState(0);
  const [douleurs, setDouleurs] = useState(0);
  const [stress, setStress] = useState(0);

  const bottomSheetModalRef = useRef<BottomSheetModalType>(null);

  return (
    <View className="py-safe px-4 flex-1 bg-white">
      <StatusBar style="dark" />
      <View className="flex-row items-center justify-between">
        <Text className="text-lg text-secondary font-ls-bold">wellness.title</Text>

        <Pressable onPress={router.back}>
          <IcClose />
        </Pressable>
      </View>

      <Text className="text-subtleText text-base mt-1">
        wellness.description
      </Text>

      <View className="gap-10 mt-6">
        <Slider
          title="wellness.sleep"
          leftIcon={<IcVeryDissatisfied />}
          leftLabel="wellness.veryBad"
          rightLabel="wellness.excellent"
          rightIcon={<IcMuscular />}
          value={sommeil}
          onChange={setSommeil}
          steps={7}
        />

        <Slider
          title="wellness.energy"
          leftIcon={<IcVeryDissatisfied />}
          leftLabel="wellness.veryBad"
          rightLabel="wellness.feelingGreat"
          rightIcon={<IcMuscular />}
          value={energie}
          onChange={setEnergie}
          steps={7}
        />

        <Slider
          title="wellness.nutritionYesterday"
          leftIcon={<IcVeryDissatisfied />}
          leftLabel="wellness.veryBad"
          rightLabel="wellness.veryHealthy"
          rightIcon={<IcMuscular />}
          value={nutrition}
          onChange={setNutrition}
          steps={7}
        />

        <Slider
          title="wellness.hydrationYesterday"
          leftIcon={<IcVeryDissatisfied />}
          leftLabel="wellness.lessThan1L"
          rightLabel="wellness.moreThan3L"
          rightIcon={<IcMuscular />}
          value={hydratation}
          onChange={setHydratation}
          steps={7}
        />

        <Slider
          title="wellness.pain"
          leftIcon={<IcMuscular />}
          leftLabel="wellness.none"
          rightLabel="wellness.veryImportant"
          rightIcon={<IcVeryDissatisfied />}
          value={douleurs}
          onChange={setDouleurs}
          steps={7}
          reverseGradient
        />

        <Slider
          title="wellness.stress"
          leftIcon={<IcMuscular />}
          leftLabel="wellness.none"
          rightLabel="wellness.veryImportant"
          rightIcon={<IcVeryDissatisfied />}
          value={stress}
          onChange={setStress}
          steps={7}
          reverseGradient
        />
      </View>

      <View className="grow" />

      <View className="flex-row gap-2 items-center">
        <Pressable
          className="p-3"
          onPress={() => bottomSheetModalRef.current?.present()}
        >
          <IcCog />
        </Pressable>
        <Button text="Valider" className="flex-1" type="secondary" />
      </View>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        name="setting"
        snapPoints={["88%"]}
        key="native"
        className="pb-safe"
      >
        <Text className="text-lg font-ls-bold text-secondary">
          Désactiver l’affichage quotidien du suivi de ta forme ?
        </Text>
        <Text className="text-subtleText text-base">
          {
            "Suis facilement ton bien-être au quotidien grâce à ces six paramètres essentiels.\n\nLe suivi de forme te permet d’indiquer chaque jour ton état de bien-être grâce à 6 paramètres essentiels : Sommeil, Douleurs, Fatigue, Stress, Nutrition de la veille, Hydratation de la veille.\n\nCes données t’aident à identifier les domaines à améliorer et à adapter tes habitudes pour un meilleur équilibre entre entraînement et récupération.\n\nSi tu le désactives, il ne s’affichera plus à chaque connexion. Tu pourras le réactiver depuis ton profil à tout moment."
          }
        </Text>

        <View className="grow" />

        <Button text="Désactiver quand même" type="secondary" />
        <Button
          text="Conserver le rappel"
          className="mt-2 mb-6"
          onPress={() => bottomSheetModalRef.current?.close()}
        />
      </BottomSheetModal>
    </View>
  );
}
