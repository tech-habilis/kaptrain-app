import Text from "@/components/text";
import IcCheck from "@/components/icons/check";
import { ColorConst } from "@/constants/theme";
import { Pressable, View } from "react-native";
import { tv } from "tailwind-variants";

interface PlanCardProps {
  title: string;
  subtitle?: string;
  price: string;
  period: string;
  priceSubtext?: string;
  selected: boolean;
  onPress: () => void;
  badge?: string;
  badgeColor?: "primary" | "tertiary" | "success";
  recommended?: boolean;
  className?: string;
}

const badgeVariants = tv({
  base: "rounded-full px-2 py-0.5",
  variants: {
    color: {
      primary: "bg-primary",
      tertiary: "bg-tertiary",
      success: "bg-success",
    },
  },
  defaultVariants: {
    color: "tertiary",
  },
});

export default function PlanCard({
  title,
  subtitle,
  price,
  period,
  priceSubtext,
  selected,
  onPress,
  badge,
  badgeColor = "tertiary",
  recommended = false,
  className = "",
}: PlanCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-2xl border-2 overflow-hidden ${
        selected ? "border-primary bg-light" : "border-stroke bg-white"
      } ${className}`}
    >
      {/* Recommended Badge Bar */}
      {recommended && (
        <View className="bg-primary py-1.5 px-3 items-center">
          <Text className="text-xs font-bold text-white">
            ⭐ RECOMMANDÉ
          </Text>
        </View>
      )}

      <View className="p-4">
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            {/* Title and Badge */}
            <View className="flex-row items-center gap-2 mb-1">
              <Text className="text-lg font-bold text-secondary">{title}</Text>
              {badge && (
                <View className={badgeVariants({ color: badgeColor })}>
                  <Text className="text-xs font-bold text-white">{badge}</Text>
                </View>
              )}
            </View>

            {/* Subtitle */}
            {subtitle && (
              <Text className="text-sm text-subtleText mb-3">{subtitle}</Text>
            )}

            {/* Price */}
            <View className="flex-row items-baseline gap-1">
              <Text className="text-3xl font-bold text-secondary">{price}</Text>
              <Text className="text-base text-subtleText">{period}</Text>
            </View>

            {/* Price Subtext */}
            {priceSubtext && (
              <Text className="text-sm text-primary font-semibold mt-1">
                {priceSubtext}
              </Text>
            )}
          </View>

          {/* Selection Radio */}
          <View
            className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
              selected ? "border-primary bg-primary" : "border-stroke"
            }`}
          >
            {selected && <IcCheck size={14} color="white" />}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export function PlanFeatureItem({
  text,
  included = true,
  className = "",
}: {
  text: string;
  included?: boolean;
  className?: string;
}) {
  return (
    <View className={`flex-row items-start gap-3 ${className}`}>
      <View className="mt-0.5">
        <IcCheck
          size={20}
          color={included ? ColorConst.success : ColorConst.subtleText}
        />
      </View>
      <Text
        className={`flex-1 text-sm ${
          included ? "text-secondary" : "text-subtleText"
        }`}
      >
        {text}
      </Text>
    </View>
  );
}

export function PlanComparisonTable({
  features,
  className = "",
}: {
  features: {
    name: string;
    free: boolean;
    premium: boolean;
  }[];
  className?: string;
}) {
  return (
    <View className={`border border-stroke rounded-2xl overflow-hidden ${className}`}>
      {/* Header */}
      <View className="flex-row bg-light p-4 border-b border-stroke">
        <View className="flex-1">
          <Text className="text-sm font-semibold text-secondary">
            Fonctionnalité
          </Text>
        </View>
        <View className="w-20 items-center">
          <Text className="text-sm font-semibold text-subtleText">Gratuit</Text>
        </View>
        <View className="w-20 items-center">
          <Text className="text-sm font-semibold text-primary">Premium</Text>
        </View>
      </View>

      {/* Feature Rows */}
      {features.map((feature, index) => (
        <View
          key={index}
          className={`flex-row p-4 ${
            index !== features.length - 1 ? "border-b border-stroke" : ""
          }`}
        >
          <View className="flex-1">
            <Text className="text-sm text-secondary">{feature.name}</Text>
          </View>
          <View className="w-20 items-center justify-center">
            {feature.free ? (
              <IcCheck size={20} color={ColorConst.success} />
            ) : (
              <View className="w-5 h-0.5 bg-subtleText rounded-full" />
            )}
          </View>
          <View className="w-20 items-center justify-center">
            {feature.premium ? (
              <IcCheck size={20} color={ColorConst.success} />
            ) : (
              <View className="w-5 h-0.5 bg-subtleText rounded-full" />
            )}
          </View>
        </View>
      ))}
    </View>
  );
}