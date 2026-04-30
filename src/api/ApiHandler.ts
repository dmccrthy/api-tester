/**
 * @author Dan McCarthy
 */

import EndpointController from "../controllers/EndpointController.ts";
import Logger from "../controllers/Logger.ts";
import { EndpointConfig } from "../models/EndpointTypes.ts";

type APIResponse = {
  status: "SUCCESS" | "FAILURE";
  message?: string;
};

/**
 * dd
 */
export default async function apiHandler(ec: EndpointController): APIResponse {
  const config: EndpointConfig = ec.getEndpointConfig();

  try {
    const response = await fetch(config.url, {
      method: config.method,
      headers: config.headers,

      // Only include body if the method isn't GET or HEAD
      body: config.method !== "GET" ? config.body : undefined,
    }).then((response) => response.text());

    Logger.write("INFO", response);

    await ec.updateEndpointResult(response);
  } catch (error) {
    // avoid throwing and error
    // should display message on form
    return {
      status: "FAILURE",
      message: error.message,
    };
  }

  return {
    status: "SUCCESS",
  };
}
