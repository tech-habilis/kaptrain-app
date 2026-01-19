import Button from "@/components/button";
import IcArrowLeft from "@/components/icons/arrow-left";
import IcPlus from "@/components/icons/plus";
import Input from "@/components/input";
import Text from "@/components/text";
import { ColorConst } from "@/constants/theme";
import { ROUTE } from "@/constants/route";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import DatePicker from "@/components/date-picker";
import { DateType } from "react-native-ui-datepicker";
import { StatusBar } from "expo-status-bar";
import IcPencil from "@/components/icons/pencil";
import IcCycling from "@/components/icons/cycling";
import { clsx } from "clsx";
import IcClose from "@/components/icons/close";
import { TimerPickerModal } from "react-native-timer-picker";
import { SelectTimeProp, TrainingBlock, TChoice } from "@/types";
import { supabase } from "@/utilities/supabase";
import { Choices } from "@/components/choices";
import FilterAndSelectModal from "@/components/filter-and-select-modal";
import { useSession } from "@/contexts/auth-context";
import { z } from "zod";
import dayjs from "dayjs";
import Stepper from "@/components/stepper";
import SessionBlock from "@/components/session-block";
import ConfirmActionModal from "@/components/confirm-action-modal";

// Validation schema
const createSessionSchema = z.object({
  theme: z.string().min(1, "Veuillez sélectionner une thématique"),
  sports: z.array(z.string()).min(1, "Veuillez sélectionner au moins un sport"),
  date: z.date({ error: "Veuillez sélectionner une date" }),
  timeRange: z
    .object({
      start: z.string().regex(/^\d{2}:\d{2}$/, "Format invalide"),
      end: z.string().regex(/^\d{2}:\d{2}$/, "Format invalide"),
    })
    .optional(),
});

const SHOWN_SPORTS = 3;

