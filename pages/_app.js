import * as React from "react";
import App, { Container } from "next/app";

export default class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <Component {...pageProps} />

        <style global jsx>{`
          body {
            margin: 0;
          }

          svg {
            display: block;
            overflow: hidden;
          }
        `}</style>
      </Container>
    );
  }
}
