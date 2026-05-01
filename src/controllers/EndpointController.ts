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
  private debounceTimer: number | undefined;

  constructor(endpoints: Endpoint[]) {
    this.endpoints = endpoints;

    // if empty add a place holder to the list
    if (this.endpoints.length === 0) {
      this.createEndpoint();
    }

    // either way the selected endpoint is just the first one in the list
    this.selected = this.endpoints[0];
  }

  public createEndpoint(): Endpoint {
    // use method chaining to find max id (new id is just max + 1)
    const id = this.endpoints.map((e) => e.id).reduce(
      (max, id) => (id > max ? id : max),
      0,
    ) + 1;

    this.endpoints.push(
      {
        id: id,
        name: `Endpoint ${id}`,
        config: {
          id: id,
          url: "",
          method: "GET",
          body: "",
        },
        result: "",
      },
    );
    this.selected = this.endpoints[this.endpoints.length - 1];

    // add new  endpoint to the db
    EndpointModel.createEndpoint(this.selected);

    return this.selected;
  }

  public deleteEndpoint(index: number): void {
    Logger.write("INFO", `deleteEndpoint() deleting endpoint with id: ${index}`);
    Logger.write("DEBUG", "deleteEndpoint() current endpoints (before deletion) - ", this.endpoints);
    const deleted = this.endpoints.splice(index, 1)[0];
    this.selected = this.endpoints[Math.max(index - 1, 0)];
    Logger.write("DEBUG", "deleteEndpoint() current endpoints (after deletion) - ", this.endpoints);

    EndpointModel.deleteEndpoint(deleted.id);
  }

  /**
   * These methods cover getting data ahbout the currently selected endpoint
   */
  public getEndpoint(): Endpoint {
    if (!this.selected) {
      return this.createEndpoint();
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

  public getEndpointMethod(): string {
    return this.getEndpointConfig().method;
  }

  public getEndpointBody(): string {
    return this.getEndpointConfig().body;
  }

  public getEndpointResult(): string {
    return this.getEndpoint().result;
  }

  /**
   * These cover updating the endpoint internally (and in the database)
   */
  public async updateEndpointName(value: string): Promise<void> {
    // endpoint names can't be greater than 20 chars long
    this.getEndpoint().name = value.slice(0, 20);
    this.debounceUpdateEndpoint(this.getEndpoint());
  }

  public async updateEndpointURL(value: string): Promise<void> {
    this.getEndpointConfig().url = value;
    this.debounceUpdateEndpoint(this.getEndpoint());
  }

  public async updateEndpointMethod(value: string): Promise<void> {
    this.getEndpointConfig().method = value;
    this.debounceUpdateEndpoint(this.getEndpoint());
  }

  public async updateEndpointBody(value: string): Promise<void> {
    this.getEndpointConfig().body = value;
    this.debounceUpdateEndpoint(this.getEndpoint());
  }

  public async updateEndpointResult(value: string): Promise<void> {
    this.getEndpoint().result = value;
    this.debounceUpdateEndpoint(this.getEndpoint());
  }

  /**
   * Since this update on use input I want to avoid unnecessary db updates.
   * When and input is made it will wait some seconds before actually updating.
   * https://www.geeksforgeeks.org/javascript/debouncing-in-javascript/
   */
  private debounceUpdateEndpoint(endpoint: Endpoint) {
    clearTimeout(this.debounceTimer);

    Logger.write("DEBUG", "debounceUpdateEndpoint() called");
    this.debounceTimer = setTimeout(async () => {
      await EndpointModel.updateEndpoint(endpoint);
      Logger.write("DEBUG", "debounceUpdateEndpoint() update completed");
    }, 5000);
  }
}
