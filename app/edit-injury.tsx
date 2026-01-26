import Button from "@/components/button";
import IcArrowLeft from "@/components/icons/arrow-left";
import Text from "@/components/text";
import InjuryForm from "@/components/injury-form";
import ConfirmActionModal from "@/components/confirm-action-modal";
import { TChoice } from "@/types";
import { ROUTE } from "@/constants/route";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

export default function EditInjury() {
  const [injuryName, setInjuryName] = useState("");
  const [injuryDescription, setInjuryDescription] = useState("");
  const [injuryStatus, setInjuryStatus] = useState<TChoice | undefined>();
  const [injuryArea, setInjuryArea] = useState("Adducteur Droit");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSubmit = () => {
    // Submit form
    console.log("Updating injury:", {
      name: injuryName,
      description: injuryDescription,
      status: injuryStatus,
      area: injuryArea,
    });
    router.back();
  };

  const handleEditArea = () => {
    router.push(ROUTE.EDIT_INJURY_AREA);
  };

  const isSubmitDisabled = () => {
    return !injuryName || !injuryDescription || !injuryStatus;
  };

  const handleDeleteInjury = () => {
    console.log("Deleting injury");
    setShowDeleteModal(false);
    router.back();
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="pt-safe px-4 pb-4">
        <View className="flex-row items-center gap-1">
          <Pressable onPress={router.back} className="p-2">
            <IcArrowLeft />
          </Pressable>
          <View className="flex-1">
            <Text className="text-lg font-ls-bold text-secondary">
              Modifier ma blessure
            </Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-4">
        <InjuryForm
          mode="edit"
          injuryName={injuryName}
          onChangeInjuryName={setInjuryName}
          injuryDescription={injuryDescription}
          onChangeInjuryDescription={setInjuryDescription}
          injuryStatus={injuryStatus}
          onChangeInjuryStatus={setInjuryStatus}
          injuryArea={injuryArea}
          onPressEditArea={handleEditArea}
        />

        <View className="h-32" />
      </ScrollView>

      {/* CTA Buttons */}
      <View className="absolute bottom-0 left-0 right-0 px-4 pt-8 pb-safe bg-white gap-3">
        <Button
          text="Supprimer ma blessure"
          type="tertiary"
          onPress={() => setShowDeleteModal(true)}
        />
        <Button
          text="Enregistrer"
          type="primary"
          onPress={handleSubmit}
          disabled={isSubmitDisabled()}
        />
      </View>

      {/* Delete Confirmation Modal */}
      <ConfirmActionModal
        name="delete-injury-modal"
        title="Supprimer cette blessure ?"
        message="Cette action est définitive. Tu perdras l'historique lié à cette blessure (date, détails, évolution…)."
        show={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        confirm={{
          text: "Confirmer et supprimer",
          isDestructive: true,
          onPress: handleDeleteInjury,
        }}
      />
    </View>
  );
}
