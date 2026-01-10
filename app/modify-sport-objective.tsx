import { useLocalSearchParams } from "expo-router";
import SportObjectiveForm from "@/components/sport-objective-form";

export default function ModifySportObjectiveScreen() {
  const params = useLocalSearchParams();
  const objectiveId = params.id as string;

  // TODO: Fetch sport objective data based on ID
  const mockObjective = {
    type: "event" as const,
    title: "Marathon de Paris 2026",
    date: new Date(),
    selectedSports: ["Course à pied"],
  };

  return (
    <SportObjectiveForm
      mode="edit"
      initialValues={mockObjective}
      onSubmit={(data) => {
        console.log("Updating sport objective:", objectiveId, data);
        // TODO: Implement update sport objective logic
      }}
      onDelete={() => {
        console.log("Deleting sport objective:", objectiveId);
        // TODO: Implement delete sport objective logic
      }}
    />
  );
}
