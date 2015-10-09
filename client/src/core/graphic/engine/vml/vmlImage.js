/**
 * @fileoverview VML class representing an image.
 */

goog.provide('xrx.vml.Image');



goog.require('xrx.vml');
goog.require('xrx.vml.Stylable');



/**
 * VML class representing an image.
 * @param {HTMLElement} The HTML element.
 * @constructor
 * @extends xrx.canvas.Stylable
 * @private
 */
xrx.vml.Image = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.vml.Image, xrx.vml.Stylable);



/**
 * Sets a new HTML image element.
 * @param {Image} image The HTML image element.
 */
xrx.vml.Image.prototype.setImage = function(image) {
  this.element_.src = image.src;
  this.element_['width'] = image.naturalWidth;
  this.element_['height'] = image.naturalHeight;
};



/**
 * Draws the image.
 * @param {HTMLImageElement} image The image to draw. Make sure
 *     that image has naturalWidth and naturalHeight attributes.
 */
xrx.vml.Image.prototype.draw = function(image) {
  if (image !== undefined) this.setImage(image);
};



/**
 * Creates a new image.
 * @param {Raphael} canvas The parent Raphael object.
 */
xrx.vml.Image.create = function(canvas) {
  var element = goog.dom.htmlToDocumentFragment('<image' +
      '  xmlns="urn:schemas-microsoft.com:vml" class="xrx-vml" src="about:blank">' +
      '</image>');
  element.style['position'] = 'absolute';
  element.style['display'] = 'inline';
  element.style['left'] = '0px';
  element.style['top'] = '0px';
  return new xrx.vml.Image(element);
};
