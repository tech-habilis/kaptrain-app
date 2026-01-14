import { Chip } from "@/components/chip";
import { Choices } from "@/components/choices";
import { TChoice } from "@/types";
import IcBasketball from "@/components/icons/basketball";
import IcBodybuilding from "@/components/icons/bodybuilding";
import IcClose from "@/components/icons/close";
import IcCrossfit from "@/components/icons/crossfit";
import IcCycling from "@/components/icons/cycling";
import IcRowing from "@/components/icons/rowing";
import IcSearch from "@/components/icons/search";
import IcYoga from "@/components/icons/yoga";
import Input from "@/components/input";
import { ColorConst } from "@/constants/theme";
import { useCompleteProfileStore } from "@/stores/complete-profile-store";
import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, View, Text as RawText } from "react-native";

export function Step4() {
  const { t } = useTranslation();
  const { formData, updateStep4 } = useCompleteProfileStore();

  const choices: TChoice[] = useMemo(
    () => [
      {
        text: "sports.athletics",
        leftIcon: <IcCycling />,
      },
      {
        text: "sports.rowing",
        leftIcon: <IcRowing />,
      },
      {
        text: "sports.basketball",
        leftIcon: <IcBasketball />,
      },
      {
        text: "sports.crossfit",
        leftIcon: <IcCrossfit />,
      },
      {
        text: "sports.cycling",
        leftIcon: <IcCycling />,
      },
      {
        text: "sports.bodybuilding",
        leftIcon: <IcBodybuilding />,
      },
      {
        text: "sports.yoga",
        leftIcon: <IcYoga />,
      },
    ],
    [],
  );

  const [search, setSearch] = useState<string>("");

  const filteredChoices = useMemo(
    () =>
      choices.filter((x) =>
        x.text.toLowerCase().includes(search.toLowerCase()),
      ),
    [choices, search],
  );

  const selectedChoices = choices.filter((c) =>
    formData.selectedSports?.includes(c.text),
  );

  const clearSearch = () => {
    setSearch("");
  };

  return (
    <>
      <View
        className={
          selectedChoices.length > 0 ? "flex-row flex-wrap gap-2 mt-6" : ""
        }
      >
        {selectedChoices.map((choice, index) => (
          <Chip
            key={index}
            text={choice.text}
            type="selected"
            onLeftSidePress={() => {
              const updatedSports =
                formData.selectedSports?.filter((s) => s !== choice.text) || [];
              updateStep4({ selectedSports: updatedSports });
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

      <ScrollView className="mt-4">
        <Choices
          data={filteredChoices}
          type="multipleChoice"
          selectedChoices={selectedChoices}
          onChangeMultiple={(newChoices) => {
            const selectedSports = newChoices.map((c) => c.text);
            updateStep4({ selectedSports: selectedSports });
          }}
          maxChoice={5}
        />
      </ScrollView>
    </>
  );
}
