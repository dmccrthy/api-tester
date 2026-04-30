/**
 * Abstract class representing an eleemnt that can be selected. This is used
 * to change style of element when selected.
 *
 * @author Dan McCarthy
 */

import View from "./View.ts";

export default abstract class Selectable extends View {
  public selected = false;
}
