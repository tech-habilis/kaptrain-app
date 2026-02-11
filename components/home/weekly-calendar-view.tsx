import { View } from "react-native";
import Text from "@/components/text";
import { Day } from "@/components/agenda/day";
import type { CalendarDay } from "@/hooks/use-week-calendar";

interface WeeklyCalendarViewProps {
  weekDays: CalendarDay[];
}

export function WeeklyCalendarView({ weekDays }: WeeklyCalendarViewProps) {
  return (
    <View className="h-20 border border-stroke rounded-2xl py-2 px-4 bg-white -mt-10 mx-4 flex-row gap-4 items-center justify-around">
      {weekDays.map((dayData, index) => (
        <View key={index} className="items-center gap-2.25">
          <Text className="text-subtleText font-medium text-xs">{dayData.title}</Text>
          <Day
            day={dayData.day}
            isToday={dayData.isToday}
            isCurrentMonth={true}
            isSelected={dayData.isSelected}
            activities={dayData.activities}
          />
        </View>
      ))}
    </View>
  );
}
