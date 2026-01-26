import BasicScreen from "@/components/basic-screen";
import Button from "@/components/button";
import Input from "@/components/input";
import Text from "@/components/text";
import CircularValueModal from "@/components/circular-value-modal";
import { useTimerStore } from "@/stores/timer-store";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

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
    setTimerType,
  } = useTimerStore();

  // Local state for modal display
  const [effort, setEffort] = useState(20);
  const [repos, setRepos] = useState(10);
  const [rounds, setLocalRounds] = useState(8);
  const [durationMinutes, setDurationMinutes] = useState(1); // For countdown/AMRAP in minutes (user-facing)

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
      // Convert seconds to minutes for countdown/AMRAP user display
      setDurationMinutes(Math.round(timerConfig.durationSeconds / 60));
    }
  }, [timerConfig]);

  // Determine screen title and description based on timer type
  const isCountdown = timerConfig?.timerType === "countdown";
  const isStopwatch = timerConfig?.timerType === "stopwatch";
  const isAmrap = timerConfig?.timerType === "amrap";
  const isEmom = timerConfig?.timerType === "emom";
  const isTabata = timerConfig?.timerType === "tabata";

  const screenTitle = timerConfig
    ? TIMER_LABELS[timerConfig.timerType]
    : "Timer";
  const screenDescription = isCountdown
    ? "Règle la durée de ton minuteur."
    : isStopwatch
      ? "Le chronomètre compte le temps écoulé."
      : isAmrap
        ? "Règle la durée de ton AMRAP."
        : isTabata
          ? "Le format Tabata est préréglé sur 20s d'effort, 10s de repos, 8 tours. Modifie pour passer en mode personnalisé."
          : "Paramètre ton timer selon tes objectifs.";

  const handleSave = () => {
    // Update store with local state values
    if (timerConfig) {
      if (isCountdown || isAmrap) {
        // For countdown and amrap - convert minutes to seconds
        setDurationSeconds(durationMinutes * 60);
      } else if (isEmom) {
        // For EMOM - effort and rounds (rest is automatic: 60 - effort)
        setEffortSeconds(effort);
        setStoreRounds(rounds);
      } else if (timerConfig.timerType === "custom") {
        // For custom - effort, repos, and rounds
        setEffortSeconds(effort);
        setRestSeconds(repos);
        setStoreRounds(rounds);
      }
      // Tabata is preset and doesn't save
    }
    router.back();
  };

  const handleRoundsChange = (value: number) => {
    setLocalRounds(value);
  };

  // Switch from Tabata to Custom when user modifies any input
  const handleTabataModify = () => {
    if (timerConfig?.timerType === "tabata") {
      setTimerType("custom");
    }
  };

  return (
    <BasicScreen title={screenTitle} description={screenDescription}>
      <StatusBar style="dark" />
      <View className="px-4 pt-6 pb-safe flex-1 gap-6">
        {isCountdown || isAmrap ? (
          // Countdown/AMRAP - only show duration input in minutes
          <>
            <Input
              label="Durée"
              value={`${durationMinutes} minute${durationMinutes > 1 ? "s" : ""}`}
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
        ) : isEmom ? (
          // EMOM - only effort and rounds (rest is automatic)
          <>
            <Input
              label="Temps d'effort"
              value={`${effort} secondes`}
              readOnly
              onPress={() => setShowTimerModal(true)}
            />
            <Input
              label="Nombre de tours"
              value={`${rounds}`}
              readOnly
              onPress={() => setShowRoundsModal(true)}
            />
          </>
        ) : isTabata ? (
          // Tabata - show preset values, modifying switches to custom
          <>
            <Input
              label="Temps d'effort"
              value={`${effort} secondes`}
              readOnly
              onPress={() => {
                handleTabataModify();
                setShowTimerModal(true);
              }}
            />
            <Input
              label="Temps de repos"
              value={`${repos} secondes`}
              readOnly
              onPress={() => {
                handleTabataModify();
                setShowReposModal(true);
              }}
            />
            <Input
              label="Nombre de tours"
              value={`${rounds}`}
              readOnly
              onPress={() => {
                handleTabataModify();
                setShowRoundsModal(true);
              }}
            />
          </>
        ) : (
          // Custom - show effort, repos, and rounds (editable)
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
          value={durationMinutes}
          setValue={setDurationMinutes}
          maxValue={60} // Max 60 minutes (1 hour)
          title="Indique la durée en minutes"
          show={showDurationModal}
          onConfirm={() => setShowDurationModal(false)}
          onCancel={() => setShowDurationModal(false)}
          unit="min"
        />
      )}

      {/* Effort modal (for EMOM, custom, and tabata timers) */}
      {(isEmom || timerConfig?.timerType === "custom" || isTabata) && (
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

      {/* Repos modal (for custom and tabata timers only - not EMOM) */}
      {(timerConfig?.timerType === "custom" || isTabata) && (
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

      {/* Rounds modal (for EMOM, custom, and tabata timers) */}
      {(isEmom || timerConfig?.timerType === "custom" || isTabata) && (
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
