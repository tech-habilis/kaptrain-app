import BottomSheetModal, {
  RawBottomSheetModalType,
} from "./bottom-sheet-modal";
import IcArrowLeft from "./icons/arrow-left";
import IcClose from "./icons/close";
import IcChevronDown from "./icons/chevron-down";
import IcClockRound from "./icons/clock-round";
import Text from "./text";
import { ColorConst } from "@/constants/theme";
import { Pressable, View } from "react-native";
import { forwardRef, useRef } from "react";
import Button from "./button";
import IcArrowRight from "./icons/arrow-right";
import IcPencil from "./icons/pencil";

type ObjectiveData = {
  id: string;
  category: string;
  date?: string;
  status?: string;
  title: string;
};

type ObjectiveDetailModalProps = {
  sportName: string;
  objective: ObjectiveData;
  onDelete?: () => void;
  onMarkComplete?: () => void;
  onEdit?: () => void;
};

const ObjectiveDetailModal = forwardRef<
  RawBottomSheetModalType,
  ObjectiveDetailModalProps
>(({ sportName, objective, onDelete, onMarkComplete, onEdit }, ref) => {
  const internalRef = useRef<RawBottomSheetModalType>(null);
  const bottomSheetRef =
    (ref as React.RefObject<RawBottomSheetModalType>) || internalRef;

  const handleDelete = () => {
    bottomSheetRef.current?.dismiss();
    onDelete?.();
  };

  const handleMarkComplete = () => {
    bottomSheetRef.current?.dismiss();
    onMarkComplete?.();
  };

  const handleEdit = () => {
    bottomSheetRef.current?.dismiss();
    onEdit?.();
  };

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      name="objective-detail-modal"
      snapPoints={["42%"]}
      className="pb-safe"
    >
      {/* Close button absolute positioned */}
      <Pressable
        className="absolute top-4 right-4 p-2"
        onPress={() => bottomSheetRef.current?.dismiss()}
      >
        <IcClose size={24} color={ColorConst.accent} />
      </Pressable>

      {/* Objective Card */}
      <Pressable
        onPress={handleEdit}
        className="relative bg-white border border-stroke rounded-xl p-3 mb-3 pr-12"
      >
        <View className="flex flex-col gap-2">
          {/* Category and Date Row */}
          <View className="flex-row items-center justify-between">
            <Text className="text-subtleText text-sm">
              {objective.category}
            </Text>
            <View className="flex-row items-center gap-1">
              <IcClockRound size={16} color={ColorConst.subtleText} />
              <Text className="text-subtleText text-sm">
                {`${objective.date || objective.status}`}
              </Text>
            </View>
          </View>
          {/* Title */}
          <Text className="text-text text-base font-semibold">
            {objective.title}
          </Text>
        </View>
        <View className="absolute right-3 top-[50%]">
          <IcPencil size={24} />
        </View>
      </Pressable>

      <View className="grow" />

      <View className="flex flex-col gap-2 mb-6">
        <Button
          type="tertiary"
          text="Supprimer l'objectif"
          onPress={handleDelete}
          size="large"
        />
        <Button
          text="Marquer comme terminé"
          onPress={handleMarkComplete}
          size="large"
        />
      </View>
    </BottomSheetModal>
  );
});

ObjectiveDetailModal.displayName = "ObjectiveDetailModal";

export default ObjectiveDetailModal;
