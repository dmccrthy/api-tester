/**
 * UI element representing a log of a users inputs. This
 * is just a proof of concept as to how UI elements work
 * and interact with input.
 *
 * @author Dan McCarthy
 */

import ANSI from "../ANSI.ts";
import { Input } from "../input/InputTypes.ts";
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

  public render(input?: Input): void {
    // update log list with new message (and remove old logs)
    if (input) {
      this.logs.push(JSON.stringify(input) + "\n");
    }

    if (input?.type === "mouse") {
      this.logs.push(
        `CLICK ON ELEMENT - ${this.checkBounds([input.x, input.y])}\n`,
      );
    }

    // remove any extra logs past height limit
    while (this.logs.length >= this.height) {
      this.logs.shift();
    }

    let currRow = this.corner[1];

    // print out header messages
    View.write(
      ANSI.updateCursor([this.corner[0], currRow++]) + "Input Logs" + "\n",
    );
    View.write(
      ANSI.updateCursor([this.corner[0], currRow++]) + "-".repeat(this.width) +
        "\n",
    );

    // print out logs
    for (const log of this.logs) {
      // I will be refactoring this in the near future
      View.write(
        ANSI.updateCursor([this.corner[0], currRow++]) + ANSI.clearLine + log,
      );
    }
  }

  public handleInput(input: Input): void {
    // logview is read only and shouldn't react to input directly
    return;
  }
}
