/**
 * UI element representing a radio input on the screen.
 *
 * @author Dan McCarthy
 */

import ANSI from "../../ANSI.ts";
import { Input } from "../../input/InputTypes.ts";
import View from "../View.ts";

export default class Multiselect extends View {
  constructor(
    corner: [number, number],
    private header: string,
    private options: string[],
    private get: () => string,
    private update: (value: string) => void,
  ) {
    // NOTE: width is calculated based on the length of option strings
    super(
      corner,
      options.map((str) => str.length).reduce((acc, curr) => acc += curr + 5),
      4,
    );
    this.header = header;
    this.options = options;
    this.get = get;
    this.update = update;
  }

  public override render(): void {
    let [x, y] = this.corner;
    const selected = this.get();

    View.write(ANSI.updateCursor([x, y]) + this.header + "\n");
    for (const option of this.options) {
      const length = option.length + 4;
      const border = "-".repeat(length);

      // used to highlight the selected box in the multiselect
      const highlight = option === selected
        ? ANSI.textBlack + ANSI.bgWhite
        : "";
      const disableHighlight = option === selected ? ANSI.resetColor : "";

      View.write(
        ANSI.updateCursor([x, y + 1]) + highlight + border +
          ANSI.updateCursor([x, y + 2]) + `| ${option} |` +
          ANSI.updateCursor([x, y + 3]) + border + disableHighlight,
      );

      x += length;
    }
  }

  public override handleInput(input: Input): void {
    if (input.type !== "click") return;

    let [x] = this.corner;

    // determining what option was pressed can be down using the x coordinate
    // since options are lined up horizontally.
    for (const option of this.options) {
      const length = option.length + 4;

      if (input.x >= x && input.x < x + length) {
        this.update(option);
        return;
      }

      x += length;
    }
  }
}
