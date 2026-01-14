import BasicScreen from "@/components/basic-screen";
import Button from "@/components/button";
import Input from "@/components/input";
import CircularValueModal from "@/components/circular-value-modal";
import React, { useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";

export default function ModifyTimer() {
  const [effort, setEffort] = useState(20);
  const [repos, setRepos] = useState(10);
  const [rounds, setRounds] = useState(8);

  const [showTimerModal, setShowTimerModal] = useState(false);
  const [showReposModal, setShowReposModal] = useState(false);
  const [showRoundsModal, setShowRoundsModal] = useState(false);

  return (
    <BasicScreen
      title="Timer personnalisé"
      description="Paramètre ton timer selon tes objectifs."
    >
      <View className="px-4 pt-6 pb-safe flex-1 gap-6">
        <Input
          label="Temps d’effort"
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

        <View className="grow" />

        <Button text="Valider" className="mb-6" size="large" onPress={router.back} />
      </View>

      <CircularValueModal
        value={effort}
        setValue={setEffort}
        maxValue={60}
        title="Indique ton temps d’effort"
        show={showTimerModal}
        onConfirm={() => setShowTimerModal(false)}
        onCancel={() => setShowTimerModal(false)}
        unit="sec"
      />

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

      <CircularValueModal
        value={rounds}
        setValue={setRounds}
        maxValue={60}
        title="Indique ton nombre de tours"
        show={showRoundsModal}
        onConfirm={() => setShowRoundsModal(false)}
        onCancel={() => setShowRoundsModal(false)}
      />
    </BasicScreen>
  );
}
