import * as React from "react"
import Svg, { Path } from "react-native-svg"

const IcArrowLeft = ({size = 24, color = "#424F65"}) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        d="M15.375 5.25L8.625 12l6.75 6.75"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default IcArrowLeft
