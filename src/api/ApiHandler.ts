/**
 * @author Dan McCarthy
 */

type apiData = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  url: string;
  headers: {
    [key: string]: string;
  };
  body: string;
};

/** */
export default function apiHandler() {
}
