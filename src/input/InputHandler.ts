/**
 * InputHandler is responsible for taking input from stdin and converting it
 * into a format we can use elsewhere. It is effectively just a loop that
 * parses each input to figure out what it is, then passes it back to the app
 * using a callback.
 *
 * @author Dan McCarthy
 */

import Logger from "../controllers/Logger.ts";
import { Input, KeyInput, MouseInput } from "./InputTypes.ts";

/**
 * @param chunk
 * @returns
 */
export function parseKey(chunk: Uint8Array): KeyInput {
  const decoder = new TextDecoder();
  const input: KeyInput = {
    type: "special",
    value: "",
  };

  // each case is a special char (like backspace).
  // all others should be decoded in default
  switch (chunk[0]) {
    case 3:
      input.value = "CTRL+C";
      break;
    case 13:
      input.value = "enter";
      break;
    case 27:
      input.value = "escape";
      break;
    case 127:
      input.value = "backspace";
      break;
    default:
      input.type = "char";
      input.value = decoder.decode(chunk);
  }

  return input;
}

/**
 * @param chunk
 * @param currMouseInput
 * @returns
 */
export function parseMouse(
  chunk: Uint8Array,
  currMouseInput: "left" | "right" | undefined,
): MouseInput | ("left" | "right") {
  const button = chunk[3] - 32;

  // code 3=release (meaning they have finished pressing the button)
  // if its not a release we want to wait to save the input until its released
  if (button !== 3) {
    currMouseInput = button === 0 ? "left" : "right";
    return currMouseInput;
  }

  return {
    type: "mouse",
    x: chunk[4] - 32,
    y: chunk[5] - 32,
    button: currMouseInput ?? "left",
  };
}

export default class InputHandler {
  constructor(private callback: (input: Input) => void) {
    this.callback = callback;
  }

  public async run(): Promise<void> {
    // setRaw is needed to read individual key presses.
    // by default Deno.stdin.readable will wait for a \n
    Deno.stdin.setRaw(true);

    let currMouseInput: "left" | "right";

    for await (const chunk of Deno.stdin.readable) {
      Logger.write("INFO", chunk);

      // single char input is relatively easy to handle
      // we do have to look out for special chars like ESC and Backspace
      if (chunk.length === 1) {
        const input = parseKey(chunk);

        if (
          input.value === "escape" || input.value === "q" ||
          input.value === "CTRL+C"
        ) return;

        this.callback(input);
        continue;
      }

      // handling mouse input here is pretty annoying since its encoded in a very specific way.
      // this program is designed to use normal tracking (from xterm) which is just one format
      // for encoding mouse input. Finding good documentation of this stuff is a pain, but some
      // info about its structure can be found here: https://invisible-island.net/xterm/ctlseqs/ctlseqs.html
      if (chunk.length === 6) {
        const input = parseMouse(chunk, currMouseInput!);

        if (input === "left" || input === "right") {
          currMouseInput = input;
          continue;
        }

        this.callback(input);
      }
    }
  }
}
