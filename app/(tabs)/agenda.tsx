import Text from "@/components/text";
import { StatusBar } from "expo-status-bar";
import { ScrollView } from "react-native";

export default function Agenda() {
  return (
  <ScrollView className="pt-safe px-4">
    <StatusBar style="auto" />
    <Text className="font-semibold text-lg">Hello from agenda</Text>
  </ScrollView>
  );
}
