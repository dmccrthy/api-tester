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
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers: {
    [key: string]: string;
  };
  body: string;
};
