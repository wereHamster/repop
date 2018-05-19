import * as React from "react";
import { Catalog, pageLoader } from "catalog";

import { HorizontalBar, AnimatedHorizontalBar } from '../examples/HorizontalBar';

const pages: any = [
  {
    path: "/",
    title: "Introduction",
    content: pageLoader(() => import("../docs/introduction.md"))
  }
];

const config = {
  title: "repop",
  pages,
  imports: {
    HorizontalBar,
    AnimatedHorizontalBar,
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
