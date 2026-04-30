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
  private scrollOffset: number = 0;

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
      // based on the scroll offset we can check if the elemetn is on screen.
      // if its not we don't want to render it.
      const elementHeight = 4;
      const yPosition = (index * elementHeight) + 1 + this.scrollOffset;

      if (yPosition < 0 || (yPosition + elementHeight) > this.height) continue;

      this.children.push(
        new Button(
          [1, yPosition],
          endpoint.name,
          this.selectButton(index),
        ),
      );
      this.children.push(
        new Button(
          [endpoint.name.length + 5, yPosition],
          "X",
          this.removeButton(index),
        ),
      );
    }

    const createButtonPosition = (this.ec.endpoints.length * 4) + 1 + this.scrollOffset;
    if (createButtonPosition >= 0 && (createButtonPosition + 4) <= this.height) {
      this.children.push(
        new Button(
          [1, createButtonPosition],
          "CREATE ENDPOINT",
          () => {
            this.ec.createEndpoint();
          },
        ),
      );
    }

    super.render();
  }

  public override handleInput(input: Input): void {
    if (input.type === "scroll") {
      Logger.write("DEBUG", this.scrollOffset);

      if (input.direction === "down") {
        // stop letting you scroll once you've hit the create button at the end
        this.scrollOffset = Math.max(
          this.ec.endpoints.length * -4,
          this.scrollOffset - 1,
        );
      } else {
        this.scrollOffset = Math.min(0, this.scrollOffset + 1);
      }
    }
  }

  /**
   * Create a function to select a button and trigger the form callback.
   */
  private selectButton(index: number): () => void {
    return () => {
      this.ec.selected = this.ec.endpoints[index];
      Logger.write("DEBUG", this.ec.selected);
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
