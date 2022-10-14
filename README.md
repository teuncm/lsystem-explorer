## L-System Explorer

This project is capable of generating [L-systems](https://en.wikipedia.org/wiki/L-system). More specifically, it generates deterministic, context-free L-systems ([D0L-systems](https://en.wikipedia.org/wiki/Morphic_word#D0L_system)) that produce only connected curves. Generating line segment coordinates is done by means of [turtle graphics](https://en.wikipedia.org/wiki/Turtle_graphics). Finally, the line segments are efficiently rendered in 3D using [Three.js](https://threejs.org/), which also provides convenient 3D pan, zoom and rotation controls for the scene.

### Usage
`npm install; npm run build; npm run preview`

### Turtle actions
Five turtle actions exist on symbols of the axiom:

`A, B, C`: move forward while drawing a line  
`+`: rotate left  
`-`: rotate right  
`[`: push turtle on stack  
`]`: pop turtle from stack

And, for completeness, implicit no-op:

`(any)`: no action

### Axiom manipulation
Assume the following setup:
```js
axiom  =  "A";
grammar  = {"A": "A+B", "B": "A-B"};
```
Let's call `lSystem.iterateN(3)`. The system will produce the following intermediate axioms by successively applying the production rules of the grammar to all characters of the axiom:

0) `"A"`
1) `"A+B"`
2) `"A+B+A-B"`
3) `"A+B+A-B+A+B-A-B"`

This system (and most other systems) will grow exponentially. Setting the number of iterations too high will crash your browser.

### To do
- Build web interface for user input
- Parse user input
- Show L-system presets
