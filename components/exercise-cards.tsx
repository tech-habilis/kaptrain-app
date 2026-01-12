import { Exercise } from "@/types";
import { Pressable, ScrollView, View } from "react-native";
import Text from "./text";
import IcClose from "./icons/close";

export default function ExerciseCards({
  exercises,
  onRemoveExercise,
}: {
  exercises: Exercise[];
  onRemoveExercise: (id: string) => void;
  }) {
  if (exercises.length === 0) {
    return null;
  }

  return (
    <View className="gap-3">
      <Text className="text-sm font-medium text-text">
        Exercices associés :
      </Text>
      <View className="relative">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2"
        >
          {exercises.map((exercise) => (
            <View
              key={exercise.id}
              className="border border-stroke rounded-xl overflow-hidden relative"
              style={{ width: 198.51, height: 145.63 }}
            >
              {/* Exercise Image */}
              <View className="absolute inset-0 bg-light">
                {/* Placeholder for image */}
                <View className="w-full h-full bg-light" />
              </View>

              {/* Gradient Overlay */}
              <View
                className="absolute inset-0"
                style={{
                  backgroundColor: "transparent",
                }}
              >
                <View
                  className="absolute inset-0"
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                  }}
                />
              </View>

              {/* Exercise Title */}
              <View className="absolute bottom-0 left-0 right-0 p-3">
                <View className="flex-row items-center gap-1">
                  <Text className="text-xs font-semibold text-white">
                    {exercise.title}
                  </Text>
                </View>
              </View>

              {/* Close Button */}
              <Pressable
                onPress={() => onRemoveExercise(exercise.id)}
                className="absolute top-3 right-3 w-5 h-5 items-center justify-center"
              >
                <IcClose size={18} color="white" />
              </Pressable>

              {/* Play Button Overlay */}
              <View className="absolute inset-0 items-center justify-center">
                <View
                  className="w-10 h-10 rounded-full items-center justify-center"
                  style={{
                    backgroundColor: "rgba(5, 24, 50, 0.15)",
                  }}
                >
                  <View
                    style={{
                      width: 0,
                      height: 0,
                      marginLeft: 2,
                      borderLeftWidth: 8,
                      borderTopWidth: 6,
                      borderBottomWidth: 6,
                      borderLeftColor: "white",
                      borderTopColor: "transparent",
                      borderBottomColor: "transparent",
                    }}
                  />
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
