/**
 * @fileoverview A class providing enumerations and static functions for
 * the drawing classes.
 */

goog.provide('xrx.drawing');
goog.provide('xrx.drawing.EventType');
goog.provide('xrx.drawing.FixPoint');
goog.provide('xrx.drawing.Mode');
goog.provide('xrx.drawing.State');



/**
 * A static class providing enumerations shared by all drawing classes.
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
  VIEW: 1,
  MODIFY: 2,
  DELETE: 3,
  CREATE: 4,
  DISABLED: 5,
  SELECT: 6,
  HOVER: 7
};



/**
 * Enumeration of fix points as used in the drawing view-box.
 * @enum {string}
 */
xrx.drawing.FixPoint = {
  C:  'C',  // center
  NE: 'NE', // northeast
  SE: 'SE', // southeast
  SW: 'SW', // southwest
  NW: 'NW'  // northwest
};



/**
 * Enumeration of event types dispatched by a drawing canvas.
 * @enum {string}
 */
xrx.drawing.EventType = {
  VIEWBOX_CHANGE: 'eventViewboxChange',
  SHAPE_HOVER_IN: 'eventShapeHoverIn',
  SHAPE_HOVER_MOVE: 'eventShapeHoverMove',
  SHAPE_HOVER_OUT: 'eventShapeHoverOut'
};
