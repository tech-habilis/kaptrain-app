import { Pressable, View } from "react-native";
import Text from "./text";
import cn from "@/utilities/cn";
import { clsx } from "clsx";
import { useState } from "react";

type TTab = string;

export default function Tabs({
  tabs,
  selected,
  onSelected,
  className = "",
  textClassName = "",
}: {
  tabs: TTab[];
  selected: TTab;
  onSelected: (tab: TTab) => void;
  className?: string;
  textClassName?: string;
}) {
  const [width, setWidth] = useState(0);

  return (
    <View
      onLayout={(event) => {
        setWidth(event.nativeEvent.layout.width);
      }}
      className={cn(
        "w-full flex-row mt-4 bg-white border border-stroke rounded-md justify-center items-center",
        className,
      )}
    >
      {tabs.map((tab, index) => (
        <Pressable
          key={index}
          className={clsx("p-3 items-center justify-center rounded-md", {
            "bg-secondary": tab === selected,
          })}
          style={{
            width: width / tabs.length,
          }}
          onPress={() => onSelected(tab)}
        >
          <Text
            className={clsx({ "text-white": tab === selected }, textClassName)}
          >
            {tab}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
