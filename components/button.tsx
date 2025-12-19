import cn from "@/utilities/cn";
import { ComponentProps } from "react";
import { Pressable, PressableProps, Text } from "react-native";
import { tv } from "tailwind-variants";

const button = tv({
  base: "font-bold flex justify-center items-center",
  variants: {
    type: {
      primary: "bg-primary",
      secondary: "bg-light border-2 border-primary",
      tertiary: "bg-transparent",
    },
    size: {
      small: "rounded-lg px-3 h-10",
      large: "rounded-2xl px-4 h-14",
    },
    disabled: {
      true: "opacity-40",
      false: "active:opacity-80",
    },
  },
  compoundVariants: [
    {
      size: ["small", "large"],
      class: "",
    },
  ],
  defaultVariants: {
    size: "large",
    type: "primary",
    disabled: false,
  },
});

const buttonText = tv({
  base: "text-white text-center font-bold",
  variants: {
    type: {
      primary: "text-white",
      secondary: "",
      tertiary: "",
    },
    size: {
      small: "text-sm",
      large: "text-base",
    },
  },
  compoundVariants: [
    {
      type: "tertiary",
      size: "small",
      class: "font-medium",
    },
    {
      type: ["secondary", "tertiary"],
      class: "text-secondary",
    },
  ],
  defaultVariants: {
    type: "primary",
  },
});

export default function Button({
  className = "",
  text,
  size,
  type,
  disabled,
  ...props
}: Omit<PressableProps, "children"> &
  ComponentProps<typeof button> & {
    text?: string;
    children?: PressableProps["children"];
  }) {
  return (
    <Pressable
      className={cn(button({ size, type, disabled }), className)}
      {...props}
    >
      <Text className={cn(buttonText({ size, type }))}>{text}</Text>
    </Pressable>
  );
}
