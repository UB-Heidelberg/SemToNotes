/**
 * @fileoverview A class implementing geometry related
 * functions for a drawing view-box.
 */

goog.provide('xrx.drawing.ViewboxGeometry');



goog.require('goog.object');
goog.require('xrx.geometry.Box');
goog.require('xrx.geometry.Point');
goog.require('xrx.EventTarget');



/**
 * @constructor
 */
xrx.drawing.ViewboxGeometry = function() {

  this.testPoint_ = new Array(2);
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
 * Returns the bounding-box for the view-box.
 * @return {goog.math.Box} The bounding box.
 */
xrx.drawing.ViewboxGeometry.prototype.getBox = function() {
  var image = this.getDrawing().getLayerBackground().getImage();
  var width = image.getWidth();
  var height = image.getHeight();
  return [0, width, height, 0];
};



xrx.drawing.ViewboxGeometry.prototype.containsPoint = function(point) {
  var box = this.getBox();
  this.ctm_.createInverse().transform(point, 0, this.testPoint_, 0, 1);
  return xrx.geometry.Box.containsPoint(box, this.testPoint_);
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
xrx.drawing.ViewboxGeometry.prototype.getFixPoints = function() {
  var image = this.getDrawing().getLayerBackground().getImage();
  var width = image.getWidth();
  var height = image.getHeight();
  return {
    'C': [width / 2, height / 2],
    'NE': [width, 0], 
    'SE': [width, height],
    'SW': [0, height],
    'NW': [0, 0]
  };
};



/**
 *
 */
xrx.drawing.ViewboxGeometry.prototype.getFixPoint = function(fixPoint, opt_transformed) {
  var fixPoint = this.getFixPoints()[fixPoint];
  if (opt_transformed === true) {
    var point = new Array(2);
    this.ctm_.transform(fixPoint, 0, point, 0, 1);
    return point;
  }
  return fixPoint;
};
