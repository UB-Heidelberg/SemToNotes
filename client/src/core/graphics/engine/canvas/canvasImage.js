/**
 * @fileoverview Canvas class representing an image.
 */

goog.provide('xrx.canvas.Image');



goog.require('xrx.canvas.Stylable');



/**
 * Canvas class representing an image.
 * @param {xrx.canvas.Canvas} canvas The parent canvas object.
 * @constructor
 * @extends xrx.canvas.Stylable
 */
xrx.canvas.Image = function(canvas) {

  goog.base(this, canvas);
};
goog.inherits(xrx.canvas.Image, xrx.canvas.Stylable);



/**
 * Draws the image.
 * @param {xrx.shape.Shape} graphic The graphic to be drawn.
 */
xrx.canvas.Image.prototype.draw = function(graphic) {
  var geometry = graphic.getGeometry();
  var image = graphic.getImage();
  if (image) this.context_.drawImage(image, geometry.x,
      geometry.y, geometry.width, geometry.height);
};



/**
 * Creates a new image.
 * @param {xrx.canvas.Canvas} canvas The parent canvas object.
 */
xrx.canvas.Image.create = function(canvas) {
  return new xrx.canvas.Image(canvas);
};
