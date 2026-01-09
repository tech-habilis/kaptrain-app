import BasicScreen from "@/components/basic-screen";
import Button from "@/components/button";
import { Chip } from "@/components/chip";
import IcArrowRight from "@/components/icons/arrow-right";
import Text from "@/components/text";
import { ColorConst } from "@/constants/theme";
import { ROUTE } from "@/constants/route";
import { router } from "expo-router";
import { View } from "react-native";

const InjuryCard = ({
  title,
  date,
  chips,
}: {
  title: string;
  date: string;
  chips: {
    text: string;
    color: string;
  }[];
}) => {
  return (
    <View className="bg-white border border-stroke p-3 rounded-2xl flex-row justify-between items-center">
      <View>
        <Text className="text-text text-base font-semibold">{title}</Text>
        <Text className="text-subtleText text-sm mt-1.5">{date}</Text>

        <View>
          {chips.map((x, index) => (
            <Text
              key={index}
              className="text-text text-sm py-0.5 px-1.5 self-start mt-3 rounded-sm"
              style={{ backgroundColor: x.color }}
            >
              {x.text}
            </Text>
          ))}
        </View>
      </View>

      <IcArrowRight />
    </View>
  );
};

export default function ContactSupport() {
  const injuries = [
    {
      title: "Déchirure épaule droite",
      date: "30/03/2025",
      chips: [
        {
          text: "Soignée",
          color: "#E5F8E8",
        },
      ],
    },
    {
      title: "Déchirure épaule droite",
      date: "30/03/2025",
      chips: [
        {
          text: "En cours",
          color: ColorConst.warmLight,
        },
      ],
    },
    {
      title: "Fracture exostosante du tibia",
      date: "30/03/2025",
      chips: [
        {
          text: "Soignée",
          color: "#E5F8E8",
        },
      ],
    },
  ];

  return (
    <BasicScreen title="Blessure(s)">
      <View className="pt-6 px-4 flex-1 pb-safe">
        <Text className="text-base text-subtleText mb-3">
          Aucune blessure déclarée
        </Text>
        <View className="gap-3 flex-1">
          {injuries.map((injury, index) => (
            <InjuryCard
              key={index}
              title={injury.title}
              date={injury.date}
              chips={injury.chips}
            />
          ))}
        </View>

        <Button
          text="Ajouter une blessure"
          type="secondary"
          className="mb-6"
          onPress={() => router.push(ROUTE.ADD_INJURY)}
        />
      </View>
    </BasicScreen>
  );
}
