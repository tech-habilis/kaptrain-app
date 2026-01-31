import { forwardRef, useImperativeHandle, useRef } from "react";
import { Dimensions, View, Pressable } from "react-native";
import Button from "./button";
import BottomSheetModal from "./bottom-sheet-modal";
import { BottomSheetModal as BottomSheetModalType } from "@gorhom/bottom-sheet";
import IcClose from "./icons/close";
import Text from "./text";

interface DeleteAccountModalProps {
  onConfirm: () => void;
  onCancel?: () => void;
}

export interface DeleteAccountModalRef {
  present: () => void;
  dismiss: () => void;
}

const DeleteAccountModal = forwardRef<
  DeleteAccountModalRef,
  DeleteAccountModalProps
>(({ onConfirm, onCancel }, ref) => {
  const bottomSheetModalRef = useRef<BottomSheetModalType>(null);

  useImperativeHandle(ref, () => ({
    present: () => {
      bottomSheetModalRef.current?.present();
    },
    dismiss: () => {
      bottomSheetModalRef.current?.dismiss();
    },
  }));

  const handleConfirm = () => {
    onConfirm();
    bottomSheetModalRef.current?.dismiss();
  };

  const handleCancel = () => {
    onCancel?.();
    bottomSheetModalRef.current?.dismiss();
  };

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      name="delete-account-modal"
      snapPoints={["42%"]}
      className="pb-safe"
    >
      {/* Header */}
      <Text className="text-[20px] font-ls font-bold text-secondary">
        Supprimer mon compte ?
      </Text>

      <Text className="text-base text-subtleText leading-5 mt-1 flex-1">
        Tu quittes l’aventure Kaptrain ? Cette action est définitive. Toutes tes
        données seront effacées.
      </Text>

      {/* Action Buttons */}
      <View className="gap-3 mb-safe">
        <Button text="Annuler" type="secondary" onPress={handleCancel} />
        <Button
          text="Supprimer mon compte"
          type="secondary"
          className="bg-[#FDFAFA] border-2 border-error2"
          textClassName="text-error2"
          onPress={handleConfirm}
        />
      </View>
    </BottomSheetModal>
  );
});

DeleteAccountModal.displayName = "DeleteAccountModal";

export default DeleteAccountModal;
