import * as React from "react";
import { spring } from "popmotion";
import { animated } from "../src/animated";
import { physicallyAnimated } from "../src/physicallyAnimated";
import Prando from "prando";

const ox = 200;
const oy = 200;
const theta = 1.2;

export interface State {
  cx: number;
  cy: number;

  last: Array<{ cx: number; cy: number }>;
}

const prng = new Prando();

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
    this.setState({ cx: prng.nextInt(0, 800), cy: prng.nextInt(0, 800), last });

    // And reschedule.
    setTimeout(this.advance, 600);
  };

  interrupt = () => {
    this.forceUpdate();
    setTimeout(this.interrupt, 150);
  };

  componentDidMount() {
    this.advance();
    this.interrupt();
  }

  componentDidUpdate() {
    // console.log('update', window.performance.now())
  }

  render() {
    const { cx, cy, last } = this.state;

    return (
      <svg width={800} height={800}>
        <circle cx={cx} cy={cy} r={8} fill="black" />

        <AnimatedCircle
          cx={cx}
          cy={cy}
          r={6}
          fill="teal"
          fillOpacity={0.8}
        />

        <PhysicallyAnimatedCircle
          cx={cx}
          cy={cy}
          r={6}
          fill="magenta"
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
      stiffness: 20,
      damping: 3
    }),

  render: (props, { cx, cy }) => {
    return <circle {...props} cx={cx} cy={cy} />;
  }
});

const PhysicallyAnimatedCircle = physicallyAnimated<
  {
    cx: number;
    cy: number;
    r: number;
    fill: string;
    fillOpacity: number;
  },
  {
    cx: number;
    cy: number;
  }
>({
  actions: {
    cx: {
      springStrength: 10,
      acceleration: 10,
      friction: 0.5,
    },
    cy: {
      springStrength: 10,
      acceleration: 10,
      friction: 0.5,
    }
  },
  render: props => {
    return <circle {...props} />;
  }
});
