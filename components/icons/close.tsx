import { Svg, Path } from "react-native-svg";

const IcClose = ({ size = 24, color = "#424F65" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z"
      fill={color}
    />
  </Svg>
);

export default IcClose;
