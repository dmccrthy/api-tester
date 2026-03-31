/**
 * InputHandler is responsible for taking input from stdin and converting it
 * into a format we can use elsewhere. It is effectively just a loop that 
 * parses each input to figure out what it is, then passes it back to the app
 * using a callback..
 * 
 * @author Dan McCarthy
 */

import { KeyInput, MouseInput, Input } from "./InputTypes.ts"

type Callback = (input: Input) => void;

export default class InputHandler {
    constructor(private callback: Callback) {
        this.callback = callback;
    }

    public async run(): Promise<void> {
        // setRaw is needed to read individual key presses.
        // by default Deno.stdin.readable will wait for a \n
        Deno.stdin.setRaw(true);

        const decoder = new TextDecoder();

        for await (const chunk of Deno.stdin.readable) {
            // single char input is relatively easy to handle
            // we do need to look out for special chars like ESC and Backspace
            if (chunk.length === 1) {
                let input: KeyInput = {
                    type: "special",
                    value: ""
                };

                // each case is a special char (like backspace).
                // all others should be decoded in default
                switch (chunk[0]) {
                    case 13: // enter
                        input.value = "enter"
                        break;
                    case 27: // escape
                        input.value = "escape"

                        // exit program with escape
                        return;
                    case 127: // backspace
                        input.value = "backspace"
                        break;
                    default:
                        // update type, and actually decode text
                        input.type = "char"
                        input.value = decoder.decode(chunk);
                }

                // exit with q
                if (input.value === "q") return;

                this.callback(input);
                continue;
            }

            // any other input is more complicated (and usually contains escape sequences)


            // handling mouse input here is pretty annoying since its encoded in a very specific way.
            // this program is designed to work with X10 which is just one format for encoding mouse inputs.
            // a good explanation of this (and how data is encoded) can be found here: https://deepwiki.com/neiropacks/xterm-mouse/3.3-terminal-protocols
            if (chunk.length === 6) {
                const button = chunk[3] - 32 === 0 ? "left" : "right";

                const input: MouseInput = {
                    type: "mouse",
                    x: chunk[4] - 32,
                    y: chunk[5] - 32,
                    button: button
                }

                this.callback(input);
                continue;
            }
        }
    }
}