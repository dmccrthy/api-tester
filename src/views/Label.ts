/**
 * UI element representing a text label on the screen.
 *
 * @author Dan McCarthy
 */

import ANSI from "../ANSI.ts";
import { Input } from "../input/InputTypes.ts";
import View from "./View.ts";

export default class Label extends View {
  public label: string;

  constructor(corner: [number, number], label: string) {
    super(corner, label.length, 1);
    this.label = label;

    // handle initial render
    this.render();
  }

  public render(): void {
    View.write(
      ANSI.updateCursor(this.corner) + this.label,
    );
  }

  public handleInput(input: Input): void {}
}
