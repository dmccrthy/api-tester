/**
 * Multiline textbox used for displaying data.
 *
 * @author Dan McCarthy
 */

import ANSI from "../ANSI.ts";
import Logger from "../controllers/Logger.ts";
import { Input } from "../input/InputTypes.ts";
import View from "./core/View.ts";

export default class TextOutput extends View {
  private scrollOffset: number = 0;

  constructor(
    corner: [number, number],
    width: number,
    private header: string,
    private get: () => string,
  ) {
    super(corner, width, 10);
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

    for (let i = 0; i < this.height - 2; i++) {
      let visibleContent: string;
      const index = i - this.scrollOffset;

      // ensure content fits inside box (TODO: i should probably implement text wrapping)
      if (content[index]) {
        visibleContent = content[index].slice(0, this.width - 2)
          .padEnd(
            this.width - 2,
            " ",
          );
      } else {
        visibleContent = "".padEnd(this.width - 2, " ");
      }

      View.write(
        ANSI.updateCursor([x, y++]) + "|" + visibleContent + "|" + "\n",
      );
    }

    View.write(ANSI.updateCursor([x, y]) + border);
  }

  public override handleInput(input: Input): void {
    if (input.type === "scroll") {
      Logger.write(
        "DEBUG",
        "TextOutput() updated scrollOffset - ",
        this.scrollOffset,
      );

      if (input.direction === "down") {
        // scroll height is based on the number of lines in the response
        this.scrollOffset = Math.max(
          this.get().split("\n").length * -1,
          this.scrollOffset - 1,
        );
      } else {
        this.scrollOffset = Math.min(0, this.scrollOffset + 1);
      }

      this.render();
    }
  }
}
