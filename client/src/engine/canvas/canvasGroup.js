/**
 * @fileoverview Canvas class representing a group.
 */

goog.provide('xrx.canvas.Group');



goog.require('xrx.canvas.Element');



/**
 * Canvas class representing a group.
 * @param {xrx.canvas.Canvas} canvas The parent canvas object.
 * @constructor
 * @extends xrx.canvas.Element
 */
xrx.canvas.Group = function(canvas) {

  goog.base(this, canvas);

  /**
   * The child elements of the group.
   * @type {Array.<xrx.canvas.Element>}
   */
  this.childs_ = [];
};
goog.inherits(xrx.canvas.Group, xrx.canvas.Element);



/**
 * Returns the child elements of the group.
 * @return {xrx.canvas.Element} The child elements.
 */
xrx.canvas.Group.prototype.getChildren = function() {
  return this.childs_;
};



/**
 * Adds child elements to a group.
 * @param {xrx.canvas.Element} children The child elements.
 */
xrx.canvas.Group.prototype.addChildren = function(children) {
  if (!goog.isArray(children)) children = [children];
  var child;
  for(var i = 0, len = children.length; i < len; i++) {
    child = children[i];
    this.childs_.push(child);
  }
};



/**
 * Removes all child elements from the group.
 */
xrx.canvas.Group.prototype.removeChildren = function() {
  this.childs_ = [];
};



/**
 * Removes a child element at an index.
 * @param {number} index The index.
 */
xrx.canvas.Group.prototype.removeChildAt = function(index) {
  this.childs_.splice(index, 1);
};



/**
 * Draws each child element of the group.
 */
xrx.canvas.Group.prototype.draw = function() {
  for(var i = 0, len = this.childs_.length; i < len; i++) {
    this.childs_[i].draw();
  }
};



/**
 * Creates a new group.
 * @param {xrx.canvas.Canvas} canvas The parent canvas object of the group.
 */
xrx.canvas.Group.create = function(canvas) {
  return new xrx.canvas.Group(canvas);
};
