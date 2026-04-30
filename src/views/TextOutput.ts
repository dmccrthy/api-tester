/**
 * Multiline textbox used for displaying data.
 *
 * @author Dan McCarthy
 */

import ANSI from "../ANSI.ts";
import { Input } from "../input/InputTypes.ts";
import View from "./core/View.ts";

export default class TextOutput extends View {
  constructor(
    corner: [number, number],
    width: number,
    private header: string,
    private get: () => string,
  ) {
    super(corner, width, 100);
    this.header = header;
    this.get = get;
    this.render();
  }

  public get value(): string {
    return this.get();
  }

  public override render(): void {
    let [x, y] = this.corner;
    const border = "-".repeat(this.width);
    const content = this.get().split("\n");

    View.write(
      ANSI.updateCursor([x, y++]) + this.header + "\n" +
        ANSI.updateCursor([x, y++]) + border + "\n",
    );
    for (const line of content) {
      // ensure content fits inside box (TODO: i should probably implement text wrapping)
      const visibleContent = line.slice(0, this.width - 2)
        .padEnd(
          this.width - 2,
          " ",
        );

      View.write(
        ANSI.updateCursor([x, y++]) + "|" + visibleContent + "|" + "\n",
      );
    }

    View.write(ANSI.updateCursor([x, y]) + border);
  }
}
