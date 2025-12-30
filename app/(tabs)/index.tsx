import Button from "@/components/button";
import { ROUTE } from "@/constants/route";
import { router } from "expo-router";
import { ScrollView } from "react-native";

export default function HomeScreen() {
  return (
    <ScrollView className="bg-white py-safe">
      <Button
        type="secondary"
        text="Renseigner ma forme du jour"
        className="mx-4"
        onPress={() => router.push(ROUTE.WELLNESS)}
      />
    </ScrollView>
  );
}
