/**
 * @fileoverview 
 */

goog.provide('xrx.widget.Shape');



goog.require('xrx.mvc.ComponentView');



/**
 * @constructor
 */
xrx.widget.Shape = function(element, drawing) {

  this.drawing_ = drawing;

  goog.base(this, element);

  this.shape_;
};
goog.inherits(xrx.widget.Shape, xrx.mvc.ComponentView);



xrx.widget.Shape.prototype.getDrawing = function() {
  return this.drawing_;
};



xrx.widget.Shape.prototype.getShape = function() {
  return this.shape_;
};
