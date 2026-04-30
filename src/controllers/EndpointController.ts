/**
 * EndpointController manages the internal state of api endpoints. Endpoints
 * are stored as objects and updated through methods exposed by this class.
 * The ec also calls the endpoint model to update the database when state is
 * changed.
 *
 * @author Dan McCarthy
 */

import { Endpoint, EndpointConfig } from "../models/EndpointTypes.ts";
import EndpointModel from "../models/EndpointModel.ts";
import Logger from "./Logger.ts";

export default class EndpointController {
  public endpoints: Endpoint[];
  public selected: Endpoint | null;

  constructor(endpoints: Endpoint[]) {
    this.endpoints = endpoints;

    // if empty add a place holder to the list
    if (this.endpoints.length === 0) {
      this.createEndpoint();
    }

    // either way the selected endpoint is just the first one in the list
    this.selected = this.endpoints[0];
  }

  /**
   * a
   */
  public createEndpoint(): void {
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
    this.selected = this.endpoints[this.endpoints.length - 1];

    // add new  endpoint to the db
    //
  }

  /**
   * @param index
   */
  public deleteEndpoint(index: number): void {
    Logger.write("DEBUG", `Deleting index ${index}`);
    Logger.write("DEBUG", `Current array ${this.endpoints}`);
    this.endpoints.splice(index, 1);
    this.selected = this.endpoints[Math.max(index - 1, 0)];

    // update db with changes
    //
  }

  /**
   * Get the currently stored endpoint
   *
   * @returns {Endpoint} currently selected endpoint
   */
  public getEndpoint(): Endpoint {
    if (!this.selected) {
      throw new Error("No endpoint selected.");
    }

    return this.selected;
  }

  public getEndpointName(): string {
    return this.getEndpoint().name;
  }

  public getEndpointConfig(): EndpointConfig {
    return this.getEndpoint().config;
  }

  public getEndpointURL(): string {
    return this.getEndpointConfig().url;
  }

  public async updateEndpointName(value: string): Promise<void> {
    this.getEndpoint().name = value;

    // update curr endpoint in db
    // this part should have some form of debouncing to prevent extra db updates
    // EndpointModel.updateEndpoint(this.GetEndpoint());
  }

  public async updateEndpointURL(value: string): Promise<void> {
    this.getEndpointConfig().url = value;
  }
}
