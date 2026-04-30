/**
 * Types representing the structure of an api endpoint inside the app.
 *
 * @author Dan McCarthy
 */

export type Endpoint = {
  id: number;
  name: string;
  config: EndpointConfig;
  result: string;
};

export type EndpointConfig = {
  id: number;
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body: string;
};
