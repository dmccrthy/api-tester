/**
 * Class represents a Database connection that can be used by other components.
 * This is a singleton that provides a database connection.
 *
 * @author Dan McCarthy
 */

import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import path from "node:path";
import Logger from "./Logger.ts";
export default class Database {
  private static client: DatabaseSync | null = null;

  public static async getInstance(): Promise<DatabaseSync> {
    if (!Database.client) {
      const schema = path.resolve(import.meta.dirname!, "schema.sql");

      Database.client = new DatabaseSync("endpoints.db");
      Database.client.exec(readFileSync(schema, "utf-8"));

      Logger.write(
        "INFO",
        "Database.getInstance() DB connection formed successfully",
      );
    }

    return Database.client;
  }

  /**
   * Handle closing any connections when program ends
   */
  public static close(): void {
    if (Database.client) {
      Database.client.close();
      Database.client = null;
    }
  }
}
