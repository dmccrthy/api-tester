/**
 * This file currently stores types for various input that can enter
 * this program. For its pretty basic, but it could get more complex
 * depending on how much I want to do with it.
 *
 * @author Dan McCarthy
 */

export type MouseInput = {
  type: "mouse";
  x: number;
  y: number;
  button: "left" | "right";
};

export type KeyInput = {
  type: "char" | "special";
  value: string | SpecialKey;
};

// right know special keys are stored as this union
// in the future I may expand it to include others like arrow keys
export type SpecialKey = "enter" | "backspace" | "escape" | "CTRL+C";

export type Input = KeyInput | MouseInput;
