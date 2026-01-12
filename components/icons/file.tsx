import * as React from "react";
import Svg, { Path } from "react-native-svg";

function IcFile({ size = 24, color = "#FF9E69" }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 22c-.55 0-1.02-.196-1.412-.587A1.93 1.93 0 014 20V4c0-.55.196-1.02.588-1.412A1.93 1.93 0 016 2h8l6 6v12c0 .55-.196 1.021-.587 1.413A1.92 1.92 0 0118 22H6zm7-13V4H6v16h12V9h-5z"
        fill={color}
      />
    </Svg>
  );
}

export default IcFile;
