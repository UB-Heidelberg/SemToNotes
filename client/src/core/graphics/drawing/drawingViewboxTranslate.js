/**
 * @fileoverview A class implementing translation functions for
 * a drawing view-box.
 */

goog.provide('xrx.drawing.ViewboxTranslate');



goog.require('xrx.drawing.EventType');
goog.require('xrx.drawing.Orientation');
goog.require('xrx.drawing.ViewboxZoom');



/**
 * A class implementing translation functions for a drawing view-box.
 * @constructor
 */
xrx.drawing.ViewboxTranslate = function() {

  goog.base(this);
};
goog.inherits(xrx.drawing.ViewboxTranslate, xrx.drawing.ViewboxZoom);



/**
 * Translates the view-box.
 * @param {number} The distance to translate in the x direction.
 * @param {number} The distance to translate in the y direction.
 */
xrx.drawing.ViewboxTranslate.prototype.translate = function(x, y) {
  var identity = this.ctm_.getIdentity();
  var point = identity.transformPoint([x, y]);
  this.ctm_ = identity.translate(point[0], point[1]).concatenate(this.ctm_);
  this.dispatchExternal(xrx.drawing.EventType.VIEWBOX_CHANGE, this.drawing_);
};



/**
 * Translates the view-box to the center of the drawing canvas.
 */
xrx.drawing.ViewboxTranslate.prototype.center = function() {
  this.centerHorizontally();
  this.centerVertically();
};



/**
 * Translates the view-box to the horizontal center of the drawing canvas.
 */
xrx.drawing.ViewboxTranslate.prototype.centerHorizontally = function() {
  var upperLeft = this.getFixPoint_(xrx.drawing.Orientation.NW, true, true);
  var width = this.getWidth(true, true);
  var dx = this.getDrawing().getWidth() / 2 - (upperLeft[0] + width / 2);
  this.translate(dx, 0);
  this.dispatchExternal(xrx.drawing.EventType.VIEWBOX_CHANGE, this.drawing_);
};



/**
 * Translates the view-box to the vertical center of the drawing canvas.
 */
xrx.drawing.ViewboxTranslate.prototype.centerVertically = function() {
  var upperLeft = this.getFixPoint_(xrx.drawing.Orientation.NW, true, true);
  var height = this.getHeight(true, true);
  var dy = this.getDrawing().getHeight() / 2 - (upperLeft[1] + height / 2);
  this.translate(0, dy);
  this.dispatchExternal(xrx.drawing.EventType.VIEWBOX_CHANGE, this.drawing_);
};
