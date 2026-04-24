/**
 * UI element representing a TextBox on the screen.
 *
 * @author Dan McCarthy
 */

import ANSI from "../../ANSI.ts";
import { Input } from "../../input/InputTypes.ts";
import View from "../View.ts";

export default class TextBox extends View {
  private header: string;
  public content: string;

  constructor(corner: [number, number], width: number, header: string) {
    super(corner, width, 4);
    this.header = header;
    this.content = "";
  }

  public override render(): void {
    const [x, y] = this.corner;
    const border = "-".repeat(this.width);

    // ensure content fits inside box (TODO: i should probably implement text wrapping)
    const visibleContent = this.content.slice(0, this.width - 2).padEnd(
      this.width - 2,
      " ",
    );

    View.write(
      ANSI.updateCursor([x, y]) + this.header + "\n" +
        ANSI.updateCursor([x, y + 1]) + border + "\n" +
        ANSI.updateCursor([x, y + 2]) + "|" + visibleContent + "|" + "\n" +
        ANSI.updateCursor([x, y + 3]) + border,
    );
  }

  public override handleInput(input: Input): void {
    if (input.type === "mouse") return;

    if (input.value === "backspace") {
      this.content = this.content.slice(0, this.content.length - 1);
    } else {
      this.content += input.value;
    }
  }
}
