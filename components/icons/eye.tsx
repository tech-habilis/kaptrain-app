import { Svg, Path } from "react-native-svg";

const IcEye = ({ size = 24 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3.877 12S6.83 6.092 12 6.092c5.169 0 8.123 5.908 8.123 5.908S17.169 17.908 12 17.908C6.83 17.908 3.877 12 3.877 12z"
        stroke="#424F65"
        strokeWidth={1.84615}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 14.215a2.215 2.215 0 100-4.43 2.215 2.215 0 000 4.43z"
        stroke="#424F65"
        strokeWidth={1.84615}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default IcEye;
