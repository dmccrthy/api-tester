/**
 * UI element representing a text label on the screen.
 *
 * @author Dan McCarthy
 */

import ANSI from "../ANSI.ts";
import View from "./core/View.ts";

export default class Label extends View {
  public label: string;

  constructor(corner: [number, number], label: string) {
    super(corner, label.length, 1);
    this.label = label;
  }

  public override render(): void {
    View.write(
      ANSI.updateCursor(this.corner) + this.label,
    );
  }
}
