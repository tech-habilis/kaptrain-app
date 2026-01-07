import Button from "@/components/button";
import { Choice } from "@/components/choices";
import DatePicker from "@/components/date-picker";
import IcApple from "@/components/icons/apple";
import IcArrowLeft from "@/components/icons/arrow-left";
import IcCard from "@/components/icons/card";
import IcCheck from "@/components/icons/check";
import IcCheckbox from "@/components/icons/checkbox";
import IcCheckboxSelected from "@/components/icons/checkbox-selected";
import Input from "@/components/input";
import Text from "@/components/text";
import { ROUTE } from "@/constants/route";
import { router } from "expo-router";
import { useState } from "react";
import { ImageBackground, Pressable, ScrollView, View } from "react-native";
import { DateType } from "react-native-ui-datepicker";

export default function BuyExercise() {
  const [expirationDate, setExpirationDate] = useState<DateType>(null);
  const [saveCard, setSaveCard] = useState(false);

  return (
    <>
      <View className="bg-white flex-1">
        <ImageBackground source={require("../assets/images/today-session.png")}>
          <View className="flex flex-row gap-1 items-center pt-safe pb-6 px-4">
            <Pressable onPress={router.back} className="p-2">
              <IcArrowLeft color="white" />
            </Pressable>
            <Text className="text-lg font-bold text-white flex-1">
              Abdos à la maison
            </Text>
          </View>
        </ImageBackground>

        <ScrollView className="px-4 mt-6 pb-6 flex-1">
          <Text className="font-semibold text-text text-base">
            Choisir un moyen de paiement
          </Text>
          <Text className="text-subtleText text-base mt-1.5">
            Sélectionne le moyen de paiement qui te correspond le mieux.
          </Text>

          <Choice
            type="radio"
            choice={{
              text: "Carte de crédit",
            }}
            selected
            onPress={() => {}}
            className="mt-4"
          />

          <Button
            text="Apple Pay"
            type="secondaryV2"
            className="mt-2"
            leftIcon={<IcApple />}
          />

          <Input
            label="Nom sur la carte"
            placeholder="Sophie Dubois"
            className="mt-8"
          />
          <Input
            label="N° de carte de crédit"
            placeholder="**** **** **** ****"
            className="mt-8"
            rightIcon={<IcCard />}
          />

          <View className="mt-8 flex-row items-center gap-4">
            <Input
              label="Date d'expiration"
              placeholder="MM/AA"
              className="grow"
            />
            <Input label="Cryptogramme" placeholder="CVC" className="grow" />
          </View>

          <Button
            size="small"
            leftIcon={saveCard ? <IcCheckboxSelected /> : <IcCheckbox />}
            text="Enregistrer ma carte pour plus tard"
            type="tertiary"
            className="self-start px-0 pt-3.5 mb-50"
            textClassName="font-normal"
            onPress={() => setSaveCard(!saveCard)}
          />
        </ScrollView>
      </View>
      <View className="px-4 pt-6 pb-safe bg-light gap-4 absolute bottom-0 left-0 right-0">
        <View className="flex-row items-center justify-between">
          <Text className="text-secondary font-semibold text-base">Total</Text>
          <Text className="text-secondary font-semibold text-base">
            29,99 €
          </Text>
        </View>
        <Button text="Valider et payer" className="mb-6" onPress={() => router.replace(ROUTE.PAYMENT_CONFIRMED)} />
      </View>
    </>
  );
}
