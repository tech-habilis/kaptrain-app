import * as React from "react";
import Svg, { Path } from "react-native-svg";

function IcHyrox({ size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M2 20h18.38c.495 0 .981-.122 1.417-.356L23 19"
        stroke="#424F65"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M4 20a1 1 0 102 0H4zm2-3a1 1 0 10-2 0h2zm7-1a1 1 0 100 2v-2zm7 2a1 1 0 100-2v2zM5 20h1v-3H4v3h1zm8-3v1h7v-2h-7v1zm3.719 3h1v-1.5h-2V20h1zm0-1.5h1V17h-2v1.5h1z"
        fill="#424F65"
      />
      <Path
        d="M13 14.496h7M13 12.117h7"
        stroke="#424F65"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M10 5a1 1 0 00-2 0h2zM9 5H8v15h2V5H9zM17.727 8.2a1 1 0 00-2 0h2zm-1 0h-1v3h2v-3h-1z"
        fill="#424F65"
      />
    </Svg>
  );
}

export default IcHyrox;
