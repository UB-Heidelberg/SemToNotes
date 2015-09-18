/**
 * @fileoverview A class representing an engine-independent
 * image graphic.
 */

goog.provide('xrx.shape.Image');



goog.require('xrx.geometry.Rect');
goog.require('xrx.shape.Stylable');



/**
 * A class representing an engine-independent image graphic.
 * @param {xrx.shape.Canvas} canvas The parent canvas object.
 * @param {xrx.engine.Element} engineElement The engine element
 *   used to render this shape.
 * @constructor
 */
xrx.shape.Image = function(canvas, engineElement) {

  goog.base(this, canvas, engineElement, new xrx.geometry.Rect());

  /**
   * The HTML image element.
   * @type {HTMLImage}
   */
  this.image_;
};
goog.inherits(xrx.shape.Image, xrx.shape.Stylable);



/**
 * Returns the HTML image element used to create the image.
 * @return {HTMLImage} The HTML image element.
 */
xrx.shape.Image.prototype.getImage = function() {
  return this.image_;
};



/**
 * Sets a new HTML image element.
 * @param {HTMLImage} image The HTML image element.
 */
xrx.shape.Image.prototype.setImage = function(image) {
  this.image_ = image;
  this.geometry_.width = image.naturalWidth;
  this.geometry_.height = image.naturalHeight;
};



/**
 * Returns the height of this image.
 * @return {number} The height.
 */
xrx.shape.Image.prototype.getHeight = function() {
  return this.geometry_.height;
};



/**
 * Returns the width of this image.
 * @return {number} The width.
 */
xrx.shape.Image.prototype.getWidth = function() {
  return this.geometry_.width;
};



/**
 * Draws this image.
 */
xrx.shape.Image.prototype.draw = function() {
  if (this.image_) this.engineElement_.draw(this.image_);
};



/**
 * Creates a new image graphic.
 * @param {xrx.shape.Canvas} The parent canvas object.
 */
xrx.shape.Image.create = function(canvas) {
  var engineElement;
  var engine = canvas.getEngine();
  var canvasElement = canvas.getEngineElement();
  if (engine.typeOf(xrx.engine.CANVAS)) {
    engineElement = xrx.canvas.Image.create(canvasElement);
  } else if (engine.typeOf(xrx.engine.SVG)) {
    engineElement = xrx.svg.Image.create(canvasElement);
  } else if (engine.typeOf(xrx.engine.VML)) {
    engineElement = xrx.vml.Image.create(canvasElement);
  } else {
    throw Error('Unknown engine.');
  }
  return new xrx.shape.Image(canvas, engineElement);
};
