/**
 * This is the primary entrypoint for the application. It initializes the
 * window and input handler, along with cleaning up.
 *
 *  deno run --allow-read --allow-write main.ts
 *
 * @author Dan McCarthy
 */

import { load } from "@std/dotenv";
import { parseArgs } from "@std/cli/parse-args";
import ANSI from "./ANSI.ts";
import Database from "./controllers/Database.ts";
import EndpointController from "./controllers/EndpointController.ts";
import Logger from "./controllers/Logger.ts";
import inputHandler from "./input/InputHandler.ts";
import cliHandler from "./cli/CliHandler.ts";
import { Input } from "./input/InputTypes.ts";
import View from "./views/core/View.ts";
import Window from "./views/Window.ts";
import EndpointModel from "./models/EndpointModel.ts";

await load({ export: true }); // expose environement variables through Deno.env

const args = parseArgs(Deno.args, {
  string: ["file"],
  alias: { f: "file" },
});

// if file is specified run program using the CliHandler
if (args.file) {
  await cliHandler(args.file);
  Deno.exit(0);
}

// run in interactive mode
View.write(ANSI.mouseTracking.enable + ANSI.cursor.disable);

try {
  const endpoints = await EndpointModel.getEndpoints();
  Logger.write("DEBUG", "main.ts - ", endpoints);
  const ec = new EndpointController(endpoints);

  // input is passed from the InputHandler to the actual window which controls that app
  const window = new Window(ec);
  const input = new inputHandler((input: Input) => {
    window.handleInput(input);
  });

  await input.run();
} catch (error) {
  Logger.write("ERROR", "main.ts - ", error.message);
} finally {
  View.write(
    ANSI.mouseTracking.disable + ANSI.cursor.enable + ANSI.clearScreen +
      ANSI.updateCursor([0, 0]),
  );
  Database.close();
  Logger.write("INFO", "Closed database connections and shutting down");
}
