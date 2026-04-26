/**
 * @author Dan McCarthy
 */

export default class Logger {
    public static async write(level: "INFO" | "ERROR", message) {
        await Deno.writeTextFile("api_tester.log", `[${level}] ${message}`);
    }
}