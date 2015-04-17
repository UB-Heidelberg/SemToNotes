/**
 * @fileoverview Canvas class representing a group.
 */

goog.provide('xrx.cnvs.Group');



goog.require('xrx.cnvs.Element');



/**
 * Canvas class representing a group.
 * @param {xrx.cnvs.Canvas} canvas The parent canvas object.
 * @constructor
 * @extends xrx.cnvs.Element
 */
xrx.cnvs.Group = function(canvas) {

  goog.base(this, canvas);

  /**
   * The child elements of the group.
   * @type {Array.<xrx.cnvs.Element>}
   */
  this.childs_ = [];
};
goog.inherits(xrx.cnvs.Group, xrx.cnvs.Element);



/**
 * Returns the child elements of the group.
 * @return {xrx.cnvs.Element} The child elements.
 */
xrx.cnvs.Group.prototype.getChildren = function() {
  return this.childs_;
};



/**
 * Adds child elements to a group.
 * @param {xrx.cnvs.Element} children The child elements.
 */
xrx.cnvs.Group.prototype.addChildren = function(children) {
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
xrx.cnvs.Group.prototype.removeChildren = function() {
  this.childs_ = [];
};



/**
 * Removes a child element at an index.
 * @param {number} index The index.
 */
xrx.cnvs.Group.prototype.removeChildAt = function(index) {
  this.childs_.splice(index, 1);
};



/**
 * Draws each child element of the group.
 */
xrx.cnvs.Group.prototype.draw = function() {
  for(var i = 0, len = this.childs_.length; i < len; i++) {
    this.childs_[i].draw();
  }
};



/**
 * Creates a new group.
 * @param {xrx.cnvs.Canvas} canvas The parent canvas object of the group.
 */
xrx.cnvs.Group.create = function(canvas) {
  return new xrx.cnvs.Group(canvas);
};
