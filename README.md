> **repop** is a library which makes it easy to combine React (re) and [popmotion](pop).

Repop provides convenience functions which allow you to create components that use popmotion to interpolate props.

# Quickstart

Let's define a component that shall behave just like a SVG `<circle>`, but whose position (cx, cy) should be interpolated using a linear tween:

```
import { animated } from "repop";
import { tween, easing } from "popmotion";

const AnimatedCircle = animated({
  action: (from, to) =>
    tween({
      from,
      to,
      duration: 1000,
      ease: easing.linear
    })

  render: (props, { cx, cy }) =>
    <circle {...props} cx={cx} cy={cy} />
});
```

And we can use it like so, passing it any props that a regular `<circle>` accepts:

```
<AnimatedCircle cx={cx} cy={cy} r={5} fill='teal' />
```

Oh gosh, that was easy. Now go and search&replace all `<circle` with `<AnimatedCircle` within your projects!

Note though that `animated` only interpolates numerical props. So for example if you change the color of the circle, it'll change immediately. That's a limitation of [popmotion].

# Use different animations for each prop

Maybe you want animate each prop with a different method (use spring for cx/cy but tween for radius). For that you can use `partiallyAnimated`:

```
import { partiallyAnimated } from "repop";
import { tween, spring } from "popmotion";

const AnimatedCircle = partiallyAnimated({
  action: {
    cx: ({ from, to }) =>
      spring({
        from,
        to,
        stiffness: 90,
        damping: 20
      }),
    cy: ({ from, to }) =>
      spring({
        from,
        to,
        stiffness: 10,
        damping: 50
      }),
    r: ({ from, to }) =>
      tween({
        from,
        to,
        duration: 600
      })
  },

  render: props => <circle {...props} />
});
```

# Playground

The repository includes a few examples in the `playground/` folder. Use `npm run playground`
to start the playground server on [localhost:3000](http://localhost:3000).

[popmotion]: https://popmotion.io/
