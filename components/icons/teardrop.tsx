import { Svg, Path } from "react-native-svg";

const IcTeardrop = ({ size = 16 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M8.35631 2.29047C8.14631 2.12714 7.85466 2.12714 7.64466 2.29047C6.53633 3.1363 3.26382 5.89547 3.28132 9.10964C3.28132 11.7113 5.39882 13.8346 8.00632 13.8346C10.6138 13.8346 12.7313 11.7171 12.7313 9.11547C12.7371 5.94797 9.45881 3.14214 8.35631 2.29047Z"
        stroke="#424F65"
        strokeWidth="1.3"
        strokeMiterlimit="10"
      />
    </Svg>
  );
};

export default IcTeardrop;