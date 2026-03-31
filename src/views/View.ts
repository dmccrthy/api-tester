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
    // NOTE: x=columns, while y=rows inside the terminal
    protected abstract corner: [number, number];
    protected abstract width: number;
    protected abstract height: number;

    // trigger a rerender of a specific UI element
    public abstract render(): void;

    // handle input on a specific element
    // Window will pass input events to current ui element
    public abstract handleInput(input: Input): void;

    /**
     * CheckBounds uses corner/width/height to determine if a coordinate
     * is within its bounds (used for clicking on elements)
     * 
     * @param coords coordinate in format [x, y]
     * @return {boolean} true if within bounds (false otherwise)
     */
    public checkBounds(coords: [number, number]): boolean {
        const withinX = (coords[0] >= this.corner[0]) && (coords[0] <= this.corner[0] + this.width);
        const withinY = (coords[1] >= this.corner[1]) && (coords[1] <= this.corner[1] + this.height);

        return withinX && withinY;
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