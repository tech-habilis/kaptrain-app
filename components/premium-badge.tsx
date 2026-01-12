import Text from "@/components/text";
import { View } from "react-native";
import IcLightning from "./icons/lightning";

interface PremiumBadgeProps {
  size?: "small" | "medium" | "large";
  variant?: "icon" | "text" | "full";
  className?: string;
}

export default function PremiumBadge({
  size = "medium",
  variant = "full",
  className = "",
}: PremiumBadgeProps) {
  const sizeClasses = {
    small: "px-2 py-0.5 gap-1",
    medium: "px-2.5 py-1 gap-1.5",
    large: "px-3 py-1.5 gap-2",
  };

  const iconSizes = {
    small: { width: 12, height: 12 },
    medium: { width: 14, height: 14 },
    large: { width: 16, height: 16 },
  };

  const textSizes = {
    small: "text-xs",
    medium: "text-sm",
    large: "text-base",
  };

  if (variant === "icon") {
    return (
      <View
        className={`bg-tertiary rounded-full items-center justify-center ${
          size === "small" ? "w-5 h-5" : size === "medium" ? "w-6 h-6" : "w-7 h-7"
        } ${className}`}
      >
        <IcLightning {...iconSizes[size]} color="white" />
      </View>
    );
  }

  if (variant === "text") {
    return (
      <View
        className={`bg-tertiary rounded-full items-center justify-center ${sizeClasses[size]} ${className}`}
      >
        <Text className={`${textSizes[size]} font-bold text-white`}>
          PREMIUM
        </Text>
      </View>
    );
  }

  return (
    <View
      className={`bg-tertiary rounded-full flex-row items-center ${sizeClasses[size]} ${className}`}
    >
      <IcLightning {...iconSizes[size]} color="white" />
      <Text className={`${textSizes[size]} font-bold text-white`}>
        PREMIUM
      </Text>
    </View>
  );
}

export function PremiumCard({
  title,
  description,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <View
      className={`bg-primary rounded-2xl p-4 ${className}`}
    >
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-1">
            <IcLightning size={20} color="white" />
            <Text className="text-lg font-bold text-white">{title}</Text>
          </View>
          {description && (
            <Text className="text-sm text-white opacity-90">
              {description}
            </Text>
          )}
        </View>
      </View>
      {children}
    </View>
  );
}

export function PremiumOverlay({
  title = "Fonctionnalité Premium",
  description = "Passe à Premium pour débloquer cette fonctionnalité",
  onUpgrade,
  className = "",
}: {
  title?: string;
  description?: string;
  onUpgrade?: () => void;
  className?: string;
}) {
  return (
    <View
      className={`absolute inset-0 bg-secondary/80 items-center justify-center z-10 ${className}`}
    >
      <View className="bg-white rounded-2xl p-6 mx-4 items-center max-w-sm">
        <View className="bg-tertiary rounded-full p-3 mb-4">
          <IcLightning size={24} color="white" />
        </View>
        <Text className="text-xl font-bold text-secondary text-center mb-2">
          {title}
        </Text>
        <Text className="text-base text-subtleText text-center mb-6">
          {description}
        </Text>
        {onUpgrade && (
          <View className="w-full">
            <button
              onClick={onUpgrade}
              className="bg-primary rounded-2xl p-4 w-full"
            >
              <Text className="text-base font-bold text-white text-center">
                Voir les offres Premium
              </Text>
            </button>
          </View>
        )}
      </View>
    </View>
  );
}