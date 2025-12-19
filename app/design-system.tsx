import Button from "@/components/button";
import Line from "@/components/line";
import { ScrollView, Text, View } from "react-native";

export default function DesignSystem() {
  return (
    <ScrollView className="my-safe p-4">
      <Text className="text-2xl">Design System</Text>

      <Line className="my-4" />

      <View className="flex flex-col gap-4">
        <Text className="text-lg">Button</Text>
        <Button text="large primary" />
        <Button text="large primary" disabled />
        <Button text="small primary" size='small' />
        <Button text="disabled small primary" size='small' disabled />
        <Button text="large secondary" type="secondary" />
        <Button text="disabled large secondary" type="secondary" disabled />
        <Button text="small secondary" size='small' type="secondary" />
        <Button
          text="disabled small secondary"
          size='small'
          type="secondary"
          disabled
        />
        <Button text="large tertiary" type="tertiary" />
        <Button text="large tertiary" type="tertiary" disabled />
        <Button text="small tertiary" type="tertiary" size='small' />
        <Button text="disabled small tertiary" type="tertiary" size='small' disabled />
      </View>
    </ScrollView>
  );
}
