***REMOVED***
***REMOVED*** @fileoverview Canvas class representing a poly-line.
***REMOVED***

goog.provide('xrx.canvas.Polyline');



goog.require('xrx.canvas.Stylable');
goog.require('xrx.geometry.Path');


***REMOVED***
***REMOVED*** Canvas class representing a poly-line.
***REMOVED*** @param {xrx.canvas.Canvas} canvas The parent canvas object.
***REMOVED***
***REMOVED*** @extends xrx.canvas.Stylable
***REMOVED***
xrx.canvas.Polyline = function(canvas) {

  goog.base(this, canvas, new xrx.geometry.Path());
***REMOVED***
goog.inherits(xrx.canvas.Polyline, xrx.canvas.Stylable);



***REMOVED***
***REMOVED*** Sets the coordinates for the poly-line.
***REMOVED*** @param {Array.<Array.<number>>} coords The coordinates.
***REMOVED***
xrx.canvas.Polyline.prototype.setCoords = function(coords) {
  this.geometry_.coords = coords;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the coordinates of the poly-line.
***REMOVED*** @return {Array.<Array.<number>>} The coordinates.
***REMOVED***
xrx.canvas.Polyline.prototype.getCoords = function(coords) {
  return this.geometry_.coords;
***REMOVED***



***REMOVED***
***REMOVED*** Appends a coordinate to the poly-line.
***REMOVED*** @param {Array.<number>} coord The new coordinate.
***REMOVED***
xrx.canvas.Polyline.prototype.appendCoord = function(coord) {
  this.geometry_.coords.push(coord);
***REMOVED***



***REMOVED***
***REMOVED*** @private
***REMOVED***
xrx.canvas.Polyline.prototype.drawPath_ = function() {
  var coords = this.geometry_.coords;
  this.context_.beginPath();
  this.context_.moveTo(coords[0][0], coords[0][1]);
  for(var i = 1, len = coords.length; i < len; i++) {
    this.context_.lineTo(coords[i][0], coords[i][1]);
  }
***REMOVED***



***REMOVED***
***REMOVED*** Draws the poly-line.
***REMOVED***
xrx.canvas.Polyline.prototype.draw = function() {
  this.drawPath_();
  this.strokeAndFill_();
***REMOVED***



***REMOVED***
***REMOVED*** Creates a new poly-line.
***REMOVED*** @param {xrx.canvas.Canvas} canvas The parent canvas object.
***REMOVED***
xrx.canvas.Polyline.create = function(canvas) {
  return new xrx.canvas.Polyline(canvas);
***REMOVED***
