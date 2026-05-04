/**
 * This file currently stores types for various input that can enter
 * this program. For its pretty basic, but it could get more complex
 * depending on how much I want to do with it.
 *
 * @author Dan McCarthy
 */

export type MouseClick = {
  type: "click";
  x: number;
  y: number;
};

export type MouseScroll = {
  type: "scroll";
  x: number;
  y: number;
  direction: "up" | "down";
};

export type KeyInput = {
  type: "char";
  value: string;
} | { type: "special"; value: SpecialKey };

export type SpecialKey = "CTRL+C" | "enter" | "escape" | "backspace";

export type Input = KeyInput | MouseClick | MouseScroll;
