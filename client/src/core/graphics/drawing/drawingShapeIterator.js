/**
 * @fileoverview A class representing a shape iterator.
 */

goog.provide('xrx.drawing.ShapeIterator');



goog.require('xrx.shape.Container');



xrx.drawing.ShapeIterator = function(drawing) {

  this.drawing_ = drawing;
};



xrx.drawing.ShapeIterator.prototype.next = goog.abstractMethod;



xrx.drawing.ShapeIterator.prototype.iterate = function(container) {
  var children = container.getChildren();
  for (var i = 0, len = children.length; i < len; i++) {
    this.next(children[i]);
    if (children[i] instanceof xrx.shape.Container) {
      this.iterate(children[i]);
    }
  }
};
