import { Svg, Path, Circle } from "react-native-svg";

const IcSuccess = ({ size = 32 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Circle cx="16" cy="16" r="12.5" fill="#4FD365" stroke="#4FD365" />
      <Path
        d="M24 10L13 21L8 16"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default IcSuccess;
