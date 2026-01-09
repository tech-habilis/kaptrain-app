import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Dimensions, View, Pressable } from "react-native";
import Button from "./button";
import BottomSheetModal from "./bottom-sheet-modal";
import { BottomSheetModal as BottomSheetModalType } from "@gorhom/bottom-sheet";
import IcClose from "./icons/close";
import Text from "./text";
import IcCheck from "./icons/check";

interface GenderSelectModalProps {
  currentGender: string;
  onSelect: (gender: string) => void;
  onCancel?: () => void;
}

export interface GenderSelectModalRef {
  present: () => void;
  dismiss: () => void;
}

const genderOptions = [
  { label: "Homme", value: "Homme" },
  { label: "Femme", value: "Femme" },
  { label: "Autre", value: "Autre" },
  { label: "Préfère ne pas dire", value: "Préfère ne pas dire" },
];

const GenderSelectModal = forwardRef<GenderSelectModalRef, GenderSelectModalProps>(
  ({ currentGender, onSelect, onCancel }, ref) => {
    const bottomSheetModalRef = useRef<BottomSheetModalType>(null);
    const [selectedGender, setSelectedGender] = useState(currentGender);

    useImperativeHandle(ref, () => ({
      present: () => {
        setSelectedGender(currentGender);
        bottomSheetModalRef.current?.present();
      },
      dismiss: () => {
        bottomSheetModalRef.current?.dismiss();
      },
    }));

    const handleConfirm = () => {
      onSelect(selectedGender);
      bottomSheetModalRef.current?.dismiss();
    };

    const handleCancel = () => {
      setSelectedGender(currentGender);
      onCancel?.();
      bottomSheetModalRef.current?.dismiss();
    };

    return (
      <BottomSheetModal
        ref={bottomSheetModalRef}
        name="gender-select-modal"
        snapPoints={["42%"]}
        className="pb-6 pt-6"
        detached
        bottomInset={Dimensions.get("screen").height * 0.15}
        style={{ marginHorizontal: 16 }}
        withHandle={false}
        backgroundStyle={{ borderRadius: 16 }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-[20px] font-futura font-bold text-secondary">
            Sélectionner le genre
          </Text>
          <Pressable
            onPress={handleCancel}
            className="w-10 h-10 items-center justify-center"
          >
            <IcClose size={24} />
          </Pressable>
        </View>

        {/* Gender Options */}
        <View className="mb-4 gap-2">
          {genderOptions.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => setSelectedGender(option.value)}
              className="flex-row items-center justify-between px-4 py-3 rounded-lg bg-warmLight border border-stroke"
            >
              <Text className="text-base font-normal text-secondary">
                {option.label}
              </Text>
              {selectedGender === option.value && (
                <IcCheck size={24} />
              )}
            </Pressable>
          ))}
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-3">
          <Button
            text="Annuler"
            type="secondary"
            size="small"
            className="flex-1"
            onPress={handleCancel}
          />
          <Button
            text="Valider"
            type="primary"
            size="small"
            className="flex-1"
            onPress={handleConfirm}
          />
        </View>
      </BottomSheetModal>
    );
  }
);

GenderSelectModal.displayName = "GenderSelectModal";

export default GenderSelectModal;
