/**
 * @fileoverview Class representing a container graphic.
 */

goog.provide('xrx.shape.Container');



xrx.shape.Container = function() {

  /**
   * The child elements of this container.
   * @type {Array<xrx.shape.Shape>}
   */
  this.child_ = [];
};



/**
 * Returns the child elements of this container.
 * @return {Array<xrx.shape.Shape>} The child elements.
 */
xrx.shape.Container.prototype.getChildren = function() {
  return this.child_;
};



/**
 * Adds elements to this container.
 * @param {(xrx.shape.Shape|Array<xrx.shape.Shape>)} children The elements to add.
 */
xrx.shape.Container.prototype.addChildren = function(children) {
  if (!goog.isArray(children)) children = [children];
  var child;
  for(var i = 0, len = children.length; i < len; i++) {
    this.child_.push(children[i]);
  }
};



/**
 * Removes all elements from this container.
 */
xrx.shape.Container.prototype.removeChildren = function() {
  this.child_ = [];
};



/**
 * Removes one element from this container at an index.
 * @param {number} index The index.
 */
xrx.shape.Container.prototype.removeChildAt = function(index) {
  this.child_.splice(index, 1);
};
