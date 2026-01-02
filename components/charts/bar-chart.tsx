import { View } from "react-native";
import Svg, { Rect, Line, G, Text } from "react-native-svg";
import { ReactNode, useState } from "react";
import { ColorConst } from "@/constants/theme";

export interface BarChartItem {
  x: string;
  y: number;
  color?: string;
}

export interface BarChartProps {
  data: BarChartItem[];
  width?: number | string;
  height?: number;
  minY?: number;
  maxY?: number;
  defaultBarColor?: string;
  defaultEmptyBarColor?: string;
  textColor?: string;
  renderXAxisLabel?: (label: string, index: number) => ReactNode;
  showGridLines?: boolean;
  showYAxis?: boolean;
}

export default function BarChart({
  data,
  width,
  height = 200,
  minY = 0,
  maxY = 10,
  defaultBarColor = ColorConst.primary,
  defaultEmptyBarColor = ColorConst.light,
  textColor = ColorConst.subtleText,
  renderXAxisLabel,
  showGridLines = false,
  showYAxis = false,
}: BarChartProps) {
  const [containerWidth, setContainerWidth] = useState(320);
  const [calculatedBarWidth, setCalculatedBarWidth] = useState(24);

  const chartWidth = typeof width === "number" ? width : containerWidth;

  if (!data || data.length === 0) {
    return <View />;
  }

  // Reserve space for X-axis labels at the bottom
  const labelSpace = renderXAxisLabel ? 40 : 30;

  const padding = {
    top: 10,
    right: 10,
    bottom: 5,
    left: showYAxis ? 40 : 10,
  };
  const innerChartWidth = chartWidth - padding.left - padding.right;
  const chartHeight = Math.max(
    50,
    height - padding.top - padding.bottom - labelSpace,
  );
  console.log("chartHeight", chartHeight);

  // Calculate positions
  const barSpacing = innerChartWidth / data.length;
  const yRange = maxY - minY;

  // Calculate bar width dynamically based on available space
  // Use 70% of the available space per bar, leaving 30% for spacing
  const dynamicBarWidth = Math.min(calculatedBarWidth, barSpacing * 0.7);

  const bars = data.map((item, index) => {
    const x =
      padding.left + index * barSpacing + (barSpacing - dynamicBarWidth) / 2;
    // If value is 0, treat it as 1 for display purposes
    const displayValue = item.y === 0 ? 1 : item.y;
    const barHeight = ((displayValue - minY) / yRange) * chartHeight;
    console.log("barHeight", barHeight);
    const y = padding.top + chartHeight - barHeight;
    // Use defaultEmptyBarColor for 0 values, otherwise use item color or defaultBarColor
    const barColor =
      item.y === 0 ? defaultEmptyBarColor : item.color || defaultBarColor;
    return {
      x,
      y,
      width: dynamicBarWidth,
      height: barHeight,
      label: item.x,
      value: item.y,
      color: barColor,
      centerX: padding.left + index * barSpacing + barSpacing / 2,
    };
  });

  // Y-axis labels
  const yLabels = [];
  const ySteps = 5;
  for (let i = 0; i <= ySteps; i++) {
    const value = minY + (yRange * i) / ySteps;
    const y = padding.top + chartHeight - (i / ySteps) * chartHeight;
    yLabels.push({ value, y });
  }

  return (
    <View
      style={{ width: width as any, height }}
      onLayout={(event) => {
        const layoutWidth = event.nativeEvent.layout.width;
        if (!width) {
          setContainerWidth(layoutWidth);
        }
        // Calculate bar width based on available space
        const availableWidth = layoutWidth - (showYAxis ? 40 : 10) - 10;
        const spacing = availableWidth / data.length;
        const calculatedWidth = Math.floor(spacing * 0.7);
        setCalculatedBarWidth(calculatedWidth);
      }}
    >
      <Svg width={chartWidth} height={height}>
        {/* Y-axis grid lines and labels */}
        {showYAxis && (
          <G>
            {yLabels.map((label, index) => (
              <G key={`y-label-${index}`}>
                {showGridLines && (
                  <Line
                    x1={padding.left}
                    y1={label.y}
                    x2={padding.left + innerChartWidth}
                    y2={label.y}
                    stroke="#E5E5E5"
                    strokeWidth="1"
                    strokeDasharray="4,4"
                  />
                )}
                <Text
                  x={padding.left - 10}
                  y={label.y + 4}
                  fill={textColor}
                  fontSize={12}
                  fontWeight="500"
                  textAnchor="end"
                >
                  {Math.round(label.value)}
                </Text>
              </G>
            ))}
          </G>
        )}

        {/* Bars */}
        <G>
          {bars.map((bar, index) => (
            <Rect
              key={`bar-${index}`}
              x={bar.x}
              y={bar.y}
              width={bar.width}
              height={bar.height}
              fill={bar.color}
              rx={4}
              ry={4}
            />
          ))}
        </G>

        {/* X-axis labels (default SVG text) */}
        {!renderXAxisLabel && (
          <G>
            {bars.map((bar, index) => (
              <Text
                key={`x-label-${index}`}
                x={bar.centerX}
                y={padding.top + chartHeight + 15}
                fill={textColor}
                fontSize={12}
                fontWeight="500"
                textAnchor="middle"
              >
                {bar.label || ""}
              </Text>
            ))}
          </G>
        )}
      </Svg>

      {/* Custom X-axis labels (React Native components) */}
      {renderXAxisLabel && (
        <View
          style={{
            position: "absolute",
            top: padding.top + chartHeight + 5,
            left: padding.left,
            right: padding.right,
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          {bars.map((bar, index) => (
            <View
              key={`custom-x-label-${index}`}
              style={{ alignItems: "center" }}
            >
              {renderXAxisLabel(bar.label, index)}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
