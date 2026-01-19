import { useEffect, useRef, useState } from "react";
import BottomSheetModal, {
  RawBottomSheetModalType,
} from "./bottom-sheet-modal";
import { Pressable, View } from "react-native";
import Input from "./input";
import IcSearch from "./icons/search";
import IcClose from "./icons/close";
import { ColorConst } from "@/constants/theme";
import { Choices } from "./choices";
import { clsx } from "clsx";
import { TChoice } from "@/types";
import { Chip } from "./chip";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";

export default function FilterAndSelectModal({
  name,
  show,
  height = "88%",
  choices,
  selectedChoices,
  onSelected,
  onDismiss,
}: {
  name: string;
  show: boolean;
  height?: number | string;
  onDismiss: () => void;
  choices: TChoice[];
  selectedChoices: TChoice | TChoice[];
  onSelected: (choices: TChoice | TChoice[]) => void;
}) {
  const ref = useRef<RawBottomSheetModalType>(null);
  const isMultipleSelect = Array.isArray(selectedChoices);
  const [search, setSearch] = useState<string>("");
  const shownChoices = choices.filter((x) =>
    x.text.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    if (show) {
      ref.current?.present();
    } else {
      ref.current?.dismiss();
    }
  }, [show]);

  return (
    <BottomSheetModal
      enableOverDrag={false}
      ref={ref}
      name={name}
      snapPoints={[height]}
      className="pb-safe"
      onDismiss={onDismiss}
    >
      <View className="flex-row gap-4 items-center">
        <Input
          leftIcon={<IcSearch size={16} />}
          className="flex-1"
          value={search}
          onChangeText={setSearch}
        />
        <Pressable onPress={() => setSearch("")}>
          <IcClose color={ColorConst.accent} />
        </Pressable>
      </View>

      {Array.isArray(selectedChoices) && (
        <View
          className={clsx("flex-row flex-wrap gap-2 mt-6", {
            "mt-6 mb-4": selectedChoices.length > 0,
          })}
        >
          {selectedChoices.map((choice) => (
            <Chip
              key={choice.id}
              text={choice.text}
              type="selected"
              onLeftSidePress={() => {
                const choicesWithoutCurrent = selectedChoices.filter(
                  (x) => x.id !== choice.id,
                );
                onSelected(choicesWithoutCurrent);
              }}
            />
          ))}
        </View>
      )}

      <BottomSheetScrollView>
        <Choices
          numColumns={1}
          data={shownChoices}
          type={isMultipleSelect ? "multipleChoice" : "radio"}
          selectedChoice={isMultipleSelect ? undefined : selectedChoices}
          selectedChoices={isMultipleSelect ? selectedChoices : undefined}
          onChangeMultiple={onSelected}
          onChange={onSelected}
          maxChoice={5}
        />
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}
