/**
 * This is a wrapper for the elements of the form (and the
 * logic associated with it like submitting). In the future
 * I'll probable rework this a bit.
 *
 * @author Dan McCarthy
 */

import View from "./View.ts";
import TextBox from "./interactive/TextBox.ts";
import Multiselect from "./interactive/Multiselect.ts";
import Button from "./interactive/Button.ts";
import Label from "./Label.ts";
import ANSI from "../ANSI.ts";

export default class Form extends View {
  private urlInput: TextBox;
  private methodInput: Radio;
  private submitButton: Button;
  private statusLabel: Label;

  constructor(columns: number) {
    super([0, 0], columns, 20);

    this.urlInput = new TextBox(
      [Math.floor(columns / 2) - 50, 2],
      100,
      "URL Endpoint:",
    );

    this.methodInput = new Multiselect(
      [Math.floor(columns / 2) - 50, 8],
      "HTTP Method:",
      ["GET", "POST", "PUT", "PATCH", "DELETE"]
    );

    this.submitButton = new Button(
      [Math.floor(columns / 2) - 50, 14],
      "Submit",
      () => this.submit(),
    );

    this.statusLabel = new Label(
      [Math.floor(columns / 2) - 38, 15],
      "",
    );

    this.children = [
      this.urlInput,
      this.methodInput,
      this.submitButton,
      this.statusLabel,
    ];
  }

  /** 
   * Handles submitting the form
   */
  private submit(): void {
    const url: string = this.urlInput.content;

    // this regex pattern is based on this article from geeks for geeks (URLs are very complicated)
    // https://www.geeksforgeeks.org/dsa/check-if-an-url-is-valid-or-not-using-regular-expression/
    const urlRegex =
      /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;

    if (!urlRegex.test(url)) {
      this.statusLabel.label = ANSI.textRed + this.methodInput.selected + ANSI.resetColor;
      return;
    }

    // in the future we''l run the ApiRunner and get a result.
    this.statusLabel.label = ANSI.textGreen + "PASS" + ANSI.resetColor;
  }
}
