import Button, { ButtonIcon } from "@/components/button";
import IcArrowLeft from "@/components/icons/arrow-left";
import IcPlus from "@/components/icons/plus";
import Input from "@/components/input";
import Text from "@/components/text";
import { ColorConst } from "@/constants/theme";
import { ROUTE } from "@/constants/route";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { Pressable, ScrollView, View, TouchableOpacity } from "react-native";
import DatePicker from "@/components/date-picker";
import { DateType } from "react-native-ui-datepicker";
import { StatusBar } from "expo-status-bar";
import IcDrag from "@/components/icons/drag";
import IcPencil from "@/components/icons/pencil";
import { Chip } from "@/components/chip";
import IcCycling from "@/components/icons/cycling";
import { clsx } from "clsx";
import IcTrash from "@/components/icons/trash";
import BottomSheetModal, {
  RawBottomSheetModalType,
} from "@/components/bottom-sheet-modal";

interface ChoiceChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

const ChoiceChip = ({ label, selected, onPress }: ChoiceChipProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`px-2 py-3 rounded-lg flex-1 items-center justify-center min-h-12 ${
        selected
          ? "bg-light border-2 border-primary"
          : "bg-white border border-stroke"
      }`}
    >
      <Text
        className={`text-sm font-medium text-center ${
          selected ? "text-text" : "text-subtleText"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const Stepper = ({ current, total }: { current: number; total: number }) => {
  return (
    <View className="flex-row gap-2 py-4">
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          className={`flex-1 h-2 rounded-full ${
            index < current ? "bg-secondary" : "bg-light"
          }`}
        />
      ))}
    </View>
  );
};

interface TrainingBlock {
  id: string;
  title: string;
  exerciseCount: number;
}

const SessionBlock = ({
  block,
  onClickDelete,
}: {
  block: TrainingBlock;
  onClickDelete: () => void;
}) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <View
      className={clsx("flex-row gap-4 items-center", {
        "-translate-x-18": showMenu,
      })}
    >
      <Pressable
        className="border border-stroke rounded-xl p-3 flex-row items-center gap-2 w-full"
        onLongPress={() => setShowMenu(!showMenu)}
      >
        {/* Drag Handle */}
        <View className="size-8 rotate-90 items-center justify-center cla">
          <IcDrag size={24} />
        </View>

        {/* Block Content */}
        <View className="flex-1 gap-1">
          <Text
            numberOfLines={1}
            className="text-sm font-semibold text-secondary leading-6"
          >
            {block.title}
          </Text>

          {/* Exercise Count Tag */}
          <View className="flex-row">
            <Chip
              text={`${block.exerciseCount} exercices`}
              type="default"
              className="bg-light border-0"
            />
          </View>
        </View>

        {/* Drag Handle (right side) */}
        <Pressable
          className="size-8"
          onPress={() =>
            router.push({
              pathname: ROUTE.ADD_BLOCK,
              params: { mode: "edit" },
            })
          }
        >
          <IcPencil size={24} />
        </Pressable>
      </Pressable>
      <ButtonIcon
        size="large"
        type="primary"
        className="bg-[#E32828]/10 h-full rounded-md"
        onPress={() => {
          setShowMenu(false);
          onClickDelete();
        }}
      >
        <IcTrash />
      </ButtonIcon>
    </View>
  );
};

export default function CreateSession() {
  const { mode } = useLocalSearchParams();
  const isEditing = mode === "edit";

  const confirmDeleteRef = useRef<RawBottomSheetModalType | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(isEditing ? 2 : 1);
  const [selectedTheme, setSelectedTheme] = useState<string>("Sports");
  const [selectedSports, setSelectedSports] = useState<string[]>(["Cyclisme"]);
  const [selectedDate, setSelectedDate] = useState<DateType>(
    new Date("2025-04-25"),
  );
  const [startTime, setStartTime] = useState<string>("10:00");
  const [endTime, setEndTime] = useState<string>("11:00");
  const [sessionName, setSessionName] = useState<string>(
    "Séance cyclisme du 19/04",
  );
  const [trainingBlocks, setTrainingBlocks] = useState<TrainingBlock[]>([
    {
      id: "1",
      title: "Travail de l'endurance aérobie haute, zone Z4 (~95 % de la VMA)",
      exerciseCount: 3,
    },
  ]);

  const themes = [
    "Sports",
    "Mobilité & Stretching",
    "Préparation physique",
    "Kinésithérapie & Réaltérisation",
  ];

  const sports = ["Aviron", "Course à pied", "Cyclisme"];

  const toggleSport = (sport: string) => {
    if (selectedSports.includes(sport)) {
      setSelectedSports(selectedSports.filter((s) => s !== sport));
    } else {
      setSelectedSports([...selectedSports, sport]);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="auto" />
      {/* Header */}
      <View className="px-4 pt-safe">
        <View className="flex-row items-center py-2">
          <Pressable onPress={router.back} className="p-2">
            <IcArrowLeft color={ColorConst.secondary} />
          </Pressable>
          <Text className="text-lg font-bold text-secondary flex-1 ml-1">
            {isEditing ? "Modifier la séance" : "Créer une séance"}
          </Text>
        </View>

        {/* Stepper */}
        {!isEditing && <Stepper current={currentStep} total={2} />}
      </View>

      {/* Main Content */}
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-32 pt-2"
        showsVerticalScrollIndicator={false}
      >
        {currentStep === 1 ? (
          <>
            {/* Thématique Section */}
            <View className="gap-3 mb-6">
              <Text className="text-sm font-medium text-accent">
                Thématique
              </Text>
              <View className="gap-2">
                <View className="flex-row gap-2">
                  <ChoiceChip
                    label={themes[0]}
                    selected={selectedTheme === themes[0]}
                    onPress={() => setSelectedTheme(themes[0])}
                  />
                  <ChoiceChip
                    label={themes[1]}
                    selected={selectedTheme === themes[1]}
                    onPress={() => setSelectedTheme(themes[1])}
                  />
                </View>
                <View className="flex-row gap-2">
                  <ChoiceChip
                    label={themes[2]}
                    selected={selectedTheme === themes[2]}
                    onPress={() => setSelectedTheme(themes[2])}
                  />
                  <ChoiceChip
                    label={themes[3]}
                    selected={selectedTheme === themes[3]}
                    onPress={() => setSelectedTheme(themes[3])}
                  />
                </View>
              </View>
            </View>

            {/* Sports Section */}
            <View className="gap-3 mb-6">
              <Text className="text-sm font-medium text-accent">Sports</Text>
              <View className="gap-2">
                <View className="flex-row gap-2">
                  <ChoiceChip
                    label={sports[0]}
                    selected={selectedSports.includes(sports[0])}
                    onPress={() => toggleSport(sports[0])}
                  />
                  <ChoiceChip
                    label={sports[1]}
                    selected={selectedSports.includes(sports[1])}
                    onPress={() => toggleSport(sports[1])}
                  />
                </View>
                <View className="flex-row gap-2">
                  <ChoiceChip
                    label={sports[2]}
                    selected={selectedSports.includes(sports[2])}
                    onPress={() => toggleSport(sports[2])}
                  />
                  <Button
                    type="tertiary"
                    size="small"
                    text="Ajouter un sport"
                    className="flex-1 min-h-12"
                    leftIcon={<IcPlus size={24} color={ColorConst.secondary} />}
                    onPress={() => {
                      // Handle add sport action
                    }}
                  />
                </View>
              </View>
            </View>

            {/* Date & Time Section */}
            <View className="gap-3">
              <Text className="text-sm font-medium text-accent">
                Date & Heure
              </Text>

              {/* Date Input */}
              <View className="flex-row items-center gap-2">
                <Text className="text-sm font-medium text-accent w-6">Le</Text>
                <View className="flex-1">
                  <DatePicker
                    label="25/04/2025"
                    selectedDate={selectedDate}
                    onSelect={setSelectedDate}
                    className="w-full"
                  />
                </View>
              </View>

              {/* Time Range Input */}
              <View className="flex-row items-center gap-2">
                <Text
                  className="text-sm font-medium text-accent"
                  style={{ width: 24 }}
                >
                  De
                </Text>
                <View className="flex-1">
                  <Input
                    value={startTime}
                    onChangeText={setStartTime}
                    placeholder="10:00"
                    inputClassName="text-center text-base"
                  />
                </View>
                <Text
                  className="text-sm font-medium text-accent text-center"
                  style={{ width: 16 }}
                >
                  à
                </Text>
                <View className="flex-1">
                  <Input
                    value={endTime}
                    onChangeText={setEndTime}
                    placeholder="11:00"
                    inputClassName="text-center text-base"
                  />
                </View>
              </View>
            </View>
          </>
        ) : (
          <>
            {/* Step 2: Session Details */}
            {/* Session Name Section */}
            <View className="gap-3 mb-6">
              <Text className="text-sm font-medium text-accent">
                Nom de la séance
              </Text>
              <View className="border border-stroke rounded-lg px-3 py-3 flex-row items-center justify-between">
                <Text className="text-base font-semibold text-text flex-1">
                  {sessionName}
                </Text>
              </View>
            </View>

            {/* Training Blocks Section */}
            <View className="gap-3">
              <Text className="text-sm font-medium text-accent">
                Déroulé de la séance
              </Text>

              <View className="gap-2">
                {trainingBlocks.map((block) => (
                  <SessionBlock
                    key={block.id}
                    block={block}
                    onClickDelete={() => {
                      confirmDeleteRef.current?.present();
                    }}
                  />
                ))}

                {/* Add Block Button */}
                <Button
                  type={isEditing ? "tertiary" : "secondary"}
                  size="small"
                  text="Ajouter un bloc"
                  leftIcon={<IcPlus size={24} color={ColorConst.secondary} />}
                  onPress={() => {
                    router.push(ROUTE.ADD_BLOCK);
                  }}
                />

                <View className="flex-row justify-between items-center mt-8">
                  <Text className="text-accent">
                    Informations complémentaires
                  </Text>
                  <View className="-rotate-90">
                    <IcArrowLeft />
                  </View>
                </View>

                <View className="border border-stroke rounded-xl p-3 flex-row items-center gap-2">
                  {/* Block Content */}
                  <View className="flex-1 gap-1">
                    <Text numberOfLines={1} className="text-sm text-subtleText">
                      Choix de thématique
                    </Text>

                    <View className="flex-row gap-1.5 items-center">
                      <IcCycling />
                      <Text className="text-base font-semibold text-secondary flex-1">
                        Cyclisme
                      </Text>
                      <IcPencil size={24} />
                    </View>
                  </View>
                </View>

                <View className="border border-stroke rounded-xl p-3 flex-row items-center gap-2">
                  {/* Block Content */}
                  <View className="flex-1 gap-1">
                    <Text numberOfLines={1} className="text-sm text-subtleText">
                      Date
                    </Text>

                    <View className="flex-row gap-1.5 items-center">
                      <Text className="text-accent text-base font-medium">
                        Le
                      </Text>
                      <Text className="text-base font-semibold text-secondary flex-1">
                        25/04/2025
                      </Text>
                      <IcPencil size={24} />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Bottom CTA */}
      <View className="absolute bottom-0 left-0 right-0 bg-white px-4 pt-6 pb-safe gap-2">
        <Button
          size="large"
          text="Supprimer ma séance"
          type="tertiary"
          onPress={() => {}}
          className={clsx({
            hidden: !isEditing,
          })}
        />
        <Button
          text={
            currentStep === 1
              ? "Continuer"
              : isEditing
                ? "Enregistrer les modifications"
                : "Valider ma séance"
          }
          type="primary"
          size="large"
          onPress={() => {
            if (currentStep === 1) {
              setCurrentStep(2);
            } else {
              // Navigate to tabs or show success
              router.push(ROUTE.TABS);
            }
          }}
        />
      </View>

      <BottomSheetModal
        ref={confirmDeleteRef}
        name="confirm-delete-ref"
        snapPoints={["45%"]}
        className="pb-safe"
      >
        <Text className="font-bold text-secondary text-lg">
          Supprimer cette séance ?
        </Text>
        <Text className="text-subtleText text-base mt-1 grow">
          Cette action est définitive. La séance sera retirée de ta
          planification.
        </Text>

        <Button text="Annuler" type="secondary" />
        <Button
          text="Supprimer la séance"
          type="secondary"
          className="bg-[#FDFAFA] border-error mt-2 mb-6"
          textClassName="text-error"
        />
      </BottomSheetModal>
    </View>
  );
}
