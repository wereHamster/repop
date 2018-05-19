The `animated()` function is the most basic one, but also the easiest to use. It automatically animates all numeric properties, and then gives to your render function both the original props, and the interpolated ones. The choice which ones to use is up to you.

Let's suppose you want to animate the `cx` and `cy` props of a SVG `<circle>`, but have the radius and opacity change immediately:

```code|lang-js
const AnimatedCirle = animated({
  action: (from, to) =>
    tween({ from, to, duration: 300 }),

  render: (props, { cx, cy }) =>
    <circle {...props} cx={cx} cy={cy} />
})
```

And later you can use it in place of any SVG `<circle>`, like so:

```code|lang-js
<AnimatedCircle fill={…} fillOpacity={…} r={…} cx={…} cy={…} />
```

A slightly more advanced module is [partiallyAnimated](/modules/partiallyAnimated), which allows you to explicitly list which props should be animated, and also animate each prop with a different action (eg. use a spring for one prop and a tween for another prop).