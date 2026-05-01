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
import View from "./core/View.ts";
import Form from "./Form.ts";

export default class Sidebar extends View {
  private ec: EndpointController;
  private scrollOffset: number = 0;
  public form: Form;

  constructor(rows: number, ec: EndpointController, form: Form) {
    super([0, 0], 30, rows);
    this.ec = ec;
    this.form = form;

    for (let i = 0; i < this.height; i++) {
      View.write(ANSI.updateCursor([this.width, i]) + "|");
    }

    this.render();
  }

  public override render(): void {
    this.children = [];

    // clear sidebar contents
    this.clearSidebar();

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

    const createButtonPosition = (this.ec.endpoints.length * 4) + 1 +
      this.scrollOffset;
    if (
      createButtonPosition >= 0 && (createButtonPosition + 4) <= this.height
    ) {
      this.children.push(
        new Button(
          [1, createButtonPosition],
          "CREATE ENDPOINT",
          this.createButton(),
        ),
      );
    }

    super.render();
  }

  public override handleInput(input: Input): void {
    if (input.type === "scroll") {
      Logger.write("DEBUG", "Sidebar() updated scrollOffset - ", this.scrollOffset);

      if (input.direction === "down") {
        // stop letting you scroll once you've hit the create button at the end
        this.scrollOffset = Math.max(
          this.ec.endpoints.length * -4,
          this.scrollOffset - 1,
        );
      } else {
        this.scrollOffset = Math.min(0, this.scrollOffset + 1);
      }

      this.render();
    }
  }

  private clearSidebar(): void {
    for (let i = 0; i < this.height; i++) {
      View.write(
        ANSI.updateCursor([this.width - 1, i]) + ANSI.clearBehindCursor,
      );
    }
  }

  /**
   * Create a function to select a button and trigger the form callback.
   */
  private createButton(): () => void {
    return async () => {
      await this.ec.createEndpoint();
      this.render();
      this.form.render();
    };
  }

  /**
   * Create a function to select a button and trigger the form callback.
   */
  private selectButton(index: number): () => void {
    return () => {
      this.ec.selected = this.ec.endpoints[index];
      this.form.render();
      Logger.write("DEBUG", "Sidebar() selected new endpoint - ", this.ec.selected);
    };
  }

  /**
   * Create a function to remove endpoint.
   *
   * @param {number} index Index of endpoint to remove
   * @returns function to remove endpoint and reload sidebar
   */
  private removeButton(index: number): () => void {
    return async () => {
      await this.ec.deleteEndpoint(index);
      this.render();
      this.form.render();
    };
  }
}
