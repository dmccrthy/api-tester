/**
 * Abstract class representing an element that can be scrolled. Handles tracking
 * the offset and handling scroll input.
 *
 * @author Dan McCarthy
 */

import Logger from "../../controllers/Logger.ts";
import { Input } from "../../input/InputTypes.ts";
import View from "./View.ts";

export default abstract class Scrollable extends View {
  public abstract scrollOffset: number;
  public abstract maxHeight: number;
  public abstract minHeight: number;

  public override render(): void {
    // elements are only rendered if on screen
    for (const element of this.children) {
      const y = element.corner[1];

      Logger.write("DEBUG", this.minHeight + " " + this.maxHeight);
      if (y >= this.maxHeight && y <= this.minHeight) {
        element.render();
      }
    }
  }

  public override handleInput(input: Input): void {
    if (input.type === "scroll") {
      Logger.write("DEBUG", this.scrollOffset);

      //   const maxHeight = this.ec.endpoints.length * -4;
      //   const minHeight = 0;

      // scroll will only trigger when within the max/min height.
      if (input.direction === "down" && this.scrollOffset !== this.maxHeight) {
        this.scrollOffset -= 1;

        for (const element of this.children) {
          element.corner[1] -= 1;
          Logger.write("DEBUG", element);
        }
      } else if (
        input.direction === "up" && this.scrollOffset !== this.minHeight
      ) {
        this.scrollOffset += 1;

        for (const element of this.children) {
          element.corner[1] += 1;
        }
      }

      this.render();
    }
  }
}
