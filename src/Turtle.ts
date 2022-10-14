import { Vec2D } from "./index";

/**
 * This class describes turtles that are usable for turtle graphics.
 */
export class Turtle {
    pos: Vec2D; dir: Vec2D;

    /**
     * Create a turtle with the given position and direction.
     * @param pos
     * @param dir
     */
    constructor(pos: Vec2D, dir: Vec2D) {
        [this.pos, this.dir] = [pos, dir];
    }

    /**
     * Initialize a turtle with its position at the origin and
     * its direction towards the x-axis.
     * @returns new Turtle
     */
    static init(): Turtle {
        return new Turtle(Vec2D.zero(), Vec2D.unit(0));
    }

    /**
     * Move turtle position by turtle direction.
     * @returns new Turtle
     */
    moveDir(): Turtle {
        return new Turtle(this.pos.add(this.dir), this.dir);
    }

    /**
     * Make turtle turn by theta radians.
     * @param theta
     * @returns new Turtle
     */
    turn(theta: number): Turtle {
        return new Turtle(this.pos, this.dir.rot(theta));
    }
}
