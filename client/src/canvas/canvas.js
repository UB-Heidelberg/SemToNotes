/**
 * @fileoverview A class providing enumerations and static functions for
 * the canvas classes.
 */

goog.provide('xrx.canvas');
goog.provide('xrx.canvas.Mode');
goog.provide('xrx.canvas.State');



/**
 * A static class providing enumerations for the canvas classes.
 * @class
 */
xrx.canvas = function() {};



/**
 * Enumeration for canvas states.
 * @enum {string}
 */
xrx.canvas.State = {
  DRAG: 'drag',
  NONE: 'none'
};



/**
 * Enumeration for canvas modes.
 * @enum {string}
 */
xrx.canvas.Mode = {
  PAN: 'pan',
  DRAW: 'draw',
  MODIFY: 'modify',
  DELETE: 'delete'
};
