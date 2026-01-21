import Button from "@/components/button";
import { Chip } from "@/components/chip";
import FitnessTracking from "@/components/home/fitness-tracking";
import Statistics from "@/components/home/statistics";
import { WeeklyCalendarView } from "@/components/home/weekly-calendar-view";
import IcBell from "@/components/icons/bell";
import IcCheckCircleFilled from "@/components/icons/check-circle-filled";
import IcHollowCircle from "@/components/icons/hollow-circle";
import IcMessage from "@/components/icons/message";
import IcSmiley from "@/components/icons/smiley";
import Text from "@/components/text";
import { ColorConst } from "@/constants/theme";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
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
  const [haveUnread] = useState(true);

  return (
    <ScrollView>
      <StatusBar style="auto" />
      <ImageBackground source={require("../../assets/images/home-hero.png")}>
        <View className="px-4 pt-safe pb-14 flex-row gap-3 items-center">
          <Avatar url={session?.user?.avatarUrl} name={session?.user?.name} />

          <View className="gap-1.5 flex-1">
            <RawText className="text-white text-xl font-bold" numberOfLines={1}>
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
          />
        </View>
      </ImageBackground>
    </ScrollView>
  );
}
