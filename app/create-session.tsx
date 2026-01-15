import Button, { ButtonIcon } from "@/components/button";
import IcArrowLeft from "@/components/icons/arrow-left";
import IcPlus from "@/components/icons/plus";
import Input from "@/components/input";
import Text from "@/components/text";
import { ColorConst } from "@/constants/theme";
import { ROUTE } from "@/constants/route";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
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
import IcClose from "@/components/icons/close";
import { TimerPickerModal } from "react-native-timer-picker";
import { SelectTimeProp, TChoice } from "@/types";
import { supabase } from "@/utilities/supabase";
import { Choices } from "@/components/choices";
import FilterAndSelectModal from "@/components/filter-and-select-modal";

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
        className="bg-error/10 h-full rounded-md"
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

const SHOWN_SPORTS = 3;

export default function CreateSession() {
  const { mode } = useLocalSearchParams();
  const isEditing = mode === "edit";

  const confirmDeleteRef = useRef<RawBottomSheetModalType | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(isEditing ? 2 : 1);
  const [selectedTheme, setSelectedTheme] = useState<TChoice>();
  const [selectedSports, setSelectedSports] = useState<TChoice[]>([]);
  const [showMoreSport, setShowMoreSport] = useState(false);

  const [selectedDate, setSelectedDate] = useState<DateType>(
    new Date("2025-04-25"),
  );
  const [timeRange, setTimeRange] = useState<
    { start: string; end: string } | undefined
  >({
    start: "10:00",
    end: "11:00",
  });
  const [selectedTime, setSelectedTime] = useState<SelectTimeProp>();
  const isShowingTimePicker = selectedTime !== undefined;
  const selectedTimeAsDate = useMemo(() => {
    const time = selectedTime?.value.split(":");
    const hours = parseInt(time?.[0] || "");
    const minutes = parseInt(time?.[1] || "");
    return { hours, minutes };
  }, [selectedTime?.value]);

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

  // Fetch sports and themes from Supabase
  const [themes, setThemes] = useState<TChoice[]>([]);
  const [availableSports, setAvailableSports] = useState<TChoice[]>([]);
  const unselectedSports = useMemo(
    () =>
      availableSports.filter(
        (x) => !selectedSports.some((y) => y.text === x.text),
      ),
    [availableSports, selectedSports],
  );
  const shownSports = useMemo(() => {
    if (selectedSports.length >= SHOWN_SPORTS) {
      return selectedSports;
    }

    return [
      ...selectedSports,
      ...unselectedSports.slice(0, SHOWN_SPORTS - selectedSports.length),
    ];
  }, [selectedSports, unselectedSports]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch themes
      const { data: themesData } = await supabase
        .from("themes")
        .select("name_fr")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (themesData) {
        const themeChoices: TChoice[] = themesData.map((t) => ({
          text: t.name_fr,
        }));
        setThemes(themeChoices);
        if (themeChoices.length > 0 && !selectedTheme) {
          setSelectedTheme(themeChoices[0]);
        }
      }

      // Fetch sports
      const { data: sportsData } = await supabase
        .from("sports")
        .select("name_fr")
        .eq("is_active", true)
        .order("name_fr", { ascending: true });

      if (sportsData) {
        setAvailableSports(sportsData.map((s) => ({ text: s.name_fr })));
      }
    };

    fetchData();
    /* eslint-disable react-hooks/exhaustive-deps */
  }, []); // Run once on mount
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      {/* Header */}
      <View className="px-4 pt-safe">
        <View className="flex-row items-center">
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
            <Choices
              label="Thématique"
              data={themes}
              selectedChoice={selectedTheme}
              onChange={setSelectedTheme}
              numColumns={2}
              className="mb-6"
              itemTextClassName="text-center"
            />

            {/* Sports Section */}
            <Choices
              label="Sports"
              data={shownSports}
              selectedChoices={selectedSports}
              onChangeMultiple={setSelectedSports}
              type="multipleChoiceWithoutIcon"
              numColumns={2}
              className="mb-6"
              extraComponent={
                <Button
                  type="tertiary"
                  size="small"
                  text="Ajouter un sport"
                  className="flex-1"
                  leftIcon={<IcPlus size={24} color={ColorConst.secondary} />}
                  onPress={() => setShowMoreSport(true)}
                />
              }
            />

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
                    selectedDate={selectedDate}
                    onSelect={setSelectedDate}
                    className="w-full"
                  />
                </View>
              </View>

              {/* Time Range Input */}
              <View>
                {timeRange === undefined ? (
                  <Button
                    leftIcon={<IcPlus size={24} color={ColorConst.accent} />}
                    type="tertiary"
                    text="Renseigner une heure"
                    onPress={() => {
                      setTimeRange({ start: "10:00", end: "11:00" });
                    }}
                  />
                ) : (
                  <View className="flex-row items-center gap-2">
                    <Text
                      className="text-sm font-medium text-accent"
                      style={{ width: 24 }}
                    >
                      De
                    </Text>
                    <View className="flex-1">
                      <Input
                        value={timeRange.start}
                        placeholder="10:00"
                        inputClassName="text-center text-base"
                        asPressable
                        onPress={() => {
                          setSelectedTime({
                            id: "time",
                            type: "start",
                            value: timeRange.start,
                          });
                        }}
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
                        value={timeRange.end}
                        asPressable
                        onPress={() =>
                          setSelectedTime({
                            id: "time",
                            type: "end",
                            value: timeRange.end,
                          })
                        }
                        placeholder="11:00"
                        inputClassName="text-center text-base"
                      />
                    </View>

                    <Pressable
                      onPress={() => {
                        setTimeRange(undefined);
                      }}
                      className="p-1"
                    >
                      <IcClose size={20} color={ColorConst.subtleText} />
                    </Pressable>
                  </View>
                )}
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

      <TimerPickerModal
        closeOnOverlayPress
        modalProps={{
          overlayOpacity: 0.2,
        }}
        onCancel={() => setSelectedTime(undefined)}
        onConfirm={({ hours, minutes }) => {
          if (!timeRange) return;

          const field = selectedTime?.type === "start" ? "start" : "end";
          setTimeRange({
            ...timeRange,
            [field]: `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`,
          });

          setSelectedTime(undefined);
        }}
        styles={{
          theme: "light",
        }}
        visible={isShowingTimePicker}
        setIsVisible={() => setSelectedTime(undefined)}
        initialValue={selectedTimeAsDate}
        hideSeconds
      />

      <FilterAndSelectModal
        name="show-more-sport-modal"
        show={showMoreSport}
        choices={availableSports}
        selectedChoices={selectedSports}
        onSelected={(selected) => setSelectedSports(selected as TChoice[])}
        onDismiss={() => setShowMoreSport(false)}
      />
    </View>
  );
}
