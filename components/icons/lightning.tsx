import { Svg, Path } from "react-native-svg";

const IcLightning = ({ size = 16 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M8.81445 6.02051L8.67871 6.78418L12.1582 6.78418L6.47363 13.9961L7.18652 9.98047L7.32129 9.2168L3.8418 9.2168L9.53027 1.99707L8.81445 6.02051Z"
        stroke="#424F65"
        strokeWidth="1.3"
      />
    </Svg>
  );
};

export default IcLightning;