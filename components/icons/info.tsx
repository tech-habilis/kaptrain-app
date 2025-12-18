import { Path, Svg, Circle } from "react-native-svg";

const IcInfo = ({ size = 32 }) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
    >
      <Circle cx="16" cy="16" r="12" fill="#457CE2" />
      <Path
        d="M16 20.7922H16.0096M16 11.1922L16 17.1922M28 15.9922C28 9.36459 22.6276 3.99219 16 3.99219C9.3724 3.99219 4 9.36459 4 15.9922C4 22.6198 9.3724 27.9922 16 27.9922C22.6276 27.9922 28 22.6198 28 15.9922Z"
        stroke="white"
        strokeWidth="2.66667"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default IcInfo;
