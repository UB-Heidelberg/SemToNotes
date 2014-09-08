/**
 * @fileoverview A class providing enumerations and static functions for
 * the drawing classes.
 */

goog.provide('xrx.drawing');
goog.provide('xrx.drawing.Mode');
goog.provide('xrx.drawing.State');



/**
 * A static class providing enumerations for the drawing classes.
 * @class
 */
xrx.drawing = function() {};



/**
 * Enumeration for drawing states.
 * @enum (number)
 */
xrx.drawing.State = {
  DRAG: 1,
  NONE: 2
};



/**
 * Enumeration for drawing modes.
 * @enum {number}
 */
xrx.drawing.Mode = {
  PAN: 1,
  DRAW: 2,
  MODIFY: 3,
  DELETE: 4
};
