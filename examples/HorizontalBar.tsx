import * as React from "react";
import Measure from "react-measure";
import { tween } from "popmotion";
import { animated } from "../src/animated";

export const HorizontalBar = props => (
  <Measure bounds>
    {({
      measureRef,
      contentRect: {
        bounds: { width, height }
      }
    }) => (
      <div ref={measureRef} style={{ position: "relative", height: 20 }}>
        {width > 0 && <Inner width={width} height={height} {...props} />}
      </div>
    )}
  </Measure>
);

export const AnimatedHorizontalBar = animated({
  action: (from, to) => tween({ from, to, duration: 300 }),

  render: (props, interpolatedProps) => (
    <HorizontalBar {...props} {...interpolatedProps} />
  )
});

const Inner = ({ width, height, total, base, used }) => {
  const baseWidth = Math.round(width * base / total);
  const usedWidth = Math.round(width * Math.min(base, used) / total);
  const maskWidth = Math.round(width * Math.max(base, used) / total);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      <defs>
        <clipPath id={`rounded-${maskWidth}-${height}`}>
          <rect x={0} y={0} width={maskWidth} height={height} rx={4} ry={4} />
        </clipPath>
      </defs>

      <g clipPath={`url(#rounded-${maskWidth}-${height})`}>
        <rect x={0} y={0} height={height} width={baseWidth} fill={"orange"} />
        <rect x={0} y={0} height={height} width={usedWidth} fill={"green"} />
        {used > base && (
          <rect
            x={usedWidth}
            y={0}
            height={height}
            width={maskWidth - usedWidth}
            fill={"red"}
          />
        )}
      </g>
    </svg>
  );
};
