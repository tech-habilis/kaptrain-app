import Svg, { Path } from "react-native-svg";

interface IcLogoutProps {
  size?: number;
  color?: string;
}

const IcLogout = ({ size = 24, color = "#06234B" }: IcLogoutProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 21c-.55 0-1.02-.196-1.413-.587A1.926 1.926 0 013 19V5c0-.55.196-1.02.587-1.413A1.926 1.926 0 015 3h7v2H5v14h7v2H5zm11-4l-1.375-1.45 2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l5 5-5 5z"
        fill={color}
      />
    </Svg>
  );
};

export default IcLogout;