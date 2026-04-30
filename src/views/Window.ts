/**
 * Window represents the display as a whole including all the elements
 * inside of it. It handles passing input to elements along with initializing
 * elements on the screen.
 *
 * @author Dan McCarthy
 */

import ANSI from "../ANSI.ts";
import EndpointController from "../controllers/EndpointController.ts";
import Logger from "../controllers/Logger.ts";
import { Input } from "../input/InputTypes.ts";
import Form from "./Form.ts";
import Selectable from "./core/Selectable.ts";
import Sidebar from "./Sidebar.ts";
import View from "./core/View.ts";

export default class Window extends View {
  private selected: View | null;

  constructor(private ec: EndpointController) {
    const { columns, rows } = Deno.consoleSize();
    super([0, 0], columns, rows);
    this.selected = null;
    this.ec = ec;

    View.write(ANSI.clearScreen);

    const sidebar = new Sidebar(rows, this.ec, new Form(columns, this.ec));

    // initialize elements
    this.children.push(sidebar);
    this.children.push(sidebar.form);
  }

  public override handleInput(input: Input): void {
    Logger.write("DEBUG", input);

    if (input.type === "click" || input.type === "scroll") {
      const element = this.checkBounds([input.x, input.y]);

      Logger.write("DEBUG", element);

      if (!element || element == this) {
        this.selected = null;
        return;
      }

      // when clicked set the element as selected (if selectable)
      if (element instanceof Selectable) {
        if (this.selected) {
          this.selected.selected = false;
          this.selected.render();
        }

        this.selected = element;
        this.selected.selected = true;

        Logger.write(
          "INFO",
          "Updating selected element - " + JSON.stringify(element),
        );
      } else {
        if (this.selected) {
          this.selected.selected = false;
          this.selected.render();
        }
        this.selected = null;
      }

      element.handleInput(input);
    } else {
      // for non-mouse input is passed to the current element
      this.selected?.handleInput(input);
    }
  }
}
