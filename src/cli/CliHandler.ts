/**
 * Handles the CLI portion of this application. If cli args are passed
 * it will try to run the api call directly instead of using the interactive
 * menu.
 *
 * @author Dan McCarthy
 */

import apiHandler from "../api/ApiHandler.ts";
import { EndpointConfig } from "../models/EndpointTypes.ts";
import Form from "../views/Form.ts";
import ANSI from "../ANSI.ts";

export default async function cliHandler(file: string): Promise<void> {
  try {
    const data = Deno.readTextFileSync(file);
    const config: EndpointConfig = JSON.parse(data);

    if (!config.url || !config.method) {
      console.error(
        "Error File is missing URL or Method:\n\n" + JSON.stringify(config),
      );
      Deno.exit(1);
    }

    if (!Form.validateURL(config.url)) {
      console.error("Error invalid URL:\n\n" + config.url);
      Deno.exit(1);
    }

    // convert body to string instead of object
    // this is needed by the apiHandler which expects string
    if (config.body) {
        config.body = JSON.stringify(config.body);
    }

    const status = await apiHandler(config);
    const statusMessage = status.status === "SUCCESS"
      ? `${ANSI.textGreen} SUCCESS ${ANSI.resetColor}`
      : `${ANSI.textRed} FAIL - ${status.message} ${ANSI.resetColor}`;

    console.log("--- Status ---");
    console.log(statusMessage + "\n");
    console.log("--- API Response ---");
    console.log(status.response);
  } catch (error) {
    console.error("Error API Request failed:\n\n" + error.message);
  }
}
