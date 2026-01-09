import { useEffect, useRef } from "react";
import BottomSheetModal, {
  RawBottomSheetModalType,
} from "./bottom-sheet-modal";
import Text from "./text";
import Button from "./button";
import { clsx } from "clsx";

export default function ConfirmActionModal({
  title,
  message,
  name,
  confirm,
  onCancel,
  show,
  height = "45%",
}: {
  title: string;
  message: string;
  onCancel?: () => void;
  name: string;
  confirm: {
    text: string;
    isDestructive?: boolean;
  };
  show: boolean;
  height?: number | string;
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
      <Text className="text-subtleText text-base mt-1 grow">{message}</Text>

      <Button
        text="Annuler"
        type="secondary"
        onPress={() => {
          ref.current?.dismiss();
          onCancel?.();
        }}
      />
      <Button
        text={confirm.text}
        type={confirm.isDestructive ? "secondary" : "primary"}
        className={clsx(" mt-2 mb-6", {
          "bg-[#FDFAFA] border-error": confirm.isDestructive,
        })}
        textClassName={clsx({
          "text-error": confirm.isDestructive,
        })}
      />
    </BottomSheetModal>
  );
}
