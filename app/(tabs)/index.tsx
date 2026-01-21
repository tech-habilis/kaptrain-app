import Button from "@/components/button";
import BottomSheetModal, {
  RawBottomSheetModalType,
} from "@/components/bottom-sheet-modal";
import { Chip } from "@/components/chip";
import { Choices } from "@/components/choices";
import FitnessTracking from "@/components/home/fitness-tracking";
import Statistics from "@/components/home/statistics";
import { WeeklyCalendarView } from "@/components/home/weekly-calendar-view";
import IcBell from "@/components/icons/bell";
import IcCheckCircleFilled from "@/components/icons/check-circle-filled";
import IcClock from "@/components/icons/clock";
import IcHollowCircle from "@/components/icons/hollow-circle";
import IcMessage from "@/components/icons/message";
import IcSmiley from "@/components/icons/smiley";
import Text from "@/components/text";
import { ColorConst } from "@/constants/theme";
import { StatusBar } from "expo-status-bar";
import { useState, useRef } from "react";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  View,
  Text as RawText,
  FlatList,
} from "react-native";
import { router } from "expo-router";
import { ROUTE } from "@/constants/route";
import { useSession } from "@/contexts/auth-context";
import Avatar from "@/components/avatar";
import { useWeekCalendar } from "@/hooks/use-week-calendar";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { SessionCard } from "@/components/agenda/session-card";
import { useTimerStore } from "@/stores/timer-store";
import { TimerType } from "@/hooks/use-workout-timer";
import clsx from "clsx";

// Timer type mapping from display name to database value
const TIMER_TYPE_MAP: Record<string, TimerType> = {
  Chronomètre: "stopwatch",
  Minuteur: "countdown",
  EMOM: "emom",
  AMRAP: "amrap",
  Tabata: "tabata",
  Personnalisé: "custom",
};

// Available timer options
const TIMER_OPTIONS = Object.keys(TIMER_TYPE_MAP);

// Set dayjs locale to French
dayjs.locale("fr");

const Agenda = () => {
  const { session } = useSession();
  const userId = session?.user?.id;

  const { weekDays, selectedDate, selectedDateSessions } =
    useWeekCalendar(userId);

  // Format selected date for display (e.g., "Aujourd'hui" or "19 avril")
  const getSelectedDateLabel = () => {
    const today = dayjs();
    const selected = dayjs(selectedDate);

    if (selected.isSame(today, "day")) {
      return "Aujourd'hui";
    }

    return selected.format("D MMMM").replace(/^\w/, (c) => c.toUpperCase());
  };

  // Transform sessions into activity cards
  const activities =
    selectedDateSessions.length > 0
      ? selectedDateSessions.map((session) => {
          // Get coach name from creator (coach) data
          const firstName = session.coach?.first_name;
          const displayName = session.coach?.display_name;
          const coachName = firstName || displayName || "";
          const formattedCoachName = coachName ? `Par ${coachName}` : "";

          return {
            id: session.id,
            title: session.title,
            sessionTitle: session.description || "",
            coachName: formattedCoachName,
            color: session.activity_color || ColorConst.primary,
            icon:
              session.session_status === "completed" ? (
                <IcCheckCircleFilled size={16} />
              ) : undefined,
          };
        })
      : [];

  return (
    <>
      {/* calendar */}
      <WeeklyCalendarView weekDays={weekDays} />

      {/* today sessions */}
      <View className="p-4 flex-row gap-3 justify-stretch">
        <View className="gap-2.5 mt-0.75 items-center">
          <IcHollowCircle size={12} />
          <View className="w-0.5 flex-1 bg-stroke" />
        </View>
        <View className="flex-1">
          <Text className="text-accent mb-3">{getSelectedDateLabel()}</Text>

          {activities.length > 0 ? (
            <FlatList
              data={activities}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <SessionCard
                  title={item.title}
                  description={item.sessionTitle}
                  coachName={item.coachName}
                  borderColor={item.color}
                  icon={item.icon}
                  onPress={() =>
                    router.push({
                      pathname: ROUTE.SESSION_VIEW_INDIVIDUALIZED,
                      params: { sessionId: item.id },
                    })
                  }
                />
              )}
              ItemSeparatorComponent={() => <View className="h-2" />}
              scrollEnabled={false}
            />
          ) : (
            <Text className="text-subtleText text-sm">
              Aucune séance prévue
            </Text>
          )}
        </View>
      </View>
    </>
  );
};

