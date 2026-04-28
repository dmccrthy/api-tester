/**
 * Class represents contains commands to handle logging to a specified file.
 * Log details are specificed in .env according to README.
 *
 * @author Dan McCarthy
 */

export default class Logger {
  public static write(level: "DEBUG" | "INFO" | "ERROR", message: string) {
    Deno.writeTextFileSync("api_tester.log", `[${level}] ${message}\n`, {
      append: true,
    });
  }
}
