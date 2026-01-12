import { useRef, useState } from "react";
import { Dimensions, View } from "react-native";
import Button from "./button";
import BottomSheetModal from "./bottom-sheet-modal";
import { BottomSheetModal as BottomSheetModalType } from "@gorhom/bottom-sheet";
import IcCalendar from "./icons/calendar";
import Text from "./text";
import DateTimePicker, { DateType } from "react-native-ui-datepicker";
import dayjs from "dayjs";
import cn from "@/utilities/cn";

interface DatePickerProps {
  label: string;
  selectedDate?: DateType;
  onSelect: (date: DateType) => void;
  className?: string;
  modalTitle?: string;
  modalDescription?: string;
  minDate?: DateType;
  maxDate?: DateType;
  locale?: string;
  labelOnTop?: boolean;
}

export default function DatePicker({
  label,
  selectedDate,
  onSelect,
  className = "",
  modalTitle,
  modalDescription,
  minDate,
  maxDate,
  locale = "fr",
  labelOnTop = false,
}: DatePickerProps) {
  const bottomSheetModalRef = useRef<BottomSheetModalType>(null);
  const [tempDate, setTempDate] = useState<DateType>(selectedDate);

  const handleConfirm = () => {
    onSelect(tempDate);
    bottomSheetModalRef.current?.dismiss();
  };

  const handleCancel = () => {
    setTempDate(selectedDate);
    bottomSheetModalRef.current?.dismiss();
  };

  const formatDisplayDate = (date: DateType) => {
    if (!date) return label;
    return dayjs(date).format("DD/MM/YYYY");
  };

  return (
    <>
      <View>
        {labelOnTop && <Text className="text-sm text-accent mb-3">{label}</Text>}
        <Button
          text={selectedDate ? formatDisplayDate(selectedDate) : label}
          type="secondaryV2"
          className={cn("justify-between", className)}
          textClassName="font-normal text-base"
          rightIcon={<IcCalendar />}
          onPress={() => {
            setTempDate(selectedDate);
            bottomSheetModalRef.current?.present();
          }}
        />
      </View>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        name="date-picker-selection"
        snapPoints={["70%"]}
        className="pb-safe pt-6"
        detached
        bottomInset={Dimensions.get("screen").height * 0.2}
        style={{ marginHorizontal: 16 }}
        withHandle={false}
      >
        {modalTitle && (
          <Text className="text-sm text-subtleText">{modalTitle}</Text>
        )}
        {modalDescription && (
          <Text className="text-xs text-subtleText mt-1">
            {modalDescription}
          </Text>
        )}

        <View className="flex-1">
          <DateTimePicker
            mode="single"
            date={tempDate}
            onChange={({ date }) => setTempDate(date)}
            minDate={minDate}
            maxDate={maxDate}
            locale={locale}
            classNames={{
              header: "mb-4",
              day: "text-secondary",
              day_label: "text-secondary text-base",
              today: "border-primary border-2 rounded-md",
              today_label: "font-bold",
              selected: "bg-primary rounded-md",
              selected_label: "text-white font-bold",
              disabled: "opacity-30",
              disabled_label: "text-subtleText",
              range_fill: "bg-light",
              month: "text-primary",
              month_label: "text-base text-text",
              year_label: "text-base text-text",
              month_selector_label: "font-bold text-lg",
              year_selector_label: "font-bold text-lg",
            }}
          />
        </View>

        <View className="flex-row gap-3 mt-4">
          <Button
            text="Annuler"
            type="secondary"
            size="small"
            className="flex-1"
            onPress={handleCancel}
          />
          <Button
            text="Définir"
            type="primary"
            size="small"
            className="flex-1"
            onPress={handleConfirm}
          />
        </View>
      </BottomSheetModal>
    </>
  );
}
