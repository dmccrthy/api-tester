/**
 * Abstract class representing an ui element in the terminal.
 * This was ported over from another exercise.
 *
 * @author Dan McCarthy
 */

import { Input } from "../input/InputTypes.ts";

export default abstract class View {
  // corner represents (x, y) of top-left corner
  // width and height represent the number of rows/columns covered by the element
  //* NOTE: x=columns, while y=rows inside the terminal
  protected corner: [number, number];
  protected width: number;
  protected height: number;
  protected children: View[];

  constructor(corner: [number, number], width: number, height: number) {
    this.corner = corner;
    this.width = width;
    this.height = height;
    this.children = [];
  }

  // trigger a rerender of a specific UI element
  public abstract render(): void;

  // handle input on a specific element
  // Window will pass input events to current ui element
  public abstract handleInput(input: Input): void;

  /**
   * CheckBounds uses corner/width/height to determine if a coordinate
   * is within its bounds (used for clicking on elements). This is
   * recursive as it will check the bounds of its children.
   *
   * @param coords coordinate in format [x, y]
   * @return {View | null} Returns the element its within or null
   */
  public checkBounds(coords: [number, number]): View | null {
    const withinX = (coords[0] >= this.corner[0]) &&
      (coords[0] <= this.corner[0] + this.width);

    const withinY = (coords[1] >= this.corner[1]) &&
      (coords[1] <= this.corner[1] + this.height);

    if (!(withinX && withinY)) {
      return null;
    }

    // if its within the bounds of a child element return that
    for (const element of this.children) {
      const result = element.checkBounds(coords);

      if (result) return result;
    }

    return this;
  }

  /**
   * Handles encoding/writing data to the screen. Static so we can use
   * a single function between each view
   *
   * @param output String to write to stdout
   */
  public static write(output: string): void {
    const encoder = new TextEncoder();
    Deno.stdout.writeSync(encoder.encode(output));
  }
}
