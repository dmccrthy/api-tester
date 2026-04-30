/**
 * UI element representing a Button on the screen.
 *
 * @author Dan McCarthy
 */

import ANSI from "../../ANSI.ts";
import { Input } from "../../input/InputTypes.ts";
import Selectable from "../core/Selectable.ts";
import View from "../core/View.ts";

export default class Button extends View {
  protected label: string;
  protected callback: () => void;
  public highlighted: boolean = false;

  constructor(corner: [number, number], label: string, callback: () => void) {
    super(corner, label.length + 4, 3);
    this.label = label;
    this.callback = callback;
    this.render();
  }

  public override render(): void {
    let [x, y] = this.corner;
    const border = "-".repeat(this.width);

    View.write(
      ANSI.updateCursor([x, y]) + ANSI.bgWhite + ANSI.textBlack + border +
        "\n" +
        ANSI.updateCursor([x, y + 1]) + "| " + this.label + " |" + "\n" +
        ANSI.updateCursor([x, y + 2]) + border + ANSI.resetColor,
    );
  }

  public override handleInput(input: Input): void {
    if (input.type === "click") {
      this.callback();
    }

    this.render();
  }
}
