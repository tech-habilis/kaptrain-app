import { Pressable, View } from "react-native";
import Button from "./button";
import Text from "./text";
import cn from "@/utilities/cn";
import clsx from "clsx";

type TTab = string;

export default function Tabs({
  tabs,
  selected,
  onSelected,
  className = "",
}: {
  tabs: TTab[];
  selected: TTab;
  onSelected: (tab: TTab) => void;
  className?: string;
}) {
  return (
    <View
      className={cn(
        "flex-row mt-4 bg-white border border-stroke rounded-md justify-center items-center",
        className,
      )}
    >
      {tabs.map((tab, index) => (
        <Pressable
          key={index}
          className={clsx("p-3 w-1/3 items-center justify-center rounded-md", {
            "bg-secondary": tab === selected,
          })}
          onPress={() => onSelected(tab)}
        >
          <Text className={clsx({ "text-white": tab === selected })}>
            {tab}
          </Text>
        </Pressable>
      ))}
      {/*{tabs.map((tab, index) => (
        <Button
          key={index}
          text={tab}
          type={tab === selected ? "primary" : "secondaryV2"}
          onPress={() => onSelected(tab)}
        />
      ))}*/}
    </View>
  );
}
