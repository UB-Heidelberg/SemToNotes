/**
 * @fileoverview Class representing a graphic group.
 */

goog.provide('xrx.shape.Group');



goog.require('xrx.shape.Container');


 
/**
 * A class representing a shape group.
 * @param {xrx.drawing.Drawing} drawing The parent drawing object.
 * @constructor
 */
xrx.shape.Group = function() {

  goog.base(this);
};
goog.inherits(xrx.shape.Group, xrx.shape.Container);



/**
 * The engine class used to render this shape group.
 * @type {string}
 * @const
 */
xrx.shape.Group.prototype.engineClass_ = 'Group';



/**
 * Creates a new shape group.
 * @param {xrx.drawing.Drawing} drawing The parent drawing object.
 */
xrx.shape.Group.create = function() {
  return new xrx.shape.Group();
};
