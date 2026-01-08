import { View, Pressable } from "react-native";
import Text from "@/components/text";
import IcCheck from "@/components/icons/check";
import IcCheckbox from "@/components/icons/checkbox";
import IcArrowLeft from "@/components/icons/arrow-left";
import { ColorConst } from "@/constants/theme";
import { Exercise } from "@/types";
import ExerciseCards from "../exercise-cards";
import IcFile from "../icons/file";
import SessionNote from "../session-note";
import Button from "../button";
import IcPlus from "../icons/plus";
import { clsx } from "clsx";

interface SessionCardProps {
  title: string;
  description: string;
  isCompleted: boolean;
  onToggleComplete: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  exercises: Exercise[];
  haveNote?: boolean;
}

export function SessionCard({
  title,
  description,
  isCompleted,
  onToggleComplete,
  isExpanded,
  onToggleExpand,
  exercises,
  haveNote,
}: SessionCardProps) {
  return (
    <View className="p-3 gap-3 border border-stroke rounded-xl">
      <Pressable onPress={onToggleExpand}>
        <View className="flex-row gap-2 items-center">
          <Pressable onPress={onToggleComplete}>
            {isCompleted ? (
              <IcCheck size={24} color={ColorConst.success} />
            ) : (
              <IcCheckbox />
            )}
          </Pressable>
          <Text className="text-base font-semibold flex-1">{title}</Text>
          {!!haveNote && <IcFile />}
          <View
            className="transition-transform"
            style={{
              transform: [{ rotate: isExpanded ? "-90deg" : "90deg" }],
            }}
          >
            <IcArrowLeft color={ColorConst.subtleText} />
          </View>
        </View>
      </Pressable>
      {isExpanded && (
        <>
          <Text className="text-subtleText leading-6">{description}</Text>
          <ExerciseCards exercises={exercises} onRemoveExercise={(id) => {}} />
          <Button
            type="tertiary"
            size="small"
            text="Ajouter des exercices"
            leftIcon={<IcPlus size={24} color={ColorConst.secondary} />}
            onPress={() => {}}
            className={clsx({
              hidden: exercises.length > 0,
            })}
          />
          {haveNote && <SessionNote />}
        </>
      )}
    </View>
  );
}
