import * as React from "react";
import Svg, { Path } from "react-native-svg";

function IcPencil({ size = 16 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M3.333 12.667h.95L10.8 6.15l-.95-.95-6.517 6.517v.95zM2 14v-2.833l8.8-8.784c.133-.122.28-.216.442-.283a1.38 1.38 0 011.025 0c.166.067.31.167.433.3l.917.933c.133.123.23.267.291.434a1.444 1.444 0 010 1.008 1.25 1.25 0 01-.291.442L4.833 14H2zm8.317-8.317L9.85 5.2l.95.95-.483-.467z"
        fill="#424F65"
      />
    </Svg>
  );
}

export default IcPencil;
