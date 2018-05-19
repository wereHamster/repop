import * as React from "react";
import { tween, spring, delay, chain } from "popmotion";
import { partiallyAnimated } from "../src/partiallyAnimated";

const ox = 200;
const oy = 200;
const theta = 2.2;

export interface State {
  generation: number;

  cx: number;
  cy: number;

  last: Array<{ cx: number; cy: number }>;
}

export default class extends React.PureComponent<{}, State> {
  state: State = { generation: 0, cx: 200, cy: 50, last: [] };

  advance = () => {
    const { generation, cx, cy } = this.state;

    // Copy current position to the 'last' array.
    const last = this.state.last.slice(0, 0);
    last.unshift({ cx, cy });

    // Compute new position (rotate by 'theta' radians clockwise).
    const x = Math.cos(theta) * (cx - ox) - Math.sin(theta) * (cy - oy) + ox;
    const y = Math.sin(theta) * (cx - ox) + Math.cos(theta) * (cy - oy) + oy;

    // Update the state.
    this.setState({ generation: generation + 1, cx: x, cy: y, last });

    // And reschedule.
    setTimeout(this.advance, 1000);
  };

  componentDidMount() {
    this.advance();
  }

  render() {
    const { generation, cx, cy, last } = this.state;

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
          r={(generation % 2) * 10 + 4}
          fill="teal"
        />
      </svg>
    );
  }
}

const AnimatedCircle = partiallyAnimated<any, any>({
  actions: {
    cx: (from, to) =>
      spring({
        from,
        to,
        stiffness: 30,
        damping: 10
      }),
    cy: (from, to) =>
      spring({
        from,
        to,
        stiffness: 30,
        damping: 10
      }),
    r: (from, to) => chain(delay(800), tween({ from, to, duration: 200 }))
  },

  render: props => <circle {...props} />
});
