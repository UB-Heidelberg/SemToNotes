/**
 * @fileoverview VML class representing an image.
 */

goog.provide('xrx.vml.Image');



goog.require('xrx.geometry.Rect');
goog.require('xrx.vml.Stylable');



/**
 * VML class representing an image.
 * @param {Raphael.circle} raphael The Raphael circle object.
 * @constructor
 * @extends xrx.canvas.Stylable
 */
xrx.vml.Image = function(raphael) {

  goog.base(this, raphael);
};
goog.inherits(xrx.vml.Image, xrx.vml.Stylable);



/**
 * @private
 */
xrx.vml.Image.prototype.setWidth_ = function(width) {
  this.raphael_.attr({width: width});
};



/**
 * @private
 */
xrx.vml.Image.prototype.setHeight_ = function(height) {
  this.raphael_.attr({height: height});
};



/**
 * Sets a new HTML image element.
 * @param {Image} image The HTML image element.
 */
xrx.vml.Image.prototype.setImage = function(image) {
  this.raphael_.attr({'src': image.src, 'width': image.naturalWidth,
      'height': image.naturalHeight});
  this.setWidth_(image.naturalWidth);
  this.setHeight_(image.naturalHeight);
};



/**
 * Draws the image.
 */
xrx.vml.Image.prototype.draw = function() {
  this.raphael_.show();
};



/**
 * Creates a new image.
 * @param {Raphael} canvas The parent Raphael object.
 */
xrx.vml.Image.create = function(canvas) {
  var raphael = canvas.getRaphael().image('', 0, 0, 0, 0);
  raphael.hide();
  return new xrx.vml.Image(raphael);
};
