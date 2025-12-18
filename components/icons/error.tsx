import { Path, Svg } from "react-native-svg";

const IcError = ({size = 32}) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
    >
      <Path
        d="M12.584 5.9624C14.1057 3.3463 17.8954 3.34618 19.417 5.9624L28.7979 22.0933C30.3279 24.7272 28.4094 28.0005 25.3799 28.0005H6.62012C3.58911 28.0005 1.67232 24.7268 3.20215 22.0933L12.584 5.9624Z"
        fill="#E32828"
        stroke="white"
        stroke-width="2.66667"
      />
      <Path
        d="M15.9961 22.1348H16.0057M15.9961 12.5348L15.9961 18.5348"
        stroke="white"
        strokeWidth="2.66667"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default IcError;
