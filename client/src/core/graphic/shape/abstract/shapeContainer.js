/**
 * @fileoverview An abstract class representing a shape container.
 */

goog.provide('xrx.shape.Container');



goog.require('xrx.shape.Geometry');



/**
 * An abstract class representing a shape container.
 * @param {xrx.drawing.Drawing} canvas The parent drawing canvas.
 * @param {xrx.engine.Element} engineElement The engine element
 *   used to render this shape.
 * @constructor
 */
xrx.shape.Container = function(drawing, engineElement) {

  goog.base(this, drawing, engineElement);

  this.childs_ = [];
};
goog.inherits(xrx.shape.Container, xrx.shape.Geometry);



/**
 * Returns the child elements of this container.
 * @return {Array<xrx.shape.Shape>} The child elements.
 */
xrx.shape.Container.prototype.getChildren = function() {
  return this.childs_;
};



/**
 * Adds elements to this container.
 * @param {(xrx.shape.Shape|Array<xrx.shape.Shape>)} children The elements to add.
 */
xrx.shape.Container.prototype.addChildren = function(children) {
  if (!goog.isArray(children)) children = [children];
  for(var i = 0, len = children.length; i < len; i++) {
    this.childs_.push(children[i]);
    this.engineElement_.addChild(children[i].getEngineElement());
  }
};



/**
 * Removes all elements from this container.
 */
xrx.shape.Container.prototype.removeChildren = function() {
  this.childs_ = [];
  this.engineElement_.removeChildren();
};



/**
 * Removes one element from this container at an index.
 * @param {number} index The index.
 */
xrx.shape.Container.prototype.removeChildAt = function(index) {
  this.childs_.splice(index, 1);
  this.engineElement_.removeChildAt(index);
};
