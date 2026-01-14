import * as React from "react";
import Svg, { Path } from "react-native-svg";

function IcGridV({ size = 24, color = "#04152D" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 17.2v.6c0 1.12 0 1.68.218 2.108a2 2 0 00.874.874C4.52 21 5.08 21 6.2 21h11.6c1.12 0 1.68 0 2.108-.218a2 2 0 00.874-.874C21 19.48 21 18.92 21 17.8v-.6c0-1.12 0-1.68-.218-2.108a2 2 0 00-.874-.874C19.48 14 18.92 14 17.8 14H6.2c-1.12 0-1.68 0-2.108.218a2 2 0 00-.874.874C3 15.52 3 16.08 3 17.2zM3 6.2v.6c0 1.12 0 1.68.218 2.108a2 2 0 00.874.874C4.52 10 5.08 10 6.2 10h11.6c1.12 0 1.68 0 2.108-.218a2 2 0 00.874-.874C21 8.48 21 7.92 21 6.8v-.6c0-1.12 0-1.68-.218-2.108a2 2 0 00-.874-.874C19.48 3 18.92 3 17.8 3H6.2c-1.12 0-1.68 0-2.108.218a2 2 0 00-.874.874C3 4.52 3 5.08 3 6.2z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default IcGridV;
