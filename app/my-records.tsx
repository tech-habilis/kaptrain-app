import BasicScreen from "@/components/basic-screen"
import Button from "@/components/button"
import IcArrowRight from "@/components/icons/arrow-right"
import Text from "@/components/text"
import { ROUTE } from "@/constants/route"
import { ColorConst } from "@/constants/theme"
import { useAthleteSports } from "@/hooks/use-sports"
import { TSport } from "@/types/sport.type"
import { router } from "expo-router"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import {
  ActivityIndicator,
  Image,
  Pressable,
  Text as RawText,
  ScrollView,
  View,
} from "react-native"

function SportRecordCard({ sport }: { sport: TSport }) {
  const { i18n } = useTranslation()
  const lang = (i18n.language === "fr" ? "fr" : "en") as "en" | "fr"
  const sportName = sport.name[lang] || sport.name.en
  const recordCount = sport.records?.length ?? 0
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    setImageError(false)
  }, [sport.iconName])

  const icon =
    sport.iconName && !imageError ? (
      <Image
        source={{ uri: sport.iconName }}
        style={{ width: 24, height: 24 }}
        resizeMode="contain"
        onError={() => setImageError(true)}
      />
    ) : (
      <View className="size-6 bg-light rounded-full items-center justify-center">
        <Text className="text-text text-sm font-medium">
          {sportName.charAt(0)}
        </Text>
      </View>
    )

  return (
    <Pressable
      className="bg-white border border-stroke rounded-xl p-3 flex-row items-center gap-2"
      onPress={() =>
        router.push({
          pathname: ROUTE.RECORD_DETAIL,
          params: { sport: sport.id },
        })
      }
    >
      <View className="flex-1 flex-col gap-1">
        <View className="flex-row items-center gap-1.5">
          {icon}
          <Text className="text-secondary text-base font-semibold">
            {sportName}
          </Text>
        </View>
        <Text className="text-subtleText text-sm">
          {recordCount > 0
            ? `${recordCount} records enregistrés`
            : "Aucun record"}
        </Text>
      </View>
      <IcArrowRight size={24} color={ColorConst.accent} />
    </Pressable>
  )
}

export default function MyRecordsScreen() {
  const {
    data: athleteSports = [],
    isLoading,
    isError,
    error,
  } = useAthleteSports({
    withRecords: true,
  })

  return (
    <BasicScreen
      title="Mes records"
      description="Consulte ou ajoute un record pour suivre ta progression au fil du temps"
      headerClassName="bg-light"
    >
      <ScrollView className="flex-1 px-4 pt-6 pb-48">
        {isLoading ? (
          <View className="flex-1 justify-center items-center py-12">
            <ActivityIndicator size="large" />
          </View>
        ) : isError ? (
          <View className="flex-1 justify-center items-center py-12">
            <RawText className="text-error text-sm text-center">
              {error?.message ?? "Une erreur est survenue"}
            </RawText>
          </View>
        ) : (
          <View className="flex flex-col gap-2">
            {athleteSports.map((sport) => (
              <SportRecordCard key={sport.id} sport={sport} />
            ))}
          </View>
        )}
      </ScrollView>

      {/* CTA with gradient overlay */}
      <View className="absolute bottom-0 left-0 right-0 px-4 pb-safe pt-8 bg-linear-to-t from-white via-white to-transparent">
        <Button
          type="secondary"
          text="Ajouter un record"
          onPress={() => router.push(ROUTE.ADD_RECORD)}
          className="mb-6"
        />
      </View>
    </BasicScreen>
  )
}
