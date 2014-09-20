***REMOVED***
***REMOVED*** @fileoverview VML class representing a poly-line.
***REMOVED***

goog.provide('xrx.vml.Polyline');



goog.require('xrx.geometry.Path');
goog.require('xrx.vml');
goog.require('xrx.vml.Stylable');



***REMOVED***
***REMOVED*** VML class representing a poly-line.
***REMOVED*** @param {Raphael.path} raphael The Raphael path object.
***REMOVED***
***REMOVED*** @extends xrx.vml.Stylable
***REMOVED***
xrx.vml.Polyline = function(raphael) {

  goog.base(this, raphael, new xrx.geometry.Path());
***REMOVED***
goog.inherits(xrx.vml.Polyline, xrx.vml.Stylable);



***REMOVED***
***REMOVED*** Sets the coordinates for the poly-line.
***REMOVED*** @param {Array.<Array.<number>>} coords The coordinates.
***REMOVED***
xrx.vml.Polyline.prototype.setCoords = function(coords) {
  this.geometry_.coords = coords;
  xrx.vml.setCoords(this.raphael_, coords, false);
***REMOVED***



***REMOVED***
***REMOVED*** Returns the coordinates of the poly-line.
***REMOVED*** @return {Array.<Array.<number>>} The coordinates.
***REMOVED***
xrx.vml.Polyline.prototype.getCoords = function(coords) {
  return this.geometry_.coords;
***REMOVED***



***REMOVED***
***REMOVED*** Appends a coordinate to the poly-line.
***REMOVED*** @param {Array.<number>} coord The new coordinate.
***REMOVED***
xrx.vml.Polyline.prototype.appendCoord = function(coord) {
  this.geometry_.coords.push(coord);
  xrx.vml.setCoords(this.raphael_, this.geometry_.coords);
***REMOVED***



***REMOVED***
***REMOVED*** Draws the polygon.
***REMOVED***
xrx.vml.Polyline.prototype.draw = function() {
  this.raphael_.show();
***REMOVED***



***REMOVED***
***REMOVED*** Creates a new poly-line.
***REMOVED*** @param {xrx.vml.Canvas} canvas The parent canvas object.
***REMOVED***
xrx.vml.Polyline.create = function(canvas) {
  var raphael = canvas.getRaphael().path('M0 0');
  raphael.hide();
  return new xrx.vml.Polyline(raphael);
***REMOVED***
