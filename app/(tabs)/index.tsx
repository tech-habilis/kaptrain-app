import Button from "@/components/button";
import { Chip } from "@/components/chip";
import FitnessTracking from "@/components/home/fitness-tracking";
import Statistics from "@/components/home/statistics";
import IcBell from "@/components/icons/bell";
import IcCheckCircleFilled from "@/components/icons/check-circle-filled";
import IcCycling from "@/components/icons/cycling";
import IcHollowCircle from "@/components/icons/hollow-circle";
import IcMessage from "@/components/icons/message";
import IcMuscular from "@/components/icons/muscular";
import IcSmiley from "@/components/icons/smiley";
import Text from "@/components/text";
import { ColorConst } from "@/constants/theme";
import { Day, ActivityStatus } from "@/components/agenda/day";
import { ActivityCard } from "@/components/agenda/activity-card";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { router } from "expo-router";
import { ROUTE } from "@/constants/route";

const Agenda = () => {
  const sessions = [
    {
      title: "Hyrox",
      sessionTitle: "Hyrox Paris Grand palais",
      coachName: "Par Enguerrand Aucher",
      color: ColorConst.tertiary,
      icon: <IcMuscular size={16} />,
      status: "completed" as const,
    },
    {
      title: "Cyclisme",
      sessionTitle: "Fractionné court",
      coachName: "Par Enguerrand Aucher",
      color: ColorConst.primary,
      icon: <IcCycling size={16} />,
      status: "pending" as const,
    },
  ];

  // Helper function to convert session color to activity status
  const getActivityStatus = (color: string): ActivityStatus => {
    if (color === ColorConst.tertiary) return "orange";
    if (color === ColorConst.primary) return "blue";
    return "grey";
  };

  const days = [
    {
      title: "Lun",
      day: "7",
      activities: [getActivityStatus(sessions[1].color)],
    },
    {
      title: "Mar",
      day: "8",
      activities: [
        getActivityStatus(sessions[0].color),
        getActivityStatus(sessions[1].color),
      ],
    },
    {
      title: "Mer",
      day: "9",
      activities: [],
    },
    {
      title: "Jeu",
      day: "10",
      activities: [
        getActivityStatus(sessions[0].color),
        getActivityStatus(sessions[1].color),
      ],
    },
    {
      title: "Ven",
      day: "11",
      activities: [getActivityStatus(sessions[1].color)],
    },
    {
      title: "Sam",
      day: "12",
      activities: [],
    },
    {
      title: "Dim",
      day: "13",
      activities: [],
    },
  ];

  return (
    <>
      {/* calendar */}
      <View className="h-20 border border-stroke rounded-2xl py-2 px-4 bg-white -mt-10 mx-4 flex-row gap-4 items-center justify-around">
        {days.map((day, index) => {
          const isToday = index === 1;
          return (
            <View key={index} className="items-center gap-2.25">
              <Text>{day.title}</Text>
              <Day
                day={day.day}
                isToday={isToday}
                isCurrentMonth={true}
                activities={day.activities}
              />
            </View>
          );
        })}
      </View>

      {/* today sessions */}
      <View className="p-4 flex-row gap-3 justify-stretch">
        <View className="gap-2.5 mt-0.75 items-center">
          <IcHollowCircle size={12} />
          <View className="w-0.5 flex-1 bg-stroke" />
        </View>
        <View className="flex-1">
          <Text className="text-accent mb-3">Aujourd&apos;hui</Text>

          {sessions.map((activity, index) => (
            <View key={index} className="mt-2">
              <ActivityCard
                title={activity.title}
                description={activity.sessionTitle}
                coachName={activity.coachName}
                borderColor={activity.color}
                icon={activity.icon}
                status={activity.status}
                completedIcon={<IcCheckCircleFilled size={16} />}
              />
            </View>
          ))}
        </View>
      </View>
    </>
  );
};

export default function HomeScreen() {
  const [haveUnread, setHaveUnread] = useState(true);

  return (
    <ScrollView>
      <StatusBar style="auto" />
      <ImageBackground source={require("../../assets/images/home-hero.png")}>
        <View className="px-4 pt-safe pb-14 flex-row gap-3 items-center">
          <Image
            source={require("../../assets/images/sample-avatar.png")}
            className="rounded-lg border border-white"
          />

          <View className="gap-1.5 flex-1">
            <Text className="text-white text-xl font-bold">
              Bonjour Marie !
            </Text>
            <Chip
              text="Forme excellente"
              leftIcon={<IcSmiley />}
              className="bg-green-50 border-[#00A71C] self-start"
            />
          </View>

          <View className="flex-row items-center">
            <Pressable className="p-2" onPress={() => {
              router.push(ROUTE.SUBSCRIPTION)
            }}>
              <IcMessage />
            </Pressable>
            <Pressable
              className="p-2"
              onPress={() => setHaveUnread(!haveUnread)}
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
            Besoin d’un timer ?
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
