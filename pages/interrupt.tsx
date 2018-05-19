import * as React from "react";
import { spring } from "popmotion";
import { animated } from "../src/animated";

const ox = 200;
const oy = 200;
const theta = 1.8;

export interface State {
  cx: number;
  cy: number;

  last: Array<{ cx: number; cy: number }>;
}

export default class extends React.PureComponent<{}, State> {
  state: State = { cx: 200, cy: 50, last: [] };

  advance = () => {
    const { cx, cy } = this.state;

    // Copy current position to the 'last' array.
    const last = this.state.last.slice(0, 3);
    last.unshift({ cx, cy });

    // Compute new position (rotate by 'theta' radians clockwise).
    const x = Math.cos(theta) * (cx - ox) - Math.sin(theta) * (cy - oy) + ox;
    const y = Math.sin(theta) * (cx - ox) + Math.cos(theta) * (cy - oy) + oy;

    // Update the state.
    this.setState({ cx: x, cy: y, last });

    // And reschedule.
    setTimeout(this.advance, 3000);
  };

  interrupt = () => {
    this.forceUpdate();
    setTimeout(this.interrupt, 200);
  };

  componentDidMount() {
    this.advance();
    this.interrupt();
  }

  render() {
    const { cx, cy, last } = this.state;

    return (
      <svg width={400} height={400}>
        <circle cx={cx} cy={cy} r={4} fill="black" />
        {last.map(({ cx, cy }, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={4}
            fill="black"
            fillOpacity={1 - (i + 1) / (last.length + 1)}
          />
        ))}

        <AnimatedCircle
          cx={cx}
          cy={cy}
          r={6}
          fill="teal"
          fillOpacity={0.8}
        />
      </svg>
    );
  }
}

const AnimatedCircle = animated<{
  cx: number;
  cy: number;
  r: number;
  fill: string;
  fillOpacity: number;
}>({
  action: (from, to) =>
    spring({
      from,
      to,
      stiffness: 30,
      damping: 5
    }),

  render: (props, { cx, cy }) => {
    return <circle {...props} cx={cx} cy={cy} />;
  }
});
