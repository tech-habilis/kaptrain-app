import { Chip } from "@/components/chip"
import { Choices } from "@/components/choices"
import IcClose from "@/components/icons/close"
import IcLightning from "@/components/icons/lightning"
import IcSearch from "@/components/icons/search"
import Input from "@/components/input"
import { ColorConst } from "@/constants/theme"
import { useSports } from "@/hooks/use-sports"
import { useCompleteProfileStore } from "@/stores/complete-profile-store"
import { TChoice } from "@/types"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import {
  ActivityIndicator,
  Image,
  Pressable,
  Text as RawText,
  ScrollView,
  View,
} from "react-native"

export function Step4() {
  const { i18n, t } = useTranslation()
  const { formData, updateStep4 } = useCompleteProfileStore()
  const { data: sports = [], isLoading, isError, error } = useSports()

  const lang = (i18n.language === "fr" ? "fr" : "en") as "en" | "fr"

  const choices: TChoice[] = useMemo(
    () =>
      sports.map((sport) => ({
        id: sport.id,
        text: sport.name[lang] || sport.name.en,
        leftIcon: sport.iconName ? (
          <Image
            source={{ uri: sport.iconName }}
            style={{ width: 24, height: 24 }}
            resizeMode="contain"
          />
        ) : (
          <IcLightning size={24} color={ColorConst.accent} />
        ),
      })),
    [sports, lang]
  )

  const [search, setSearch] = useState<string>("")

  const filteredChoices = useMemo(
    () =>
      choices.filter((x) =>
        x.text.toLowerCase().includes(search.toLowerCase())
      ),
    [choices, search]
  )

  const selectedChoices = choices.filter((c) =>
    formData.selectedSports?.includes(c.id)
  )

  const clearSearch = () => {
    setSearch("")
  }

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center py-12">
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center py-12">
        <RawText className="text-error text-sm text-center">
          {error?.message ?? t("common.error")}
        </RawText>
      </View>
    )
  }

  return (
    <>
      <View
        className={
          selectedChoices.length > 0 ? "flex-row flex-wrap gap-2 mt-6" : ""
        }
      >
        {selectedChoices.map((choice) => (
          <Chip
            key={choice.id}
            text={choice.text}
            type="selected"
            onLeftSidePress={() => {
              const updatedSports =
                formData.selectedSports?.filter((s) => s !== choice.id) || []
              updateStep4({ selectedSports: updatedSports })
            }}
          />
        ))}
      </View>

      {selectedChoices.length > 0 && (
        <RawText className="text-subtleText mt-2">
          {selectedChoices.length.toString()}{" "}
          {t("completeProfile.step4.selected")}{" "}
          {selectedChoices.length === 5
            ? t("completeProfile.step4.limitReached")
            : null}
        </RawText>
      )}

      <View className="flex-row gap-4 mt-6 items-center">
        <Input
          leftIcon={<IcSearch size={16} />}
          className="flex-1"
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
        />
        <Pressable onPress={clearSearch}>
          <IcClose color={ColorConst.accent} />
        </Pressable>
      </View>

      <ScrollView className="mt-4 mb-safe pb-28 android:pb-34">
        <Choices
          data={filteredChoices}
          type="multipleChoice"
          selectedChoices={selectedChoices}
          onChangeMultiple={(newChoices) => {
            const selectedSports = newChoices.map((c) => c.id)
            updateStep4({ selectedSports })
          }}
          maxChoice={5}
        />
      </ScrollView>
    </>
  )
}
