import * as React from "react"
import Svg, { Path } from "react-native-svg"

const IcArrowRight = ({size = 24, color = "#424F65"}) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        d="M8.625 18.75L15.375 12l-6.75-6.75"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default IcArrowRight