This module is the larger brother of `animated`. Sometimes using the same animation for each prop just doesn't cut it and you want to use a slightly different animation for each. Thanks to the many compositors that are available in popmotion, you can also use it to chain multiple actions.

For example the following definition will cause the circle to immediately start changing the position, but the radius only starts changing towards the end, just before the circle is at its final position.

```code|lang-js
const AnimatedCircle = partiallyAnimated({
  actions: {
    cx: (from, to) =>
      tween({ from, to, duration: 500 }),
    cy: (from, to) =>
      tween({ from, to, duration: 500 }),
    r: (from, to) =>
      chain(delay(430), tween({ from, to, duration: 140 })),
  },

  render: (props) =>
    <circle {...props} />
})
```

```react
state: { generation: 0 }
---
<div style={{ display: 'flex' }}>
  <div style={{ flex: 1 }}>
    <Measure bounds>
      {({ measureRef, contentRect: { bounds: { width, height } } }) => (
        <div ref={measureRef} style={{ position: "relative", height: 40 }}>
          {width > 0 && (
            <svg width={width} height={height}>
              <AnimatedCircle fill="teal" cx={(state.generation % 2) * (width - 80) + 40} cy={20} r={(state.generation % 2) * 16 + 4} />
            </svg>
          )}
        </div>
      )}
    </Measure>
  </div>
  <button onClick={() => { setState({ generation: state.generation + 1 }) }}>Click Me!</button>
</div>
```