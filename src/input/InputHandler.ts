/**
 * InputHandler is responsible for taking input from stdin and converting it
 * into a format we can use elsewhere. It is effectively just a loop that
 * parses each input to figure out what it is, then passes it back to the app
 * using a callback.
 *
 * @author Dan McCarthy
 */

import Logger from "../controllers/Logger.ts";
import {
  Input,
  KeyInput,
  MouseClick,
  MouseScroll,
} from "./InputTypes.ts";

/**
 * This function handles key inputs. For the special keys it will map them
 * to a string like "CTRL+C". For the rest it will decode it as whatever 
 * character it represents.
 */
export function parseKey(chunk: Uint8Array): KeyInput {
  // Special key values are stored across 2 objects
  // one stores the key code, and the other maps that code to a string
  const SpecialKeyCodes = {
    CTRL_C: 3,
    ENTER: 13,
    ESCAPE: 27,
    BACKSPACE: 127,
  };

  const KEY_MAP: Record<number, SpecialKey> = {
    [SpecialKeyCodes.CTRL_C]: "CTRL+C",
    [SpecialKeyCodes.ENTER]: "enter",
    [SpecialKeyCodes.ESCAPE]: "escape",
    [SpecialKeyCodes.BACKSPACE]: "backspace",
  };


  const code = chunk[0];
  const specialKey = KEY_MAP[code];

  // if the code maps to a special key (ie. enter, escape) skip decoding it
  if (specialKey) {
    return {
      type: "special",
      value: specialKey,
    };
  }

  return {
    type: "char",
    value: new TextDecoder().decode(chunk),
  };
}

/**
 * This function handles decoding mouse inputs. this program is designed to use normal 
 * tracking mode (from xterm) which is just one format for encoding mouse input. Finding 
 * good documentation of this stuff is a pain, but some info about its structure can 
 * be found here: https://invisible-island.net/xterm/ctlseqs/ctlseqs.html
 */
export function parseMouse(
  chunk: Uint8Array,
): MouseClick | MouseScroll | void {
  const x = chunk[4] - 32;
  const y = chunk[5] - 32;
  const button = chunk[3] - 32;

  if (button === 64 || button === 65) {
      return {
        type: "scroll",
        x: x, 
        y: y,
        direction: button === 64 ? "up" : "down",
      };
    }

    if (button === 3) {
      return { type: "click", x: x, y: y };
    }
}

export default class InputHandler {
  constructor(private callback: (input: Input) => void) {
    this.callback = callback;
  }

  public async run(): Promise<void> {
    // setRaw is needed to read individual key presses.
    // by default Deno.stdin.readable will wait for a \n
    Deno.stdin.setRaw(true);

    for await (const chunk of Deno.stdin.readable) {
      Logger.write("DEBUG", "InputHandler.run() raw input received - ", chunk);

      // handle single char input
      if (chunk.length === 1) {
        const keyInput = parseKey(chunk);

        if (
          keyInput.value === "escape" ||
          keyInput.value === "CTRL+C"
        ) return;

        this.callback(keyInput);
      }

      // handle mouse input
      if (chunk.length === 6) {
        const mouseInput = parseMouse(chunk);

        if (mouseInput) {
          this.callback(mouseInput);
        }
      }
    }
  }
}
