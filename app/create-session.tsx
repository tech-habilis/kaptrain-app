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
import { SelectTimeProp, TChoice } from "@/types";
import { supabase } from "@/utilities/supabase";
import { Choices } from "@/components/choices";
import FilterAndSelectModal from "@/components/filter-and-select-modal";
import { useSession } from "@/contexts/auth-context";
import { z } from "zod";
import dayjs from "dayjs";
import Stepper from "@/components/stepper";
import SessionBlock from "@/components/session-block";
import ConfirmActionModal from "@/components/confirm-action-modal";
import {
  useCreateSessionStore,
  type SessionBlockData,
} from "@/stores/create-session-store";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";

// Validation schema
const createSessionSchema = z.object({
  sessionName: z
    .any()
    .refine((val) => val !== undefined && val !== null && val !== "", {
      message: "Le nom de la séance est requis",
    })
    .refine((val) => typeof val === "string", {
      message: "Le nom de la séance doit être une chaîne de caractères",
    }),
  theme: z.string().min(1, "Veuillez sélectionner une thématique"),
  sports: z.array(z.string()).min(1, "Veuillez sélectionner au moins un sport"),
  date: z.date({ error: "Veuillez sélectionner une date" }),
  blocks: z.array(z.any()).min(1, "Au moins un bloc est requis"),
  timeRange: z
    .object({
      start: z.string().regex(/^\d{2}:\d{2}$/, "Format invalide"),
      end: z.string().regex(/^\d{2}:\d{2}$/, "Format invalide"),
    })
    .optional(),
});

const SHOWN_SPORTS = 3;

