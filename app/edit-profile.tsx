import BasicScreen from "@/components/basic-screen";
import Button from "@/components/button";
import Input from "@/components/input";
import Toggle from "@/components/toggle";
import IcCalendar from "@/components/icons/calendar";
import IcPencil from "@/components/icons/pencil";
import { useRef, useState } from "react";
import { Image, Pressable, ScrollView, View } from "react-native";
import Text from "@/components/text";
import DeleteAccountModal, {
  DeleteAccountModalRef,
} from "@/components/delete-account-modal";
import Dropdown from "@/components/dropdown";
import { TChoice } from "@/types";

export default function EditProfile() {
  const deleteAccountModalRef = useRef<DeleteAccountModalRef>(null);
  const [firstName, setFirstName] = useState("Marie");
  const [lastName, setLastName] = useState("Patouillet");
  const [birthDate, setBirthDate] = useState("07/08/1988");
  const [height, setHeight] = useState("169 cm");
  const [isWheelchair, setIsWheelchair] = useState(false);
  const [weight, setWeight] = useState("63,0 kg");
  const [profileImage] = useState(require("@/assets/images/sample-avatar.png"));
  const genders: TChoice[] = ["Femme", "Homme", "Non Binaire"].map((x) => ({
    text: x,
  }));
  const [gender, setGender] = useState(genders[0]);

  const practiceLevels: TChoice[] = [
    { text: "Débutant", secondaryText: "1 à 2h par semaine" },
    { text: "Intermédiaire", secondaryText: "3 à 4h par semaine" },
    { text: "Avancé", secondaryText: "5 à 7h par semaine" },
    { text: "Confirmé", secondaryText: "8 à 11h par semaine" },
    { text: "Expert", secondaryText: "+ de 12h par semaine" },
  ];

  const [practiceLevel, setPracticeLevel] = useState(practiceLevels[0]);

  // TODO: Add setProfileImage when implementing actual photo upload

  const handleSave = () => {
    // TODO: Implement save profile logic
    console.log("Saving profile...");
  };

  const handleDeleteAccountPress = () => {
    deleteAccountModalRef.current?.present();
  };

  const handleDeleteAccountConfirm = () => {
    console.log("Account deletion confirmed");
    // TODO: Implement account deletion logic
  };

  const handleEditPhoto = () => {
    // TODO: Implement photo picker logic
    // For now, just open the resize modal with the current image
  };

  return (
    <BasicScreen
      title="Modifier mon profil"
      description="Mets à jour tes infos ici"
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-32 pt-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-6 items-center">
          {/* Profile Image */}
          <Pressable className="relative" onPress={handleEditPhoto}>
            <Image source={profileImage} className="size-30 rounded-[18.5px]" />
            <View className="absolute -right-2 -bottom-2 bg-white rounded-[9px] items-center justify-center border-2 border-stroke p-1">
              <IcPencil size={24} />
            </View>
          </Pressable>

          {/* Form Fields */}
          <View className="gap-6 w-full">
            <Input
              label="Prénom"
              value={firstName}
              onChangeText={setFirstName}
            />

            <Input label="Nom" value={lastName} onChangeText={setLastName} />

            <Input
              label="Date de naissance"
              value={birthDate}
              onChangeText={setBirthDate}
              rightIcon={<IcCalendar />}
              onRightIconPress={() => console.log("Open date picker")}
            />

            <Dropdown
              type="input"
              label="Genre"
              modalTitle="Genre"
              options={genders}
              selectedOption={gender}
              onSelect={setGender}
              modalHeight="45%"
            />

            <Input label="Taille" value={height} onChangeText={setHeight} />

            {/* Wheelchair Toggle */}
            <View className="flex-row items-center justify-between py-2">
              <Text className="text-secondary font-bold text-base">
                Je suis en fauteuil
              </Text>
              <Toggle value={isWheelchair} onValueChange={setIsWheelchair} />
            </View>

            <Input label="Poids" value={weight} onChangeText={setWeight} />

            <Dropdown
              label="Niveau de pratique"
              modalTitle="Niveau de pratique"
              selectedOption={practiceLevel}
              options={practiceLevels}
              onSelect={setPracticeLevel}
              type="input"
              modalHeight="60%"
              itemType="secondary"
            />

            {/* Delete Account Button */}
            <Button
              text="Supprimer mon compte"
              type="secondary"
              size="large"
              onPress={handleDeleteAccountPress}
              className="bg-[#FDFAFA] border-2 border-error2 mt-4 android:mb-2"
              textClassName="text-error2"
            />
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View className="absolute bottom-0 left-0 right-0 px-4 pt-8 pb-safe bg-linear-to-t from-white via-white to-transparent backdrop-blur-sm">
        <Button
          text="Enregistrer les modifications"
          type="primary"
          size="large"
          onPress={handleSave}
          disabled={false}
          className="mb-6"
        />
      </View>

      {/* Delete Account Modal */}
      <DeleteAccountModal
        ref={deleteAccountModalRef}
        onConfirm={handleDeleteAccountConfirm}
      />
    </BasicScreen>
  );
}
