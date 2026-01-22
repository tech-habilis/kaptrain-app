import { useMemo, useState } from "react";
import { Image, View, Text } from "react-native";
export default function Avatar({
  name,
  url,
}: {
  name?: string | null;
  url?: string | null;
}) {
  const [imageFetchError, setImageFetchError] = useState(false);
  const initial = useMemo(() => name?.[0], [name]);

  return (
    <View className="rounded-lg border border-white size-14 bg-secondary items-center justify-center overflow-hidden">
      <Image
        source={{ uri: url || undefined }}
        className="size-14"
        onError={() => setImageFetchError(true)}
        onLoad={() => setImageFetchError(false)}
      />

      {imageFetchError && initial !== undefined && (
        <View className="absolute inset-0 items-center justify-center">
          <Text className="text-white uppercase text-3xl font-medium">
            {name?.[0]}
          </Text>
        </View>
      )}
    </View>
  );
}
