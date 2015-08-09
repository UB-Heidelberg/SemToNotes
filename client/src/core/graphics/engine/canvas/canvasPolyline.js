/**
 * @fileoverview Canvas class representing a poly-line.
 */

goog.provide('xrx.canvas.Polyline');



goog.require('xrx.canvas.Stylable');
goog.require('xrx.geometry.Path');


/**
 * Canvas class representing a poly-line.
 * @param {xrx.canvas.Canvas} canvas The parent canvas object.
 * @constructor
 * @extends xrx.canvas.Stylable
 */
xrx.canvas.Polyline = function(canvas) {

  goog.base(this, canvas);
};
goog.inherits(xrx.canvas.Polyline, xrx.canvas.Stylable);



/**
 * @private
 */
xrx.canvas.Polyline.prototype.drawPath_ = function(graphic) {
  var coords = graphic.getGeometry().coords;
  this.context_.beginPath();
  this.context_.moveTo(coords[0][0], coords[0][1]);
  for(var i = 1, len = coords.length; i < len; i++) {
    this.context_.lineTo(coords[i][0], coords[i][1]);
  }
};



/**
 * Draws the poly-line.
 * @param {xrx.shape.Shape} graphic The graphic to be drawn.
 */
xrx.canvas.Polyline.prototype.draw = function(graphic) {
  this.drawPath_(graphic);
  this.strokeAndFill_(graphic);
};



/**
 * Creates a new poly-line.
 * @param {xrx.canvas.Canvas} canvas The parent canvas object.
 */
xrx.canvas.Polyline.create = function(canvas) {
  return new xrx.canvas.Polyline(canvas);
};
