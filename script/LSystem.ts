type grammar = { [key: string]: string };

import { Turtle, Line2D, Vec2D } from "./index.js";

/**
 * This class describes the L-system, its generation and traversal.
 */
export class LSystem {
    // Axiom that is iterated over.
    axiom: string;
    // Grammar that contains production rules.
    grammar: grammar;

    // In radians for all rotations performed by turtles.
    theta: number;
    // All lines that were found by traversal.
    lines: Line2D[];

    // Boundaries of the L-system.
    min: Vec2D;
    max: Vec2D;

    /**
     * Create an L-system. This system will operate on the axiom using
     * the rules in its grammar. The axiom will therefore change when iterating.
     *
     * After iteration, axiom traversal will construct all lines and the boundaries
     * of the system by using a stack of turtles.
     *
     * The rotation in theta radians will be constant for every turtle.
     * @param axiom
     * @param grammar
     * @param theta
     */
    constructor(axiom: string, grammar: grammar, theta: number) {
        this.axiom = axiom;
        this.grammar = grammar;
        this.theta = theta;
        this.lines = [];
        this.min = Vec2D.zero();
        this.max = Vec2D.zero();
    }

    /**
     * Iterate over the current axiom, using the production rules to construct
     * the new axiom.
     */
    iterate(): void {
        let productions: string[] = [];

        for (let c of this.axiom) {
            if (c in this.grammar) {
                productions.push(this.grammar[c]);
            } else {
                productions.push(c);
            }
        }

        this.axiom = productions.join("");
    }

    /**
     * Iterate n times over the current axiom.
     * @param n
     */
    iterateN(n: number): void {
        for(let i = 0; i < n; i++) {
            this.iterate();
        }
    }

    /**
     * Traverse the current axiom to generate its lines, to be drawn by an
     * external library.
     * At the same time, determine the boundaries of the system.
     */
    traverseAxiom(): void {
        let curTurtle: Turtle = Turtle.init();
        let prevTurtles: Turtle[] = [];

        for (let c of this.axiom) {
            switch (c) {
                case "A": case "B": case "C":
                    let pointFrom = curTurtle.pos;
                    curTurtle = curTurtle.moveDir();
                    let pointTo = curTurtle.pos;

                    this.updateBounds(pointTo);
                    this.lines.push(new Line2D(pointFrom, pointTo));

                    break;
                case "+":
                    curTurtle = curTurtle.turn(this.theta);
                    break;
                case "-":
                    curTurtle = curTurtle.turn(-this.theta);
                    break;
                case "[":
                    prevTurtles.push(curTurtle);
                    break;
                case "]":
                    curTurtle = prevTurtles.pop()!;
                    break;
            }
        }
    }

    /**
     * Update the boundaries of the system using the given point.
     * @param point
     */
    updateBounds(point: Vec2D): void {
        if (point.x < this.min.x) {
            this.min.x = point.x;
        } else if (point.x > this.max.x) {
            this.max.x = point.x;
        }

        if (point.y < this.min.y) {
            this.min.y = point.y;
        } else if (point.y > this.max.y) {
            this.max.y = point.y;
        }
    }
}
