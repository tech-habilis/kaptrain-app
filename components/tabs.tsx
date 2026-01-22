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
  tabClassName = "",
  textClassName = "",
  selectedClassName = "bg-secondary",
  selectedTextClassName = "text-white",
  selectedStyle,
}: {
  tabs: TTab[];
  selected: TTab;
  onSelected: (tab: TTab) => void;
    className?: string;
  tabClassName?: string;
  textClassName?: string;
  selectedClassName?: string;
  selectedTextClassName?: string;
  selectedStyle?: object;
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
          className={clsx("p-3 items-center justify-center rounded-md", tabClassName, {
            [selectedClassName]: tab === selected,
          })}
          style={{
            width: width / tabs.length,
            ...(tab === selected && selectedStyle ? selectedStyle : {}),
          }}
          onPress={() => onSelected(tab)}
        >
          <Text
            className={clsx(textClassName, {
              [selectedTextClassName]: tab === selected,
            })}
          >
            {tab}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
