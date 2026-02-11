import { View } from "react-native";

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

export default Stepper;
