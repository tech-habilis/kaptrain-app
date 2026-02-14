import BasicScreen from "@/components/basic-screen"
import BottomSheetModal, {
  RawBottomSheetModalType,
} from "@/components/bottom-sheet-modal"
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
import { ALL_SPORTS, mockSports } from "@/constants/mock"
import { ColorConst } from "@/constants/theme"
import { TChoice } from "@/types"
import { useRef, useState } from "react"
import { Pressable, View } from "react-native"
import { DateType } from "react-native-ui-datepicker"

export default function AddRecord() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedSport, setSelectedSport] = useState<TChoice>()

  const today = new Date()
  const [date, setDate] = useState<DateType>(today)

  const chooseSportModalRef = useRef<RawBottomSheetModalType>(null)

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

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <View className="gap-3">
            <Choices
              numColumns={2}
              data={mockSports}
              selectedChoice={selectedSport}
              onChange={setSelectedSport}
            />
            <Button
              text="Choisir un autre"
              leftIcon={<IcPlus color={ColorConst.accent} size={24} />}
              type="tertiary"
              onPress={() => chooseSportModalRef.current?.present()}
            />

            <BottomSheetModal
              ref={chooseSportModalRef}
              name="choose-sport-modal"
              snapPoints={["85%"]}
            >
              <View className="flex-1 pb-safe">
                <Text className="text-lg text-secondary font-bold">
                  Choisir un sport
                </Text>
                {/* Search */}
                <View className="flex-row gap-3 items-center mb-6 mt-6">
                  <Input
                    className="flex-1"
                    leftIcon={<IcSearch size={16} />}
                    inputClassName="text-sm"
                  />
                  <Pressable onPress={() => {}}>
                    <IcClose size={24} color={ColorConst.accent} />
                  </Pressable>
                </View>

                {/* Sports List */}
                <View className="flex-col gap-2">
                  {ALL_SPORTS.map((sport) => {
                    const isSelected = selectedSport?.text === sport.name

                    return (
                      <SportOptionItem
                        key={sport.id}
                        sport={sport}
                        isSelected={isSelected}
                        isDisabled={false}
                        onPress={() =>
                          setSelectedSport({
                            text: sport.name,
                            id: sport.id,
                          })
                        }
                        isMultipleSelection={false}
                      />
                    )
                  })}
                </View>

                <View className="grow" />
                <Button
                  text="Suivant"
                  className="mb-6"
                  onPress={() => {
                    chooseSportModalRef.current?.dismiss()
                    setCurrentStep(1)
                  }}
                />
              </View>
            </BottomSheetModal>
          </View>
        )
      case 1:
        return (
          <View className="flex-1">
            <ChooseSubSport sportId={ALL_SPORTS[0].id} />;
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

        <Button
          text={renderCtaText()}
          className="mb-6"
          onPress={getCtaAction()}
        />
      </View>
    </BasicScreen>
  )
}
