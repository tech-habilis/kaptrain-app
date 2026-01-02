import { View } from "react-native";
import Svg, { Circle, G, Path, Text as SvgText } from "react-native-svg";
import { useState } from "react";

export interface DonutChartItem {
  label: string;
  value: number; // percentage value
  color: string;
}

export interface DonutChartProps {
  data: DonutChartItem[];
  size?: number;
  strokeWidth?: number;
  showPercentageLabels?: boolean;
  centerContent?: React.ReactNode;
  className?: string;
}

export default function DonutChart({
  data,
  size,
  strokeWidth = 20,
  showPercentageLabels = true,
  className,
}: DonutChartProps) {
  const [containerSize, setContainerSize] = useState(size || 120);

  if (!data || data.length === 0) {
    return <View />;
  }

  // Reserve space for percentage labels (circles with offset)
  const labelSpace = 40; // Space for label circles positioned outside
  const chartSize = containerSize - labelSpace;
  const center = containerSize / 2;
  const outerRadius = chartSize / 2;
  const innerRadius = outerRadius - strokeWidth;

  // Calculate total to normalize percentages
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Generate segments
  let currentAngle = -90; // Start from top (12 o'clock position)

  const segments = data.map((item) => {
    const percentage = (item.value / total) * 100;
    const sweepAngle = (item.value / total) * 360;

    // Calculate path for the arc segment
    const startAngle = currentAngle;
    const endAngle = currentAngle + sweepAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    // Outer arc points
    const x1Outer = center + outerRadius * Math.cos(startRad);
    const y1Outer = center + outerRadius * Math.sin(startRad);
    const x2Outer = center + outerRadius * Math.cos(endRad);
    const y2Outer = center + outerRadius * Math.sin(endRad);

    // Inner arc points
    const x1Inner = center + innerRadius * Math.cos(startRad);
    const y1Inner = center + innerRadius * Math.sin(startRad);
    const x2Inner = center + innerRadius * Math.cos(endRad);
    const y2Inner = center + innerRadius * Math.sin(endRad);

    const largeArcFlag = sweepAngle > 180 ? 1 : 0;

    // Create donut segment path
    const path = `
      M ${x1Outer} ${y1Outer}
      A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2Outer} ${y2Outer}
      L ${x2Inner} ${y2Inner}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1Inner} ${y1Inner}
      Z
    `;

    // Calculate midpoint angle for label position
    const midAngle = startAngle + sweepAngle / 2;
    const midRad = (midAngle * Math.PI) / 180;

    // Position label outside the donut with offset (overlapping slightly)
    const labelRadius = outerRadius + 2;
    const labelX = center + labelRadius * Math.cos(midRad);
    const labelY = center + labelRadius * Math.sin(midRad);

    const segment = {
      path,
      color: item.color,
      percentage: Math.round(percentage),
      labelX,
      labelY,
      label: item.label,
    };

    currentAngle = endAngle;
    return segment;
  });

  return (
    <View
      className={className}
      style={{ width: size || '100%', height: containerSize }}
      onLayout={(event) => {
        const layoutWidth = event.nativeEvent.layout.width;
        if (!size) {
          setContainerSize(layoutWidth);
        }
      }}
    >
      <Svg width={containerSize} height={containerSize}>
        {/* Draw donut segments */}
        <G>
          {segments.map((segment, index) => (
            <Path
              key={`segment-${index}`}
              d={segment.path}
              fill={segment.color}
            />
          ))}
        </G>

        {/* Draw percentage labels with circles */}
        {showPercentageLabels && (
          <G>
            {segments.map((segment, index) => (
              <G key={`label-${index}`}>
                {/* Circle background for percentage */}
                <Circle
                  cx={segment.labelX}
                  cy={segment.labelY}
                  r={10}
                  fill="white"
                  stroke="#E5E5E5"
                  strokeWidth="1"
                />
                {/* Percentage text */}
                <SvgText
                  x={segment.labelX - 2.75}
                  y={segment.labelY + 2.5}
                  fill="#04152D"
                  fontSize={6.55}
                  fontWeight="600"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  {segment.percentage}%
                </SvgText>
              </G>
            ))}
          </G>
        )}
      </Svg>
    </View>
  );
}
