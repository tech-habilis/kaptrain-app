import Button from "@/components/button";
import { Chip } from "@/components/chip";
import FitnessTracking from "@/components/home/fitness-tracking";
import Statistics from "@/components/home/statistics";
import IcArrowLeft from "@/components/icons/arrow-left";
import IcBell from "@/components/icons/bell";
import IcCheckCircleFilled from "@/components/icons/check-circle-filled";
import IcCycling from "@/components/icons/cycling";
import IcHollowCircle from "@/components/icons/hollow-circle";
import IcMessage from "@/components/icons/message";
import IcMuscular from "@/components/icons/muscular";
import IcSmiley from "@/components/icons/smiley";
import Text from "@/components/text";
import { ColorConst } from "@/constants/theme";
import cn from "@/utilities/cn";
import { clsx } from "clsx";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  View,
} from "react-native";

const Agenda = () => {
  const sessions = [
    {
      title: "Hyrox",
      sessionTitle: "Hyrox Paris Grand palais",
      coachName: "Par Enguerrand Aucher",
      color: ColorConst.tertiary,
      icon: <IcMuscular size={16} />,
      status: "completed",
    },
    {
      title: "Cyclisme",
      sessionTitle: "Fractionné court",
      coachName: "Par Enguerrand Aucher",
      color: ColorConst.primary,
      icon: <IcCycling size={16} />,
      status: "pending",
    },
  ];

  const days = [
    {
      title: "Lun",
      sessions: [sessions[1]],
    },
    {
      title: "Mar",
      sessions: [sessions[0], sessions[1]],
    },
    {
      title: "Mer",
      sessions: [],
    },
    {
      title: "Jeu",
      sessions: [sessions[0], sessions[1]],
    },
    {
      title: "Ven",
      sessions: [sessions[1]],
    },
    {
      title: "Sam",
      sessions: [],
    },
    {
      title: "Dim",
      sessions: [],
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
              <View
                className={cn(
                  "size-8 items-center justify-center relative",
                  clsx({ "bg-secondary rounded-full": isToday }),
                )}
              >
                <View className="absolute -top-1 flex-row gap-0.5">
                  {day.sessions.map((activity, index) => (
                    <View
                      key={index}
                      className="size-2 rounded-full border border-light"
                      style={{ backgroundColor: activity.color }}
                    />
                  ))}
                </View>
                <Text className={clsx({ "text-white font-bold": isToday })}>
                  {(index + 7).toString()}
                </Text>
              </View>
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
          <Text className="text-accent mb-3">Aujourd’hui</Text>

          {sessions.map((activity, index) => (
            <View
              key={index}
              className="bg-white border border-stroke rounded-[14px] mt-2 flex-row items-center justify-between"
            >
              <View
                className="pl-3 rounded-[14px] border-l-4 py-1.5"
                style={{
                  borderColor: activity.color,
                }}
              >
                <View className="flex-row gap-1 items-center">
                  {activity.status === "completed" ? (
                    <IcCheckCircleFilled size={16} />
                  ) : (
                    activity.icon
                  )}
                  <Text className="font-bold">{activity.title}</Text>
                </View>

                <Text className="text-subtleText text-xs mt-1">
                  {activity.sessionTitle}
                </Text>
                <Text className="text-text text-[10px] mt-0.5 italic">
                  {activity.coachName}
                </Text>
              </View>

              <View className="rotate-180 mr-3">
                <IcArrowLeft />
              </View>
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
            <Pressable className="p-2">
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
