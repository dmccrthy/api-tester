/**
 * UI element representing a Button on the screen.
 *
 * @author Dan McCarthy
 */

import ANSI from "../../ANSI.ts";
import { Input } from "../../input/InputTypes.ts";
import View from "../View.ts";

export default class Button extends View {
  private label: string;
  private callback: () => void;

  constructor(corner: [number, number], label: string, callback: () => void) {
    super(corner, label.length + 4, 3);
    this.label = label;
    this.callback = callback;

    // handle initial render
    this.render();
  }

  public render(): void {
    const [x, y] = this.corner;
    const border = "-".repeat(this.width);

    View.write(
      ANSI.updateCursor([x, y]) + ANSI.bgWhite + ANSI.textBlack + border +
        "\n" +
        ANSI.updateCursor([x, y + 1]) + "| " + ANSI.resetColor + this.label +
        ANSI.bgWhite + ANSI.textBlack + " |" + "\n" +
        ANSI.updateCursor([x, y + 2]) + border + ANSI.resetColor,
    );
  }

  public handleInput(input: Input): void {
    if (input.type === "mouse") {
      this.callback();
      this.render();
    }
  }
}
