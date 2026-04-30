/**
 * This test covers checkBounds method in View.ts.
 *
 * @author Dan McCarthy
 */

import { assertEquals } from "@std/assert";
import View from "../../views/core/View.ts";

// placeholder element to test click detection
class TestView extends View {
  public render() {}
  public handleInput() {}

  public appendChild(element: View) {
    this.children.push(element);
  }
}

Deno.test("checkBounds() returns itself when clicked", () => {
  const view = new TestView([0, 0], 10, 10);
  const result = view.checkBounds([5, 5]);

  assertEquals(result, view);
});

Deno.test("checkBounds() returns null when not clicked", () => {
  const view = new TestView([0, 0], 10, 10);
  const result = view.checkBounds([11, 11]);

  assertEquals(result, null);
});

Deno.test("checkBounds() returns child element when clicked", () => {
  const view = new TestView([0, 0], 20, 20);
  const child = new TestView([10, 10], 5, 5);
  view.appendChild(child);

  const result = view.checkBounds([11, 11]);

  assertEquals(result, child);
});

Deno.test("checkBounds() returns itself and not child element", () => {
  const view = new TestView([0, 0], 20, 20);
  const child = new TestView([10, 10], 5, 5);
  view.appendChild(child);

  const result = view.checkBounds([9, 9]);

  assertEquals(result, view);
});
