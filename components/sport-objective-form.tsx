import { View, Pressable, ScrollView } from "react-native";
import Text from "@/components/text";
import { ColorConst } from "@/constants/theme";
import { router } from "expo-router";
import IcCalendar from "@/components/icons/calendar";
import IcRadio from "@/components/icons/radio";
import IcRadioSelected from "@/components/icons/radio-selected";
import BasicScreen from "@/components/basic-screen";
import Input from "@/components/input";
import { Choices } from "@/components/choices";
import { TChoice, BasicIcon } from "@/types";
import cn from "@/utilities/cn";
import { useState } from "react";
import IcLove from "./icons/love";
import IcPerformance from "./icons/performance";
import Button from "./button";
import DatePicker from "./date-picker";
import { DateType } from "react-native-ui-datepicker";

type ObjectiveType = "event" | "health" | "performance";
type DateOption = "specific" | "none";

type ObjectiveFormProps = {
  mode: "add" | "edit";
  initialValues?: {
    type?: ObjectiveType;
    title?: string;
    date?: DateType;
    selectedSports?: string[];
  };
  onSubmit?: (data: {
    type: ObjectiveType;
    title: string;
    date: string | null;
    selectedSports: string[];
  }) => void;
  onDelete?: () => void;
};

const SPORTS_CHOICES: TChoice[] = [
  { text: "Aviron" },
  { text: "Course à pied" },
  { text: "Cyclisme" },
  { text: "Hyrox" },
];

const OBJECTIVE_TYPES: {
  key: ObjectiveType;
  label: string;
  icon: BasicIcon;
}[] = [
  {
    key: "event",
    label: "Évènement",
    icon: IcCalendar,
  },
  { key: "health", label: "Santé", icon: IcLove },
  { key: "performance", label: "Performance", icon: IcPerformance },
];

function TypeChoiceBox({
  label,
  isSelected,
  onPress,
  Icon,
}: {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  Icon: BasicIcon;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        "flex-1 flex-col items-center justify-center gap-1.5 px-2 py-3 rounded-lg",
        isSelected
          ? "bg-light border-2 border-primary"
          : "bg-white border border-stroke",
      )}
    >
      <Icon
        size={24}
        color={isSelected ? ColorConst.primary : ColorConst.accent}
      />
      <Text className="text-sm text-center text-text">{label}</Text>
    </Pressable>
  );
}

export default function ObjectiveForm({
  mode,
  initialValues,
  onSubmit,
  onDelete,
}: ObjectiveFormProps) {
  const [objectiveType, setObjectiveType] = useState<ObjectiveType>(
    initialValues?.type || "event",
  );
  const [title, setTitle] = useState(initialValues?.title || "");
  const [dateOption, setDateOption] = useState<DateOption>(
    initialValues?.date ? "specific" : "none",
  );
  const [date, setDate] = useState(initialValues?.date);
  const [selectedSports, setSelectedSports] = useState<string[]>(
    initialValues?.selectedSports || [],
  );

  const handleSubmit = () => {
    onSubmit?.({
      type: objectiveType,
      title,
      date: dateOption === "specific" ? date : null,
      selectedSports,
    });
    router.back();
  };

  const handleDelete = () => {
    onDelete?.();
    router.back();
  };

  const isFormValid = title.trim().length > 0;

  return (
    <>
      <BasicScreen
        title={mode === "add" ? "Ajouter un objectif" : "Modifier un objectif"}
        headerClassName="bg-white"
      >
        <ScrollView className="flex-1 px-4 pt-6 pb-48">
          {/* Type d'objectif */}
          <View className="mb-8">
            <Text className="text-accent text-sm mb-2">Type d'objectif</Text>
            <View className="flex flex-row gap-2">
              {OBJECTIVE_TYPES.map(({ key, label, icon }) => (
                <TypeChoiceBox
                  key={key}
                  label={label}
                  Icon={icon}
                  isSelected={objectiveType === key}
                  onPress={() => setObjectiveType(key)}
                />
              ))}
            </View>
          </View>

          {/* Objectif */}
          <View className="mb-8">
            <Input
              label="Objectif"
              placeholder="Marathon Paris 2026"
              value={title}
              onChangeText={setTitle}
              inputClassName="text-base"
            />
          </View>

          {/* Date */}
          <View className="mb-8">
            <Text className="text-accent text-sm mb-3">
              Quand souhaitez-vous atteindre cet objectif ?
            </Text>
            <View className="flex flex-col gap-2">
              {/* Le (specific date) */}
              <View className="flex-row items-center gap-3">
                <Pressable onPress={() => setDateOption("specific")}>
                  {dateOption === "specific" ? (
                    <IcRadioSelected size={24} />
                  ) : (
                    <IcRadio size={24} />
                  )}
                </Pressable>
                <Text className="text-text text-base font-medium">Le</Text>
                <DatePicker
                  label="12/11/2025"
                  className="w-[90%]"
                  selectedDate={date}
                  onSelect={setDate}
                />
              </View>

              {/* Aucune date */}
              <Pressable
                className="flex-row items-center gap-3 py-1"
                onPress={() => setDateOption("none")}
              >
                {dateOption === "none" ? (
                  <IcRadioSelected size={24} />
                ) : (
                  <IcRadio size={24} />
                )}
                <Text className="text-text text-base font-medium">
                  Aucune date
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Sports */}
          <View className="mb-8">
            <Choices
              label="A quel(s) sport(s) voulez-vous associer l'objectif ?"
              data={SPORTS_CHOICES}
              type="multipleChoice"
              selectedChoices={selectedSports}
              onChangeMultiple={setSelectedSports}
              numColumns={2}
            />
          </View>
        </ScrollView>

        {/* CTA */}
        <View className="absolute bottom-0 left-0 right-0 px-4 pb-safe pt-6 bg-white">
          <View className="flex flex-col gap-2">
            {mode === "edit" && (
              <Button
                type="tertiary"
                text="Supprimer l'objectif"
                onPress={handleDelete}
              />
            )}

            <Button
              className="mb-6"
              onPress={handleSubmit}
              disabled={!isFormValid}
              text={
                mode === "add"
                  ? "Ajouter l'objectif"
                  : "Enregistrer les modifications"
              }
            />
          </View>
        </View>
      </BasicScreen>
    </>
  );
}
