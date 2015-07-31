/**
 * @fileoverview A class implementing geometry related
 * functions for a drawing view-box.
 */

goog.provide('xrx.drawing.ViewboxGeometry');



goog.require('goog.array');
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



xrx.drawing.ViewboxGeometry.prototype.getWidth = function(opt_transformed,
    opt_visible) {
  if (opt_visible === true && this.isHorizontal()) {
    return this.getHeight(opt_transformed);
  } else {
    var image = this.getDrawing().getLayerBackground().getImage();
    var width = image.getWidth();
    return !opt_transformed ? width : width * this.ctm_.getScale();
  }
};



xrx.drawing.ViewboxGeometry.prototype.getHeight = function(opt_transformed, opt_visible) {
  if (opt_visible === true && this.isHorizontal()) {
    return this.getWidth(opt_transformed);
  } else {
    var image = this.getDrawing().getLayerBackground().getImage();
    var height = image.getHeight();
    return !opt_transformed ? height : height * this.ctm_.getScale();
  }
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
  return xrx.geometry.Box.containsPoint(box, point);
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



xrx.drawing.ViewboxGeometry.prototype.getVisibleOrientation_ = function(orientation) {
  var orientations = ['NW', 'SW', 'SE', 'NE'];
  var index = goog.array.indexOf(orientations, orientation);
  var rotations = this.getRotation() / 90;
  return orientations[(index + rotations) % 4];
};



/**
 * @type {Object}
 */
xrx.drawing.ViewboxGeometry.prototype.FixPoints_ = {
  'C': [0, 0],
  'NE': [0, 0], 
  'SE': [0, 0],
  'SW': [0, 0],
  'NW': [0, 0]
};



/**
 *
 */
xrx.drawing.ViewboxGeometry.prototype.getFixPoints_ = function() {
  var image = this.getDrawing().getLayerBackground().getImage();
  var width = image.getWidth();
  var height = image.getHeight();
  this.FixPoints_.C = [width / 2, height / 2];
  this.FixPoints_.NE = [width, 0];
  this.FixPoints_.SE = [width, height];
  this.FixPoints_.SW = [0, height];
  this.FixPoints_.NW = [0, 0];
  return this.FixPoints_;
};



/**
 * 
 */
xrx.drawing.ViewboxGeometry.prototype.getFixPoint_ = function(orientation,
    opt_transformed, opt_visible) {
  var fixPoints = this.getFixPoints_();
  var fixPoint = !opt_visible ? fixPoints[orientation] :
      fixPoints[this.getVisibleOrientation_(orientation)];
  if (opt_transformed === true) {
    var point = new Array(2);
    this.ctm_.transform(fixPoint, 0, point, 0, 1);
    return point;
  }
  return fixPoint;
};
