/**
 * This is the sidebar element that manages the currently selected endpoint.
 * It manages swapping between endpoints along with deleting endpoints.
 *
 * @author Dan McCarthy
 */

import ANSI from "../ANSI.ts";
import EndpointController from "../controllers/EndpointController.ts";
import Logger from "../controllers/Logger.ts";
import { Input } from "../input/InputTypes.ts";
import Button from "./interactive/Button.ts";
import View from "./View.ts";

export default class Sidebar extends View {
  private ec: EndpointController;
  private scrollOffset = 0;

  constructor(rows: number, ec: EndpointController) {
    super([0, 0], 30, rows);
    this.ec = ec;
  }

  public override render(): void {
    this.children = [];

    // clear sidebar contents
    View.write(ANSI.clearScreen); // TODO: fix this

    for (let i = 0; i < this.height; i++) {
      View.write(ANSI.updateCursor([this.width, i]) + "|");
    }

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
          [endpoint.name.length + 5, (index * 4) + 1],
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

  public override handleInput(input: Input): void {
    if (input.type === "scroll") {
      Logger.write("DEBUG", this.scrollOffset)

      if (input.direction === "down") {
        this.scrollOffset = Math.max(0, this.scrollOffset - 1);
      } else {
        // Prevent scrolling past the end of the list
        const maxOffset = Math.max(0, this.ec.endpoints.length - this.maxVisible);
        this.scrollOffset = Math.min(maxOffset, this.scrollOffset + 1);
      }
      this.render();
    }
  }

  /**
   * Create a function to select a button and trigger the form callback.
   */
  private selectButton(index: number): () => void {
    return () => {
      this.ec.selected = this.ec.endpoints[index];
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
