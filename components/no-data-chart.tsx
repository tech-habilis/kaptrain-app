import { View } from "react-native";
import IcNoDataChart from "./icons/no-data-chart";
import Text from "./text";
import cn from "@/utilities/cn";

export default function NoDataChart({
  className = "",
}: {
  className?: string;
}) {
  return (
    <View className={cn("items-center justify-center gap-2", className)}>
      <IcNoDataChart />
      <Text className="text-base text-secondary font-bold">Aucune donnée</Text>
      <Text className="text-sm text-subtleText w-60 text-center">
        Aucun RPE n’a été renseignée pour cette période
      </Text>
    </View>
  );
}
