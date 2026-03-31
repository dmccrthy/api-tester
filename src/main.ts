/**
 * The goal for this exercise was to setup a basic input system
 * for a terminal based application. I wanted to get it setup so that
 * it could handle different kinds of input (chars, special keys, and mouse).
 * Additionally I wanted to see if I could integrate this with a basic UI which
 * would then do something with the input. This is all really just work towards
 * the final project for this class as handling input and how it interacts with
 * the UI is going to be the hardest part. For know you can run his program using
 * the command below:
 * 
 *  deno run src/main.ts
 * 
 * @author Dan McCarthy
 */

import ANSI from "./ANSI.ts";
import inputHandler from "./input/InputHandler.ts";
import { Input } from "./input/InputTypes.ts";
import View from "./views/View.ts";
import Window from "./views/Window.ts";

// Enable X10 mouse reporting (so we can see any mouse clicks)
// also disable cursor
View.write("\x1b[?9h" + ANSI.cursor.disable);

try {
    // input is passed from the InputHandler to the actual window which controls that app
    const window = new Window();
    const input = new inputHandler((input: Input) => { window.handleInput(input) })

    await input.run();
} catch(error) {
    // placeholder for now. Should expand on this more later
    console.error(error);
} finally {
    // cleanup (disable X10 and enable cursor)
    View.write("\x1b[?9l" + ANSI.cursor.enable)
}



