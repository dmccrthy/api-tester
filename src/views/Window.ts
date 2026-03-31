/**
 * 
 * @author Dan McCarthy
 */

import { Input } from "../input/InputTypes.ts";
import LogView from "./LogView.ts";
import View from "./View.ts";

export default class Window {
    private views: View[];

    constructor() {
        this.views = []

        const { rows, columns } = Deno.consoleSize();
        View.write("\x1b[2J");

        // initialize elements
        const log = new LogView([(columns / 2) - 50, 2], 100, rows - 10)
        this.views.push(log);
    }

    public handleInput(input: Input): void {
        // all this does right now is pass input directly to logs
        // in the future I'll need to implement logic to handle
        // different inputs based on the element
        this.views[0].render(JSON.stringify(input));
    }
}