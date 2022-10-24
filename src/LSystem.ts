export type grammar = { [key: string]: string };

/**
 * This class describes the L-system properties.
 */
export class LSystem {
    // Axiom that is iterated over.
    axiom: string;
    // Grammar that contains production rules.
    grammar: grammar;
    // In radians for all rotations performed by turtles.
    theta: number;

    /**
     * Create an L-system. This system will operate on the axiom using
     * the rules in its grammar.
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
    }
}
