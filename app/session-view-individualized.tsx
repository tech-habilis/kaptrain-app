import Button, { ButtonIcon } from "@/components/button";
import BottomSheetModal, {
  RawBottomSheetModalType,
} from "@/components/bottom-sheet-modal";
import { Chip } from "@/components/chip";
import { Choices } from "@/components/choices";
import ConfirmActionModal from "@/components/confirm-action-modal";
import IcArrowLeft from "@/components/icons/arrow-left";
import IcChat from "@/components/icons/chat";
import IcClock from "@/components/icons/clock";
import IcFile from "@/components/icons/file";
import IcLightning from "@/components/icons/lightning";
import IcPencil from "@/components/icons/pencil";
import TimerCard from "@/components/timer-card";
import Text from "@/components/text";
import { ROUTE } from "@/constants/route";
import { ColorConst } from "@/constants/theme";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { supabase } from "@/utilities/supabase";
import { Database } from "@/utilities/supabase/database.types";
import { TimerType } from "@/hooks/use-workout-timer";
import { TrainingBlockCard } from "@/components/session";
import { useTimerStore } from "@/stores/timer-store";

type SessionExercise = Database["public"]["Tables"]["session_exercises"]["Row"];
type SessionTimerConfig =
  Database["public"]["Tables"]["session_timer_configs"]["Row"];
type Session = Database["public"]["Tables"]["sessions"]["Row"];
type Sport = Database["public"]["Tables"]["sports"]["Row"];

interface SessionWithRelations extends Session {
  sport: Sport | null;
}

interface BlockWithExercises {
  id: string;
  session_id: string;
  title: string;
  description: string | null;
  color: string | null;
  intensity_id: string | null;
  sequence_order: number;
  exercises: SessionExercise[];
}

// Timer type mapping from display name to database value
const TIMER_TYPE_MAP: Record<string, string> = {
  Chronomètre: "stopwatch",
  Minuteur: "countdown",
  EMOM: "emom",
  AMRAP: "amrap",
  Tabata: "tabata",
  Personnalisé: "custom",
};

// Available timer options
const TIMER_OPTIONS = Object.keys(TIMER_TYPE_MAP);

