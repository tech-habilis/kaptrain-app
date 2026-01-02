import { ColorConst } from "@/constants/theme";
import Svg, { Circle } from "react-native-svg";

const IcHollowCircle = ({size = 12, strokeWidth = 2, color = ColorConst.accent}) => {
  const radius = size / 2 - strokeWidth

  return (
    <Svg height={size} width={size} viewBox={`0 0 ${size} ${size}`}>
      <Circle
        cx={size / 2} // Center X
        cy={size / 2} // Center Y
        r={radius} // Radius
        stroke={color} // Outline color
        strokeWidth={strokeWidth}
        fill="none" // No fill inside the circle
      />
    </Svg>
  );
};

export default IcHollowCircle;
