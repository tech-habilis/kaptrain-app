import { Svg, Path } from "react-native-svg";

const IcKaptrain = ({ size = 74, color = "#F3F3F4" }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 74 73" fill="none">
      <Path
        d="M41.4766 26.3438L40.8662 29.6807H59.1426L28.0645 68.0742L32.0752 46.0664L32.6826 42.7305H14.4053L45.5049 4.30469L41.4766 26.3438Z"
        stroke={color}
        strokeWidth="5.65776"
      />
    </Svg>
  );
};

export default IcKaptrain;
