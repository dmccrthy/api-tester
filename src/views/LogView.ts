/**
 * UI element representing a log of a users inputs. This
 * is just a proof of concept as to how UI elements work
 * and interact with input.
 * 
 * @author Dan McCarthy
 */

import View from "./View.ts";

export default class LogView extends View {
    protected corner: [number, number];
    protected width: number;
    protected height: number;

    // string array of current logs
    // logs are removed as they reach max height
    private logs: string[];

    constructor(corner, width, height) {
        super();
        this.corner = corner;
        this.width = width;
        this.height = height;
        this.logs = [];

        // handle initial render
        this.render();
    }

    public render(message?: string): void {
        // update log list with new message (and remove old logs)
        if (message) {
            this.logs.push(message + "\n");
        }

        if (this.logs.length >= this.height) {
            this.logs.shift();
        }

        let currRow = this.corner[1];

        // print out header messages
        View.write(`\x1b[${currRow++};${this.corner[0]}H` + "Input Logs" + "\n")
        View.write(`\x1b[${currRow++};${this.corner[0]}H` + "-".repeat(this.width) + "\n");

        // print out logs
        for (const log of this.logs) {
            // this is really (really) terrible. but it works.
            // I will be refactoring this in the near future
            View.write(`\x1b[${currRow++};${this.corner[0]}H\x1b[2K` + log);
        }
    }

    public handleInput(input: Input): void {
        // logview is read only and shouldn't react to input directly
        return;
    }
}