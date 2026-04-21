/**
 * This is a wrapper for the elements of the form (and the
 * logic associated with it like submitting). In the future
 * I'll probable rework this a bit.
 *
 * @author Dan McCarthy
 */

import View from "./View.ts";
import TextBox from "./interactive/TextBox.ts";
import Button from "./interactive/Button.ts";
import Label from "./Label.ts";
import ANSI from "../ANSI.ts";

let ELEMENTS: View[] = [];

export default function initForm(columns: number): View[] {
  ELEMENTS.push(
    new TextBox([Math.floor(columns / 2) - 50, 2], 100, "URL Endpoint:"),
  );
  ELEMENTS.push(
    new Button([Math.floor(columns / 2) - 50, 8], "Submit", () => {
      submitForm();
    }),
  );
  ELEMENTS.push(new Label([Math.floor(columns / 2) - 38, 9], ""));

  return ELEMENTS;
}

function submitForm(): void {
  const input = ELEMENTS[0];
  const label = ELEMENTS[2];
  const url = input.content;

  // this regex pattern is based on this article from geeks for geeks (URLs are very complicated)
  // https://www.geeksforgeeks.org/dsa/check-if-an-url-is-valid-or-not-using-regular-expression/
  const urlRegex =
    /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;

  if (urlRegex.test(url)) {
    label.label = ANSI.textGreen + "PASS" + ANSI.resetColor;
  } else {
    label.label = ANSI.textRed + "FAIL" + ANSI.resetColor;
  }

  input.render();
  label.render();
}
