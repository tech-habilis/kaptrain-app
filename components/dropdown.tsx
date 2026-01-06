import { useRef } from "react";
import { View } from "react-native";
import Button from "./button";
import BottomSheetModal from "./bottom-sheet-modal";
import { BottomSheetModal as BottomSheetModalType } from "@gorhom/bottom-sheet";
import IcUnfoldMore from "./icons/unfold-more";
import { Choices, TChoice } from "./choices";
import Text from "./text";

interface DropdownProps {
  label: string;
  options: TChoice[];
  selectedOption: TChoice;
  onSelect: (option: TChoice) => void;
  className?: string;
  modalTitle?: string;
  modalDescription?: string;
}

export default function Dropdown({
  label,
  options,
  selectedOption,
  onSelect,
  className = "",
  modalTitle,
  modalDescription,
}: DropdownProps) {
  const bottomSheetModalRef = useRef<BottomSheetModalType>(null);

  const handleSelect = (option: TChoice) => {
    onSelect(option);
    bottomSheetModalRef.current?.dismiss();
  };

  return (
    <>
      <Button
        text={label}
        type="secondaryV2"
        className={className}
        rightIcon={<IcUnfoldMore />}
        onPress={() => bottomSheetModalRef.current?.present()}
      />

      <BottomSheetModal
        ref={bottomSheetModalRef}
        name="dropdown-selection"
        snapPoints={["65%"]}
        className="pb-safe"
      >
        {modalTitle && (
          <Text className="text-sm text-subtleText">{modalTitle}</Text>
        )}
        {modalDescription && (
          <Text className="text-xs text-subtleText mt-1">
            {modalDescription}
          </Text>
        )}

        <View className="mt-4">
          <Choices
            data={options}
            selectedChoice={selectedOption}
            onChange={handleSelect}
            type="radio"
          />
        </View>
      </BottomSheetModal>
    </>
  );
}
