/**
 * Endpoint model handle converting internal endpoint objects into records
 * that can be put into the DB (and vice versa).
 *
 * @author Dan McCarthy
 */

import { Endpoint } from "./EndpointTypes.ts";
import Database from "../controllers/Database.ts";

export default class EndpointModel {
  public static async fetchEndpoints(): Promise<Endpoint[]> {
    const db = Database.getInstance();
    const endpoints: Endpoint[] = [];
  }
}