export default function SessionViewIndividualized() {
  const { sessionId } = useLocalSearchParams<{ sessionId?: string }>();
  const {
    timerConfig: storeTimerConfig,
    initializeTimer,
    reset: resetTimerStore,
    setShowWidget,
  } = useTimerStore();

  const [expandedSections, setExpandedSections] = useState<{
    [key: number]: boolean;
  }>({});
  const [completedSections, setCompletedSections] = useState<{
    [key: number]: boolean;
  }>({});

  const showTimersRef = useRef<RawBottomSheetModalType>(null);
  const resetTimerRef = useRef<RawBottomSheetModalType>(null);
  const [showDeleteTabata, setShowDeleteTabata] = useState(false);

  // Data state
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<SessionWithRelations | null>(null);
  const [blocks, setBlocks] = useState<BlockWithExercises[]>([]);
  const [timerConfig, setTimerConfig] = useState<SessionTimerConfig | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const sessionExerciseToExerciseItem = useMemo(() => {
    return (sessionExercise: SessionExercise) => {
      return {
        id: sessionExercise.id,
        title: sessionExercise.name,
        image: "",
        icon: undefined,
        isFavorite: false,
      };
    };
  }, []);

  // Handle opening timer bottom sheet
  const handleOpenTimerSheet = () => {
    // Check if a timer already exists in store or database
    const hasTimer = storeTimerConfig || timerConfig;

    if (hasTimer) {
      // If timer exists, show reset/erase timer bottom sheet
      resetTimerRef.current?.present();
    } else {
      // If no timer, show timer selection bottom sheet
      showTimersRef.current?.present();
    }
  };

  // Handle timer type selection
  const handleTimerSelect = (timerName: string) => {
    const timerType = TIMER_TYPE_MAP[timerName] as TimerType;
    if (timerType) {
      // Set default values based on timer type
      const isEmom = timerType === "emom";

      initializeTimer({
        timerType,
        effortSeconds: isEmom ? 40 : 20, // EMOM defaults to 40s work
        restSeconds: 10,
        durationSeconds: 60,
        rounds: 8,
      });
      showTimersRef.current?.dismiss();
    }
  };

  // Fetch session data
  useEffect(() => {
    const fetchSessionData = async () => {
      if (!sessionId) {
        setError("No session ID provided");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch session with sport
        const { data: sessionData, error: sessionError } = await supabase
          .from("sessions")
          .select(
            `
            *,
            sport:sports(*)
          `,
          )
          .eq("id", sessionId)
          .single();

        if (sessionError) throw sessionError;
        if (!sessionData) throw new Error("Session not found");

        setSession(sessionData as SessionWithRelations);

        // Fetch session blocks with exercises
        const { data: blocksData, error: blocksError } = await supabase
          .from("session_blocks")
          .select(
            `
            *,
            session_exercises(*)
          `,
          )
          .eq("session_id", sessionId)
          .order("sequence_order", { ascending: true });

        if (blocksError) throw blocksError;

        // Transform the data to match BlockWithExercises interface
        const transformedBlocks = (blocksData || []).map((block: any) => ({
          id: block.id,
          session_id: block.session_id,
          title: block.title,
          description: block.description,
          color: block.color,
          intensity_id: block.intensity_id,
          sequence_order: block.sequence_order,
          exercises: block.session_exercises || [],
        }));

        setBlocks(transformedBlocks);

        // Fetch timer config
        const { data: timerData, error: timerError } = await supabase
          .from("session_timer_configs")
          .select("*")
          .eq("session_id", sessionId)
          .maybeSingle();

        if (timerError && timerError.code !== "PGRST116") {
          // PGRST116 = "not found" which is acceptable
          throw timerError;
        }

        setTimerConfig(timerData);
        if (timerData) {
          // Initialize the store with timer config from database
          initializeTimer({
            timerType: timerData.timer_type as TimerType,
            effortSeconds: timerData.work_seconds ?? 20,
            restSeconds: timerData.rest_seconds ?? 10,
            durationSeconds: timerData.duration_seconds ?? 60,
            rounds: timerData.rounds ?? 8,
          });
        }
      } catch (err) {
        console.error("Error fetching session:", err);
        setError(err instanceof Error ? err.message : "Failed to load session");
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();
  }, [sessionId, initializeTimer]);

  const toggleExpanded = (index: number) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleCompleted = (index: number) => {
    setCompletedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Loading state
  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color={ColorConst.primary} />
        <Text className="text-subtleText text-base mt-4">
          Chargement de la séance...
        </Text>
      </View>
    );
  }

  // Error state
  if (error || !session) {
    return (
      <View className="flex-1 bg-white px-4 pt-safe">
        <StatusBar style="auto" />
        <View className="flex-row items-center gap-1 mb-6">
          <Pressable onPress={router.back} className="p-2">
            <IcArrowLeft color={ColorConst.secondary} />
          </Pressable>
          <Text className="text-lg font-bold text-secondary flex-1">
            Séance du jour
          </Text>
        </View>
        <View className="flex-1 items-center justify-center">
          <Text className="text-error text-lg mb-4">Erreur</Text>
          <Text className="text-subtleText text-base text-center mb-6">
            {error || "Séance non trouvée"}
          </Text>
          <Button text="Retour" type="secondary" onPress={router.back} />
        </View>
      </View>
    );
  }

  // Calculate duration in minutes
  const durationMinutes = session.duration_seconds
    ? Math.round(session.duration_seconds / 60)
    : null;

  // Format scheduled date
  const formattedDate = session.scheduled_date
    ? new Date(session.scheduled_date).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "";

  return (
    <>
      <StatusBar style="dark" />
      <View className="flex-1 bg-white">
        <ScrollView
          className="flex-1"
          contentContainerClassName="pb-24"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="bg-[#F6F7FC] pt-safe pb-4 px-4">
            <View className="flex-row gap-1 items-center">
              <Pressable onPress={router.back} className="p-2">
                <IcArrowLeft />
              </Pressable>
              <Text className="text-lg font-ls-bold text-secondary flex-1">
                Séance du jour
              </Text>
              <Pressable
                onPress={() => {
                  if (sessionId) {
                    router.push({
                      pathname: ROUTE.CREATE_SESSION,
                      params: { mode: "edit", sessionId },
                    });
                  }
                }}
              >
                <IcPencil size={24} />
              </Pressable>
            </View>
          </View>

          {/* Title Section */}
          <View className="px-4 pt-6">
            <View className="flex-row items-center gap-2">
              <IcLightning size={24} color={ColorConst.tertiary} />
              <Text className="text-base font-bold text-text flex-1">
                {session.title}
              </Text>

              {formattedDate && (
                <Chip text={formattedDate} className="bg-light" />
              )}
            </View>
            <Text className="text-sm text-text mt-1">
              {/* TODO: check why sport is empty */}
              {(session.sport?.name_fr ?? "Séance") || "Séance"}{" "}
              {durationMinutes && `- Environ ${durationMinutes} minutes`}
            </Text>
            {session.description && (
              <Text className="text-sm text-subtleText mt-2">
                {session.description}
              </Text>
            )}
          </View>

          {/* Timer card if configured */}
          {storeTimerConfig && (
            <TimerCard
              className="mx-4 mt-6"
              timerType={storeTimerConfig.timerType}
              effortSeconds={storeTimerConfig.effortSeconds}
              restSeconds={storeTimerConfig.restSeconds}
              durationSeconds={storeTimerConfig.durationSeconds}
              totalRounds={storeTimerConfig.rounds}
              onClose={() => {
                resetTimerStore();
                setShowDeleteTabata(false);
                setShowWidget(false);
              }}
              onModify={() => {
                router.push(ROUTE.MODIFY_TIMER);
              }}
              onStarted={() => {
                console.log("Timer started!");
              }}
            />
          )}

          {/* Session Sections */}
          <View className="gap-2 px-4 mt-4">
            {blocks.map((block, index) => (
              <TrainingBlockCard
                key={block.id}
                title={block.title}
                description={block.description || ""}
                isCompleted={completedSections[index] || false}
                onToggleComplete={() => toggleCompleted(index)}
                isExpanded={expandedSections[index] || false}
                onToggleExpand={() => toggleExpanded(index)}
                exercises={
                  block.exercises.map(sessionExerciseToExerciseItem) || []
                }
              />
            ))}
          </View>
        </ScrollView>

        {/* Bottom Action Bar */}
        <View className="absolute bottom-0 left-0 right-0 gap-3">
          <ButtonIcon size="large" type="primary" className="self-end mr-4">
            <IcChat />
          </ButtonIcon>

          <View className="px-4 pb-safe flex-row items-center p-4 gap-3 bg-white">
            <View className="flex-row items-center gap-3">
              <Pressable className="p-3" onPress={handleOpenTimerSheet}>
                <IcClock size={32} />
              </Pressable>
              <Pressable
                className="p-3"
                onPress={() => router.push(ROUTE.NOTE_HISTORY)}
              >
                <IcFile size={32} color={ColorConst.accent} />
              </Pressable>
            </View>
            <Button
              type="secondary"
              text="J'ai terminé"
              className="flex-1"
              onPress={() => router.push(ROUTE.SESSION_ENDED_FORM)}
            />
          </View>
        </View>
      </View>

      <BottomSheetModal
        ref={showTimersRef}
        name="show-timer-ref"
        snapPoints={["50%"]}
        className="pb-safe"
      >
        <Text className="font-bold text-lg text-secondary">
          Ajouter un timer
        </Text>

        <Choices
          numColumns={2}
          data={TIMER_OPTIONS.map((name, index) => ({
            id: `timer-${index}`,
            text: name,
          }))}
          type="secondary"
          className="mt-3"
          itemClassName="bg-secondary"
          itemTextClassName="text-white"
          onChange={(choice) => {
            handleTimerSelect(choice.text);
          }}
        />

        <View className="pb-safe flex-row items-center py-4 gap-3 bg-white">
          <Pressable
            className="p-3"
            onPress={() => {
              showTimersRef.current?.dismiss();
            }}
          >
            <IcClock color={ColorConst.primary} size={32} />
          </Pressable>
          <Button
            type="secondary"
            text="J'ai terminé"
            className="flex-1"
            onPress={() => {
              showTimersRef.current?.dismiss();
              router.push(ROUTE.SESSION_ENDED_FORM);
            }}
          />
        </View>
      </BottomSheetModal>

      <BottomSheetModal
        ref={resetTimerRef}
        name="reset-timer-ref"
        snapPoints={["32%"]}
        className="pb-safe"
      >
        <Text className="font-bold text-lg text-secondary">
          Écraser le chrono actuel ?
        </Text>
        <Text className="mt-1 text-accent text-base">
          Lancer un nouveau chrono remplacera celui en cours. Es-tu sûr de
          vouloir continuer ?
        </Text>

        <View className="grow" />

        <View className="flex-row items-center pt-6 gap-3 bg-white">
          <Pressable
            className="p-3"
            onPress={() => {
              resetTimerRef.current?.dismiss();
            }}
          >
            <IcClock color={ColorConst.primary} size={32} />
          </Pressable>
          <Button
            type="secondary"
            text="Écraser le chrono en cours"
            className="flex-1"
            onPress={() => {
              // Remove the current timer from store
              resetTimerStore();

              // Dismiss erase timer modal and show timer selection
              resetTimerRef.current?.dismiss();
              showTimersRef.current?.present();
            }}
          />
        </View>
      </BottomSheetModal>

      <ConfirmActionModal
        height="40%"
        show={showDeleteTabata}
        onCancel={() => setShowDeleteTabata(false)}
        name="confirm-delete-tabata"
        title="Arrêter le timer ?"
        message="Tu es sur le point de fermer ton timer en cours. Tu confirmes ?"
        confirm={{
          text: "Oui, fermer le timer",
          isDestructive: false,
        }}
      />
    </>
  );
}
