import BasicScreen from "@/components/basic-screen"
import Button from "@/components/button"
import { Choices } from "@/components/choices"
import ChooseSubSport from "@/components/choose-sub-sport"
import DatePicker from "@/components/date-picker"
import IcClose from "@/components/icons/close"
import IcMuscular from "@/components/icons/muscular"
import IcPlus from "@/components/icons/plus"
import IcSearch from "@/components/icons/search"
import Input from "@/components/input"
import SportOptionItem from "@/components/sport-option-item"
import Text from "@/components/text"
import { ColorConst } from "@/constants/theme"
import { useAthleteSports, useSports } from "@/hooks/use-sports"
import { TChoice } from "@/types"
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Image, Pressable, View } from "react-native"
import { DateType } from "react-native-ui-datepicker"

export default function AddRecord() {
  const { i18n } = useTranslation()
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedSport, setSelectedSport] = useState<TChoice>()
  const today = new Date()
  const [date, setDate] = useState<DateType>(today)
  const chooseSportModalRef = useRef<BottomSheet>(null)
  const [iconErrorIds, setIconErrorIds] = useState<Set<string>>(new Set())
  const { data: athleteSports, isLoading, isError, error } = useAthleteSports()
  const { data: sports, isLoading: sportsLoading } = useSports()
  const [search, setSearch] = useState<string>("")
  const filteredSports = useMemo(() => {
    return sports
      ?.filter(
        (sport) =>
          !athleteSports?.some((athleteSport) => athleteSport.id === sport.id)
      )
      ?.filter((sport) =>
        i18n.language === "en"
          ? sport.name.en?.toLowerCase().includes(search.toLowerCase())
          : sport.name.fr?.toLowerCase().includes(search.toLowerCase())
      )
  }, [sports, search])

  const getTitle = () => {
    switch (currentStep) {
      case 0:
      default:
        return "Choisir un sport"
      case 1:
      case 2:
        return "Ajoute un record"
    }
  }

  const snapPoints = useMemo(() => ["80%"], [])

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <View className="flex-1">
            <View className="flex-1">
              <Choices
                numColumns={2}
                data={[
                  ...(athleteSports?.map((sport) => ({
                    id: sport.id,
                    text:
                      i18n.language === "en"
                        ? sport.name.en || sport.name.fr
                        : sport.name.fr || sport.name.en,
                    leftIcon:
                      sport.iconName && !iconErrorIds.has(sport.id) ? (
                        <Image
                          source={{ uri: sport.iconName }}
                          style={{ width: 24, height: 24 }}
                          resizeMode="contain"
                          onError={() =>
                            setIconErrorIds((prev) =>
                              new Set(prev).add(sport.id)
                            )
                          }
                        />
                      ) : (
                        <View className="size-6 bg-light rounded-full items-center justify-center">
                          <Text className="text-text text-sm font-medium">
                            {sport.name.en.charAt(0)}
                          </Text>
                        </View>
                      ),
                  })) ?? []),
                  {
                    id: "choose-other",
                    text: "Choisir un autre",
                    leftIcon: <IcPlus color={ColorConst.accent} size={24} />,
                  },
                ]}
                selectedChoice={selectedSport}
                onChange={(choice) => {
                  if (choice.id === "choose-other") {
                    chooseSportModalRef.current?.snapToIndex(0)
                  } else {
                    setSelectedSport(choice)
                    chooseSportModalRef.current?.snapToIndex(1)
                  }
                }}
              />
            </View>

            <Button
              text={renderCtaText()}
              className="mb-6"
              onPress={getCtaAction()}
            />

            <BottomSheet
              index={-1}
              ref={chooseSportModalRef}
              snapPoints={snapPoints}
              enableDynamicSizing={false}
              enablePanDownToClose={true}
            >
              <Text className="text-lg text-secondary font-bold">
                Choisir un sport
              </Text>
              {/* Search */}
              <View className="flex-row gap-3 items-center mb-6 mt-6">
                <Input
                  className="flex-1"
                  leftIcon={<IcSearch size={16} />}
                  inputClassName="text-sm"
                  value={search}
                  onChangeText={setSearch}
                />
                <Pressable
                  onPress={() => {
                    setSearch("")
                  }}
                >
                  <IcClose size={24} color={ColorConst.accent} />
                </Pressable>
              </View>

              <BottomSheetScrollView
                contentContainerClassName="gap-3 pb-safe"
                showsVerticalScrollIndicator={false}
              >
                {(filteredSports ?? []).map((sport) => {
                  const displayName =
                    i18n.language === "en"
                      ? sport.name.en || sport.name.fr
                      : sport.name.fr || sport.name.en
                  const isSelected = selectedSport?.id === sport.id

                  return (
                    <SportOptionItem
                      key={sport.id}
                      sport={{
                        id: sport.id,
                        name: displayName,
                        icon:
                          sport.iconName && !iconErrorIds.has(sport.id) ? (
                            <Image
                              source={{ uri: sport.iconName }}
                              style={{ width: 24, height: 24 }}
                              resizeMode="contain"
                              onError={() =>
                                setIconErrorIds((prev) =>
                                  new Set(prev).add(sport.id)
                                )
                              }
                            />
                          ) : (
                            <View className="size-6 bg-light rounded-full items-center justify-center">
                              <Text className="text-text text-sm font-medium">
                                {sport.name.en?.charAt(0) ?? "?"}
                              </Text>
                            </View>
                          ),
                      }}
                      isSelected={isSelected}
                      isDisabled={false}
                      onPress={() =>
                        setSelectedSport({
                          text: displayName,
                          id: sport.id,
                        })
                      }
                      isMultipleSelection={false}
                    />
                  )
                })}
              </BottomSheetScrollView>
              <Button
                text="Suivant"
                className="mb-6"
                onPress={() => {
                  chooseSportModalRef.current?.snapToIndex(-1)
                }}
              />
            </BottomSheet>
          </View>
        )
      case 1:
        return (
          <View className="flex-1">
            <ChooseSubSport sportId={selectedSport?.id ?? ""} />;
          </View>
        )
      case 2:
        return (
          <>
            {/* Sport and record label info */}
            <View className="flex-row gap-2 items-center">
              <IcMuscular size={32} />
              <View className="flex flex-col gap-2">
                <Text className="text-text text-base font-semibold">
                  Musculation
                </Text>
                <Text className="text-subtleText text-sm">Squat clavicule</Text>
              </View>
            </View>

            <Input
              label="Poids"
              placeholder="Entre le poids en kg"
              inputClassName="text-base font-normal"
              keyboardType="numeric"
              returnKeyType="done"
            />

            <DatePicker
              label="Date du record"
              selectedDate={date}
              onSelect={(selectedDate) => setDate(selectedDate)}
              maxDate={today}
            />
          </>
        )
    }
  }

  const renderCtaText = () => {
    switch (currentStep) {
      case 0:
      case 1:
        return "Suivant"
      case 2:
        return "Ajouter"
      default:
        return ""
    }
  }

  const getCtaAction = () => {
    switch (currentStep) {
      case 0:
        return () => setCurrentStep(1)
      case 1:
        return () => setCurrentStep(2)
      case 2:
        return () => {
          // Add record logic here
        }
      default:
        return () => {}
    }
  }

  return (
    <BasicScreen title={getTitle()} headerClassName="bg-white">
      <View className="gap-4 px-4 flex-1 pb-safe">
        <View className="flex-row gap-2">
          <View
            className={`grow h-2 rounded-full ${
              currentStep >= 0 ? "bg-secondary" : "bg-light"
            }`}
          />
          <View
            className={`grow h-2 rounded-full ${
              currentStep >= 1 ? "bg-secondary" : "bg-light"
            }`}
          />
          <View
            className={`grow h-2 rounded-full ${
              currentStep >= 2 ? "bg-secondary" : "bg-light"
            }`}
          />
        </View>

        {renderStep()}
      </View>
    </BasicScreen>
  )
}
