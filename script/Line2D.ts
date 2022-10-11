import { Vec2D } from "./index.js";

/**
 * This class describes a 2D line.
 */
export class Line2D {
    from: Vec2D; to: Vec2D;

    /**
     * Describe a line between the given vectors from and to.
     * @param from
     * @param to
     */
    constructor(from: Vec2D, to: Vec2D) {
        [this.from, this.to] = [from, to];
    }
}
