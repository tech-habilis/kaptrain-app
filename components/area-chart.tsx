import { View } from "react-native";
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Path,
  Line,
  G,
  Text,
} from "react-native-svg";
import { ReactNode, useState } from "react";
import { ColorConst } from "@/constants/theme";

export interface AreaChartItem {
  x: string;
  y: number;
}

export interface AreaChartProps {
  data: AreaChartItem[];
  width?: number | string;
  height?: number;
  minY?: number;
  maxY?: number;
  lineColor?: string;
  lineWidth?: number;
  gradientTopColor?: string;
  gradientBottomColor?: string;
  textColor?: string;
  renderXAxisLabel?: (label: string, index: number) => ReactNode;
  withCurvedLines?: boolean;
  showGridLines?: boolean;
}

export default function AreaChart({
  data,
  width,
  height = 200,
  minY = 0,
  maxY = 10,
  lineColor = ColorConst.secondary,
  lineWidth = 4,
  gradientTopColor = "#3A7CF5",
  gradientBottomColor = "#FFFFFF",
  textColor = ColorConst.tertiary,
  renderXAxisLabel,
  withCurvedLines = true,
  showGridLines = false,
}: AreaChartProps) {
  const [containerWidth, setContainerWidth] = useState(320);

  const chartWidth = typeof width === "number" ? width : containerWidth;

  if (!data || data.length === 0) {
    return <View />;
  }

  const padding = {
    top: 20,
    right: 10,
    bottom: renderXAxisLabel ? 50 : 40,
    left: 40,
  };
  const innerChartWidth = chartWidth - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Calculate positions
  const xStep =
    data.length > 1 ? innerChartWidth / (data.length - 1) : innerChartWidth;
  const yRange = maxY - minY;

  const points = data.map((item, index) => {
    const x = padding.left + index * xStep;
    const y =
      padding.top + chartHeight - ((item.y - minY) / yRange) * chartHeight;
    return { x, y, label: item.x, value: item.y };
  });

  // Helper function to create control points for Bézier curves
  const getControlPoints = (
    p0: { x: number; y: number },
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    tension = 0.3,
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

  // Create path for area (filled region)
  let areaPath = "";
  let linePath = "";

  if (withCurvedLines && points.length > 2) {
    // Curved path using Bézier curves
    areaPath = `M ${points[0].x} ${points[0].y}`;
    linePath = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(points.length - 1, i + 2)];

      const { cp2x, cp2y } = getControlPoints(p0, p1, p2);
      const { cp1x, cp1y } = getControlPoints(p1, p2, p3);

      const curve = ` C ${cp2x} ${cp2y}, ${cp1x} ${cp1y}, ${p2.x} ${p2.y}`;
      areaPath += curve;
      linePath += curve;
    }
  } else {
    // Straight lines
    areaPath = points.reduce((path, point, index) => {
      if (index === 0) {
        return `M ${point.x} ${point.y}`;
      }
      return `${path} L ${point.x} ${point.y}`;
    }, "");

    linePath = points.reduce((path, point, index) => {
      if (index === 0) {
        return `M ${point.x} ${point.y}`;
      }
      return `${path} L ${point.x} ${point.y}`;
    }, "");
  }

  const areaPathClosed = `${areaPath} L ${points[points.length - 1].x} ${
    padding.top + chartHeight
  } L ${points[0].x} ${padding.top + chartHeight} Z`;

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
        if (!width) {
          setContainerWidth(event.nativeEvent.layout.width);
        }
      }}
    >
      <Svg width={chartWidth} height={height}>
        <Defs>
          <LinearGradient
            id="areaGradient"
            x1="0"
            y1={padding.top}
            x2="0"
            y2={padding.top + chartHeight}
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor={gradientTopColor} stopOpacity="0.15" />
            <Stop
              offset="100%"
              stopColor={gradientBottomColor}
              stopOpacity="0.15"
            />
          </LinearGradient>
        </Defs>

        {/* Y-axis grid lines and labels */}
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

        {/* Area fill with gradient */}
        <Path d={areaPathClosed} fill="url(#areaGradient)" />

        {/* Top line */}
        <Path
          d={linePath}
          stroke={lineColor}
          strokeWidth={lineWidth}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* X-axis labels (default SVG text) */}
        {!renderXAxisLabel && (
          <G>
            {points.map((point, index) => (
              <Text
                key={`x-label-${index}`}
                x={point.x}
                y={padding.top + chartHeight + 20}
                fill={textColor}
                fontSize={12}
                fontWeight="500"
                textAnchor="middle"
              >
                {point.label || ""}
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
            top: padding.top + chartHeight + 10,
            left: padding.left,
            right: padding.right,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {points.map((point, index) => (
            <View
              key={`custom-x-label-${index}`}
              style={{ alignItems: "center" }}
            >
              {renderXAxisLabel(point.label, index)}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
