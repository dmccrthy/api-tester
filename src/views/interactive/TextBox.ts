/**
 * UI element representing a TextBox on the screen. Each text box stores a
 * get/update function to update the state of something. For this app its
 * just going to get/update the state store by one of the controllers in
 * ./controllers.
 *
 * @author Dan McCarthy
 */

import ANSI from "../../ANSI.ts";
import { Input } from "../../input/InputTypes.ts";
import View from "../View.ts";

export default class TextBox extends View {
  constructor(
    corner: [number, number],
    width: number,
    private header: string,
    private get: () => string,
    private update: (value: string) => void,
  ) {
    super(corner, width, 4);
    this.header = header;
    this.get = get;
    this.update = update;
  }

  public get value(): string {
    return this.get();
  }

  public override render(): void {
    const [x, y] = this.corner;
    const border = "-".repeat(this.width);

    // ensure content fits inside box (TODO: i should probably implement text wrapping)
    const visibleContent = this.value.slice(0, this.width - 2).padEnd(
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
    if (input.type === "click" || input.type === "scroll") return;

    if (input.value === "backspace") {
      this.update(this.value.slice(0, this.value.length - 1));
    } else if (input.type === "char") {
      this.update(this.value + input.value);
    }
  }
}
