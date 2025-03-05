import { useWindowDimensions } from "react-native";
import React from "react";
import Svg, { G, Defs, RadialGradient, Stop, Rect } from "react-native-svg";
import Animated from "react-native-reanimated";

const AnimatedG = Animated.createAnimatedComponent(G);

export default function Glow() {
  const { width: windowWidth } = useWindowDimensions();
  const width = windowWidth * 1.4;
  const aspectRatio = 0.9;
  const height = width / aspectRatio;

  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 774 867"
      fill="none"
      style={{
        position: "absolute",
        right: "-60%",
        bottom: "-4%",
      }}
    >
      <AnimatedG opacity="0.3">
        <Rect
          width="774"
          height="867"
          rx="300"
          fill="url(#paint0_radial_140_2)"
        />
      </AnimatedG>
      <Defs>
        <RadialGradient
          id="paint0_radial_140_2"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(387 433.5) rotate(90) scale(433.5 387)"
        >
          <Stop offset="0.1" stopColor={"#ffffff20"} />
          <Stop offset="1" stopColor={"#ffffff00"} stopOpacity="0" />
        </RadialGradient>
      </Defs>
    </Svg>
  );
}
