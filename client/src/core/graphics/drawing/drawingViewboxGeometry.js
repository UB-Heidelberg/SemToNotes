/**
 * @fileoverview A class implementing geometry related
 * functions for a drawing view-box.
 */

goog.provide('xrx.drawing.ViewboxGeometry');



xrx.drawing.ViewboxGeometry = function() {
};



/**
 *
 */
xrx.drawing.ViewboxGeometry.FixPoint = {
  C:  'C',  // center
  NE: 'NE', // northeast
  SE: 'SE', // southeast
  SW: 'SW', // southwest
  NW: 'NW'  // northwest
};



/**
 *
 */
xrx.drawing.ViewboxGeometry.Orientation = {
  NORTH: 0,
  EAST:  1,
  SOUTH: 2,
  WEST:  3
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
 * @private
 */
xrx.drawing.ViewboxGeometry.prototype.isVertical_ = function() {
  return this.rotation_ === 0 || goog.math.isInt(this.rotation_ / 180);
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
