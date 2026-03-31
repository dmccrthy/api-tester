/**
 * This file contains constants/helpers for different
 * ANSI escape sequences. This just helps make the code
 * easier to read since we don't need to copy paste a
 * bunch of complicated escape codes.
 * 
 * @author Dan McCarthy
 */

const ANSI = {
    cursor: { 
        enable: "\x1b[?25h",
        disable: "\x1b[?25l"
    },

    clearScreen: "\x1b[2J",
    clearLine: "\x1b[2K",

    /**
     * Generates the escape sequence to move cursor to specific row
     * and column. Returns the sequences (DOES NOT apply it directly)
     */
    updateCursor: (coords: [number, number]): string => {
        return `\x1b[${coords[1]};${coords[0]}H`;
    }
}

export default ANSI;