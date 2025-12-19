import cn from "@/utilities/cn";
import { View } from "react-native";

export default function Line({ className = '' }: { className?: string }) {
  return <View className={cn(`border-b border-black`, className)} />;
}
