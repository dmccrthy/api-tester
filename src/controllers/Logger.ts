/**
 * Class represents contains commands to handle logging to a specified file.
 * Log details are specificed in .env according to README.
 *
 * @author Dan McCarthy
 */

export type LOG_LEVEL = "DEBUG" | "INFO" | "WARN" | "ERROR";

const LOG_PRIORITY = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

export default class Logger {
  private static file: string = Deno.env.get("LOG_FILE") ?? "api_tester.log";
  private static level: LOG_LEVEL;

  public static write(level: LOG_LEVEL, message: any) {
    if (!this.level) {
      this.level = Deno.env.get("LOG_LEVEL") ?? "INFO";
    }

    // log messages won't be logged if below the current logging level
    if (LOG_PRIORITY[level] >= LOG_PRIORITY[this.level]) {
      // try to convert objects to JSON string so we avoid it logging [object, Object]
      const output = typeof message === "object"
        ? JSON.stringify(message)
        : String(message);

      Deno.writeTextFileSync(
        this.file,
        `${new Date().toISOString()} [${level}] ${output}\n`,
        {
          append: true,
        },
      );
    }
  }
}
