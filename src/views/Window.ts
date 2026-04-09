/**
 * @author Dan McCarthy
 */

import ANSI from "../ANSI.ts";
import { Input } from "../input/InputTypes.ts";
import LogView from "./LogView.ts";
import View from "./View.ts";

export default class Window {
  private views: View[];

  constructor() {
    this.views = [];

    const { rows, columns } = Deno.consoleSize();
    View.write(ANSI.clearScreen);

    // initialize elements
    const log = new LogView([Math.floor(columns / 2) - 50, 2], 100, rows - 10);
    this.views.push(log);
  }

  public handleInput(input: Input): void {
    // all this does right now is pass input directly to logs
    // in the future I'll need to implement logic to handle
    // different inputs based on the element
    this.views[0].render(input);
  }
}
