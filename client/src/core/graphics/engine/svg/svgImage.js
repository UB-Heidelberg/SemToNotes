/**
 * @fileoverview SVG class representing an image.
 */

goog.provide('xrx.svg.Image');



goog.require('xrx.svg');
goog.require('xrx.svg.Stylable');



/**
 * SVG class representing an image.
 * @param {SVGImageElement} element The SVG image element.
 * @constructor
 * @extends xrx.svg.Stylable
 */
xrx.svg.Image = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.svg.Image, xrx.svg.Stylable);



/**
 * @private
 */
xrx.svg.Image.prototype.setWidth_ = function(width) {
  this.element_.setAttribute('width', width);
};



/**
 * @private
 */
xrx.svg.Image.prototype.setHeight_ = function(height) {
  this.element_.setAttribute('height', height);
};



/**
 * Sets a new HTML image element.
 * @param {Image} image The HTML image element.
 */
xrx.svg.Image.prototype.setImage = function(image) {
  this.element_.setAttributeNS(xrx.svg.Namespace['xlink'], 'xlink:href', image.src);
  this.setWidth_(image.naturalWidth);
  this.setHeight_(image.naturalHeight);
};



/**
 * Draws the image.
 */
xrx.svg.Image.prototype.draw = function() {};



/**
 * Creates a new image.
 */
xrx.svg.Image.create = function(undefined_) {
  var element = document.createElementNS(xrx.svg.Namespace['svg'], 'image');
  return new xrx.svg.Image(element);
};
