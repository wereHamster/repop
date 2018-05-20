import * as React from "react";
import { Action } from "popmotion/action";
import { ColdSubscription } from "popmotion/action/types";

export type N<T> = { [K in keyof T]: number extends T[K] ? K : never };
export type S<T> = Record<N<T>[keyof T], number>;

const toS = <T>(x: T): S<T> => {
  const ret: any = {};
  for (const k in x) {
    typeof (x[k] as any) === "number" && (ret[k] = x[k]);
  }
  return ret as S<T>;
};

export interface O<P> {
  action(from: S<P>, to: S<P>): Action;
  render(props: P, state: S<P>): JSX.Element;
}

export type R<P> = React.ComponentType<P>;

const stop = (s: undefined | ColdSubscription) =>
  s && (s as any).stop();

export const animated = <P>({ action, render }: O<P>): R<P> => {
  return class extends React.PureComponent<P, S<P>> {
    state = toS<P>(this.props);
    s: undefined | ColdSubscription = undefined;

    update = (v: P) => {
      this.setState(v);
    };
    complete = () => {
      this.s = undefined;
    };

    componentWillReceiveProps(nextProps: P) {
      stop(this.s);
      this.s = action(this.state, toS(nextProps)).start(this);
    }

    componentWillUnmount() {
      stop(this.s);
    }

    render() {
      return render(this.props, this.state);
    }
  };
};
