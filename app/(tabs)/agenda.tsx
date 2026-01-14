import { useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { ScrollView, View, Pressable } from "react-native";
import Text from "@/components/text";
import { Chip } from "@/components/chip";
import { Day } from "@/components/agenda/day";
import { ActivityCard } from "@/components/agenda/activity-card";
import IcArrowLeft from "@/components/icons/arrow-left";
import IcArrowRight from "@/components/icons/arrow-right";
import IcHyrox from "@/components/icons/hyrox";
import IcPlus from "@/components/icons/plus";
import IcCheckCircleFilled from "@/components/icons/check-circle-filled";
import SingleFab from "@/components/fab";
import { ColorConst } from "@/constants/theme";
import { router } from "expo-router";
import { ROUTE } from "@/constants/route";
import { useAgendaCalendar } from "@/hooks/use-agenda-calendar";
import { useSession } from "@/contexts/auth-context";
import dayjs from "dayjs";
import "dayjs/locale/fr";

// Set dayjs locale to French
dayjs.locale("fr");

export default function Agenda() {
  const { session } = useSession();
  const userId = session?.user?.id;

  const {
    currentMonthLabel,
    weekDays,
    calendarWeeks,
    selectedDate,
    selectedDateSessions,
    goToToday,
    goToNextMonth,
    goToPrevMonth,
    selectDate,
  } = useAgendaCalendar(userId);

  // Format selected date for display (e.g., "19 avril 2025")
  const selectedDateLabel = dayjs(selectedDate)
    .format("D MMMM YYYY")
    .replace(/^\w/, (c) => c.toUpperCase());

  // Handle day press
  const handleDayPress = useCallback(
    (date: Date) => {
      selectDate(date);
    },
    [selectDate],
  );

  // Mock activities for display - will be replaced with real session data later
  const todayActivities =
    selectedDateSessions.length > 0
      ? selectedDateSessions.map((session) => ({
          title: session.title,
          sessionTitle: session.description || "",
          coachName: "", // Will be populated from coach_id
          color: session.activity_color || ColorConst.primary,
          icon:
            session.session_status === "completed" ? (
              <IcCheckCircleFilled size={16} />
            ) : undefined,
        }))
      : // Fallback mock data for UI testing when no sessions exist
        [
          {
            title: "Hyrox (programme)",
            sessionTitle: "Hyrox Paris Grand palais",
            coachName: "Par Enguerrand Aucher",
            color: ColorConst.primary,
            icon: <IcHyrox size={16} />,
          },
          {
            title: "Préparation physique (individu/programmation)",
            sessionTitle: "Souplesse / flexion cheville",
            coachName: "Par Enguerrand Aucher",
            color: ColorConst.tertiary,
          },
          {
            title: "Préparation physique (perso)",
            sessionTitle: "Souplesse / flexion cheville",
            coachName: "Par Enguerrand Aucher",
            color: ColorConst.tertiary,
          },
          {
            title: "Préparation physique (perso done)",
            sessionTitle: "Souplesse / flexion cheville",
            coachName: "Par Enguerrand Aucher",
            color: ColorConst.tertiary,
            icon: <IcCheckCircleFilled size={16} />,
          },
        ];

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />

      <ScrollView className="flex-1 pt-safe px-4">
        {/* Header */}
        <View className="flex-row items-center justify-between h-8 mb-6">
          <Text className="text-lg font-bold text-secondary">
            {currentMonthLabel}
          </Text>

          <View className="flex-row items-center gap-3">
            {/* Today chip */}
            <Pressable onPress={goToToday}>
              <Chip
                text="Aujourd'hui"
                type="default"
                className="border border-stroke"
              />
            </Pressable>

            {/* Navigation arrows */}
            <Pressable
              onPress={goToPrevMonth}
              className="w-10 h-10 items-center justify-center"
            >
              <IcArrowLeft size={24} color={ColorConst.accent} />
            </Pressable>
            <Pressable
              onPress={goToNextMonth}
              className="w-10 h-10 items-center justify-center"
            >
              <IcArrowRight size={24} color={ColorConst.accent} />
            </Pressable>
          </View>
        </View>

        {/* Calendar Section */}
        <View className="gap-4 mb-6">
          {/* Week day headers */}
          <View className="flex-row justify-between items-center">
            {weekDays.map((day) => (
              <View key={day} className="w-8 items-center">
                <Text className="text-xs font-medium text-subtleText">
                  {day}
                </Text>
              </View>
            ))}
          </View>

          {/* Calendar weeks */}
          <View className="gap-2">
            {calendarWeeks.map((week, weekIndex) => (
              <View
                key={weekIndex}
                className="flex-row justify-between items-center"
              >
                {week.map((dayData, dayIndex) => (
                  <Pressable
                    key={`${weekIndex}-${dayIndex}`}
                    onPress={() => handleDayPress(dayData.date)}
                  >
                    <Day
                      day={dayData.day}
                      isCurrentMonth={dayData.isCurrentMonth}
                      isToday={dayData.isToday}
                      isSelected={dayData.isSelected}
                      activities={dayData.activities}
                    />
                  </Pressable>
                ))}
              </View>
            ))}
          </View>
        </View>

        {/* Daily Activities Section */}
        <View className="gap-4 mb-24">
          {/* Section header */}
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-bold text-secondary">
              {selectedDateLabel}
            </Text>
            {/* Placeholder for "Tout voir" button - currently hidden as per Figma */}
          </View>

          {/* Activities list */}
          <View className="gap-2">
            {todayActivities.map((activity, index) => (
              <ActivityCard
                key={index}
                title={activity.title}
                description={activity.sessionTitle}
                coachName={activity.coachName}
                borderColor={activity.color}
                icon={activity.icon}
                onLongPress={() =>
                  router.push({
                    pathname: ROUTE.CREATE_SESSION,
                    params: { mode: "edit" },
                  })
                }
                onPress={() => {
                  if (index === 0) {
                    router.push(ROUTE.SESSION_VIEW);
                  } else if (index === 1) {
                    router.push(ROUTE.SESSION_VIEW_INDIVIDUALIZED);
                  } else if (index === 2) {
                    router.push(ROUTE.SESSION_VIEW_PERSONAL);
                  } else if (index === 3) {
                    router.push({
                      pathname: ROUTE.SESSION_VIEW_PERSONAL,
                      params: { status: "done" },
                    });
                  }
                }}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <SingleFab
        onPress={() => router.push(ROUTE.CREATE_SESSION)}
        icon={<IcPlus size={32} color="white" />}
      />
    </View>
  );
}
