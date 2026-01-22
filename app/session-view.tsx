import BottomSheetModal, {
  RawBottomSheetModalType,
} from "@/components/bottom-sheet-modal";
import Button from "@/components/button";
import { Choices } from "@/components/choices";
import ConfirmActionModal from "@/components/confirm-action-modal";
import IcArrowLeft from "@/components/icons/arrow-left";
import IcCheck from "@/components/icons/check";
import IcClock from "@/components/icons/clock";
import IcInfoCircle from "@/components/icons/info-circle";
import IcLightning from "@/components/icons/lightning";
import { SessionCard } from "@/components/session/session-card";
import TabataCard from "@/components/tabata-card";
import Text from "@/components/text";
import { ROUTE } from "@/constants/route";
import { ColorConst } from "@/constants/theme";
import { clsx } from "clsx";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { ImageBackground, Pressable, ScrollView, View } from "react-native";

const timers = [
  { name: "Chronomètre", onPress: () => router.push(ROUTE.SESSION_VIEW) },
  { name: "Minuteur", onPress: () => router.push(ROUTE.SESSION_VIEW) },
  { name: "EMOM", onPress: () => router.push(ROUTE.SESSION_VIEW) },
  { name: "AMRAP", onPress: () => router.push(ROUTE.SESSION_VIEW) },
  { name: "Tabata", onPress: () => router.push(ROUTE.SESSION_VIEW) },
  { name: "Personnalisé", onPress: () => router.push(ROUTE.SESSION_VIEW) },
];

export default function SessionView() {
  const [expandedCards, setExpandedCards] = useState<{
    [key: number]: boolean;
  }>({});
  const [completedCards, setCompletedCards] = useState<{
    [key: number]: boolean;
  }>({});

  const showTimersRef = useRef<RawBottomSheetModalType>(null);
  const resetTimerRef = useRef<RawBottomSheetModalType>(null);
  const [showDeleteTabata, setShowDeleteTabata] = useState(false);

  const totalWeek = 4;
  const currentWeek = 1;

  const sessionData = [
    {
      title: "Réveille ton corps en douceur",
      description:
        "Réveille ton corps en douceur.\n\nEnchaîne 3 minutes de cardio léger (corde à sauter, jumping jacks) suivi de 2 minutes de mobilité (cercles de hanches, montées de genoux dynamiques).",
    },
    {
      title: "Bloc principal - 20x20 - 12 minutes",
      description:
        "20 secondes à fond / 20 secondes de récupération x 18 rounds\n\nAlterne les exercices suivants en boucle :\n\nBurpees\n\nMountain climbers\n\nJump squats\n\nHigh knees\n\nPush-ups\n\nSkater jumps\n\nRépète cette série 3 fois avec 1 minute de pause entre chaque round complet.",
    },
  ];

  const toggleExpanded = (index: number) => {
    setExpandedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleCompleted = (index: number) => {
    setCompletedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <>
      <ScrollView className="bg-white" contentContainerClassName="pb-24">
        <ImageBackground source={require("../assets/images/today-session.png")}>
          <View className="pt-safe pb-6 px-4">
            <View className="flex-row gap-1 items-center ">
              <Pressable onPress={router.back} className="p-2">
                <IcArrowLeft color="white" />
              </Pressable>
              <Text className="text-lg font-bold text-white flex-1">
                Séance du jour
              </Text>
              <IcInfoCircle size={24} color="white" />
            </View>
            <View className="flex-row items-center justify-center mt-6">
              {Array.from({ length: totalWeek }).map((_, i) => (
                <View key={i} className="flex-row items-center">
                  <View className="bg-white items-center justify-center w-18.5 h-14 rounded-lg border-4 border-tertiary">
                    <Text className="text-[10px] font-bold text-text">
                      {i < currentWeek ? "S" + (i + 1) : "Semaine"}
                    </Text>
                    {i < currentWeek ? (
                      <IcCheck size={24} color={ColorConst.text} />
                    ) : (
                      <Text className="text-2xl font-bold text-text">
                        {(i + 1).toString()}
                      </Text>
                    )}
                  </View>

                  <View
                    className={clsx("h-1 w-4 bg-tertiary", {
                      hidden: i === totalWeek - 1,
                    })}
                  />
                </View>
              ))}
            </View>
          </View>
        </ImageBackground>

        <View className="px-4 pt-6">
          <View className="flex-row items-center gap-1.5">
            <IcLightning size={24} color={ColorConst.tertiary} />
            <Text className="text-base font-bold">
              HIIT 20x20 – Puissance & Résistance
            </Text>
          </View>
          <Text className="text-sm text-text mt-1">
            Séance du jour - Environ 25 minutes
          </Text>
        </View>

        <TabataCard
          className="mx-4 my-6"
          onClose={() => setShowDeleteTabata(true)}
          onModify={() => router.push(ROUTE.MODIFY_TIMER)}
          onStarted={() => {
            console.log("started!");
          }}
        />

        <View className="gap-2 px-4">
          {sessionData.map((session, index) => (
            <SessionCard
              key={index}
              title={session.title}
              description={session.description}
              isCompleted={completedCards[index] || false}
              onToggleComplete={() => toggleCompleted(index)}
              isExpanded={expandedCards[index] || false}
              onToggleExpand={() => toggleExpanded(index)}
              exercises={[]}
            />
          ))}
        </View>
      </ScrollView>
      <View className="px-4 pb-safe absolute bottom-0 left-0 right-0 flex-row items-center p-4 gap-3 bg-white">
        <Pressable
          className="p-3"
          onPress={() => showTimersRef.current?.present()}
        >
          <IcClock size={32} />
        </Pressable>
        <Button type="secondary" text="J’ai terminé" className="flex-1" />
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
          data={timers.map((x, index) => ({
            text: x.name,
          }))}
          type="secondary"
          className="mt-3"
          itemClassName="bg-secondary"
          itemTextClassName="text-white"
          onChange={(choice) => {
            const timer = timers.find((x) => x.name === choice.text);
            if (timer) {
              showTimersRef.current?.dismiss();
              timer.onPress();
            }
          }}
        />

        <View className="pb-safe flex-row items-center py-4 gap-3 bg-white">
          <Pressable
            className="p-3"
            onPress={() => {
              showTimersRef.current?.dismiss();
              resetTimerRef.current?.present();
            }}
          >
            <IcClock color={ColorConst.primary} size={32} />
          </Pressable>
          <Button type="secondary" text="J’ai terminé" className="flex-1" />
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
              showTimersRef.current?.present();
            }}
          >
            <IcClock color={ColorConst.primary} size={32} />
          </Pressable>
          <Button
            type="secondary"
            text="Écraser le chrono en cours"
            className="flex-1"
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
