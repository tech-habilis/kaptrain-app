import { clsx } from "clsx";
import { useState } from "react";
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
  const [showMenu, setShowMenu] = useState(false);

  return (
    <View
      className={clsx("flex-row gap-4 items-center", {
        "-translate-x-18": showMenu,
      })}
    >
      <Pressable
        className={clsx(
          "border border-stroke rounded-xl p-3 flex-row items-center gap-2 w-full",
          {
            "opacity-50": isActive,
          }
        )}
        onLongPress={() => setShowMenu(!showMenu)}
        {...(drag && { onLongPress: drag })}
      >
        {/* Drag Handle */}
        <View className="size-8 rotate-90 items-center justify-center cla">
          <IcDrag size={24} />
        </View>

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

        {/* Drag Handle (right side) */}
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
      </Pressable>
      <ButtonIcon
        size="large"
        type="primary"
        className="bg-error/10 h-full rounded-md"
        onPress={() => {
          setShowMenu(false);
          onClickDelete();
        }}
      >
        <IcTrash />
      </ButtonIcon>
    </View>
  );
};

export default SessionBlock;
