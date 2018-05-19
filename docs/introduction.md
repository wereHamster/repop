Let's suppose you have a simple React component that draws a chart. For example a bar chart. Like the one below.

```react
<HorizontalBar total={200} base={100} used={20} />
```

Now let's suppose you have some controls which cause the values to be shown to change. For example a filter menu that the user can use. Or you continuously load new data from the server and update the bar chart with it.

I've kept it simple and created a button for you to click. It'll change the length to a random value. Go and try it out!

```react
state: { used: 10 }
---
<div style={{ display: 'flex' }}>
  <div style={{ flex: 1 }}>
    <HorizontalBar total={200} base={100} used={state.used} />
  </div>
  <button onClick={() => { setState({ used: Math.random() * 200 }) }}>Click Me!</button>
</div>
```

Notice how the bar immediately changes to the new length. There is no transition, no visual feedback how the bar grows and shrinks. Let's fix that.

The bar itself is a pretty simple component. It takes three props: *total*, *base*, and *used*. All numbers.

```code|lang-js
const HorizontalBar = ({ total, base, used }) => …
```

The usefulnes of **repop** is that you can take such a simple component, wrap it with `animated()`, and it'll animate all numeric props.

```code|lang-js
const AnimatedHorizontalBar = animated({
  action: (from, to) =>
    tween({ from, to, duration: 300 }),

  render: (props, interpolatedProps) =>
    <HorizontalBar {...props} {...interpolatedProps} />
})
```

```react
state: { used: 10 }
---
<div style={{ display: 'flex' }}>
  <div style={{ flex: 1 }}>
    <AnimatedHorizontalBar total={200} base={100} used={state.used} />
  </div>
  <button onClick={() => { setState({ used: Math.random() * 200 }) }}>Click Me!</button>
</div>
```

Oh wow, so smooth, much joy.
