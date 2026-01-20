import { StatusBar } from "expo-status-bar";
import { View, FlatList } from "react-native";
import Text from "@/components/text";
import { ActivityCard } from "@/components/agenda/activity-card";
import { AgendaCalendarView } from "@/components/agenda/agenda-calendar-view";
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
import { useProfileStore } from "@/stores/profile-store";

// Set dayjs locale to French
dayjs.locale("fr");

export default function Agenda() {
  const { session } = useSession();
  const { profile } = useProfileStore();
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

  // Mock activities for display - will be replaced with real session data later
  const todayActivities =
    selectedDateSessions.length > 0
      ? selectedDateSessions.map((session) => {
          // Get coach name from creator (coach) data
          const firstName = session.coach?.first_name;
          const displayName = session.coach?.display_name;
          const coachName = firstName || displayName || "";
          const formattedCoachName = coachName ? `Par ${coachName}` : "";

          return {
            id: session.id, // Include session ID for editing
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
      : // Fallback mock data for UI testing when no sessions exist
        [
          {
            id: "mock-1",
            title: "Hyrox (programme)",
            sessionTitle: "Hyrox Paris Grand palais",
            coachName: "Par Enguerrand Aucher",
            color: ColorConst.primary,
            icon: <IcHyrox size={16} />,
          },
          {
            id: "mock-2",
            title: "Préparation physique (individu/programmation)",
            sessionTitle: "Souplesse / flexion cheville",
            coachName: "Par Enguerrand Aucher",
            color: ColorConst.tertiary,
          },
          {
            id: "mock-3",
            title: "Préparation physique (perso)",
            sessionTitle: "Souplesse / flexion cheville",
            coachName: "Par Enguerrand Aucher",
            color: ColorConst.tertiary,
          },
          {
            id: "mock-4",
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

      <View className="flex-1 pt-safe px-4">
        {/* Calendar Section */}
        <AgendaCalendarView
          currentMonthLabel={currentMonthLabel}
          weekDays={weekDays}
          calendarWeeks={calendarWeeks}
          selectDate={selectDate}
          goToToday={goToToday}
          goToNextMonth={goToNextMonth}
          goToPrevMonth={goToPrevMonth}
        />

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
          <FlatList
            data={todayActivities}
            keyExtractor={(_item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <ActivityCard
                title={item.title}
                description={item.sessionTitle}
                coachName={item.coachName}
                borderColor={item.color}
                icon={item.icon}
                onLongPress={() =>
                  router.push({
                    pathname: ROUTE.CREATE_SESSION,
                    params: { mode: "edit", sessionId: item.id },
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
            )}
            ItemSeparatorComponent={() => <View className="h-2" />}
            scrollEnabled={false}
          />
        </View>
      </View>

      {profile?.role === "coach" && (
        <SingleFab
          onPress={() => router.push(ROUTE.CREATE_SESSION)}
          icon={<IcPlus size={32} color="white" />}
        />
      )}
    </View>
  );
}
