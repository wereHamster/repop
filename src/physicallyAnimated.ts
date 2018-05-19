import * as React from "react";
import { physics } from "popmotion";
import { ColdSubscription } from "popmotion/action/types";

export interface ActionProps {
  acceleration?: number;
  restSpeed?: number;
  friction?: number;
  springStrength?: number;
  velocity?: number;
}

export type Actions<T> = { [P in keyof T]: ActionProps };

type Subscriptions<T> = { [P in keyof T]?: undefined | ColdSubscription };

const clearSubscriptions = <T>(s: Subscriptions<T>) => {
  for (const k in s) {
    s[k] && s[k].stop();
  }
};

type Component<T> = React.Component<{}, T> & { s: Subscriptions<T> };

type Observers<T> = { [P in keyof T]: any };

const mkObservers = <T>(self: Component<T>, p: Actions<T>): Observers<T> => {
  const s: any = {};
  for (const k in p) {
    s[k] = {
      update: v => {
        self.setState({ [k]: v } as any);
      },
      complete: () => {
        self.s[k] = undefined;
      }
    };
  }
  return s as Observers<T>;
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
    o = mkObservers(this, actions);

    componentWillReceiveProps(to: P & S) {
      for (const k in actions) {
        const p = actions[k];
        const a = this.s[k];
        if (a) {
          a.setSpringTarget(to[k]);
          p.acceleration !== undefined && a.setAcceleration(p.acceleration);
          p.restSpeed !== undefined && a.setRestSpeed(p.restSpeed);
          p.friction !== undefined && a.setFriction(p.friction);
          p.springStrength !== undefined &&
            a.setSpringStrength(p.springStrength);
          p.velocity !== undefined && a.setVelocity(p.velocity);
        } else {
          const physicsOptions = {
            ...(p as any),
            from: this.state[k],
            to: to[k]
          };

          this.s[k] = physics(physicsOptions).start(this.o[k]);
        }
      }
    }

    componentWillUnmount() {
      clearSubscriptions(this.s);
    }

    render() {
      return render({ ...(this.props as any), ...(this.state as any) });
    }
  };
};
