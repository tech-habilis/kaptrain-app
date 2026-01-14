import { useEffect, useRef } from "react";
import BottomSheetModal, {
  RawBottomSheetModalType,
} from "./bottom-sheet-modal";
import Text from "./text";
import Button from "./button";
import CircularProgress from "./charts/circular-progress";
import { View } from "react-native";
import { ColorConst } from "@/constants/theme";

export default function CircularValueModal({
  title,
  value,
  setValue,
  maxValue,
  name = "set-circular-value-modal",
  onConfirm,
  onCancel,
  show,
  height = "70%",
  unit = "",
}: {
  title: string;
  value: number;
  maxValue: number;
  setValue: (value: number) => void;
  onConfirm: () => void;
  onCancel?: () => void;
  name?: string;
  show: boolean;
  height?: number | string;
  unit?: string;
}) {
  const ref = useRef<RawBottomSheetModalType>(null);

  useEffect(() => {
    if (show) {
      ref.current?.present();
    } else {
      ref.current?.dismiss();
    }
  }, [show]);

  return (
    <BottomSheetModal
      ref={ref}
      name={name}
      snapPoints={[height]}
      className="pb-safe"
      onDismiss={onCancel}
    >
      <Text className="font-bold text-secondary text-lg">{title}</Text>

      <View className="justify-start items-center mt-6 flex-1">
        <CircularProgress
          current={value}
          total={maxValue}
          title={unit}
          onChange={setValue}
          size={280}
          strokeWidth={20}
          valueFontSize={48}
          labelFontSize={48}
          progressColor={ColorConst.primary}
          textContainerClassName="flex-row-reverse gap-2"
          labelClassName="text-secondary font-bold"
          valueClassName="text-secondary font-bold"
        />
      </View>

      <Button
        className="mx-2 mb-6"
        text="Valider"
        size="large"
        onPress={() => {
          ref.current?.dismiss();
          onConfirm();
        }}
      />
    </BottomSheetModal>
  );
}
