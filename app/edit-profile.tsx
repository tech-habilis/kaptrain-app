import BasicScreen from "@/components/basic-screen";
import Button from "@/components/button";
import Input from "@/components/input";
import Toggle from "@/components/toggle";
import IcCalendar from "@/components/icons/calendar";
import IcPencil from "@/components/icons/pencil";
import { useRef, useState } from "react";
import { Image, Pressable, ScrollView, View } from "react-native";
import Text from "@/components/text";
import PhotoResizeModal, { PhotoResizeModalRef } from "@/components/photo-resize-modal";

export default function EditProfile() {
  const photoResizeModalRef = useRef<PhotoResizeModalRef>(null);
  const [firstName, setFirstName] = useState("Marie");
  const [lastName, setLastName] = useState("Patouillet");
  const [birthDate, setBirthDate] = useState("07/08/1988");
  const [gender, setGender] = useState("Femme");
  const [height, setHeight] = useState("169 cm");
  const [isWheelchair, setIsWheelchair] = useState(false);
  const [weight, setWeight] = useState("63,0 kg");
  const [practiceLevel, setPracticeLevel] = useState("Expert");
  const [profileImage] = useState(require("@/assets/images/sample-avatar.png"));
  // TODO: Add setProfileImage when implementing actual photo upload

  const handleSave = () => {
    // TODO: Implement save profile logic
    console.log("Saving profile...");
  };

  const handleDeleteAccount = () => {
    // TODO: Implement delete account logic
    console.log("Deleting account...");
  };

  const handleEditPhoto = () => {
    // TODO: Implement photo picker logic
    // For now, just open the resize modal with the current image
    photoResizeModalRef.current?.present();
  };

  const handlePhotoConfirm = (croppedImage?: any) => {
    // TODO: Update profile image with cropped image
    // setProfileImage(croppedImage);
    console.log("Photo confirmed:", croppedImage);
  };

  const handlePhotoCancel = () => {
    console.log("Photo resize cancelled");
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
          <View className="relative">
            <Image
              source={profileImage}
              className="size-30 rounded-[18.5px]"
            />
            <Pressable
              className="absolute -right-2 -bottom-2 bg-white rounded-[9px] items-center justify-center border-2 border-stroke p-1"
              onPress={handleEditPhoto}
            >
              <IcPencil size={24} />
            </Pressable>
          </View>

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

            <Input label="Genre" value={gender} onChangeText={setGender} />

            <Input label="Taille" value={height} onChangeText={setHeight} />

            {/* Wheelchair Toggle */}
            <View className="flex-row items-center justify-between py-2">
              <Text className="text-secondary font-bold text-base">
                Je suis en fauteuil
              </Text>
              <Toggle value={isWheelchair} onValueChange={setIsWheelchair} />
            </View>

            <Input label="Poids" value={weight} onChangeText={setWeight} />

            <Input
              label="Niveau de pratique"
              value={practiceLevel}
              onChangeText={setPracticeLevel}
            />

            {/* Delete Account Button */}
            <Button
              text="Supprimer mon compte"
              type="secondary"
              size="large"
              onPress={handleDeleteAccount}
              className="bg-[#FDFAFA] border-2 border-error2 mt-4"
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

      {/* Photo Resize Modal */}
      <PhotoResizeModal
        ref={photoResizeModalRef}
        imageSource={profileImage}
        onConfirm={handlePhotoConfirm}
        onCancel={handlePhotoCancel}
      />
    </BasicScreen>
  );
}
