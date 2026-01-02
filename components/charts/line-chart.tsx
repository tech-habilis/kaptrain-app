import { View } from "react-native";
import Svg, { Rect, Path, Circle, G, Text, Line } from "react-native-svg";
import { ReactNode, useState } from "react";

export interface LineChartItem {
  x: string;
  y: number;
}

export interface LineChartProps {
  data: LineChartItem[];
  width?: number | string;
  height?: number;
  minY?: number;
  maxY?: number;
  lineColor?: string;
  lineWidth?: number;
  backgroundColor?: string;
  textColor?: string;
  showDots?: boolean;
  dotRadius?: number;
  withCurvedLines?: boolean;
  showXAxisIndices?: number[]; // Array of indices to show labels for
  barSpacing?: number;
}

export default function LineChart({
  data,
  width,
  height = 200,
  minY = 0,
  maxY = 100,
  lineColor = "#3A7CF5",
  lineWidth = 2,
  backgroundColor = "#F5F6FD",
  textColor = "#04152D",
  showDots = true,
  dotRadius = 4,
  withCurvedLines = true,
  showXAxisIndices = [],
  barSpacing = 2,
}: LineChartProps) {
  const [containerWidth, setContainerWidth] = useState(320);

  const chartWidth = typeof width === "number" ? width : containerWidth;

  if (!data || data.length === 0) {
    return <View />;
  }

  const labelSpace = 30;

  const padding = {
    top: 10,
    right: 10,
    bottom: 5,
    left: 10,
  };
  const innerChartWidth = chartWidth - padding.left - padding.right;
  const chartHeight = Math.max(
    50,
    height - padding.top - padding.bottom - labelSpace
  );

  // Calculate positions
  const barWidth = (innerChartWidth + barSpacing) / data.length - barSpacing;
  const yRange = maxY - minY;

  const points = data.map((item, index) => {
    const x = padding.left + index * (barWidth + barSpacing) + barWidth / 2;
    const y =
      padding.top + chartHeight - ((item.y - minY) / yRange) * chartHeight;
    return { x, y, label: item.x, value: item.y };
  });

  // Helper function to create control points for Bézier curves
  const getControlPoints = (
    p0: { x: number; y: number },
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    tension = 0.3
  ) => {
    const d01 = Math.sqrt(Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2));
    const d12 = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    const fa = (tension * d01) / (d01 + d12);
    const fb = tension - fa;

    const cp1x = p1.x - fa * (p2.x - p0.x);
    const cp1y = p1.y - fa * (p2.y - p0.y);
    const cp2x = p1.x + fb * (p2.x - p0.x);
    const cp2y = p1.y + fb * (p2.y - p0.y);

    return { cp1x, cp1y, cp2x, cp2y };
  };

  // Create path for line
  let linePath = "";

  if (withCurvedLines && points.length > 2) {
    // Curved path using Bézier curves
    linePath = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(points.length - 1, i + 2)];

      const { cp2x, cp2y } = getControlPoints(p0, p1, p2);
      const { cp1x, cp1y } = getControlPoints(p1, p2, p3);

      const curve = ` C ${cp2x} ${cp2y}, ${cp1x} ${cp1y}, ${p2.x} ${p2.y}`;
      linePath += curve;
    }
  } else {
    // Straight lines
    linePath = points.reduce((path, point, index) => {
      if (index === 0) {
        return `M ${point.x} ${point.y}`;
      }
      return `${path} L ${point.x} ${point.y}`;
    }, "");
  }

  return (
    <View
      style={{ width: width as any, height }}
      onLayout={(event) => {
        if (!width) {
          setContainerWidth(event.nativeEvent.layout.width);
        }
      }}
    >
      <Svg width={chartWidth} height={height}>
        {/* Background rectangles */}
        <G>
          {data.map((item, index) => {
            const x = padding.left + index * (barWidth + barSpacing);
            return (
              <Rect
                key={`bg-rect-${index}`}
                x={x}
                y={padding.top}
                width={barWidth}
                height={chartHeight}
                fill={backgroundColor}
              />
            );
          })}
        </G>

        {/* Line */}
        <Path
          d={linePath}
          stroke={lineColor}
          strokeWidth={lineWidth}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dots on data points */}
        {showDots && (
          <G>
            {points.map((point, index) => (
              <Circle
                key={`dot-${index}`}
                cx={point.x}
                cy={point.y}
                r={dotRadius}
                fill={lineColor}
              />
            ))}
          </G>
        )}

        {/* X-axis labels (selective) */}
        <G>
          {points.map((point, index) => {
            if (showXAxisIndices.includes(index)) {
              return (
                <Text
                  key={`x-label-${index}`}
                  x={point.x}
                  y={padding.top + chartHeight + 15}
                  fill={textColor}
                  fontSize={10}
                  fontWeight="500"
                  textAnchor="middle"
                >
                  {point.label || ""}
                </Text>
              );
            }
            return null;
          })}
        </G>
      </Svg>
    </View>
  );
}