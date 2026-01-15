import { ComponentProps, ReactNode, useRef } from "react";
import { View } from "react-native";
import Button from "./button";
import BottomSheetModal from "./bottom-sheet-modal";
import { BottomSheetModal as BottomSheetModalType } from "@gorhom/bottom-sheet";
import IcUnfoldMore from "./icons/unfold-more";
import { Choices } from "./choices";
import Text from "./text";
import { TChoice } from "@/types";
import Input from "./input";
import { useTranslation } from "react-i18next";

interface DropdownProps {
  label?: string;
  options: TChoice[];
  selectedOption?: TChoice;
  onSelect: (option: TChoice) => void;
  className?: string;
  textClassName?: string;
  modalTitle?: string;
  modalDescription?: string;
  rightIcon?: ReactNode;
  size?: ComponentProps<typeof Button>["size"];
  alwaysShowLabel?: boolean;
  type?: "default" | "input";
  modalHeight?: string | number;
  itemType?: ComponentProps<typeof Choices>["type"];
  formatLabel?: (choice: TChoice) => string;
  placeholder?: string;
  inputWrapperClassName?: ComponentProps<typeof Input>["inputWrapperClassName"];
}

export default function Dropdown({
  label,
  options,
  selectedOption,
  onSelect,
  className = "",
  textClassName = "",
  modalTitle,
  modalDescription,
  rightIcon,
  size,
  type = "default",
  alwaysShowLabel = false,
  modalHeight = "65%",
  itemType = "radio",
  formatLabel,
  inputWrapperClassName,
  placeholder,
}: DropdownProps) {
  const { t } = useTranslation();
  const bottomSheetModalRef = useRef<BottomSheetModalType>(null);

  const handleSelect = (option: TChoice) => {
    onSelect(option);
    setTimeout(() => bottomSheetModalRef.current?.dismiss(), 300);
  };

  const renderShownText = () => {
    if (
      label !== undefined &&
      alwaysShowLabel &&
      selectedOption?.text !== undefined
    ) {
      return (
        <View className="gap-1">
          <Text className="text-subtleText text-xs">{label}</Text>
          <Text className="text-sm font-semibold text-text">
            {formatLabel ? formatLabel(selectedOption) : selectedOption.text}
          </Text>
        </View>
      );
    }

    if (selectedOption?.text !== undefined) {
      return (
        <Text className="text-sm font-semibold text-text">
          {formatLabel ? formatLabel(selectedOption) : selectedOption.text}
        </Text>
      );
    }

    if (label) {
      return <Text className="text-sm text-subtleText">{label}</Text>;
    }

    return null;
  };

  return (
    <>
      {type === "default" ? (
        <Button
          type="secondaryV2"
          className={className}
          textClassName={textClassName}
          rightIcon={rightIcon || <IcUnfoldMore />}
          size={size}
          onPress={() => bottomSheetModalRef.current?.present()}
        >
          {renderShownText()}
        </Button>
      ) : (
        <Input
          label={label}
          value={
            selectedOption
              ? formatLabel
                ? formatLabel(selectedOption)
                : t(selectedOption?.text || "")
              : undefined
          }
          asPressable
          onPress={() => bottomSheetModalRef.current?.present()}
          inputClassName={textClassName}
          rightIcon={rightIcon}
          inputWrapperClassName={inputWrapperClassName}
          placeholder={placeholder}
        />
      )}

      <BottomSheetModal
        ref={bottomSheetModalRef}
        name="dropdown-selection"
        snapPoints={[modalHeight]}
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

        <View className="mt-4 pb-safe flex-1">
          <Choices
            numColumns={1}
            data={options}
            selectedChoice={selectedOption}
            onChange={handleSelect}
            type={itemType}
          />
        </View>
      </BottomSheetModal>
    </>
  );
}
