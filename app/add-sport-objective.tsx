import { Stack } from "expo-router";
import SportObjectiveForm from "@/components/sport-objective-form";

export default function AddSportObjectiveScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SportObjectiveForm
        mode="add"
        initialValues={{
          date: new Date()
        }}
        onSubmit={(data) => {
          console.log("Adding sport objective:", data);
          // TODO: Implement add sport objective logic
        }}
      />
    </>
  );
}
