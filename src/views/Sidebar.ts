/**
 * 
 * 
 * @author Dan McCarthy
 */

import EndpointController from "../controllers/EndpointController.ts";
import Logger from "../controllers/Logger.ts";
import Button from "./interactive/Button.ts";
import View from "./View.ts";

export default class Sidebar extends View {
  private ec: EndpointController;

  constructor(rows: number, ec: EndpointController) {
    super([0, 0], 20, rows);
    this.ec = ec;

    this.rebuildSidebar();
  }

  private rebuildSidebar(): void {
    this.children = []

    let i = 1;
    for (const endpoint of this.ec.endpoints) {
      this.children.push(new Button([1, i*4], endpoint.name, () => { this.ec.selected = i }));

      i++;
    }

    Logger.write("INFO", this.ec.endpoints.length);

    this.children.push(new Button([1, i*4], "CREATE ENDPOINT", () => { this.ec.createEndpoint(); this.rebuildSidebar() }));
  }
}
