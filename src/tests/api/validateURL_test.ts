/**
 * This covers tests related to the Form.validateURL function.
 *
 * @author Dan McCarthy
 */

import { assert } from "@std/assert";
import Form from "../../views/Form.ts";

Deno.test("validateURL() check https URL", () => {
  assert(Form.validateURL("https://google.com"))
});

Deno.test("validateURL() check http URL", () => {
  assert(Form.validateURL("http://neverssl.net"))
});

Deno.test("validateURL() invalid URL", () => {
  assert(!Form.validateURL("https://ghfghgfh..gfdgfdg"))
});

Deno.test("validateURL() URL without http(s)", () => {
    // this should be false
  assert(!Form.validateURL("google.com"));
});

Deno.test("validateURL() check URL with subdomains", () => {
  assert(Form.validateURL("https://cyber.cs.unh.edu"));
});