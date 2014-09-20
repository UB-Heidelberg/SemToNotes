***REMOVED***
***REMOVED*** @fileoverview Canvas class representing a polygon.
***REMOVED***

goog.provide('xrx.canvas.Polygon');



goog.require('xrx.canvas.Stylable');
goog.require('xrx.geometry.Path');



***REMOVED***
***REMOVED*** Canvas class representing a polygon.
***REMOVED*** @param {xrx.canvas.Canvas} canvas The parent canvas object.
***REMOVED***
***REMOVED*** @extends xrx.canvas.Stylable
***REMOVED***
xrx.canvas.Polygon = function(canvas) {

  goog.base(this, canvas, new xrx.geometry.Path());
***REMOVED***
goog.inherits(xrx.canvas.Polygon, xrx.canvas.Stylable);



***REMOVED***
***REMOVED*** Sets the coordinates for the polygon.
***REMOVED*** @param {Array.<Array.<number>>} coords The coordinates.
***REMOVED***
xrx.canvas.Polygon.prototype.setCoords = function(coords) {
  this.geometry_.coords = coords;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the coordinates of the polygon.
***REMOVED*** @return {Array.<Array.<number>>} The coordinates.
***REMOVED***
xrx.canvas.Polygon.prototype.getCoords = function(coords) {
  return this.geometry_.coords;
***REMOVED***



***REMOVED***
***REMOVED*** Updates one coordinate in the list of coordinates.
***REMOVED*** @param {number} pos Index of the coordinate to be updated.
***REMOVED*** @param {Array.<number>} coord The new coordinate.
***REMOVED***
xrx.canvas.Polygon.prototype.setCoordAt = function(pos, coord) {
  this.geometry_.coords[pos] = coord;
***REMOVED***



***REMOVED***
***REMOVED*** @private
***REMOVED***
xrx.canvas.Polygon.prototype.drawPath_ = function() {
  var coords = this.geometry_.coords;
  this.context_.beginPath();
  this.context_.moveTo(coords[0][0], coords[0][1]);
  for(var i = 1, len = coords.length; i < len; i++) {
    this.context_.lineTo(coords[i][0], coords[i][1]);
  }
  this.context_.lineTo(coords[0][0], coords[0][1]);
  this.context_.closePath();
***REMOVED***



***REMOVED***
***REMOVED*** Draws the polygon.
***REMOVED***
xrx.canvas.Polygon.prototype.draw = function() {
  this.drawPath_();
  this.strokeAndFill_();
***REMOVED***



***REMOVED***
***REMOVED*** Creates a new polygon.
***REMOVED*** @param {xrx.canvas.Canvas} canvas The parent canvas object.
***REMOVED***
xrx.canvas.Polygon.create = function(canvas) {
  return new xrx.canvas.Polygon(canvas);
***REMOVED***
