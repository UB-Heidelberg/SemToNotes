/**
 * @fileoverview A class implementing geometry related
 * functions for a drawing view-box.
 */

goog.provide('xrx.drawing.ViewboxGeometry');



goog.require('xrx.EventTarget');



xrx.drawing.ViewboxGeometry = function() {
};
goog.inherits(xrx.drawing.ViewboxGeometry, xrx.EventTarget);



xrx.drawing.ViewboxGeometry.prototype.getWidth = function() {
  var image = this.getDrawing().getLayerBackground().getImage();
  return image.getWidth();
};



xrx.drawing.ViewboxGeometry.prototype.getHeight = function() {
  var image = this.getDrawing().getLayerBackground().getImage();
  return image.getHeight();
};



/**
 * @private
 */
xrx.drawing.ViewboxGeometry.prototype.getCenterPoint_ = function(opt_transformed) {
  var image = this.getDrawing().getLayerBackground().getImage();
  var natural = [image.getWidth() / 2, image.getHeight() / 2];
  var transformed;
  if (opt_transformed !== true) {
    return natural;
  } else {
    transformed = new Array(2);
    this.ctm_.transform(natural, 0, transformed, 0, 1);
    return transformed;
  }
};



/**
 *
 */
xrx.drawing.ViewboxGeometry.prototype.getFixPoint = function(fixPoint, opt_transformed) {
  var image = this.getDrawing().getLayerBackground().getImage();
  var width = image.getWidth();
  var height = image.getHeight();
  var fixPoints = {
    'C': [width / 2, height / 2],
    'NE': [width, 0], 
    'SE': [width, height],
    'SW': [0, height],
    'NW': [0, 0]
  };
  var fixPoint = fixPoints[fixPoint];
  if (opt_transformed === true) {
    var point = new Array(2);
    this.ctm_.transform(fixPoint, 0, point, 0, 1);
    return point;
  }
  return fixPoint;
};



/**
 * 
 */
xrx.drawing.ViewboxGeometry.prototype.getScale = function() {
  return Math.sqrt(Math.pow(this.ctm_.getScaleX(), 2) +
      Math.pow(this.ctm_.getShearX(), 2))
};



/**
 * Returns the bounding-box for the view-box.
 * @return {goog.math.Box} The bounding box.
 */
xrx.drawing.ViewboxGeometry.prototype.getBox = function() {
  var image = this.drawing_.getLayerBackground().getImage();
  return image.getGeometry().getBox();
};
