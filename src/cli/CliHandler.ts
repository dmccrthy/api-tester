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

export default async function cliHandler(
  file: string,
): Promise<APIResponse | string> {
  if (!/.json$/.test(file)) {
    let err = "Error file must end in .json:\n\n" + file;
    console.error(err);

    return err;
  }

  try {
    const data = Deno.readTextFileSync(file);
    const config: EndpointConfig = JSON.parse(data);

    if (!config.url || !config.method) {
      let err = "Error File is missing URL or Method:\n\n" +
        JSON.stringify(config);
      console.error(
        err,
      );

      return err;
    }

    if (!Form.validateURL(config.url)) {
      let err = "Error invalid URL:\n\n" + config.url;
      console.error(err);

      return err;
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

    return status;
  } catch (error) {
    let err = "Error API Request failed:\n\n" + error.message;
    console.error(err);

    return err;
  }
}
