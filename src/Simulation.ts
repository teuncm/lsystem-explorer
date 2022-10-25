import { LSystem, Turtle, Vec2D } from "./index";

/**
 * This class describes the L-system, its generation and traversal.
 */
export class Simulation {
    // The L-system that this simulation will use.
    lSystem: LSystem;

    // The result of applying the L-system rules.
    iteratedAxiom: string;

    // All lines that were found by traversal.
    points: Vec2D[];

    // Boundaries of the L-system.
    min: Vec2D;
    max: Vec2D;

    /**
     * Construct a simulation using the given L-system.
     * @param lSystem
     */
    constructor(lSystem: LSystem) {
        this.lSystem = lSystem;
        this.iteratedAxiom = "";
        this.points = [];
        this.min = Vec2D.zero();
        this.max = Vec2D.zero();
    }

    /**
     * Iterate over the current axiom, using the production rules to construct
     * the new axiom.
     */
    iterate(): void {
        // Define iteration 0 to copy the axiom from the L-system.
        if (this.iteratedAxiom == "") {
            this.iteratedAxiom = this.lSystem.axiom;

            return;
        }

        let productions: string[] = [];

        for (let c of this.iteratedAxiom) {
            if (c in this.lSystem.grammar) {
                productions.push(this.lSystem.grammar[c]);
            } else {
                productions.push(c);
            }
        }

        this.iteratedAxiom = productions.join("");
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

        this.points = [];
        for (let c of this.iteratedAxiom) {
            switch (c) {
                case "A": case "B": case "C":
                    let pointFrom = curTurtle.pos;
                    curTurtle = curTurtle.moveDir();
                    let pointTo = curTurtle.pos;

                    this.updateBounds(pointTo);
                    this.points.push(pointFrom);
                    this.points.push(pointTo);

                    break;
                case "+":
                    curTurtle = curTurtle.turn(this.lSystem.theta);
                    break;
                case "-":
                    curTurtle = curTurtle.turn(-this.lSystem.theta);
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
