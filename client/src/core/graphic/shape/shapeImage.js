/**
 * @fileoverview A class representing an engine-independent
 * image graphic.
 */

goog.provide('xrx.shape.Image');



goog.require('xrx.geometry.Rect');
goog.require('xrx.shape.Geometry');



/**
 * A class representing an engine-independent image graphic.
 * @param {xrx.drawing.Drawing} drawing The parent drawing canvas.
 * @constructor
 */
xrx.shape.Image = function(drawing, engineElement) {

  goog.base(this, drawing, engineElement,
      new xrx.geometry.Rect());

  /**
   * The HTML image element.
   * @type {HTMLImage}
   */
  this.image_;
};
goog.inherits(xrx.shape.Image, xrx.shape.Geometry);



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
  this.startDrawing_();
  if (this.image_) this.engineElement_.draw(this.image_);
  this.finishDrawing_();
};



/**
 * Creates a new image graphic.
 * @param {xrx.drawing.Drawing} drawing The parent drawing canvas.
 */
xrx.shape.Image.create = function(drawing) {
  var shapeCanvas = drawing.getCanvas();
  var engine = shapeCanvas.getEngine();
  var engineCanvas = shapeCanvas.getEngineElement();
  var engineElement = engine.createImage(engineCanvas);
  return new xrx.shape.Image(drawing, engineElement);
};
