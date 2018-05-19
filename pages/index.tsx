import * as React from "react";
import { Catalog, pageLoader } from "catalog";
import Measure from 'react-measure';

import {
  HorizontalBar,
  AnimatedHorizontalBar
} from "../examples/HorizontalBar";
import {
  AnimatedCircle,
} from "../examples/Circle";

const pages: any = [
  {
    path: "/",
    title: "Introduction",
    content: pageLoader(() => import("../docs/introduction.md"))
  },
  {
    title: "Modules",
    pages: [
      {
        path: "/modules/animated",
        title: "animated",
        content: pageLoader(() => import("../docs/modules/animated.md"))
      },
      {
        path: "/modules/partiallyAnimated",
        title: "partiallyAnimated",
        content: pageLoader(() => import("../docs/modules/partiallyAnimated.md"))
      }
    ]
  }
];

const config = {
  title: "repop",
  pages,
  imports: {
    Measure,
    HorizontalBar,
    AnimatedHorizontalBar,
    AnimatedCircle
  }
};

export default class extends React.PureComponent {
  state = { isMounted: false };

  componentDidMount() {
    this.setState({ isMounted: true });
  }

  render() {
    if (!this.state.isMounted) {
      return null;
    } else {
      return <Catalog {...config} />;
    }
  }
}
