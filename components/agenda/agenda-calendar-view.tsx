import { useCallback } from "react";
import { View, Pressable } from "react-native";
import Text from "@/components/text";
import { Chip } from "@/components/chip";
import { Day } from "@/components/agenda/day";
import IcArrowLeft from "@/components/icons/arrow-left";
import IcArrowRight from "@/components/icons/arrow-right";
import { ColorConst } from "@/constants/theme";
import type { CalendarDay } from "@/hooks/use-agenda-calendar";

interface AgendaCalendarViewProps {
  currentMonthLabel: string;
  weekDays: string[];
  calendarWeeks: CalendarDay[][];
  selectDate: (date: Date) => void;
  goToToday: () => void;
  goToNextMonth: () => void;
  goToPrevMonth: () => void;
}

export function AgendaCalendarView({
  currentMonthLabel,
  weekDays,
  calendarWeeks,
  selectDate,
  goToToday,
  goToNextMonth,
  goToPrevMonth,
}: AgendaCalendarViewProps) {
  // Handle day press
  const handleDayPress = useCallback(
    (date: Date) => {
      selectDate(date);
    },
    [selectDate],
  );

  return (
    <View className="gap-4 mb-6">
      {/* Header */}
      <View className="flex-row items-center justify-between h-8">
        <Text className="text-lg font-bold text-secondary">
          {currentMonthLabel}
        </Text>

        <View className="flex-row items-center gap-3">
          {/* Today chip */}
          <Pressable onPress={goToToday}>
            <Chip
              text="Aujourd'hui"
              type="default"
              className="border border-stroke"
            />
          </Pressable>

          {/* Navigation arrows */}
          <Pressable
            onPress={goToPrevMonth}
            className="w-10 h-10 items-center justify-center"
          >
            <IcArrowLeft size={24} color={ColorConst.accent} />
          </Pressable>
          <Pressable
            onPress={goToNextMonth}
            className="w-10 h-10 items-center justify-center"
          >
            <IcArrowRight size={24} color={ColorConst.accent} />
          </Pressable>
        </View>
      </View>

      {/* Week day headers */}
      <View className="flex-row justify-between items-center">
        {weekDays.map((day) => (
          <View key={day} className="w-8 items-center">
            <Text className="text-xs font-medium text-subtleText">{day}</Text>
          </View>
        ))}
      </View>

      {/* Calendar weeks */}
      <View className="gap-2">
        {calendarWeeks.map((week, weekIndex) => (
          <View
            key={weekIndex}
            className="flex-row justify-between items-center"
          >
            {week.map((dayData, dayIndex) => (
              <Pressable
                key={`${weekIndex}-${dayIndex}`}
                onPress={() => handleDayPress(dayData.date)}
              >
                <Day
                  day={dayData.day}
                  isCurrentMonth={dayData.isCurrentMonth}
                  isToday={dayData.isToday}
                  isSelected={dayData.isSelected}
                  activities={dayData.activities}
                />
              </Pressable>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}
