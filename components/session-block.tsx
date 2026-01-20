import { clsx } from "clsx";
import { View, Pressable } from "react-native";
import Text from "./text";
import IcDrag from "./icons/drag";
import { Chip } from "./chip";
import { ButtonIcon } from "./button";
import IcPencil from "./icons/pencil";
import { router } from "expo-router";
import { ROUTE } from "@/constants/route";
import IcTrash from "./icons/trash";
import type { SessionBlockData } from "@/stores/create-session-store";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const DELETE_BUTTON_WIDTH = 72; // Width of the delete button
const SNAP_THRESHOLD = 50; // Threshold to snap to delete button position

const SessionBlock = ({
  block,
  onClickDelete,
  drag,
  isActive,
}: {
  block: SessionBlockData;
  onClickDelete: () => void;
  drag?: () => void;
  isActive?: boolean;
}) => {
  const translateX = useSharedValue(0);

  const pan = Gesture.Pan()
    .onStart(() => {
      // Gesture started
    })
    .onUpdate((event) => {
      // Only allow swipe left (negative translation)
      // And limit swipe right to 0
      const newTranslateX = Math.min(0, event.translationX);

      // Limit the swipe to the delete button width
      translateX.value = Math.max(-DELETE_BUTTON_WIDTH, newTranslateX);
    })
    .onEnd(() => {
      // Snap to either 0 (hidden) or -DELETE_BUTTON_WIDTH (revealed)
      if (translateX.value < -SNAP_THRESHOLD) {
        translateX.value = withSpring(-DELETE_BUTTON_WIDTH);
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View className="flex-row items-center" style={{ position: "relative" }}>
      {/* Delete Button - Positioned absolutely on the right, behind the content */}
      <View
        style={{
          position: "absolute",
          right: 0,
          width: DELETE_BUTTON_WIDTH,
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 0,
        }}
      >
        <ButtonIcon
          size="large"
          type="primary"
          className="bg-error/10 h-full rounded-md"
          onPress={() => {
            translateX.value = withSpring(0);
            onClickDelete();
          }}
        >
          <IcTrash />
        </ButtonIcon>
      </View>

      {/* Swipable Content - Sits on top with higher z-index */}
      <GestureDetector gesture={pan}>
        <Animated.View
          className={clsx(
            "border border-stroke rounded-xl p-3 flex-row items-center gap-2 w-full",
            {
              "opacity-50": isActive,
            },
          )}
          style={[animatedStyle, { zIndex: 1, backgroundColor: "white" }]}
        >
          {/* Drag Handle - separate from swipe gesture */}
          <Pressable
            onPressIn={drag}
            className="size-8 rotate-90 items-center justify-center"
          >
            <IcDrag size={24} />
          </Pressable>

          {/* Block Content */}
          <View className="flex-1 gap-1">
            <Text
              numberOfLines={1}
              className="text-sm font-semibold text-secondary leading-6"
            >
              {block.title}
            </Text>

            {/* Exercise Count Tag */}
            <View className="flex-row">
              <Chip
                text={`${block.exercises.length} exercices`}
                type="default"
                className="bg-light border-0"
              />
            </View>
          </View>

          {/* Edit Button */}
          <Pressable
            className="size-8"
            onPress={() =>
              router.push({
                pathname: ROUTE.ADD_BLOCK,
                params: { mode: "edit", blockId: block.id },
              })
            }
          >
            <IcPencil size={24} />
          </Pressable>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default SessionBlock;
