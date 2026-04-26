/**
 * @author Dan McCarthy
 */

import { Endpoint } from "../models/EndpointTypes.ts";
import EndpointModel from "../models/EndpointModel.ts";

export default class EndpointController {
  public endpoints: Endpoint[];
  public selected: number;

  constructor(endpoints: Endpoint[]) {
    this.endpoints = endpoints;

    // if empty add a place holder to the list
    if (this.endpoints.length === 0) {
      this.createEndpoint();
    }

    // either way the selected endpoint is just the first one in the list
    this.selected = 0;
  }

  /**
   * a
   */
  public createEndpoint(): Promise<void> {
    this.endpoints.push(
      {
        id: this.endpoints.length,
        name: `Endpoint ${this.endpoints.length}`,
        config: {
          url: "",
          method: "GET",
          headers: {},
          body: "",
        },
        results: [],
      },
    );
    this.selected = this.endpoints.length - 1;

    // add new  endpoint to the db
    //
  }

  public async updateEndpoint(id: number): Promise<void> {

  }
}
