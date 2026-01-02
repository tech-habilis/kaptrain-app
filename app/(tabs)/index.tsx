import Button from "@/components/button";
import { Chip } from "@/components/chip";
import IcAppleFood from "@/components/icons/apple-food";
import IcArrowLeft from "@/components/icons/arrow-left";
import IcBell from "@/components/icons/bell";
import IcCheckCircleFilled from "@/components/icons/check-circle-filled";
import IcCycling from "@/components/icons/cycling";
import IcHollowCircle from "@/components/icons/hollow-circle";
import IcLightning from "@/components/icons/lightning";
import IcMessage from "@/components/icons/message";
import IcMoon from "@/components/icons/moon";
import IcSmiley from "@/components/icons/smiley";
import IcTeardrop from "@/components/icons/teardrop";
import Text from "@/components/text";
import { ROUTE } from "@/constants/route";
import { ColorConst } from "@/constants/theme";
import cn from "@/utilities/cn";
import { clsx } from "clsx";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  View,
} from "react-native";

const MyStatistic = () => {
  const statistics = [
    {
      title: "Répartition d’activité",
      subtitle: "Aujourd’hui",
    },
    {
      title: "Volume d’entrainement",
      subtitle: "7 derniers jours",
    },
    {
      title: "Répartition d’activité",
      subtitle: "Aujourd’hui",
    },
    {
      title: "Volume d’entrainement",
      subtitle: "7 derniers jours",
    },
    {
      title: "Répartition d’activité",
      subtitle: "Aujourd’hui",
    },
  ];

  return (
    <View className="bg-white py-4 gap-4">
      <View className="flex-row justify-between items-center mx-4">
        <Text className="font-bold text-base text-secondary">
          Mes statistiques
        </Text>
        <Button
          text="Tout voir"
          type="link"
          size="small"
          textClassName="text-secondary"
          rightIcon={
            <View className="rotate-180">
              <IcArrowLeft size={16} />
            </View>
          }
        />
      </View>

      {/* list */}
      <ScrollView
        horizontal
        contentContainerClassName="gap-2 px-4"
        showsHorizontalScrollIndicator={false}
      >
        {statistics.map((statistic, index) => (
          <View
            key={index}
            className="bg-white border border-stroke size-[168px] p-3 gap-1 rounded-lg"
          >
            <Text className="font-medium text-xs text-text">
              {statistic.title}
            </Text>
            <Text className="text-[10px] text-subtleText">
              {statistic.subtitle}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* indicator */}
      <View className="flex-row gap-2 self-center">
        {Array.from({ length: statistics.length }).map((_, index) => (
          <View
            key={index}
            className={cn(
              "size-2 rounded-full",
              index === 0 ? "bg-primary" : "bg-light",
            )}
          />
        ))}
      </View>
    </View>
  );
};

const MyFitnessTracking = () => {
  const chips = [
    { title: "Sommeil", icon: <IcMoon size={16} /> },
    { title: "Energie", icon: <IcLightning size={16} /> },
    { title: "Nutrition", icon: <IcAppleFood size={16} /> },
    { title: "Hydratation", icon: <IcTeardrop size={16} /> },
  ];

  return (
    <View className="bg-white py-4 gap-4">
      <View className="flex-row justify-between items-center mx-4">
        <Text className="font-bold text-base text-secondary">
          Mon suivi de forme
        </Text>
        <Button text="Aujourd’hui" type="secondaryV2" size="small" />
      </View>

      {/* area chart */}
      <View className="size-[160px] px-4 self-center" />

      {/* chips */}
      <ScrollView horizontal contentContainerClassName="gap-2 px-4">
        {chips.map((chip, index) => (
          <Chip
            type="uncheck"
            text={chip.title}
            leftIcon={chip.icon}
            key={index}
          />
        ))}
      </ScrollView>

      <Button
        type="secondary"
        size="small"
        text="Renseigner ma forme du jour"
        className="mx-4"
        onPress={() => router.push(ROUTE.WELLNESS)}
      />
    </View>
  );
};

const Agenda = () => {
  const activities = [
    {
      title: "Hyrox",
      location: "Hyrox Paris Grand palais",
      by: "Par Enguerrand Aucher",
      color: ColorConst.tertiary,
      icon: <IcCheckCircleFilled size={16} />,
    },
    {
      title: "Cyclisme",
      location: "Fractionné court",
      by: "Par Enguerrand Aucher",
      color: ColorConst.primary,
      icon: <IcCycling size={16} />,
    },
  ];

  const days = [
    {
      title: "Lun",
      activities: [activities[1]],
    },
    {
      title: "Mar",
      activities: [activities[0], activities[1]],
    },
    {
      title: "Mer",
      activities: [],
    },
    {
      title: "Jeu",
      activities: [activities[0], activities[1]],
    },
    {
      title: "Ven",
      activities: [activities[1]],
    },
    {
      title: "Sam",
      activities: [],
    },
    {
      title: "Dim",
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
              <View
                className={cn(
                  "size-8 items-center justify-center relative",
                  clsx({ "bg-secondary rounded-full": isToday }),
                )}
              >
                <View className="absolute -top-1 flex-row gap-0.5">
                  {day.activities.map((activity, index) => (
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

      {/* today activities */}
      <View className="p-4 flex-row gap-3 justify-stretch">
        <View className="gap-2.5 mt-0.75 items-center">
          <IcHollowCircle size={12} />
          <View className="w-0.5 flex-1 bg-stroke" />
        </View>
        <View className="flex-1">
          <Text className="text-accent mb-3">Aujourd’hui</Text>

          {activities.map((activity, index) => (
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
                  {activity.icon}
                  <Text className="font-bold">{activity.title}</Text>
                </View>

                <Text className="text-subtleText text-xs mt-1">
                  {activity.location}
                </Text>
                <Text className="text-text text-[10px] mt-0.5 italic">
                  {activity.by}
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

      {/* my fitness tracking */}
      <MyFitnessTracking />

      {/* my statistics */}
      <MyStatistic />

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
