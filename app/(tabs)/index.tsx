import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import cn from "@/utilities/cn";
import { Link } from "expo-router";
import { ScrollView } from "react-native";

export default function HomeScreen() {

  return (
    <ScrollView>
      <ThemedView
        className="flex gap-6 px-6 py-safe bg-red-500"
      >
        <ThemedText type="title">menu.home</ThemedText>
        <ThemedText type="subtitle">This is subtitle</ThemedText>
        <ThemedText type="defaultSemiBold">This is default text but bolder</ThemedText>
        <ThemedText className={cn("text-2xl italic", "font-bold")}>This is text with tailwind styling</ThemedText>
        <ThemedText type="default">common.helloWorld</ThemedText>
        <Link href="/profile">
          <ThemedText type="link">Click here! it&apos;s a link to profile!</ThemedText>
        </Link>
      </ThemedView>
    </ScrollView>
  );
}
