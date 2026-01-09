import * as React from "react";
import Svg, { Path } from "react-native-svg";

function IcSendMessage({ size = 32, color = "#457CE2" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M4 26.667V5.334l25.333 10.667L4 26.667zm2.667-4l15.8-6.666-15.8-6.667v4.667l8 2-8 2v4.666zm0 0V9.334v13.333z"
        fill={color}
      />
    </Svg>
  );
}

export default IcSendMessage;
