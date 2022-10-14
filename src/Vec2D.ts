/**
 * This class describes a 2D vector.
 */
export class Vec2D {
    x: number; y: number;

    /**
     * Create a vector with the given coordinates.
     * @param x
     * @param y
     */
    constructor(x: number, y: number) {
        [this.x, this.y] = [x, y];
    }

    /**
     * Zero vector
     * @returns new Vec2D
     */
    static zero(): Vec2D {
        return new Vec2D(0, 0);
    }

    /**
     * Unit vector at angle of theta radians.
     * @param theta
     * @returns new Vec2D
     */
    static unit(theta: number): Vec2D {
        return new Vec2D(1, 0).rot(theta);
    }

    /**
     * Add other vector.
     * @param other
     * @returns new Vec2D
     */
    add(other: Vec2D): Vec2D {
        return new Vec2D(this.x + other.x, this.y + other.y);
    }

    /**
     * Multiply vector by factor n.
     * @param n
     * @returns new Vec2D
     */
    mult(n: number): Vec2D {
        return new Vec2D(n*this.x, n*this.y);
    }

    /**
     * Rotate CCW by theta radians.
     * @param theta
     * @returns new Vec2D
     */
    rot(theta: number): Vec2D {
        let [ct, st] = [Math.cos(theta), Math.sin(theta)];

        return new Vec2D(ct*this.x - st*this.y, st*this.x + ct*this.y);
    }
}
