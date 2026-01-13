import { Choices } from "@/components/choices";
import { TChoice } from "@/types";
import IcPlus from "@/components/icons/plus";
import IcUser from "@/components/icons/user";
import Input from "@/components/input";
import DatePicker from "@/components/date-picker";
import Text from "@/components/text";
import { useTranslation } from "react-i18next";
import { useCompleteProfileStore } from "@/stores/complete-profile-store";
import { ScrollView, View } from "react-native";
import dayjs from "dayjs";

export function Step1() {
  const { t } = useTranslation();
  const { formData, errors, updateStep1 } = useCompleteProfileStore();

  const genders: TChoice[] = [
    { text: "completeProfile.step1.genderFemale" },
    { text: "completeProfile.step1.genderMale" },
    { text: "completeProfile.step1.genderNonBinary" },
  ];

  const selectedGender = genders.find((g) => g.text === formData.gender);

  return (
    <View className="gap-6 mt-6">
      <View className="bg-light self-center p-6 rounded-2xl relative">
        <IcUser />

        <View className="absolute bg-primary p-1 -right-2 -bottom-2 rounded-lg items-center justify-center">
          <IcPlus />
        </View>
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
        selectedDate={formData.birthDate ? dayjs(formData.birthDate).toDate() : undefined}
        onSelect={(date) => updateStep1({ birthDate: dayjs(date).format("YYYY-MM-DD") })}
        error={errors.birthDate ? t(errors.birthDate) : undefined}
        maxDate={dayjs().toDate()}
        showIcon={false}
        placeholder="completeProfile.step1.birthDatePlaceholder"
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
