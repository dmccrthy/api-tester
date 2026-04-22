/**
 * These tests cover parsing keyboard input inside the InputHandler. These
 * mainly focus on different raw inputs being intepreted correctly.
 *
 * @author Dan McCarthy
 */

import { assertEquals } from "@std/assert";
import { parseKey } from "../../input/InputHandler.ts";

Deno.test("parseKey() normal character", () => {
  const input = parseKey(new Uint8Array([97])); // this is just 'a'

  assertEquals(input.type, "char");
  assertEquals(input.value, "a");
});

Deno.test("parseKey() enter", () => {
  const input = parseKey(new Uint8Array([13]));

  assertEquals(input.type, "special");
  assertEquals(input.value, "enter");
});

Deno.test("parseKey() backspace", () => {
  const input = parseKey(new Uint8Array([127]));

  assertEquals(input.type, "special");
  assertEquals(input.value, "backspace");
});

Deno.test("parseKey() escape", () => {
  const input = parseKey(new Uint8Array([27]));

  assertEquals(input.type, "special");
  assertEquals(input.value, "escape");
});

Deno.test("parseKey() CTRL+C", () => {
  const input = parseKey(new Uint8Array([3]));

  assertEquals(input.type, "special");
  assertEquals(input.value, "CTRL+C");
});
