import { SessionNoteCardProps } from "@/types";
import { Pressable, View } from "react-native";
import Text from "./text";
import SessionNote from "./session-note";
import IcArrowLeft from "./icons/arrow-left";
import { ColorConst } from "@/constants/theme";
import { Chip } from "./chip";

export default function SessionNoteCard({
  sessionTitle,
  date,
  notes,
  isExpanded,
  onToggleExpand,
}: SessionNoteCardProps & {
  isExpanded: boolean;
  onToggleExpand: () => void;
}) {
  return (
    <View className="p-3 gap-3 border border-stroke rounded-xl">
      <Pressable onPress={onToggleExpand}>
        <View className="flex-row gap-2 items-center">
          <Text className="text-base font-semibold flex-1">{sessionTitle}</Text>
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
          <Chip text={`Séance du ${date}`} className="bg-light self-start" />
          {notes.map((note, index) => (
            <SessionNote key={index} {...note} />
          ))}
        </>
      )}
    </View>
  );
}
