/**
 * This is a wrapper for the elements of the form (and the
 * logic associated with it like submitting). In the future
 * I'll probable rework this a bit.
 *
 * @author Dan McCarthy
 */

import View from "./core/View.ts";
import TextBox from "./interactive/TextBox.ts";
import Multiselect from "./interactive/Multiselect.ts";
import Button from "./interactive/Button.ts";
import Label from "./Label.ts";
import ANSI from "../ANSI.ts";
import EndpointController from "../controllers/EndpointController.ts";
import apiHandler from "../api/ApiHandler.ts";
import TextOutput from "./TextOutput.ts";
import { Endpoint } from "../models/EndpointTypes.ts";
import Logger from "../controllers/Logger.ts";

export default class Form extends View {
  private ec: EndpointController;
  private endpointName: TextBox;
  private urlInput: TextBox;
  private methodInput: Multiselect;
  private submitButton: Button;
  private statusLabel: Label;
  private bodyInput: TextBox;
  private responseBox: TextOutput;

  constructor(columns: number, ec: EndpointController) {
    super([0, 0], columns, 100);
    this.ec = ec;

    const maxWidth = columns / 2;
    const center = Math.floor(columns / 2) - Math.floor(maxWidth / 2);

    this.endpointName = new TextBox(
      [center, 2],
      maxWidth,
      "Endpoint Name (max 20 chars)",
      () => this.ec.getEndpointName(),
      (val) => this.ec.updateEndpointName(val),
    );

    this.urlInput = new TextBox(
      [center, 7],
      maxWidth,
      "URL",
      () => this.ec.getEndpointURL(),
      (val) => this.ec.updateEndpointURL(val),
    );

    this.methodInput = new Multiselect(
      [center, 12],
      "HTTP Method",
      ["GET", "POST", "PUT", "PATCH", "DELETE"],
      () => this.ec.getEndpointMethod(),
      (val) => this.ec.updateEndpointMethod(val),
    );

    this.bodyInput = new TextBox(
      [center, 17],
      maxWidth,
      "Request Body",
      () => this.ec.getEndpointBody(),
      (val) => this.ec.updateEndpointBody(val),
    );

    this.submitButton = new Button(
      [center, 22],
      "Submit",
      () => this.submit(),
    );

    this.statusLabel = new Label(
      [Math.floor(columns / 2) - 25, 23],
      "",
    );

    this.responseBox = new TextOutput(
      [center, 26],
      maxWidth,
      "Response",
      () => this.ec.getEndpointResult(),
    );

    this.children = [
      this.endpointName,
      this.urlInput,
      this.methodInput,
      this.bodyInput,
      this.submitButton,
      this.statusLabel,
      this.responseBox,
    ];
  }

  public override render(): void {
    if (this.ec.selected) {
      super.render();
    }
  }

  /**
   * Handles submitting the form
   */
  private async submit(): Promise<void> {
    Logger.write("INFO", "Submiting form.");

    const endpoint: Endpoint = this.ec.getEndpoint();

    // validate differen inputs before calling apiHandelr
    if (!/^[ a-zA-Z0-9]+$/.test(endpoint.name)) {
      this.statusLabel.label = ANSI.textRed + "Invalid Endpoint Name" +
        ANSI.resetColor;
      this.render();
      return;
    }

    if (!Form.validateURL(endpoint.config.url)) {
      this.statusLabel.label = ANSI.textRed + "Invalid URL" +
        ANSI.resetColor;
      this.render();
      return;
    }

    if (!/(GET|POST|PUT|PATCH|DELETE)/.test(endpoint.config.method)) {
      this.statusLabel.label = ANSI.textRed + "Invalid HTTP Method" +
        ANSI.resetColor;
      this.render();
      return;
    }

    // if body is valid json

    // have apiHandler make request
    const status = await apiHandler(this.ec);
    Logger.write("DEBUG", status);

    this.statusLabel.label = ANSI.textGreen + status.status + ANSI.resetColor;
    this.render();
  }

  /**
   * Check if a url is properly formatted. Public to test URL handling.
   *
   * @param {string} url address to validate
   * @returns {boolean} True/false if the url is valid
   */
  public static validateURL(url: string): boolean {
    // this regex pattern is based on this article from geeks for geeks (URLs are very complicated)
    // https://www.geeksforgeeks.org/dsa/check-if-an-url-is-valid-or-not-using-regular-expression/
    return /^(http(s)?:\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/
      .test(url);
  }
}
