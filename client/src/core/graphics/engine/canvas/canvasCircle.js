/**
 * @fileoverview Canvas rendering class representing a circle.
 */

goog.provide('xrx.canvas.Circle');



goog.require('xrx.canvas.Stylable');



/**
 * Canvas rendering class representing a circle.
 * @param {xrx.canvas.Canvas} element The parent canvas object.
 * @constructor
 * @extends xrx.canvas.Stylable
 */
xrx.canvas.Circle = function(canvas) {

  goog.base(this, canvas);
};
goog.inherits(xrx.canvas.Circle, xrx.canvas.Stylable);



/**
 * Draws the circle on the canvas.
 * @param {xrx.shape.Shape} graphic The graphic to be drawn.
 */
xrx.canvas.Circle.prototype.draw = function(graphic) {
  var geometry = graphic.getGeometry();
  this.context_.beginPath();
  this.context_.arc(geometry.cx, geometry.cy, geometry.r,
      0, 2 * Math.PI);
  this.strokeAndFill_(graphic);
};



/**
 * Creates a new circle.
 * @param {xrx.canvas.Canvas} canvas The parent canvas object.
 */
xrx.canvas.Circle.create = function(canvas) {
  return new xrx.canvas.Circle(canvas);
};
