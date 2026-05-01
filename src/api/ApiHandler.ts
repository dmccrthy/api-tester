/**
 * Handles making request to specified endpoints. Using current endpoint
 * from EndpointController and tries to make the request. Gives back
 * a response based on wether the request was successful or not which
 * is handled by who ever calls it.
 *
 * @author Dan McCarthy
 */

import EndpointController from "../controllers/EndpointController.ts";
import Logger from "../controllers/Logger.ts";
import { EndpointConfig } from "../models/EndpointTypes.ts";
import ky from "ky";

type APIResponse = {
  status: "SUCCESS" | "FAILURE";
  message?: string;
  response: string;
};

export default async function apiHandler(
  config: EndpointConfig,
  ec?: EndpointController,
): APIResponse {
  let response: string;

  try {
    // ran into quite a few problems getting the JSON body to work with fetch
    // seems to work correctly when using ky instead.
    const options = {
      method: config.method,
      timeout: 5000,
    };

    if (config.body && config.body?.trim() !== "") {
      // only add request body if present
      options.json = JSON.parse(config.body);
    }

    Logger.write("DEBUG", JSON.stringify(config.body));
    response = await ky(config.url, options).text();

    Logger.write("INFO", response);

    // when running in cli mode it will not update the db (therefore no ec)
    if (ec) {
      await ec.updateEndpointResult(response);
    }
  } catch (error) {
    // avoid throwing and error
    // should display message on form
    Logger.write("WARN", error);
    return {
      status: "FAILURE",
      message: error.message,
      response: "",
    };
  }

  return {
    status: "SUCCESS",
    response: response,
  };
}
