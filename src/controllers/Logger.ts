/**
 * Class represents contains commands to handle logging to a specified file.
 * Log details are specificed in .env according to README.
 *
 * @author Dan McCarthy
 */

export type LOG_LEVEL = "DEBUG" | "INFO" | "ERROR";

const LOG_PRIORITY = {
  DEBUG: 0,
  INFO: 1,
  ERROR: 2,
};

export default class Logger {
  private static file: string = Deno.env.get("LOG_FILE") ?? "api_tester.log";
  private static level: LOG_LEVEL = Deno.env.get("LOG_LEVEL") ?? "INFO";

  public static write(level: LOG_LEVEL, message: string) {
    // log messages won't be logged if below the current logging level
    if (LOG_PRIORITY[level] >= LOG_PRIORITY[this.level]) {
      Deno.writeTextFileSync(
        this.file,
        `${new Date().toISOString()} [${level}] ${message}\n`,
        {
          append: true,
        },
      );
    }
  }
}
