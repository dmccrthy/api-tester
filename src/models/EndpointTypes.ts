/**
 * Types representing the structure of an api endpoint inside the app.
 *
 * @author Dan McCarthy
 */

export type Endpoint = {
  id: string;
  name: string;
  config: EndpointConfig;
  results: Result[];
};

export type EndpointConfig = {
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers: {
    [key: string]: string;
  };
  body?: string;
};

export type Result = {
  id: string;
  content: unknown;
};
