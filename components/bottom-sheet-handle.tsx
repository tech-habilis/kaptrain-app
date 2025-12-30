import {
  BottomSheetHandleProps,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import { FC } from "react";
import { Pressable, View } from "react-native";
import IcClose from "./icons/close";

const BottomSheetHandle: FC<
  BottomSheetHandleProps & {
    name: string;
  }
> = ({ name, ...props }) => {
  const { dismiss } = useBottomSheetModal();

  return (
    <View {...props} className="flex-row items-center justify-between p-4">
      {/*placeholder to center handle */}
      <View className="size-10" />

      <View className="bg-secondary-grey w-17.5 h-1.75 rounded-[18px]" />

      <Pressable className="p-2" onPress={() => dismiss(name)}>
        <IcClose size={24} />
      </Pressable>
    </View>
  );
};

export default BottomSheetHandle;
