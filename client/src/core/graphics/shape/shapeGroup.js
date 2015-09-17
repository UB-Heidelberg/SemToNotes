/**
 * @fileoverview Class representing an engine-independent graphic
 * group.
 */

goog.provide('xrx.shape.Group');



goog.require('xrx.shape.Container');


 
/**
 * A class representing an engine-independent shape group.
 * @param {xrx.shape.Canvas} canvas The parent canvas object.
 * @constructor
 */
xrx.shape.Group = function(canvas) {

  goog.base(this, canvas);
};
goog.inherits(xrx.shape.Group, xrx.shape.Container);



/**
 * The engine class used to render this shape group.
 * @type {string}
 * @const
 */
xrx.shape.Group.prototype.engineClass_ = 'Group';



/**
 * Draws this group and all its groups and shapes contained.
 */
xrx.shape.Group.prototype.draw = function() {
  var children = this.getChildren();
  for(var i = 0, len = children.length; i < len; i++) {
    children[i].draw();
  };
};



/**
 * Creates a new graphic group.
 * @param {xrx.shape.Canvas} The parent canvas object.
 */
xrx.shape.Group.create = function(canvas) {
  return new xrx.shape.Group(canvas);
};
