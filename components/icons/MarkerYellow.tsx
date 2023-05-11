import * as React from "react";
import Svg, { Path, Circle } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMarkerYellow = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={30}
    height={38}
    fill="none"
    {...props}
  >
    <Path fill="#111C35" d="M15 38 9.804 26.75h10.392L15 38Z" />
    <Circle cx={15} cy={15} r={15} fill="#111C35" />
    <Path
      fill="#FFCF26"
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m14.03 24.93.433-7.332-4.498-1.788 6.569-11.523-.434 7.331 4.498 1.788L14.03 24.93Z"
    />
  </Svg>
);
export default SvgMarkerYellow;

