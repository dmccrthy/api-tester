/**
 * This file contains constants/helpers for different
 * ANSI escape sequences. This just helps make the code
 * easier to read since we don't need to copy paste a
 * bunch of complicated escape codes.
 *
 * @author Dan McCarthy
 */

const ANSI = {
  // NOTE: cursor/mousetracking require the use of private modes.
  // these should be available in unix-like terminals (but it can vary).
  // we're using normal tracking here since all we care about is clicks.
  cursor: {
    enable: "\x1b[?25h",
    disable: "\x1b[?25l",
  },
  mouseTracking: {
    enable: "\x1b[?1000h",
    disable: "\x1b[?1000l",
  },
  clearScreen: "\x1b[2J",
  clearLine: "\x1b[2K",
  clearBehindCursor: "\x1b[1K",

  // Text Styling
  textGreen: "\x1b[1;32m",
  textRed: "\x1b[1;31m",
  textBlack: "\x1b[1;30m",
  bgWhite: "\x1b[47m",
  resetColor: "\x1b[0m",

  /**
   * Generates the escape sequence to move cursor to specific row
   * and column. Returns the sequences (DOES NOT apply it directly)
   */
  updateCursor: (coords: [number, number]): string => {
    return `\x1b[${coords[1]};${coords[0]}H`;
  },
};

export default ANSI;
