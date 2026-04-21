/**
 * InputHandler is responsible for taking input from stdin and converting it
 * into a format we can use elsewhere. It is effectively just a loop that
 * parses each input to figure out what it is, then passes it back to the app
 * using a callback.
 *
 * @author Dan McCarthy
 */

import { Input, KeyInput, MouseInput } from "./InputTypes.ts";

type Callback = (input: Input) => void;

export default class InputHandler {
  constructor(private callback: Callback) {
    this.callback = callback;
  }

  public async run(): Promise<void> {
    // setRaw is needed to read individual key presses.
    // by default Deno.stdin.readable will wait for a \n
    Deno.stdin.setRaw(true);

    let currMouseInput: "left" | "right";
    const decoder = new TextDecoder();

    for await (const chunk of Deno.stdin.readable) {
      // single char input is relatively easy to handle
      // we do have to look out for special chars like ESC and Backspace
      if (chunk.length === 1) {
        const input: KeyInput = {
          type: "special",
          value: "",
        };

        // each case is a special char (like backspace).
        // all others should be decoded in default
        switch (chunk[0]) {
          case 3:
            // exit program with CTRL + C
            return;
          case 13:
            input.value = "enter";
            break;
          case 27:
            // exit program with escape
            return;
          case 127:
            input.value = "backspace";
            break;
          default:
            input.type = "char";
            input.value = decoder.decode(chunk);
        }

        if (input.value === "q") return;

        this.callback(input);
        continue;
      }

      // handling mouse input here is pretty annoying since its encoded in a very specific way.
      // this program is designed to use normal tracking (from xterm) which is just one format
      // for encoding mouse input. Finding good documentation of this stuff is a pain, but some
      // info about its structure can be found here: https://invisible-island.net/xterm/ctlseqs/ctlseqs.html
      if (chunk.length === 6) {
        const button = chunk[3] - 32;

        // code 3=release (meaning they have finished pressing the button)
        // if its not a release we want to wait to save the input until its released
        if (button !== 3) {
          currMouseInput = button === 0 ? "left" : "right";
          continue;
        }

        const input: MouseInput = {
          type: "mouse",
          x: chunk[4] - 32,
          y: chunk[5] - 32,
          button: currMouseInput!,
        };

        this.callback(input);
      }
    }
  }
}
