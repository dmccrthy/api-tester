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
import Logger from "../controllers/Logger.ts";

export default class EndpointModel {
  /**
   * Retrieve all endpoints from the database.
   *
   * @returns {Endpoint[]} array of current endpoints
   */
  public static async getEndpoints(): Promise<Endpoint[]> {
    const db = await Database.getInstance();
    let results: Endpoint[] = [];

    // need a join here to combine data from the 2 tables
    try {
      results = db.prepare(`
        SELECT e.id, e.name, e.result, c.id as config_id, c.url, c.method, c.body 
        FROM Endpoints e
        LEFT JOIN Configurations c ON e.id = c.endpoint_id
      `).all();
    } catch (error) {
      Logger.write("WARN", "getEndpoints() failed - ", error);
      return results;
    }

    Logger.write("DEBUG", "getEndpoints() retrieved results - ", results);

    // map to array of endpoints (and remove any null values)
    return results.map((row) => ({
      id: row.id,
      name: row.name ?? "",
      result: row.result ?? "",
      config: {
        id: row.config_id,
        url: row.url ?? "",
        method: row.method ?? "GET",
        body: row.body ?? "",
      },
    }));
  }

  public static async createEndpoint(endpoint: Endpoint): Promise<void> {
    const db = await Database.getInstance();

    // need 2 insertions since theres 2 tables
    try {
      Logger.write(
        "INFO",
        "createEndpoint() insert into Endpoints table - ",
        db.prepare(
          "INSERT INTO Endpoints (id, name, result) VALUES (?, ?, ?);",
        ).run(endpoint.id, endpoint.name, endpoint.result),
      );

      Logger.write(
        "INFO",
        "createEndpoint() insert into Configurations table - ",
        db.prepare(
          "INSERT INTO Configurations (id, endpoint_id, url, method, body) VALUES (?, ?, ?, ?, ?);",
        ).run(
          endpoint.config.id,
          endpoint.id,
          endpoint.config.url,
          endpoint.config.method,
          endpoint.config.body,
        ),
      );
    } catch (error) {
      Logger.write("WARN", "createEndpoint() failed - ", error);
      return;
    }
  }

  public static async updateEndpoint(endpoint: Endpoint): Promise<void> {
    const db = await Database.getInstance();

    // similiar to create just need to use update
    try {
      Logger.write(
        "INFO",
        "updateEndpoint() update on Endpoints table - ",
        db.prepare(
          "UPDATE Endpoints SET name = ?, result = ? WHERE id = ?;",
        ).run(endpoint.name, endpoint.result, endpoint.id),
      );

      Logger.write(
        "INFO",
        "updateEndpoint() update on Configurations table - ",
        db.prepare(
          "UPDATE Configurations SET url = ?, method = ?, body = ? WHERE id = ?;",
        ).run(
          endpoint.config.url,
          endpoint.config.method,
          endpoint.config.body,
          endpoint.config.id,
        ),
      );
    } catch (error) {
      Logger.write("WARN", "updateEndpoint() failed - ", error);
      return;
    }
  }

  public static async deleteEndpoint(id: number): Promise<void> {
    const db = await Database.getInstance();

    // delete records from both tables based on the provided id
    try {
      Logger.write(
        "INFO",
        "deleteEndpoint() from Endpoints table - ",
        db.prepare(
          "DELETE FROM Endpoints WHERE id = ?;",
        ).run(id),
      );

      Logger.write(
        "INFO",
        "deleteEndpoint() from Configurations table - ",
        db.prepare(
          "DELETE FROM Configurations WHERE endpoint_id = ?;",
        ).run(id),
      );
    } catch (error) {
      Logger.write("WARN", "deleteEndpoint() failed - ", error);
      return;
    }
  }
}
