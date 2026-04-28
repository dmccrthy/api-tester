/**
 * This is the sidebar element that manages the currently selected endpoint.
 * It manages swapping between endpoints along with deleting endpoints.
 *
 * @author Dan McCarthy
 */

import ANSI from "../ANSI.ts";
import EndpointController from "../controllers/EndpointController.ts";
import Logger from "../controllers/Logger.ts";
import Button from "./interactive/Button.ts";
import View from "./View.ts";

export default class Sidebar extends View {
  private ec: EndpointController;

  constructor(rows: number, ec: EndpointController) {
    super([0, 0], 40, rows);
    this.ec = ec;
  }

  public override render(): void {
    this.children = [];

    // clear sidebar contents
    View.write(ANSI.clearScreen); // TODO: fix this

    for (const [index, endpoint] of this.ec.endpoints.entries()) {
      this.children.push(
        new Button(
          [1, (index * 4) + 1],
          endpoint.name,
          this.selectButton(index),
        ),
      );
      this.children.push(
        new Button(
          [endpoint.name.length + 6, (index * 4) + 1],
          "X",
          this.removeButton(index),
        ),
      );
    }

    this.children.push(
      new Button(
        [1, (this.ec.endpoints.length * 4) + 1],
        "CREATE ENDPOINT",
        () => {
          this.ec.createEndpoint();
        },
      ),
    );

    super.render();
  }

  /**
   * Create a function to select a button and trigger the form callback.
   */
  private selectButton(index: number): () => void {
    return () => {
      this.ec.selected = index;
    };
  }

  /**
   * Create a function to remove endpoint.
   *
   * @param {number} index Index of endpoint to remove
   * @returns function to remove endpoint and reload sidebar
   */
  private removeButton(index: number): () => void {
    return () => {
      this.ec.deleteEndpoint(index);
      this.render();
    };
  }
}
