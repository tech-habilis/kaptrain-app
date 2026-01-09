import Button from "@/components/button";
import CircularProgress from "@/components/charts/circular-progress";
import IcArrowLeft from "@/components/icons/arrow-left";
import IcPause from "@/components/icons/pause";
import { IcReset } from "@/components/icons/repeat";
import Tabs from "@/components/tabs";
import Text from "@/components/text";
import { ROUTE } from "@/constants/route";
import { TabataTheme } from "@/constants/tabata-theme";
import { useTabataTimer } from "@/hooks/use-tabata-timer";
import { clsx } from "clsx";
import { router, useFocusEffect } from "expo-router";
import { Pressable, View, Text as RawText } from "react-native";

export default function TimerExpanded() {
  const effortSeconds = 5;
  const restSeconds = 5;
  const totalRounds = 1;

  const onStarted = () => undefined;
  const onCompleted = () => undefined;

  const {
    state,
    phase,
    round,
    formattedMinutes,
    formattedSeconds,
    pause,
    resume,
    reset,
    remainingSeconds,
    totalSeconds,
    phaseTabs,
    currentPhaseTab,
    startWithoutCountdown,
  } = useTabataTimer({
    effortSeconds,
    restSeconds,
    totalRounds,
    onStarted,
    onCompleted,
  });

  const phaseTheme =
    TabataTheme[["default", "completed"].includes(state) ? "default" : phase];

  useFocusEffect(() => {
    startWithoutCountdown();
  });

  return (
    <View
      className="px-4 py-safe flex-1"
      style={{ backgroundColor: phaseTheme.cardBackgroundColor }}
    >
      <View className="flex-row gap-1 items-center">
        <Pressable onPress={router.back} className="p-2">
          <IcArrowLeft />
        </Pressable>
        <Text className="text-secondary text-lg font-bold">Tabata</Text>
      </View>

      <View className="flex-row gap-2 mt-3">
        <View className="bg-white border rounded px-2 py-0.5 border-stroke">
          <Text className="text-sm text-accent">
            {`Effort ${effortSeconds}s`}
          </Text>
        </View>
        <View className="bg-white border rounded px-2 py-0.5 border-stroke">
          <Text className="text-sm text-accent">{`Repos ${restSeconds}s`}</Text>
        </View>
        <View className="bg-white border border-stroke rounded px-2 py-0.5">
          <Text className="text-sm text-accent">{`${totalRounds} tours`}</Text>
        </View>
      </View>

      {["running", "paused"].includes(state) && (
        <Tabs
          tabs={phaseTabs}
          selected={currentPhaseTab}
          onSelected={() => {
            // do nothing, tab selection is done by the timer
          }}
          selectedClassName="bg-error2"
          selectedStyle={{
            backgroundColor: phaseTheme?.tabBackgroundColor,
          }}
          textClassName="text-base text-accent font-medium"
          selectedTextClassName="text-base text-white font-bold"
          tabClassName="py-[10.5px]"
          className="mt-12"
        />
      )}

      <Text className="text-2xl font-medium text-accent mt-14">
        {`Tours ${round + 1}/${totalRounds}`}
      </Text>

      <View className="flex-row items-center justify-center mt-8">
        <CircularProgress
          backgroundColor={phaseTheme.backgroundColor}
          progressColor={phaseTheme.progressColor}
          current={remainingSeconds}
          total={totalSeconds}
          size={74}
          strokeWidth={10}
          textContainerClassName="hidden"
        />

        <View className="flex-row justify-center items-center ml-3">
          <Text className="text-secondary font-semibold text-[80px]">
            {formattedMinutes}
          </Text>
          <RawText className="text-secondary font-semibold text-[80px]">
            :
          </RawText>
          <Text className="text-secondary font-semibold text-[80px]">
            {formattedSeconds}
          </Text>
        </View>
      </View>

      {state === "completed" && (
        <Text className="font-bold text-secondary text-2xl mt-8">
          Temps écoulé. Bien joué !
        </Text>
      )}

      <View className="grow" />

      <View
        className={clsx("flex-row gap-3 items-center mb-6", {
          "justify-center": ["running", "paused"].includes(state),
        })}
      >
        <Pressable onPress={reset} className="p-4">
          <IcReset size={32} />
        </Pressable>
        <Button
          leftIcon={state === "running" ? <IcPause /> : null}
          text={
            state === "completed"
              ? "Terminer"
              : state === "running"
                ? "Pause"
                : state === "paused"
                  ? "Reprendre"
                  : "C'est parti !"
          }
          type={["running", "paused"].includes(state) ? "secondary" : "primary"}
          size="large"
          onPress={
            state === "completed"
              ? () => router.push(ROUTE.SESSION_ENDED_FORM)
              : state === "running"
                ? pause
                : state === "paused"
                  ? resume
                  : startWithoutCountdown
          }
          className={clsx("grow", {
            "bg-white border-secondary ": ["running", "paused"].includes(state),
          })}
        />
      </View>
    </View>
  );
}
