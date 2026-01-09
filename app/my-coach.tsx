import BasicScreen from "@/components/basic-screen";
import Button from "@/components/button";
import SingleFab from "@/components/fab";
import IcChat from "@/components/icons/chat";
import IcPlus from "@/components/icons/plus";
import Input from "@/components/input";
import Text from "@/components/text";
import { ColorConst } from "@/constants/theme";
import cn from "@/utilities/cn";
import { useState } from "react";
import { View, Image } from "react-native";

const CoachCard = ({ className = "" }: { className?: string }) => {
  return (
    <View className={cn("bg-white border border-stroke p-3", className)}>
      <Text className="text-text text-base font-semibold">Coach actuel</Text>

      <View className="flex-row items-center mt-3">
        <Image
          source={require("../assets/images/coach-avatar.png")}
          className="size-9 bg-light p-0.5 rounded-full z-10"
        />
        <Text className="bg-light pl-3 pr-2 py-0.5 -ml-2 text-text text-sm">
          Enguerrand Aucher
        </Text>
      </View>

      <Text className="mt-4 text-sm text-subtleText">Depuis le 07/04/2019</Text>
    </View>
  );
};

export default function MyCoach() {
  const [invitationCode, setInvitationCode] = useState("");

  return (
    <BasicScreen title="Mon coach">
      <View className="px-4">
        <CoachCard className="mt-6 rounded-2xl" />

        <View className="border border-b border-stroke my-6" />

        <Text className="text-secondary font-bold text-base">
          Demande d’invitation. Renseigne ton code ici
        </Text>

        <Input
          label="Ton code d’invitation"
          placeholderTextColor={ColorConst.subtleText}
          placeholder="EX : JNKMD701"
          className="mt-3"
          inputClassName="font-semibold uppercase"
          value={invitationCode}
          onChangeText={setInvitationCode}
        />

        <Button
          disabled={invitationCode.length === 0}
          className="mt-3"
          size="large"
          text="Se connecter à mon coach"
        />
      </View>

      <SingleFab className="mb-safe" icon={<IcChat />} onPress={() => {}} />
    </BasicScreen>
  );
}
