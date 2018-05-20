import * as React from "react";
import { Action } from "popmotion/action";
import { ColdSubscription } from "popmotion/action/types";

export type Actions<T> = { [P in keyof T]: (from: T[P], to: T[P]) => Action };

type Subscriptions<T> = { [P in keyof T]?: undefined | ColdSubscription };

type Observers<T> = { [P in keyof T]: any };

type Component<T> = React.Component<{}, T> & { s: Subscriptions<T> };

const stop = (s: undefined | ColdSubscription) =>
  s && (s as any).stop();

const mkObservers = <T>(self: Component<T>, p: Actions<T>): Observers<T> => {
  const s: any = {};
  for (const k in p) {
    s[k] = {
      update: (v: number) => {
        self.setState({ [k]: v } as any);
      },
      complete: () => {
        self.s[k] = undefined;
      }
    };
  }
  return s as Observers<T>;
};

const toS = <P, S>(props: P & S, actions: Actions<S>): S => {
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

export const partiallyAnimated = <P, S>(o: O<P, S>): R<P & S> => {
  const { actions, render } = o;
  return class extends React.PureComponent<P & S, S> {
    state = toS<P, S>(this.props as P & S, actions);

    s: Subscriptions<S> = {};
    o = mkObservers(this, actions);

    componentWillReceiveProps(nextProps: P & S) {
      for (const k in actions) {
        if (this.props[k] !== nextProps[k]) {
          stop(this.s[k]);
          this.s[k] = actions[k](this.state[k], nextProps[k]).start(this.o[k]);
        }
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
