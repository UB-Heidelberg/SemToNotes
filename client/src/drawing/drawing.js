/**
 * @fileoverview A class providing enumerations and static functions for
 * the drawing classes.
 */

goog.provide('xrx.drawing');
goog.provide('xrx.drawing.Mode');
goog.provide('xrx.drawing.State');



goog.require('xrx');



/**
 * A static class providing enumerations for the drawing classes.
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
  VIEW: 2,
  MODIFY: 3,
  DELETE: 4,
  DISABLED: 5
};
