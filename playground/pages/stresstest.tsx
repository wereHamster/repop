import * as React from "react";
import { spring } from "popmotion";
import { animated } from "../../src/animated";
import { range } from "ramda";
import Prando from "prando";

export interface State {
  generation: number;
}

export default class extends React.PureComponent<{}, State> {
  state: State = { generation: 1 };

  advance = () => {
    this.setState({ generation: this.state.generation + 1 });
    setTimeout(this.advance, 1000);
  };

  componentDidMount() {
    this.advance();
  }

  render() {
    const { generation } = this.state;
    const prng = new Prando(generation);

    return (
      <svg width={400} height={400}>
        {range(0, 100).map(i => (
          <AnimatedCircle
            key={i}
            cx={prng.nextInt(2, 398)}
            cy={prng.nextInt(2, 398)}
            r={4}
            fill="teal"
          />
        ))}
      </svg>
    );
  }
}

const AnimatedCircle = animated<{
  cx: number;
  cy: number;
  r: number;
  fill: string;
}>({
  action: (from, to) =>
    spring({
      from,
      to,
      stiffness: 10,
      damping: 10
    }),

  render: (props, { cx, cy }) => {
    return <circle {...props} cx={cx} cy={cy} />;
  }
});
