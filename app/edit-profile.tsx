import BasicScreen from "@/components/basic-screen";
import Button from "@/components/button";
import DatePicker from "@/components/date-picker";
import DeleteAccountModal, {
  DeleteAccountModalRef,
} from "@/components/delete-account-modal";
import Dropdown from "@/components/dropdown";
import IcCheck from "@/components/icons/check";
import IcPencil from "@/components/icons/pencil";
import Input from "@/components/input";
import Text from "@/components/text";
import { toast } from "@/components/toast";
import Toggle from "@/components/toggle";
import { IMAGE_PICKER_OPTIONS } from "@/constants/misc";
import { useSession } from "@/contexts/auth-context";
import { useProfileStore } from "@/stores/profile-store";
import { TChoice } from "@/types";
import { editProfileSchema } from "@/utilities/validation/edit-profile-schema";
import { phoneSchema } from "@/utilities/validation/schema";
import dayjs from "dayjs";
import { StatusBar } from "expo-status-bar";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Image, Pressable, ScrollView, View } from "react-native";
import ImagePicker from "react-native-image-crop-picker";

export default function EditProfile() {
  const { t } = useTranslation();
  const { session } = useSession();
  const deleteAccountModalRef = useRef<DeleteAccountModalRef>(null);
  const [isPickerLoading, setIsPickerLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const {
    profile,
    isLoading,
    isSaving,
    localAvatarUri,
    setFirstName,
    setLastName,
    setBirthDate,
    setGender,
    setHeight,
    setInWheelchair,
    setWeight,
    setSportLevel,
    setLocalAvatarUri,
    setPhone,
    saveProfile,
    firstName,
    lastName,
    birthDate,
    gender,
    height,
    inWheelchair,
    weight,
    sportLevel,
    phone,
  } = useProfileStore();

  console.log("Profile", profile);

  const displayImageUri = localAvatarUri || profile?.avatar_url;

  const isPhoneValid = useMemo(() => {
    return phoneSchema.safeParse(phone).success;
  }, [phone]);

  const genders: TChoice[] = [
    {
      id: "completeProfile.step1.genderFemale",
      text: "completeProfile.step1.genderFemale",
    },
    {
      id: "completeProfile.step1.genderMale",
      text: "completeProfile.step1.genderMale",
    },
    {
      id: "completeProfile.step1.genderNonBinary",
      text: "completeProfile.step1.genderNonBinary",
    },
  ];

  const genderMap: Record<string, "female" | "male" | "nonbinary"> = {
    "completeProfile.step1.genderFemale": "female",
    "completeProfile.step1.genderMale": "male",
    "completeProfile.step1.genderNonBinary": "nonbinary",
  };

  const selectedGender = genders.find((g) => genderMap?.[g.text] === gender);

  const practiceLevels: TChoice[] = [
    {
      id: "completeProfile.step3.levelBeginner",
      text: "completeProfile.step3.levelBeginner",
      secondaryText: "1 à 2h par semaine",
    },
    {
      id: "completeProfile.step3.levelIntermediate",
      text: "completeProfile.step3.levelIntermediate",
      secondaryText: "3 à 4h par semaine",
    },
    {
      id: "completeProfile.step3.levelAdvanced",
      text: "completeProfile.step3.levelAdvanced",
      secondaryText: "5 à 7h par semaine",
    },
    {
      id: "completeProfile.step3.levelConfirmed",
      text: "completeProfile.step3.levelConfirmed",
      secondaryText: "8 à 11h par semaine",
    },
    {
      id: "completeProfile.step3.levelExpert",
      text: "completeProfile.step3.levelExpert",
      secondaryText: "+ de 12h par semaine",
    },
  ];

  const sportLevelMap = {
    beginner: "completeProfile.step3.levelBeginner",
    intermediate: "completeProfile.step3.levelIntermediate",
    advanced: "completeProfile.step3.levelAdvanced",
    confirmed: "completeProfile.step3.levelConfirmed",
    expert: "completeProfile.step3.levelExpert",
  };

  const selectedPracticeLevel = practiceLevels.find((l) =>
    sportLevel ? sportLevelMap[sportLevel] === l.text : false,
  );

  const handlePickImage = async () => {
    try {
      setIsPickerLoading(true);

      const result = await ImagePicker.openPicker(IMAGE_PICKER_OPTIONS);

      setLocalAvatarUri(result.path);
    } catch (error: any) {
      // User cancelled the picker
      if (error.code === "E_PICKER_CANCELLED") {
        return;
      }
      console.error("Error picking image:", error);
      Alert.alert(
        t("completeProfile.step1.errorTitle") || "Error",
        t("completeProfile.step1.errorMessage") ||
          "Failed to pick image. Please try again.",
      );
    } finally {
      setIsPickerLoading(false);
    }
  };

  const handleSave = async () => {
    if (!session?.user?.id) {
      toast.error("User session not found");
      return;
    }

    // Validate using Zod schema
    const result = editProfileSchema.safeParse({
      firstName,
      lastName,
      birthDate,
      gender,
      weight,
      sportLevel,
      height,
      inWheelchair,
      phone,
    });

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        newErrors[field] = t(issue.message);
      });
      setErrors(newErrors);
      return;
    }

    await saveProfile(session.user.id);
  };

  const handleDeleteAccountPress = () => {
    deleteAccountModalRef.current?.present();
  };

  const handleDeleteAccountConfirm = () => {
    console.log("Account deletion confirmed");
    // TODO: Implement account deletion logic
  };

  return (
    <BasicScreen
      title="Modifier mon profil"
      description="Mets à jour tes infos ici"
    >
      <StatusBar style="auto" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-32 pt-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-6 items-center">
          {/* Profile Image */}
          <Pressable
            className="relative"
            onPress={handlePickImage}
            disabled={isPickerLoading}
          >
            {displayImageUri ? (
              <Image
                source={{ uri: displayImageUri }}
                className="size-30 rounded-[18.5px]"
              />
            ) : (
              <View className="size-30 rounded-[18.5px] bg-light items-center justify-center">
                <Text className="text-subtleText">No photo</Text>
              </View>
            )}
            <View className="absolute -right-2 -bottom-2 bg-white rounded-[9px] items-center justify-center border-2 border-stroke p-1">
              {isPickerLoading ? (
                <View className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              ) : (
                <IcPencil size={24} />
              )}
            </View>
          </Pressable>

          {/* Form Fields */}
          <View className="gap-6 w-full">
            <Input
              label="Prénom"
              value={firstName}
              onChangeText={(text) => {
                setFirstName(text);
                if (errors.firstName) {
                  setErrors((prev) => {
                    const { firstName, ...rest } = prev;
                    return rest;
                  });
                }
              }}
              error={errors.firstName}
            />

            <Input
              label="Nom"
              value={lastName}
              onChangeText={(text) => {
                setLastName(text);
                if (errors.lastName) {
                  setErrors((prev) => {
                    const { lastName, ...rest } = prev;
                    return rest;
                  });
                }
              }}
              error={errors.lastName}
            />

            <DatePicker
              label="Date de naissance"
              selectedDate={birthDate ? dayjs(birthDate).toDate() : undefined}
              onSelect={(date) => {
                setBirthDate(dayjs(date).format("YYYY-MM-DD"));
                if (errors.birthDate) {
                  setErrors((prev) => {
                    const { birthDate, ...rest } = prev;
                    return rest;
                  });
                }
              }}
              maxDate={dayjs().toDate()}
              placeholder="DD/MM/YYYY"
              showIcon={false}
              error={errors.birthDate}
            />

            <Input
              label="Numéro de téléphone"
              placeholder="06 12 34 56 78"
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                if (errors.phone) {
                  setErrors((prev) => {
                    const { phone: _, ...rest } = prev;
                    return rest;
                  });
                }
              }}
              keyboardType="phone-pad"
              error={errors.phone}
              rightIcon={
                isPhoneValid && !errors.phone ? (
                  <IcCheck size={24} />
                ) : undefined
              }
            />

            <Dropdown
              type="input"
              label="Genre"
              modalTitle="Genre"
              options={genders}
              selectedOption={selectedGender}
              onSelect={(choice) => {
                const mappedGender = genderMap?.[choice.text];
                if (mappedGender) {
                  setGender(mappedGender);
                  if (errors.gender) {
                    setErrors((prev) => {
                      const { gender, ...rest } = prev;
                      return rest;
                    });
                  }
                }
              }}
              modalHeight="45%"
              error={errors.gender}
            />

            <Input
              label="Taille (cm)"
              value={height}
              onChangeText={setHeight}
              placeholder="170"
              keyboardType="decimal-pad"
            />

            {/* Wheelchair Toggle */}
            <View className="flex-row items-center justify-between py-2">
              <Text className="text-secondary font-bold text-base">
                Je suis en fauteuil
              </Text>
              <Toggle value={inWheelchair} onValueChange={setInWheelchair} />
            </View>

            <Input
              label="Poids (kg)"
              value={weight}
              onChangeText={(text) => {
                setWeight(text);
                if (errors.weight) {
                  setErrors((prev) => {
                    const { weight, ...rest } = prev;
                    return rest;
                  });
                }
              }}
              placeholder="63.5"
              keyboardType="decimal-pad"
              error={errors.weight}
            />

            <Dropdown
              label="Niveau de pratique"
              modalTitle="Niveau de pratique"
              selectedOption={selectedPracticeLevel}
              options={practiceLevels}
              onSelect={(choice) => {
                const mappedLevel = Object.entries(sportLevelMap).find(
                  ([_, text]) => text === choice.text,
                )?.[0] as
                  | "beginner"
                  | "intermediate"
                  | "advanced"
                  | "confirmed"
                  | "expert";
                if (mappedLevel) {
                  setSportLevel(mappedLevel);
                  if (errors.sportLevel) {
                    setErrors((prev) => {
                      const { sportLevel, ...rest } = prev;
                      return rest;
                    });
                  }
                }
              }}
              type="input"
              modalHeight="60%"
              itemType="secondary"
              error={errors.sportLevel}
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
          disabled={isSaving}
          loading={isSaving || isLoading}
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
