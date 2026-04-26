/**
 * This is the primary entrypoint for the application. It initializes the
 * window and input handler, along with cleaning up.
 *
 *  deno run main.ts
 *
 * @author Dan McCarthy
 */

import ANSI from "./ANSI.ts";
import Database from "./controllers/Database.ts";
import inputHandler from "./input/InputHandler.ts";
import { Input } from "./input/InputTypes.ts";
import View from "./views/View.ts";
import Window from "./views/Window.ts";

View.write(ANSI.mouseTracking.enable + ANSI.cursor.disable);

try {
  // input is passed from the InputHandler to the actual window which controls that app
  const window = new Window();
  const input = new inputHandler((input: Input) => {
    window.handleInput(input);
  });

  await input.run();
} catch (error) {
  // placeholder for now. TODO: expand on this more later
  console.error(error);
} finally {
  View.write(ANSI.mouseTracking.disable + ANSI.cursor.enable);
  Database.close();
}
