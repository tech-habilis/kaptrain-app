import Button from "@/components/button";
import IcArrowLeft from "@/components/icons/arrow-left";
import IcPlus from "@/components/icons/plus";
import Input from "@/components/input";
import Text from "@/components/text";
import { ColorConst } from "@/constants/theme";
import { ROUTE } from "@/constants/route";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, View, TouchableOpacity } from "react-native";
import DatePicker from "@/components/date-picker";
import { DateType } from "react-native-ui-datepicker";
import { StatusBar } from "expo-status-bar";

interface ChoiceChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

const ChoiceChip = ({ label, selected, onPress }: ChoiceChipProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`px-2 py-3 rounded-lg flex-1 items-center justify-center min-h-12 ${
        selected
          ? "bg-light border-2 border-primary"
          : "bg-white border border-stroke"
      }`}
    >
      <Text
        className={`text-sm font-medium text-center ${
          selected ? "text-text" : "text-subtleText"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const Stepper = ({ current, total }: { current: number; total: number }) => {
  return (
    <View className="flex-row gap-2 py-4">
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          className={`flex-1 h-2 rounded-full ${
            index < current ? "bg-secondary" : "bg-light"
          }`}
        />
      ))}
    </View>
  );
};

export default function CreateSession() {
  const [selectedTheme, setSelectedTheme] = useState<string>("Sports");
  const [selectedSports, setSelectedSports] = useState<string[]>(["Cyclisme"]);
  const [selectedDate, setSelectedDate] = useState<DateType>(
    new Date("2025-04-25"),
  );
  const [startTime, setStartTime] = useState<string>("10:00");
  const [endTime, setEndTime] = useState<string>("11:00");

  const themes = [
    "Sports",
    "Mobilité & Stretching",
    "Préparation physique",
    "Kinésithérapie & Réaltérisation",
  ];

  const sports = ["Aviron", "Course à pied", "Cyclisme"];

  const toggleSport = (sport: string) => {
    if (selectedSports.includes(sport)) {
      setSelectedSports(selectedSports.filter((s) => s !== sport));
    } else {
      setSelectedSports([...selectedSports, sport]);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="auto" />
      {/* Header */}
      <View className="px-4 pt-safe">
        <View className="flex-row items-center py-2">
          <Pressable onPress={router.back} className="p-2">
            <IcArrowLeft color={ColorConst.secondary} />
          </Pressable>
          <Text className="text-lg font-bold text-secondary flex-1 ml-1">
            Créer une séance
          </Text>
        </View>

        {/* Stepper */}
        <Stepper current={1} total={2} />
      </View>

      {/* Main Content */}
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-32 pt-2"
        showsVerticalScrollIndicator={false}
      >
        {/* Thématique Section */}
        <View className="gap-3 mb-6">
          <Text className="text-sm font-medium text-accent">Thématique</Text>
          <View className="gap-2">
            <View className="flex-row gap-2">
              <ChoiceChip
                label={themes[0]}
                selected={selectedTheme === themes[0]}
                onPress={() => setSelectedTheme(themes[0])}
              />
              <ChoiceChip
                label={themes[1]}
                selected={selectedTheme === themes[1]}
                onPress={() => setSelectedTheme(themes[1])}
              />
            </View>
            <View className="flex-row gap-2">
              <ChoiceChip
                label={themes[2]}
                selected={selectedTheme === themes[2]}
                onPress={() => setSelectedTheme(themes[2])}
              />
              <ChoiceChip
                label={themes[3]}
                selected={selectedTheme === themes[3]}
                onPress={() => setSelectedTheme(themes[3])}
              />
            </View>
          </View>
        </View>

        {/* Sports Section */}
        <View className="gap-3 mb-6">
          <Text className="text-sm font-medium text-accent">Sports</Text>
          <View className="gap-2">
            <View className="flex-row gap-2">
              <ChoiceChip
                label={sports[0]}
                selected={selectedSports.includes(sports[0])}
                onPress={() => toggleSport(sports[0])}
              />
              <ChoiceChip
                label={sports[1]}
                selected={selectedSports.includes(sports[1])}
                onPress={() => toggleSport(sports[1])}
              />
            </View>
            <View className="flex-row gap-2">
              <ChoiceChip
                label={sports[2]}
                selected={selectedSports.includes(sports[2])}
                onPress={() => toggleSport(sports[2])}
              />
              <Button
                type="tertiary"
                size="small"
                text="Ajouter un sport"
                className="flex-1 min-h-12"
                leftIcon={<IcPlus size={24} color={ColorConst.secondary} />}
                onPress={() => {
                  // Handle add sport action
                }}
              />
            </View>
          </View>
        </View>

        {/* Date & Time Section */}
        <View className="gap-3">
          <Text className="text-sm font-medium text-accent">Date & Heure</Text>

          {/* Date Input */}
          <View className="flex-row items-center gap-2">
            <Text className="text-sm font-medium text-accent w-6">Le</Text>
            <View className="flex-1">
              <DatePicker
                label="25/04/2025"
                selectedDate={selectedDate}
                onSelect={setSelectedDate}
                className="w-full"
              />
            </View>
          </View>

          {/* Time Range Input */}
          <View className="flex-row items-center gap-2">
            <Text
              className="text-sm font-medium text-accent"
              style={{ width: 24 }}
            >
              De
            </Text>
            <View className="flex-1">
              <Input
                value={startTime}
                onChangeText={setStartTime}
                placeholder="10:00"
                inputClassName="text-center text-base"
              />
            </View>
            <Text
              className="text-sm font-medium text-accent text-center"
              style={{ width: 16 }}
            >
              à
            </Text>
            <View className="flex-1">
              <Input
                value={endTime}
                onChangeText={setEndTime}
                placeholder="11:00"
                inputClassName="text-center text-base"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View className="absolute bottom-0 left-0 right-0 bg-white px-4 pt-6 pb-safe">
        <Button
          text="Continuer"
          type="primary"
          size="large"
          onPress={() => {
            // Navigate to step 2
            router.push(ROUTE.TABS);
          }}
        />
      </View>
    </View>
  );
}
