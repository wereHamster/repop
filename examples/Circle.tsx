import * as React from "react";
import Measure from "react-measure";
import { tween, chain, delay } from "popmotion";
import { partiallyAnimated } from "../src/partiallyAnimated";

export const AnimatedCircle = partiallyAnimated({
  actions: {
    cx: (from, to) =>
      tween({ from, to, duration: 500 }),
    cy: (from, to) =>
      tween({ from, to, duration: 500 }),
    r: (from, to) =>
      chain(delay(450), tween({ from, to, duration: 300 })),
  },

  render: (props) =>
    <circle {...props} />
});
