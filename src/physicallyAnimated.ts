import * as React from "react";
import { Action } from "popmotion/action";
import { ColdSubscription } from "popmotion/action/types";
import value, { ValueReaction } from "popmotion/reactions/value";

export type Actions<T> = { [P in keyof T]: (from: T[P], velocity: number, to: T[P]) => Action };

type Subscriptions<T> = { [P in keyof T]?: undefined | ColdSubscription };

const stop = (s: undefined | ColdSubscription) =>
  s && (s as any).stop();

type Component<P, S> = React.Component<P & S, S> & { s: Subscriptions<S> };

type Values<T> = { [P in keyof T]: ValueReaction };
const mkValues = <P, S>(self: Component<P, S>, a: Actions<S>): Values<S> => {
  const s: any = {};
  for (const k in a) {
    s[k] = value(self.props[k] as any);
  }
  return s as Values<P & S>;
};

const toS = <P, S>(props: Readonly<P & S>, actions: Actions<S>): S => {
  const ret: any = {};
  for (const k in actions) {
    ret[k] = props[k];
  }
  return ret as S;
};

export interface O<P, S> {
  actions: Actions<S>;
  render(props: P & S): JSX.Element;
}

export type R<P> = React.ComponentType<P>;

export const physicallyAnimated = <P, S>(o: O<P, S>): R<P & S> => {
  const { actions, render } = o;
  return class extends React.PureComponent<P & S, S> {
    state = toS<P, S>(this.props, actions);

    s: Subscriptions<S> = {};
    v = mkValues<P, S>(this, actions);

    componentWillReceiveProps(nextProps: P & S) {
      for (const k in actions) {
        const to = nextProps[k];
        if (this.props[k] !== to) {
          stop(this.s[k]);

          const v = this.v[k];
          this.s[k] = actions[k](v.get() as any, v.getVelocity(), to).start(this.v[k]);
        }
      }
    }

    componentDidMount() {
      for (const k in this.v) {
        this.v[k].subscribe({
          update: (v: number) => {
            this.setState({ [k]: v } as any)
          },
          complete: () => {
            this.s[k] = undefined;
          }
        } as any)
      }
    }

    componentWillUnmount() {
      for (const k in this.s) {
        stop(this.s[k]);
      }
    }

    render() {
      return render({ ...(this.props as any), ...(this.state as any) });
    }
  };
};
