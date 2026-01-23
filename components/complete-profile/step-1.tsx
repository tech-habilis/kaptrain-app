import { Choices } from "@/components/choices";
import { TChoice } from "@/types";
import IcPlus from "@/components/icons/plus";
import IcUser from "@/components/icons/user";
import IcCheck from "@/components/icons/check";
import Input from "@/components/input";
import DatePicker from "@/components/date-picker";
import Text from "@/components/text";
import { useTranslation } from "react-i18next";
import { useCompleteProfileStore } from "@/stores/complete-profile-store";
import { View, Image, Pressable, Alert } from "react-native";
import { useState, useMemo } from "react";
import dayjs from "dayjs";
import * as ImagePicker from "expo-image-picker";
import { phoneSchema } from "@/utilities/validation/schema";

export function Step1() {
  const { t } = useTranslation();
  const { formData, errors, updateStep1, localAvatarUri, setLocalAvatarUri } =
    useCompleteProfileStore();
  const [isPickerLoading, setIsPickerLoading] = useState(false);

  const isPhoneValid = useMemo(() => {
    return phoneSchema.safeParse(formData.phone).success;
  }, [formData.phone]);

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

  const selectedGender = genders.find((g) => g.text === formData.gender);

  const handlePickImage = async () => {
    try {
      setIsPickerLoading(true);

      // Request permission
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          t("completeProfile.step1.permissionDenied") || "Permission needed",
          t("completeProfile.step1.permissionMessage") ||
            "Sorry, we need camera roll permissions to make this work.",
        );
        return;
      }

      // Pick image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        // Store local URI for preview and upload
        updateStep1({ avatarUrl: uri });
        setLocalAvatarUri(uri);
      }
    } catch (error) {
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

  const displayImageUri = localAvatarUri || formData.avatarUrl;

  return (
    <View className="gap-6 mt-6">
      <View className="items-center">
        <Pressable
          className="bg-light rounded-2xl relative"
          onPress={handlePickImage}
          disabled={isPickerLoading}
        >
          {displayImageUri ? (
            <Image
              source={{ uri: displayImageUri }}
              className="w-28 h-28"
              style={{ borderRadius: 16 }}
            />
          ) : (
            <View className="w-28 h-28 items-center justify-center">
              <IcUser />
            </View>
          )}
          <View className="absolute bg-primary p-2 -right-2 -bottom-2 rounded-lg items-center justify-center">
            {isPickerLoading ? (
              <View className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <IcPlus size={20} color="#FFFFFF" />
            )}
          </View>
        </Pressable>
      </View>

      <Input
        label="completeProfile.step1.firstName"
        placeholder="completeProfile.step1.firstNamePlaceholder"
        value={formData.firstName}
        onChangeText={(text) => updateStep1({ firstName: text })}
        error={errors.firstName ? t(errors.firstName) : undefined}
      />

      <Input
        label="completeProfile.step1.lastName"
        placeholder="completeProfile.step1.lastNamePlaceholder"
        value={formData.lastName}
        onChangeText={(text) => updateStep1({ lastName: text })}
        error={errors.lastName ? t(errors.lastName) : undefined}
      />

      <DatePicker
        label="completeProfile.step1.birthDate"
        selectedDate={
          formData.birthDate ? dayjs(formData.birthDate).toDate() : undefined
        }
        onSelect={(date) =>
          updateStep1({ birthDate: dayjs(date).format("YYYY-MM-DD") })
        }
        error={errors.birthDate ? t(errors.birthDate) : undefined}
        maxDate={dayjs().toDate()}
        showIcon={false}
        placeholder="completeProfile.step1.birthDatePlaceholder"
      />

      <Input
        label="Numéro de téléphone"
        placeholder="06 12 34 56 78"
        value={formData.phone}
        onChangeText={(text) => {
          updateStep1({ phone: text });
        }}
        keyboardType="phone-pad"
        error={errors.phone ? t(errors.phone) : undefined}
        rightIcon={
          isPhoneValid && !errors.phone ? <IcCheck size={24} /> : undefined
        }
      />

      <View className="mb-28">
        <Text className="text-accent font-medium text-sm">
          completeProfile.step1.gender
        </Text>
        <Choices
          data={genders}
          selectedChoice={selectedGender}
          type="default"
          onChange={(choice) => updateStep1({ gender: choice.text })}
        />
      </View>
    </View>
  );
}
