/**
 * Class represents a Database connection that can be used by other components.
 * This is a singleton that provides a database connection.
 *
 * @author Dan McCarthy
 */

import { Client } from "mysql";
import { load } from "@std/dotenv";
import Logger from "./Logger.ts";
export default class Database {
  private static client: Client | null = null;

  public static async getInstance(): Promise<Client> {
    if (!Database.client) {
      const env = await load();
      Logger.write("DEBUG", "Database.getInstance() loaded .env - ", env);

      // create db connection using settings from the .env file
      Database.client = await new Client().connect({
        hostname: env.MYSQL_ADDRESS,
        port: Number(env.MYSQL_PORT),
        username: env.MYSQL_USER,
        password: env.MYSQL_PASSWORD,
        db: env.MYSQL_DATABASE,
        debug: false,
      });
      Logger.write("INFO", "Database.getInstance() DB connection formed successfully");
    }

    return Database.client;
  }

  /**
   * Handle closing any connections when program ends
   */
  public static async close(): Promise<void> {
    if (Database.client) {
      await Database.client.close();
      Database.client = null;
    }
  }
}
