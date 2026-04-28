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
import Sidebar from "./Sidebar.ts";
import View from "./View.ts";

export default class Window extends View {
  private selected: View | null;
  private ec: EndpointController = new EndpointController([]);

  constructor() {
    const { columns, rows } = Deno.consoleSize();
    super([0, 0], columns, rows);
    this.selected = null;

    View.write(ANSI.clearScreen);

    // initialize elements
    this.children.push(new Sidebar(rows, this.ec));
    this.children.push(new Form(columns, this.ec));
    this.render();
  }

  public override handleInput(input: Input): void {
    if (input.type === "mouse") {
      const element = this.checkBounds([input.x, input.y]);

      if (!element || element == this) {
        this.selected = null;
        return;
      }

      // when clicked set the element as selected
      this.selected = element;
      element.handleInput(input);
    } else {
      // for non-mouse input is passed to the current element
      this.selected?.handleInput(input);
    }

    // rerender all elements in the application
    this.render();
  }
}
