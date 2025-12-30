import IcClose from "@/components/icons/close";
import IcMuscular from "@/components/icons/muscular";
import IcVeryDissatisfied from "@/components/icons/very-dissatisfied";
import { Slider } from "@/components/slider";
import Text from "@/components/text";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Pressable, View } from "react-native";

export default function Wellness() {
  const [sommeil, setSommeil] = useState(0);
  const [energie, setEnergie] = useState(0);
  const [nutrition, setNutrition] = useState(0);
  const [hydratation, setHydratation] = useState(0);
  const [douleurs, setDouleurs] = useState(0);
  const [stress, setStress] = useState(0);

  return (
    <View className="py-safe px-4 flex-1 bg-white">
      <StatusBar style="dark" />
      <View className="flex-row items-center justify-between mt-6">
        <Text className="text-lg text-secondary font-bold">
          {"Comment te sens-tu\naujourd'hui ?"}
        </Text>

        <Pressable
          onPress={() => {
            // TODO: implement close function
          }}
        >
          <IcClose />
        </Pressable>
      </View>

      <Text className="text-subtleText text-base mt-1">
        {
          "Suis ton état de bien-être au quotidien\ngrâce à ces six paramètres essentiels."
        }
      </Text>

      <View className="gap-10 mt-6">
        <Slider
          title="Sommeil"
          leftIcon={<IcVeryDissatisfied />}
          leftLabel="Très mauvais"
          rightLabel="Excellent"
          rightIcon={<IcMuscular />}
          value={sommeil}
          onChange={setSommeil}
          steps={7}
        />

        <Slider
          title="Energie"
          leftIcon={<IcVeryDissatisfied />}
          leftLabel="Très mauvais"
          rightLabel="Je pète la forme"
          rightIcon={<IcMuscular />}
          value={energie}
          onChange={setEnergie}
          steps={7}
        />

        <Slider
          title="Nutrition de la veille"
          leftIcon={<IcVeryDissatisfied />}
          leftLabel="Très mauvaise"
          rightLabel="Très saine"
          rightIcon={<IcMuscular />}
          value={nutrition}
          onChange={setNutrition}
          steps={7}
        />

        <Slider
          title="Hydratation de la veille"
          leftIcon={<IcVeryDissatisfied />}
          leftLabel="- 1L"
          rightLabel="+ 3L"
          rightIcon={<IcMuscular />}
          value={hydratation}
          onChange={setHydratation}
          steps={7}
        />

        <Slider
          title="Douleurs"
          leftIcon={<IcMuscular />}
          leftLabel="Aucune"
          rightLabel="Très importante"
          rightIcon={<IcVeryDissatisfied />}
          value={douleurs}
          onChange={setDouleurs}
          steps={7}
          reverseGradient
        />

        <Slider
          title="Stress"
          leftIcon={<IcMuscular />}
          leftLabel="Aucun"
          rightLabel="Très important"
          rightIcon={<IcVeryDissatisfied />}
          value={stress}
          onChange={setStress}
          steps={7}
          reverseGradient
        />
      </View>
    </View>
  );
}