export default function CreateSession() {
  const { mode } = useLocalSearchParams();
  const isEditing = mode === "edit";
  const { session, setSession } = useSession();

  const [selectedBlockForDelete, setSelectedBlockForDelete] =
    useState<TrainingBlock>();
  const showDeleteConfirmation = useMemo(
    () => selectedBlockForDelete !== undefined,
    [selectedBlockForDelete],
  );
  const [currentStep, setCurrentStep] = useState<number>(isEditing ? 2 : 1);
  const [selectedTheme, setSelectedTheme] = useState<TChoice>();
  const [selectedSports, setSelectedSports] = useState<TChoice[]>([]);
  const [showMoreSport, setShowMoreSport] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>();

  // Validation errors for step 1
  const [errors, setErrors] = useState<{
    theme?: string;
    sports?: string;
    date?: string;
  }>({});

  const [selectedDate, setSelectedDate] = useState<DateType>(new Date());
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

  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      // Fetch themes
      const fetchThemes = supabase
        .from("themes")
        .select("id, name_fr")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      // Fetch sports
      const fetchSports = supabase
        .from("sports")
        .select("id, name_fr")
        .eq("is_active", true)
        .order("name_fr", { ascending: true });

      const [{ data: themesData }, { data: sportsData }] = await Promise.all([
        fetchThemes,
        fetchSports,
      ]);

      if (themesData) {
        const themeChoices: TChoice[] = themesData.map((t) => ({
          id: t.id,
          text: t.name_fr,
        }));
        setThemes(themeChoices);
        if (themeChoices.length > 0 && !selectedTheme) {
          setSelectedTheme(themeChoices[0]);
        }
      }

      if (sportsData) {
        setAvailableSports(
          sportsData.map((s) => ({ id: s.id, text: s.name_fr })),
        );
      }

      setIsFetching(false);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  const validateStep1 = (): boolean => {
    const newErrors: typeof errors = {};

    // Validate theme
    if (!selectedTheme?.text) {
      newErrors.theme = "Veuillez sélectionner une thématique";
    }

    // Validate sports
    if (selectedSports.length === 0) {
      newErrors.sports = "Veuillez sélectionner au moins un sport";
    }

    // Validate date
    if (!selectedDate) {
      newErrors.date = "Veuillez sélectionner une date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setSubmitError(undefined);

    const userId = session?.user?.id;
    if (!userId) {
      setSession(null);
      return;
    }

    setIsSubmitting(true);

    try {
      // Validate form data
      const validationResult = createSessionSchema.safeParse({
        theme: selectedTheme?.text,
        sports: selectedSports.map((s) => s.text),
        date: selectedDate ? new Date(selectedDate as string) : undefined,
        timeRange,
      });

      if (!validationResult.success) {
        const firstError = validationResult.error.issues[0];
        setSubmitError(firstError.message);
        return;
      }

      const data = validationResult.data;

      // Get sport IDs from database
      const { data: sportsData, error: sportsError } = await supabase
        .from("sports")
        .select("id")
        .in("name_fr", data.sports);

      if (sportsError || !sportsData || sportsData.length === 0) {
        setSubmitError("Erreur lors de la récupération des sports");
        return;
      }

      // Calculate duration from time range
      let durationSeconds: number | null = null;
      if (timeRange) {
        const [startH, startM] = timeRange.start.split(":").map(Number);
        const [endH, endM] = timeRange.end.split(":").map(Number);
        const startMinutes = startH * 60 + startM;
        const endMinutes = endH * 60 + endM;
        durationSeconds = Math.max(0, endMinutes - startMinutes) * 60;
      }

      // Format date for database
      const scheduledDate = dayjs(data.date).format("YYYY-MM-DD");
      const scheduledTime = timeRange ? timeRange.start : null;

      // Insert session
      const { data: sessionData, error: sessionError } = await supabase
        .from("sessions")
        .insert({
          user_id: userId,
          title: sessionName,
          session_type: "individual",
          session_status: "upcoming",
          scheduled_date: scheduledDate,
          scheduled_time: scheduledTime,
          duration_seconds: durationSeconds,
          sport_id: sportsData[0].id, // Primary sport
          created_by: "user",
        })
        .select()
        .single();

      if (sessionError) {
        setSubmitError("Erreur lors de la création de la séance");
        return;
      }

      // Insert session blocks if any
      if (trainingBlocks.length > 0) {
        const blocks = trainingBlocks.map((block, index) => ({
          session_id: sessionData.id,
          title: block.title,
          sequence_order: index,
        }));

        const { error: blocksError } = await supabase
          .from("session_blocks")
          .insert(blocks);

        if (blocksError) {
          setSubmitError("Séance créée, mais erreur lors de l'ajout des blocs");
          return;
        }
      }

      // Navigate back on success
      router.back();
    } catch {
      setSubmitError("Une erreur inattendue s'est produite");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      {/* Header */}
      <View className="px-4 pt-safe">
        <View className="flex-row items-center">
          <Pressable
            onPress={() => {
              if (currentStep === 1) {
                router.back();
              } else {
                setCurrentStep((current) => current - 1);
              }
            }}
            className="p-2"
          >
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
            <View>
              <Choices
                label="Thématique"
                data={themes}
                selectedChoice={selectedTheme}
                onChange={(choice) => {
                  setSelectedTheme(choice);
                  setErrors((prev) => ({ ...prev, theme: undefined }));
                }}
                numColumns={2}
                className="mb-6"
                itemTextClassName="text-center"
              />
              {isFetching && <ActivityIndicator />}
              {errors.theme && (
                <Text className="text-error2 text-sm -mt-4 mb-2 ml-1">
                  {errors.theme}
                </Text>
              )}
            </View>

            {/* Sports Section */}
            <View>
              <Choices
                label="Sports"
                data={shownSports}
                selectedChoices={selectedSports}
                type="multipleChoiceWithoutIcon"
                onChangeMultiple={(choices) => {
                  console.log("selectedChoices changed", choices);
                  setSelectedSports(choices);
                  setErrors((prev) => ({ ...prev, sports: undefined }));
                }}
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
              {isFetching && <ActivityIndicator />}
              {errors.sports && (
                <Text className="text-error text-sm -mt-4 mb-2 ml-1">
                  {errors.sports}
                </Text>
              )}
            </View>

            {/* Date & Time Section */}
            <View className="gap-3">
              <Text className="text-sm font-medium text-accent">
                Date & Heure
              </Text>

              {/* Date Input */}
              <View>
                <View className="flex-row items-center gap-2">
                  <Text className="text-sm font-medium text-accent w-6">
                    Le
                  </Text>
                  <View className="flex-1">
                    <DatePicker
                      selectedDate={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        setErrors((prev) => ({ ...prev, date: undefined }));
                      }}
                      className="w-full"
                    />
                  </View>
                </View>
                {errors.date && (
                  <Text className="text-error text-sm mt-1 ml-1">
                    {errors.date}
                  </Text>
                )}
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
            <Input
              label="Nom de la séance"
              value={sessionName}
              onChangeText={setSessionName}
            />

            {/* Training Blocks Section */}
            <View className="gap-3 mt-6">
              <Text className="text-sm font-medium text-accent">
                Déroulé de la séance
              </Text>

              <View className="gap-2">
                {trainingBlocks.map((block) => (
                  <SessionBlock
                    key={block.id}
                    block={block}
                    onClickDelete={() => {
                      setSelectedBlockForDelete(block);
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

                {isEditing && (
                  <>
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
                        <Text
                          numberOfLines={1}
                          className="text-sm text-subtleText"
                        >
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
                        <Text
                          numberOfLines={1}
                          className="text-sm text-subtleText"
                        >
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
                  </>
                )}
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
          loading={isSubmitting}
          onPress={() => {
            if (currentStep === 1) {
              if (validateStep1()) {
                setCurrentStep(2);
              }
            } else {
              handleSubmit();
            }
          }}
        />
        {submitError && (
          <Text className="text-error2 text-sm text-center">{submitError}</Text>
        )}
      </View>

      <ConfirmActionModal
        name="confirm-delete-ref"
        title="Supprimer cette séance ?"
        message="Cette action est définitive. La séance sera retirée de ta
      planification."
        confirm={{
          text: "Supprimer la séance",
          isDestructive: true,
          onPress: () => {
            setTrainingBlocks((blocks) =>
              blocks.filter((x) => x.id !== selectedBlockForDelete?.id),
            );
            setSelectedBlockForDelete(undefined);
          },
        }}
        show={showDeleteConfirmation}
      />

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