export default function CreateSession() {
  const { mode, sessionId } = useLocalSearchParams();
  const isEditing = mode === "edit";
  const { session, setSession } = useSession();
  const createSessionStore = useCreateSessionStore();

  const [selectedBlockForDelete, setSelectedBlockForDelete] =
    useState<SessionBlockData>();
  const showDeleteConfirmation = useMemo(
    () => selectedBlockForDelete !== undefined,
    [selectedBlockForDelete],
  );
  const [showSessionDeleteConfirmation, setShowSessionDeleteConfirmation] =
    useState(false);
  const [currentStep, setCurrentStep] = useState<number>(isEditing ? 2 : 1);
  const [selectedTheme, setSelectedTheme] = useState<TChoice>();
  const [selectedSports, setSelectedSports] = useState<TChoice[]>([]);
  const [showMoreSport, setShowMoreSport] = useState(false);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>();

  // Validation errors for step 1
  const [errors, setErrors] = useState<{
    theme?: string;
    sports?: string;
    date?: string;
    sessionName?: string;
    blocks?: string;
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

  const [sessionName, setSessionName] = useState<string>();

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
  const [hasLoadedSessionData, setHasLoadedSessionData] = useState(false);

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

  // Initialize store on mount (only for create mode, not edit mode)
  useEffect(() => {
    if (!isEditing) {
      createSessionStore.initializeSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing]);

  // Load existing session data when in edit mode (only once)
  // TODO: Reimplement edit mode after schema changes are fully understood
  useEffect(() => {
    if (isEditing && sessionId && typeof sessionId === "string" && !hasLoadedSessionData) {
      console.warn("Edit mode temporarily disabled due to schema changes");
      setHasLoadedSessionData(true);
    }
     
  }, [isEditing, sessionId, hasLoadedSessionData]);

  // Sync store data to local state (for when returning from add-block)
  useEffect(() => {
    const storeData = createSessionStore.sessionData;
    if (storeData) {
      if (storeData.sessionName) {
        setSessionName(storeData.sessionName);
      }
      // Clear blocks error if blocks are added
      if (storeData.blocks && storeData.blocks.length > 0) {
        setErrors((prev) => ({ ...prev, blocks: undefined }));
      }
      // Could sync other fields here if needed
    }
  }, [createSessionStore.sessionData]);

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
    console.log("=== handleSubmit started ===");
    setSubmitError(undefined);

    const userId = session?.user?.id;
    console.log("userId:", userId);
    if (!userId) {
      console.log("No userId found, setting session to null");
      setSession(null);
      return;
    }

    // Assert userId is non-null after the check
    const coachId: string = userId;
    console.log("coachId:", coachId);

    setIsSubmitting(true);

    try {
      // Validate form data
      console.log("=== Starting form validation ===");
      const formData = {
        sessionName,
        theme: selectedTheme?.text,
        sports: selectedSports.map((s) => s.text),
        date: selectedDate ? new Date(selectedDate as string) : undefined,
        blocks: createSessionStore.sessionData?.blocks || [],
        timeRange,
      };
      console.log("Form data:", formData);

      const validationResult = createSessionSchema.safeParse(formData);
      console.log("Validation result:", validationResult);

      if (!validationResult.success) {
        console.log("Validation failed:", validationResult.error.issues);
        // Set field-specific errors
        const newErrors: typeof errors = {};
        validationResult.error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof typeof errors;
          console.log("Field error:", field, issue.message);
          // Check if field is a valid error field (theme, sports, date, sessionName, blocks)
          if (
            ["theme", "sports", "date", "sessionName", "blocks"].includes(field)
          ) {
            newErrors[field] = issue.message;
          }
        });
        setErrors(newErrors);
        setIsSubmitting(false);
        return;
      }

      console.log("=== Form validation passed ===");
      const data = validationResult.data;
      console.log("Validated data:", data);

      // Get sport IDs from database
      console.log("=== Fetching sport IDs ===");
      console.log("Sports to fetch:", data.sports);
      const { data: sportsData, error: sportsError } = await supabase
        .from("sports")
        .select("id")
        .in("name_fr", data.sports);

      console.log("Sports query result:", { sportsData, sportsError });

      if (sportsError || !sportsData || sportsData.length === 0) {
        console.log("Error fetching sports:", sportsError);
        setSubmitError("Erreur lors de la récupération des sports");
        return;
      }

      // Get theme ID from database
      console.log("=== Fetching theme ID ===");
      console.log("Theme to fetch:", data.theme);
      const { data: themeData, error: themeError } = await supabase
        .from("themes")
        .select("id")
        .eq("name_fr", data.theme);

      console.log("Theme query result:", { themeData, themeError });

      if (themeError || !themeData || themeData.length === 0) {
        console.log("Error fetching theme:", themeError);
        setSubmitError("Erreur lors de la récupération de la thématique");
        return;
      }

      // Prepare arrays for new schema
      const sportIds = sportsData.map((sport) => sport.id);
      const themeIds = [themeData[0].id];
      console.log("Sport IDs:", sportIds);
      console.log("Theme IDs:", themeIds);

      console.log("=== Calculating duration ===");
      // Calculate duration from time range
      let durationSeconds: number | null = null;
      if (timeRange) {
        const [startH, startM] = timeRange.start.split(":").map(Number);
        const [endH, endM] = timeRange.end.split(":").map(Number);
        const startMinutes = startH * 60 + startM;
        const endMinutes = endH * 60 + endM;
        durationSeconds = Math.max(0, endMinutes - startMinutes) * 60;
      }
      console.log("Duration seconds:", durationSeconds);

      // Format date for database
      const scheduledDate = dayjs(data.date).format("YYYY-MM-DD");
      const scheduledTime = timeRange ? timeRange.start : null;
      console.log("Formatted date:", scheduledDate);
      console.log("Scheduled time:", scheduledTime);

      // Check if editing or creating
      if (isEditing && sessionId && typeof sessionId === "string") {
        console.log("=== EDIT MODE TEMPORARILY DISABLED ===");
        console.log("Edit mode disabled due to schema changes");
        setSubmitError("Mode édition temporairement indisponible");
        return;
      } else {
        console.log("=== CREATING NEW SESSION ===");
        // CREATE NEW SESSION
        if (!sessionName) {
          console.log("No session name provided");
          setSubmitError("Le nom de la séance est requis");
          return;
        }

        console.log("Creating session with data:", {
          coach_id: coachId,
          title: sessionName,
          session_type: "individual",
          session_status: "upcoming",
          scheduled_date: scheduledDate,
          scheduled_time: scheduledTime,
          duration_seconds: durationSeconds,
          sport_ids: sportIds,
          theme_ids: themeIds,
        });

        const { data: sessionData, error: sessionError } = await supabase
          .from("sessions")
          .insert({
            coach_id: coachId,
            title: sessionName,
            session_type: "individual",
            session_status: "upcoming",
            scheduled_date: scheduledDate,
            scheduled_time: scheduledTime,
            duration_seconds: durationSeconds,
            sport_ids: sportIds,
            theme_ids: themeIds,
          })
          .select()
          .single();

        console.log("Session creation result:", { sessionData, sessionError });

        if (sessionError) {
          console.log("Error creating session:", sessionError);
          setSubmitError("Erreur lors de la création de la séance");
          return;
        }

        // Create training blocks and link them to the session
        const storeBlocks = createSessionStore.sessionData?.blocks || [];
        console.log("Store blocks for creation:", storeBlocks);
        
        if (storeBlocks.length > 0) {
          // Create training blocks first
          for (let index = 0; index < storeBlocks.length; index++) {
            const block = storeBlocks[index];
            console.log(`Creating training block ${index}:`, block);

            // Create training block
            const { data: trainingBlockData, error: trainingBlockError } = await supabase
              .from("training_blocks")
              .insert({
                created_by: coachId,
                title: block.title,
                description: block.description,
                is_public: false,
              })
              .select()
              .single();

            console.log(`Training block ${index} creation result:`, { trainingBlockData, trainingBlockError });

            if (trainingBlockError) {
              console.log("Error creating training block:", trainingBlockError);
              setSubmitError("Erreur lors de la création des blocs d'entraînement");
              return;
            }

            // Create exercises for this training block
            if (block.exercises.length > 0) {
              console.log(`Creating exercises for training block ${trainingBlockData.id}:`, block.exercises);

              for (let exerciseIndex = 0; exerciseIndex < block.exercises.length; exerciseIndex++) {
                const exercise = block.exercises[exerciseIndex];

                const { error: exerciseError } = await supabase
                  .from("training_block_exercises")
                  .insert({
                    training_block_id: trainingBlockData.id,
                    name: exercise.text,
                  });

                if (exerciseError) {
                  console.error("Error inserting training block exercise:", exerciseError);
                  // Don't fail the entire operation if exercises fail
                }
              }
            }

            // Link training block to session
            const { error: sessionBlockError } = await supabase
              .from("session_blocks")
              .insert({
                session_id: sessionData.id,
                training_block_id: trainingBlockData.id,
                intensity_id: block.intensity?.id || null,
                sequence_order: index,
              });

            if (sessionBlockError) {
              console.log("Error linking training block to session:", sessionBlockError);
              setSubmitError("Erreur lors de l'association des blocs à la séance");
              return;
            }
          }
        }
      }

      console.log("=== Session submission successful ===");
      // Navigate back on success
      router.back();
    } catch (error) {
      console.error("Unexpected error in handleSubmit:", error);
      setSubmitError("Une erreur inattendue s'est produite");
    } finally {
      console.log("=== handleSubmit finished ===");
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
              // for edit mode, there's only 1 step
              if (isEditing) {
                router.back();
                return;
              }

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
      {currentStep === 1 ? (
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-4 pb-48 pt-2"
          showsVerticalScrollIndicator={false}
        >
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
        </ScrollView>
      ) : (
        <>
          {/* Step 2: Session Details */}
          <ScrollView
            className="flex-1"
            contentContainerClassName="px-4 pb-48 pt-2"
            showsVerticalScrollIndicator={false}
          >
            {/* Session Name Section */}
            <Input
              label="Nom de la séance"
              value={sessionName}
              error={errors.sessionName}
              onChangeText={(text) => {
                setSessionName(text);
                createSessionStore.setSessionName(text);
                setErrors((prev) => ({ ...prev, sessionName: undefined }));
              }}
            />

            {/* Training Blocks Section */}
            <View className="gap-3 mt-6">
              <Text className="text-sm font-medium text-accent">
                Déroulé de la séance
              </Text>

              {errors.blocks && (
                <Text className="text-error text-sm">{errors.blocks}</Text>
              )}

              {/* Blocks List */}
              <View>
                {(createSessionStore.sessionData?.blocks || []).length > 0 ? (
                  <DraggableFlatList
                    data={createSessionStore.sessionData?.blocks || []}
                    renderItem={({
                      item,
                      drag,
                      isActive,
                    }: RenderItemParams<SessionBlockData>) => (
                      <View className="mb-2">
                        <SessionBlock
                          block={item}
                          drag={drag}
                          isActive={isActive}
                          onClickDelete={() => {
                            setSelectedBlockForDelete(item);
                          }}
                        />
                      </View>
                    )}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
                    onDragEnd={(event: any) => {
                      // Method 1: Use from/to if available
                      if (event?.data?.from !== undefined && event?.data?.to !== undefined) {
                        createSessionStore.reorderBlocks(event.data.from, event.data.to);
                      }
                      // Method 2: Fallback - directly use reordered data array
                      else if (Array.isArray(event?.data)) {
                        createSessionStore.setBlocks(event.data);
                      }
                      // Method 3: Check if event itself has from/to
                      else if (event?.from !== undefined && event?.to !== undefined) {
                        createSessionStore.reorderBlocks(event.from, event.to);
                      }
                    }}
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={false}
                    style={{ flexGrow: 0 }}
                  />
                ) : (
                  <Text className="text-subtleText text-sm text-center py-4">
                    Aucun bloc ajouté pour le moment
                  </Text>
                )}
              </View>

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
                  <Pressable
                    onPress={() => setShowAdditionalInfo(!showAdditionalInfo)}
                    className="flex-row justify-between items-center mt-8"
                  >
                    <Text className="text-accent">
                      Informations complémentaires
                    </Text>
                    <View
                      className={clsx({
                        "-rotate-90": showAdditionalInfo,
                        "rotate-90": !showAdditionalInfo,
                      })}
                    >
                      <IcArrowLeft />
                    </View>
                  </Pressable>

                  {showAdditionalInfo && (
                    <View className="gap-2 mt-2">
                      <Pressable
                        onPress={() => setShowMoreSport(true)}
                        className="border border-stroke rounded-xl p-3 flex-row items-center gap-2"
                      >
                        {/* Block Content */}
                        <View className="flex-1 gap-1">
                          <Text
                            numberOfLines={1}
                            className="text-sm text-subtleText"
                          >
                            Sport
                          </Text>

                          <View className="flex-row gap-1.5 items-center">
                            <IcCycling />
                            <Text className="text-base font-semibold text-secondary flex-1">
                              {selectedSports[0]?.text || "--"}
                            </Text>
                            <IcPencil size={24} />
                          </View>
                        </View>
                      </Pressable>

                      <DatePicker
                        selectedDate={selectedDate}
                        onSelect={setSelectedDate}
                        renderTrigger={({ onPress, formattedDate }) => (
                          <Pressable
                            onPress={onPress}
                            className="border border-stroke rounded-xl p-3 flex-row items-center gap-2"
                          >
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
                                  {formattedDate || "--/--/----"}
                                </Text>
                                <IcPencil size={24} />
                              </View>
                            </View>
                          </Pressable>
                        )}
                      />
                    </View>
                  )}
                </>
              )}
            </View>
          </ScrollView>
        </>
      )}

      {/* Bottom CTA */}
      <View className="absolute bottom-0 left-0 right-0 bg-white px-4 pt-6 pb-safe gap-2">
        <Button
          size="large"
          text="Supprimer ma séance"
          type="tertiary"
          onPress={() => setShowSessionDeleteConfirmation(true)}
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
          disabled={isSubmitting}
          onPress={() => {
            console.log("=== Button pressed ===");
            console.log("currentStep:", currentStep);
            console.log("sessionName:", sessionName);
            console.log("isEditing:", isEditing);
            console.log("sessionId:", sessionId);

            if (currentStep === 1) {
              console.log("Going to step 1 validation");
              if (validateStep1()) {
                console.log("Step 1 validated, going to step 2");
                // Save step 1 data to store
                createSessionStore.setStep1Data({
                  theme: selectedTheme!,
                  sports: selectedSports,
                  date: selectedDate,
                  timeRange: timeRange || null,
                });
                setCurrentStep(2);
              }
            } else {
              console.log("Calling handleSubmit");
              handleSubmit();
            }
          }}
        />
        {submitError && (
          <Text className="text-error2 text-sm text-center">{submitError}</Text>
        )}
      </View>

      {/* Block Delete Modal */}
      <ConfirmActionModal
        name="confirm-delete-block-modal"
        title="Supprimer ce bloc ?"
        message="Cette action est définitive. Le bloc sera retiré de ta séance."
        confirm={{
          text: "Supprimer le bloc",
          isDestructive: true,
          onPress: () => {
            createSessionStore.removeBlock(selectedBlockForDelete?.id || "");
            setSelectedBlockForDelete(undefined);
          },
        }}
        show={showDeleteConfirmation}
        onCancel={() => {
          setSelectedBlockForDelete(undefined);
        }}
      />

      {/* Session Delete Modal */}
      <ConfirmActionModal
        name="confirm-delete-session-modal"
        title="Supprimer cette séance ?"
        message="Cette action est définitive. La séance sera retirée de ta
      planification."
        confirm={{
          text: "Supprimer la séance",
          isDestructive: true,
          onPress: async () => {
            if (isEditing && sessionId && typeof sessionId === "string") {
              // Delete from database
              const { error } = await supabase
                .from("sessions")
                .delete()
                .eq("id", sessionId);

              if (error) {
                console.error("Error deleting session:", error);
                return;
              }
            }
            setShowSessionDeleteConfirmation(false);
            router.back();
          },
        }}
        show={showSessionDeleteConfirmation}
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
        singleChoice
      />
    </View>
  );
}
