import cn from "@/utilities/cn";
import { Link, LinkProps } from "expo-router";
import { ComponentProps } from "react";
import {
  View,
  Pressable,
  PressableProps,
  ActivityIndicator,
} from "react-native";
import { tv, VariantProps } from "tailwind-variants";
import Text from "./text";
import { ColorConst } from "@/constants/theme";

const button = tv({
  base: "font-bold flex flex-row justify-center items-center",
  variants: {
    type: {
      primary: "bg-primary",
      secondary: "bg-light border-2 border-primary",
      tertiary: "",
      link: "",
      secondaryV2: "border border-stroke",
    },
    size: {
      small: "rounded-lg px-3",
      large: "rounded-2xl p-4",
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
    {
      type: "link",
      size: "small",
      className: "px-0 h-fit",
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
      link: "text-primary font-semibold",
      secondaryV2: "text-secondary-500",
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

type ButtonVariants = VariantProps<typeof button>;

export default function Button({
  className = "",
  text,
  size,
  type,
  disabled,
  leftIcon,
  loading,
  ...props
}: Omit<PressableProps, "children"> &
  ComponentProps<typeof button> & {
    text: string;
    leftIcon?: React.ReactNode;
    loading?: boolean;
  }) {
  const loadingColorMap: Record<
    Exclude<ButtonVariants["type"], undefined>,
    string
  > = {
    primary: "white",
    secondary: "white",
    tertiary: "white",
    link: ColorConst.primary,
    secondaryV2: ColorConst.secondary500,
  };

  return (
    <Pressable
      className={cn(button({ size, type, disabled }), className)}
      {...props}
    >
      {/* render leftIcon */}
      {leftIcon && <View className="mr-2.5">{leftIcon}</View>}

      {/* render loading icon ONLY if no leftIcon */}
      {loading && !leftIcon && (
        <ActivityIndicator
          size="small"
          color={loadingColorMap[type || "primary"]}
          className="mr-2.5"
        />
      )}

      <Text className={cn(buttonText({ size, type }))}>{text}</Text>
    </Pressable>
  );
}

export function ButtonLink({
  className = "",
  textClassName = "",
  text = "",
  size,
  disabled,
  ...props
}: Omit<LinkProps, "children"> & {
  text: string;
  size: "small" | "large";
  textClassName?: string;
}) {
  return (
    <Link
      className={cn(button({ size, type: "link", disabled }), className)}
      {...props}
    >
      <Text className={cn(buttonText({ size, type: "link" }), textClassName)}>
        {text}
      </Text>
    </Link>
  );
}
