/**
 * @fileoverview VML class representing an image.
 */

goog.provide('xrx.vml.Image');



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
 * Sets a new HTML image element.
 * @param {Image} image The HTML image element.
 */
xrx.vml.Image.prototype.setImage = function(image) {
  this.raphael_.attr({'src': image.src, 'width': image.naturalWidth,
      'height': image.naturalHeight});
};



/**
 * Draws the image.
 * @param {HTMLImageElement} image The image to draw. Make sure
 *     that image has naturalWidth and naturalHeight attributes.
 */
xrx.vml.Image.prototype.draw = function(image) {
  this.setImage(image);
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
