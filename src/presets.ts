import { LSystem } from "./index";

// Several L-system presets.
const PRESETS = {
    'tree': new LSystem("A", { "A": "B[+A]-A", "B": "BB" }, 2 * Math.PI / 8),
    'sierpinski_regular': new LSystem("A-B-B", { "A": "A-B+A+B-A", "B": "BB" }, 2 * Math.PI / 3),
    'sierpinski_arrowhead': new LSystem("A", { "A": "B-A-B", "B": "A+B+A" }, 2 * Math.PI / 6),
    'dragon': new LSystem("A", {"A": "A+B", "B": "A-B"}, 2 * Math.PI / 4),
    'crystal': new LSystem("A", {"A": "AA-A--A-A"}, 2 * Math.PI / 4),
    'snowflake': new LSystem("A", {"A": "A+A--A+A"}, 2 * Math.PI / 6),
    'gosper': new LSystem("A", {"A": "A-B--B+A++AA+B-", "B": "+A-BB--B-A++A+B"}, 2 * Math.PI / 6),
};

export { PRESETS };
