/**
 * Integration tests for the CLI mode. Tests all HTTP methods, along
 * with error handling for different situations
 *
 * @author Dan McCarthy
 */

import { assert, assertEquals } from "@std/assert";
import cliHandler from "../../cli/CliHandler.ts";
import { APIResponse } from "../../api/ApiHandler.ts";

Deno.test("cliHandler() runs GET request", async () => {
  const response: APIResponse = await cliHandler(
    "./src/tests/examples/get_request.json",
  );

  // check status and response is present
  assertEquals(response.status, "SUCCESS");
  assert(response.response);
});

Deno.test("cliHandler() runs POST request", async () => {
  const response: APIResponse = await cliHandler(
    "./src/tests/examples/post_request.json",
  );

  assertEquals(response.status, "SUCCESS");
  assert(response.response);
});

Deno.test("cliHandler() runs PUT request", async () => {
  const response: APIResponse = await cliHandler(
    "./src/tests/examples/put_request.json",
  );

  assertEquals(response.status, "SUCCESS");
  assert(response.response);
});

Deno.test("cliHandler() runs PATCH request", async () => {
  const response: APIResponse = await cliHandler(
    "./src/tests/examples/patch_request.json",
  );

  assertEquals(response.status, "SUCCESS");
  assert(response.response);
});

Deno.test("cliHandler() runs DELETE request", async () => {
  const response: APIResponse = await cliHandler(
    "./src/tests/examples/delete_request.json",
  );

  assertEquals(response.status, "SUCCESS");
  assert(response.response);
});

Deno.test("cliHandler() missing URL option", async () => {
  const response = await cliHandler("./src/tests/examples/no_url_request.json");

  assert(typeof response === "string");
  assert(response.includes("missing URL"));
});

Deno.test("cliHandler() invalid URL option", async () => {
  const response = await cliHandler(
    "./src/tests/examples/invalid_url_request.json",
  );
  assert(typeof response === "string");
  assert(response.includes("invalid URL"));
});

Deno.test("cliHandler() file doesn't exist", async () => {
  const response = await cliHandler("./src/this/does/not.json");

  assert(typeof response === "string");
  assert(response.includes("Error API Request failed"));
});

Deno.test("cliHandler() file isn't JSON", async () => {
  const response = await cliHandler("./src/test");

  assert(typeof response === "string");
  assert(response.includes("must end in .json"));
});
