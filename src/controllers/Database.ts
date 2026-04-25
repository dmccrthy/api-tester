/**
 * Class represents a Database connection that can be used by other components.
 * This is a singleton that provides a database connection.
 *
 * @author Dan McCarthy
 */

import { Client } from "mysql";

export default class Database {
  private static client: Client | null = null;

  public static async initDatabase() {
    const client = await Database.getInstance();

    client.execute(";");
  }

  public static async getInstance(): Promise<Client> {
    if (!Database.client) {
      //
      Database.client = await new Client().connect({
        hostname: "127.0.0.1",
        username: "root",
        db: "dbname",
        password: "password",
      });
    }

    return Database.client;
  }
}
