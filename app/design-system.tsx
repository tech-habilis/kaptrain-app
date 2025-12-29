import Button from "@/components/button";
import { Choices, TChoice } from "@/components/choices";
import Line from "@/components/line";
import { ROUTE } from "@/constants/route";
import { router } from "expo-router";
import { useState, ReactNode } from "react";
import { ScrollView, Text, View } from "react-native";

const components = [
  "Button",
  "Choices",
  "Switch",
  "Radio",
  "Checkbox",
] as const;
type ComponentType = (typeof components)[number];

const ChoicesExample = () => {
  const options = [
    { text: "Option 1", },
    { text: "Option 2", },
    { text: "Option 3", },
  ];

  const [option, setOption] = useState<TChoice>();

  const options2 = [
    { text: "Option 1", secondaryText: "Secondary text 1" },
    { text: "Option 2", secondaryText: "Secondary text 2" },
    { text: "Option 3", secondaryText: "Secondary text 3" },
  ];

  const [option2, setOption2] = useState<TChoice>();

  return (
    <View className="flex flex-col gap-4">
    </View>
  );
};

const componentMap: Record<ComponentType, ReactNode> = {
  Button: (
    <View className="flex flex-col gap-4">
      <Button text="Large primary" />
      <Button text="Large primary" disabled />
      <Button text="Small primary" size="small" />
      <Button text="Disabled small primary" size="small" disabled />
      <Button text="Large secondary" type="secondary" />
      <Button text="Disabled large secondary" type="secondary" disabled />
      <Button text="Small secondary" size="small" type="secondary" />
      <Button
        text="Disabled small secondary"
        size="small"
        type="secondary"
        disabled
      />
      <Button text="Large tertiary" type="tertiary" />
      <Button text="Large tertiary" type="tertiary" disabled />
      <Button text="Small tertiary" type="tertiary" size="small" />
      <Button
        text="Disabled small tertiary"
        type="tertiary"
        size="small"
        disabled
      />
    </View>
  ),
  Choices: <ChoicesExample />,
  Switch: <></>,
  Radio: <></>,
  Checkbox: <></>,
};

export default function DesignSystem() {
  const [selectedComponent, setSelectedComponent] =
    useState<ComponentType>("Button");

  return (
    <ScrollView className="px-4 my-safe">
      <Text className="text-2xl">Design System</Text>

      <ScrollView
        horizontal
        contentContainerClassName="flex flex-row gap-2 mt-4 h-12"
      >
        {components.map((component) => (
          <Button
            key={component}
            text={component}
            size="small"
            type={component === selectedComponent ? "primary" : "secondary"}
            onPress={() => setSelectedComponent(component)}
          />
        ))}
        <Button
          text="Sign In"
          size="small"
          type="secondary"
          onPress={() => router.push(ROUTE.SIGN_IN)}
        />
      </ScrollView>

      <Line className="my-4" />

      {componentMap[selectedComponent]}

      <View className="h-20" />
    </ScrollView>
  );
}
