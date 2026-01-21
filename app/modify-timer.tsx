import BasicScreen from "@/components/basic-screen";
import Button from "@/components/button";
import Input from "@/components/input";
import Text from "@/components/text";
import CircularValueModal from "@/components/circular-value-modal";
import { useTimerStore } from "@/stores/timer-store";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";

// Timer type labels in French
const TIMER_LABELS = {
  stopwatch: "Chronomètre",
  countdown: "Minuteur",
  emom: "EMOM",
  amrap: "AMRAP",
  tabata: "Tabata",
  custom: "Personnalisé",
} as const;

export default function ModifyTimer() {
  const {
    timerConfig,
    setEffortSeconds,
    setRestSeconds,
    setDurationSeconds,
    setRounds: setStoreRounds,
  } = useTimerStore();

  // Local state for modal display
  const [effort, setEffort] = useState(20);
  const [repos, setRepos] = useState(10);
  const [rounds, setLocalRounds] = useState(8);
  const [duration, setDuration] = useState(60); // For countdown (minuteur) in seconds

  const [showTimerModal, setShowTimerModal] = useState(false);
  const [showReposModal, setShowReposModal] = useState(false);
  const [showRoundsModal, setShowRoundsModal] = useState(false);
  const [showDurationModal, setShowDurationModal] = useState(false);

  // Initialize local state from store when component mounts or store changes
  useEffect(() => {
    if (timerConfig) {
      setEffort(timerConfig.effortSeconds);
      setRepos(timerConfig.restSeconds);
      setLocalRounds(timerConfig.rounds);
      setDuration(timerConfig.durationSeconds);
    }
  }, [timerConfig]);

  // Determine screen title and description based on timer type
  const isCountdown = timerConfig?.timerType === "countdown";
  const isStopwatch = timerConfig?.timerType === "stopwatch";
  const isAmrap = timerConfig?.timerType === "amrap";

  const screenTitle = timerConfig
    ? TIMER_LABELS[timerConfig.timerType]
    : "Timer";
  const screenDescription = isCountdown
    ? "Règle la durée de ton minuteur."
    : isStopwatch
      ? "Le chronomètre compte le temps écoulé."
      : isAmrap
        ? "Règle la durée de ton AMRAP."
        : "Paramètre ton timer selon tes objectifs.";

  const handleSave = () => {
    // Update store with local state values
    if (timerConfig) {
      if (!isCountdown && !isStopwatch && !isAmrap) {
        // For interval timers (tabata, custom, emom)
        setEffortSeconds(effort);
        setRestSeconds(repos);
        setStoreRounds(rounds);
      } else if (isCountdown || isAmrap) {
        // For countdown and amrap
        setDurationSeconds(duration);
      }
    }
    router.back();
  };

  const handleRoundsChange = (value: number) => {
    setLocalRounds(value);
  };

  return (
    <BasicScreen title={screenTitle} description={screenDescription}>
      <View className="px-4 pt-6 pb-safe flex-1 gap-6">
        {isCountdown || isAmrap ? (
          // Countdown/AMRAP - only show duration input
          <>
            <Input
              label="Temps"
              value={`${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, "0")}`}
              readOnly
              onPress={() => setShowDurationModal(true)}
            />
          </>
        ) : isStopwatch ? (
          // Stopwatch - no configuration needed
          <View className="items-center justify-center flex-1">
            <Text className="text-subtleText text-base">
              Le chronomètre n&apos;a pas besoin de configuration.
            </Text>
          </View>
        ) : (
          // Other timers - show effort, repos, and rounds
          <>
            <Input
              label="Temps d'effort"
              value={`${effort} secondes`}
              readOnly
              onPress={() => setShowTimerModal(true)}
            />
            <Input
              label="Temps de repos"
              value={`${repos} secondes`}
              readOnly
              onPress={() => setShowReposModal(true)}
            />
            <Input
              label="Nombre de tours"
              value={`${rounds}`}
              readOnly
              onPress={() => setShowRoundsModal(true)}
            />
          </>
        )}

        <View className="grow" />

        <Button
          text="Valider"
          className="mb-6"
          size="large"
          onPress={handleSave}
        />
      </View>

      {/* Duration modal for countdown/AMRAP timer */}
      {(isCountdown || isAmrap) && (
        <CircularValueModal
          value={duration}
          setValue={setDuration}
          maxValue={3600} // Max 1 hour
          title="Indique la durée"
          show={showDurationModal}
          onConfirm={() => setShowDurationModal(false)}
          onCancel={() => setShowDurationModal(false)}
          unit="sec"
        />
      )}

      {/* Effort modal (for non-countdown/non-stopwatch/non-amrap timers) */}
      {!isCountdown && !isStopwatch && !isAmrap && (
        <CircularValueModal
          value={effort}
          setValue={setEffort}
          maxValue={60}
          title="Indique ton temps d'effort"
          show={showTimerModal}
          onConfirm={() => setShowTimerModal(false)}
          onCancel={() => setShowTimerModal(false)}
          unit="sec"
        />
      )}

      {/* Repos modal (for interval timers) */}
      {!isCountdown && !isStopwatch && !isAmrap && (
        <CircularValueModal
          value={repos}
          setValue={setRepos}
          maxValue={60}
          title="Indique ton temps de repos"
          show={showReposModal}
          onConfirm={() => setShowReposModal(false)}
          onCancel={() => setShowReposModal(false)}
          unit="sec"
        />
      )}

      {/* Rounds modal (for interval timers) */}
      {!isCountdown && !isStopwatch && !isAmrap && (
        <CircularValueModal
          value={rounds}
          setValue={handleRoundsChange}
          maxValue={60}
          title="Indique ton nombre de tours"
          show={showRoundsModal}
          onConfirm={() => setShowRoundsModal(false)}
          onCancel={() => setShowRoundsModal(false)}
        />
      )}
    </BasicScreen>
  );
}