export default function HomeScreen() {
  const { session } = useSession();
  const showWidget = useTimerStore((state) => state.showWidget);
  const timerConfig = useTimerStore((state) => state.timerConfig);
  const initializeTimer = useTimerStore((state) => state.initializeTimer);
  const resetTimerStore = useTimerStore((state) => state.reset);
  const [haveUnread] = useState(true);
  const showTimersRef = useRef<RawBottomSheetModalType>(null);
  const resetTimerRef = useRef<RawBottomSheetModalType>(null);

  // Handle opening timer bottom sheet
  const handleOpenTimerSheet = () => {
    // Check if a timer already exists in store
    if (timerConfig) {
      // If timer exists, show erase timer bottom sheet
      resetTimerRef.current?.present();
    } else {
      // If no timer, show timer selection bottom sheet
      showTimersRef.current?.present();
    }
  };

  // Handle timer type selection
  const handleTimerSelect = (timerName: string) => {
    const timerType = TIMER_TYPE_MAP[timerName];
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

  return (
    <>
      <ScrollView>
        <StatusBar style="dark" />
        <ImageBackground source={require("../../assets/images/home-hero.png")}>
          <View
            className={clsx("px-4 pb-14 flex-row gap-3 items-center", {
              "pt-6": showWidget,
              "pt-safe": !showWidget,
            })}
          >
            <Avatar url={session?.user?.avatarUrl} name={session?.user?.name} />

            <View className="gap-1.5 flex-1">
              <RawText
                className="text-white text-xl font-bold"
                numberOfLines={1}
              >
                <Text>common.hello</Text>{" "}
                {session?.user?.name?.split(" ")?.[0] || ""} !
              </RawText>
              <Chip
                text="Forme excellente"
                leftIcon={<IcSmiley />}
                className="bg-green-50 border-[#00A71C] self-start"
              />
            </View>

            <View className="flex-row items-center">
              <Pressable
                className="p-2"
                onPress={() => {
                  router.push(ROUTE.MESSAGING);
                }}
              >
                <IcMessage />
              </Pressable>
              <Pressable
                className="p-2"
                onPress={() => router.push(ROUTE.NOTIFICATIONS)}
              >
                <IcBell haveUnread={haveUnread} />
              </Pressable>
            </View>
          </View>
        </ImageBackground>

        <Agenda />

        {/* wellness tracking (mon suivi de forme) */}
        <FitnessTracking />

        {/* Statistics Section (Mes statistiques) */}
        <Statistics />

        {/* timer */}
        <ImageBackground
          source={require("../../assets/images/timer-hero.png")}
          className="p-4 rounded-xl bg-white"
        >
          <View className="p-4">
            <Text className="text-white font-bold text-base">
              Besoin d&apos;un timer ?
            </Text>
            <Text className="text-white mt-1 font-medium">
              Lance un chrono pour structurer ta séance.
            </Text>
            <Button
              type="secondary"
              size="small"
              text="Choisir un timer"
              className="mt-3"
              onPress={handleOpenTimerSheet}
            />
          </View>
        </ImageBackground>
      </ScrollView>

      {/* Timer selection bottom sheet */}
      <BottomSheetModal
        ref={showTimersRef}
        name="show-timer-ref"
        snapPoints={["45%"]}
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
      </BottomSheetModal>

      {/* Erase timer bottom sheet */}
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
    </>
  );
}
