/**
 * This covers tests related to parsing mouse input inside the inputHandler.
 *
 * @author Dan McCarthy
 */

import { assertEquals, assertExists } from "@std/assert";
import { parseMouse } from "../../input/InputHandler.ts";
import type { MouseClick, MouseScroll } from "../../input/InputTypes.ts";

function createMouseChunk(
  button: number,
  x: number,
  y: number,
): Uint8Array {
  // the mouse data is sent using an escape sequence with the button, and position attached.
  // more info on this here: https://invisible-island.net/xterm/ctlseqs/ctlseqs.html#h3-Normal-tracking-mode
  return new Uint8Array([
    27,
    91,
    77,
    button + 32,
    x + 32,
    y + 32,
  ]);
}

Deno.test("parseMouse() left click returns button state", () => {
  const chunk = createMouseChunk(0, 10, 5);
  const result = parseMouse(chunk);

  assertEquals(result, "left");
});

Deno.test("parseMouse() right click returns button state", () => {
  const chunk = createMouseChunk(1, 10, 5);
  const result = parseMouse(chunk);

  assertEquals(result, "right");
});

Deno.test("parseMouse() MB3 is treated like left click", () => {
  const chunk = createMouseChunk(2, 10, 5);
  const result = parseMouse(chunk);

  assertEquals(result, "right");
});

Deno.test("parseMouse() release event returns MouseClick", () => {
  // need type assertion here sine type function returns different types
  const chunk = createMouseChunk(3, 15, 8);
  const result = parseMouse(chunk, "left") as MouseClick;

  assertExists(result);
  assertEquals(result.type, "click");
  assertEquals(result.x, 15);
  assertEquals(result.y, 8);
  assertEquals(result.button, "left");
});

//
// Deno.test("run() right click handled", async () => {

// });
