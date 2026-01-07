import { StatusBar } from "expo-status-bar";
import { ScrollView, View, Pressable } from "react-native";
import Text from "@/components/text";
import { Chip } from "@/components/chip";
import { Day, ActivityStatus } from "@/components/agenda/day";
import { ActivityCard } from "@/components/agenda/activity-card";
import IcArrowLeft from "@/components/icons/arrow-left";
import IcArrowRight from "@/components/icons/arrow-right";
import IcHyrox from "@/components/icons/hyrox";
import IcPlus from "@/components/icons/plus";
import { ColorConst } from "@/constants/theme";
import { ButtonIcon } from "@/components/button";
import { router } from "expo-router";
import { ROUTE } from "@/constants/route";

export default function Agenda() {
  // Mock data for the calendar - April 2025
  const weekDays = ["LUN", "MAR", "MER", "JEU", "VEN", "SAM", "DIM"];

  // Calendar data structure: [day, isCurrentMonth, activities[]]
  const calendarWeeks = [
    [
      { day: "31", isCurrentMonth: false, activities: [] as ActivityStatus[] },
      { day: "1", isCurrentMonth: true, activities: [] as ActivityStatus[] },
      {
        day: "2",
        isCurrentMonth: true,
        activities: ["grey" as ActivityStatus],
      },
      {
        day: "3",
        isCurrentMonth: true,
        activities: ["grey" as ActivityStatus],
      },
      { day: "4", isCurrentMonth: true, activities: [] as ActivityStatus[] },
      { day: "5", isCurrentMonth: true, activities: [] as ActivityStatus[] },
      { day: "6", isCurrentMonth: true, activities: [] as ActivityStatus[] },
    ],
    [
      {
        day: "7",
        isCurrentMonth: true,
        activities: ["blue" as ActivityStatus],
      },
      {
        day: "8",
        isCurrentMonth: true,
        activities: [
          "orange" as ActivityStatus,
          "grey" as ActivityStatus,
          "grey" as ActivityStatus,
        ],
      },
      { day: "9", isCurrentMonth: true, activities: [] as ActivityStatus[] },
      {
        day: "10",
        isCurrentMonth: true,
        activities: ["orange" as ActivityStatus, "blue" as ActivityStatus],
      },
      {
        day: "11",
        isCurrentMonth: true,
        activities: ["blue" as ActivityStatus],
      },
      { day: "12", isCurrentMonth: true, activities: [] as ActivityStatus[] },
      { day: "13", isCurrentMonth: true, activities: [] as ActivityStatus[] },
    ],
    [
      {
        day: "14",
        isCurrentMonth: true,
        activities: ["blue" as ActivityStatus],
      },
      {
        day: "15",
        isCurrentMonth: true,
        activities: ["blue" as ActivityStatus],
      },
      { day: "16", isCurrentMonth: true, activities: [] as ActivityStatus[] },
      {
        day: "17",
        isCurrentMonth: true,
        activities: ["grey" as ActivityStatus],
      },
      { day: "18", isCurrentMonth: true, activities: [] as ActivityStatus[] },
      {
        day: "19",
        isCurrentMonth: true,
        activities: ["orange" as ActivityStatus],
        isToday: true,
      },
      {
        day: "20",
        isCurrentMonth: true,
        activities: ["grey" as ActivityStatus],
      },
    ],
    [
      { day: "21", isCurrentMonth: true, activities: [] as ActivityStatus[] },
      {
        day: "22",
        isCurrentMonth: true,
        activities: ["orange" as ActivityStatus],
      },
      {
        day: "23",
        isCurrentMonth: true,
        activities: ["grey" as ActivityStatus],
      },
      { day: "24", isCurrentMonth: true, activities: [] as ActivityStatus[] },
      {
        day: "25",
        isCurrentMonth: true,
        activities: ["green" as ActivityStatus, "orange" as ActivityStatus],
      },
      { day: "26", isCurrentMonth: true, activities: [] as ActivityStatus[] },
      { day: "27", isCurrentMonth: true, activities: [] as ActivityStatus[] },
    ],
    [
      {
        day: "28",
        isCurrentMonth: true,
        activities: ["grey" as ActivityStatus],
      },
      {
        day: "29",
        isCurrentMonth: true,
        activities: ["grey" as ActivityStatus],
      },
      { day: "30", isCurrentMonth: true, activities: [] as ActivityStatus[] },
      { day: "1", isCurrentMonth: false, activities: [] as ActivityStatus[] },
      { day: "2", isCurrentMonth: false, activities: [] as ActivityStatus[] },
      { day: "3", isCurrentMonth: false, activities: [] as ActivityStatus[] },
      { day: "4", isCurrentMonth: false, activities: [] as ActivityStatus[] },
    ],
  ];

  // Mock activities for today (April 19, 2025)
  const todayActivities = [
    {
      title: "Hyrox",
      sessionTitle: "Hyrox Paris Grand palais",
      coachName: "Par Enguerrand Aucher",
      color: ColorConst.primary,
      icon: <IcHyrox size={16} />,
    },
    {
      title: "Préparation physique",
      sessionTitle: "Souplesse / flexion cheville",
      coachName: "Par Enguerrand Aucher",
      color: ColorConst.tertiary,
    },
  ];

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="auto" />

      <ScrollView className="flex-1 pt-safe px-4">
        {/* Header */}
        <View className="flex-row items-center justify-between h-8 mb-6">
          <Text className="text-lg font-bold text-secondary">Avril 2025</Text>

          <View className="flex-row items-center gap-3">
            {/* Today chip */}
            <Chip
              text="Aujourd'hui"
              type="default"
              className="border border-stroke"
            />

            {/* Navigation arrows */}
            <Pressable className="w-10 h-10 items-center justify-center">
              <IcArrowLeft size={24} color={ColorConst.accent} />
            </Pressable>
            <Pressable className="w-10 h-10 items-center justify-center">
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
                  <Day
                    key={`${weekIndex}-${dayIndex}`}
                    day={dayData.day}
                    isCurrentMonth={dayData.isCurrentMonth}
                    isToday={dayData.isToday}
                    activities={dayData.activities}
                  />
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
              19 avril 2025
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
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <View className="absolute bottom-20 right-4">
        <ButtonIcon
          size="large"
          type="primary"
          className="w-14 h-14 rounded-2xl shadow-lg"
          onPress={() => router.push(ROUTE.CREATE_SESSION)}
        >
          <IcPlus size={32} color="white" />
        </ButtonIcon>
      </View>
    </View>
  );
}
