/**
 * Endpoint model handle converting internal endpoint objects into records
 * that can be put into the DB (and vice versa). Instead of having different
 * files make requests to the DB all operations related to endpoints are done
 * from this model.
 *
 * @author Dan McCarthy
 */

import { Endpoint } from "./EndpointTypes.ts";
import Database from "../controllers/Database.ts";

export default class EndpointModel {
  /**
   * Retrieve all endpoints from the database.
   *
   * @returns {Endpoint[]} array of current endpoints
   */
  public static async getEndpoints(): Promise<Endpoint[]> {
    const db = await Database.getInstance();
    const endpoints: Endpoint[] = [];

    const results = await db.query("SELECT * FROM Endpoints;");

    console.log(results);

    return endpoints;
  }
}
