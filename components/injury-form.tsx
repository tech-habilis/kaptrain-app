import { Choices } from "@/components/choices";
import Input from "@/components/input";
import Text from "@/components/text";
import IcPencil from "@/components/icons/pencil";
import { TChoice } from "@/types";
import { ColorConst } from "@/constants/theme";
import { TextInput, View } from "react-native";

interface InjuryFormProps {
  mode: "create" | "edit";
  injuryName: string;
  onChangeInjuryName: (name: string) => void;
  injuryDescription: string;
  onChangeInjuryDescription: (description: string) => void;
  injuryStatus: TChoice | undefined;
  onChangeInjuryStatus: (status: TChoice | undefined) => void;
  injuryArea?: string;
  onPressEditArea?: () => void;
}

export default function InjuryForm({
  mode,
  injuryName,
  onChangeInjuryName,
  injuryDescription,
  onChangeInjuryDescription,
  injuryStatus,
  onChangeInjuryStatus,
  injuryArea,
  onPressEditArea,
}: InjuryFormProps) {
  const injuryStatuses: TChoice[] = [{ text: "En cours" }, { text: "Soignée" }];

  return (
    <View className="gap-6">
      <Input
        label="Nom de la blessure"
        placeholder="Blessure Adducteur Droit"
        value={injuryName}
        onChangeText={onChangeInjuryName}
      />

      {mode === "edit" && (
        <Input
          label="Zone de la blessure"
          placeholder="Zone de la blessure"
          value={injuryArea}
          editable={false}
          rightIcon={<IcPencil size={24} />}
          onPress={onPressEditArea}
        />
      )}

      <View className="gap-2">
        <Text className="text-accent font-medium text-sm">
          Décrivez votre blessure
        </Text>
        <View className="bg-white border border-stroke rounded-lg px-4 py-4">
          <TextInput
            placeholder="Explique comment la blessure est survenue et en quoi elle te gêne au quotidien"
            placeholderTextColor={ColorConst.subtleText}
            value={injuryDescription}
            onChangeText={onChangeInjuryDescription}
            multiline
            textAlignVertical="top"
            className="text-base text-text min-h-32"
          />
        </View>
      </View>

      <Choices
        label="État de la blessure"
        data={injuryStatuses}
        selectedChoice={injuryStatus}
        onChange={onChangeInjuryStatus}
        type="secondary"
        itemTextClassName="text-center"
      />
    </View>
  );
}
