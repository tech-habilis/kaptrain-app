import AreaChart from "@/components/charts/area-chart";
import { View, useWindowDimensions } from "react-native";
import Text from "@/components/text";

interface WellnessTrackingChartItem {
  date: Date;
  score: number;
}

export interface WellnessTrackingChartProps {
  data: WellnessTrackingChartItem[];
}

export default function WellnessTrackingChart({
  data,
}: WellnessTrackingChartProps) {
  const { width: screenWidth } = useWindowDimensions();
  const chartWidth = screenWidth - 32; // Account for padding (16px on each side)
  // Parse date object and return day name and date number separately
  const parseDateInfo = (
    date: Date | string | number,
  ): { dayName: string; dayNumber: string } => {
    let dateObj: Date;

    // Convert to Date object if it's not already
    if (date instanceof Date) {
      dateObj = date;
    } else if (typeof date === "string" || typeof date === "number") {
      dateObj = new Date(date);
    } else {
      return { dayName: "Invalid", dayNumber: "Date" };
    }

    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return { dayName: "Invalid", dayNumber: "Date" };
    }

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayName = dayNames[dateObj.getDay()];
    const dayNumber = dateObj.getDate().toString();
    return { dayName, dayNumber };
  };

  // Transform data for area chart - store the date object for custom rendering
  const chartData = data.map(({ date, score }) => {
    return {
      x: date.toISOString(), // Store as string for now, will use custom renderer
      y: score || 0,
    };
  });

  // Custom X-axis label renderer
  const renderXAxisLabel = (label: string, index: number) => {
    const dateInfo = parseDateInfo(data[index].date);
    return (
      <View className="flex-col items-center gap-0.5">
        <Text className="text-text text-xs font-medium">
          {dateInfo.dayName}
        </Text>
        <Text className="text-text text-xs font-medium">
          {dateInfo.dayNumber}
        </Text>
      </View>
    );
  };

  return (
    <View className="px-4">
      <AreaChart
        data={chartData}
        width={chartWidth}
        height={200}
        minY={0}
        maxY={10}
        lineColor="#06234B"
        lineWidth={4}
        gradientTopColor="#3A7CF5"
        gradientBottomColor="#FFFFFF"
        textColor="#04152D"
        renderXAxisLabel={renderXAxisLabel}
        withCurvedLines={true}
      />
    </View>
  );
}
