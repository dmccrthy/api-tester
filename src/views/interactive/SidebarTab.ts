/**
 * @author Dan McCarthy
 */

import Button from "./Button.ts";

export default class SidebarTab extends Button {
  constructor(corner: [number, number], label: string, callback: () => void) {
    super(corner, label.length + 4, 3);
    this.label = label;
    this.callback = callback;
  }

  public override render(): void {
    const [x, y] = this.corner;
    const border = "-".repeat(this.width);

    View.write(
      ANSI.updateCursor([x, y]) + ANSI.bgWhite + ANSI.textBlack + border +
        "\n" +
        ANSI.updateCursor([x, y + 1]) + "| " + this.label + " |" + "\n" +
        ANSI.updateCursor([x, y + 2]) + border + ANSI.resetColor,
    );
  }
}
