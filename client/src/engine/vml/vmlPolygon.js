***REMOVED***
***REMOVED*** @fileoverview VML class representing a polygon.
***REMOVED***

goog.provide('xrx.vml.Polygon');



goog.require('xrx.geometry.Polygon');
goog.require('xrx.vml');
goog.require('xrx.vml.Stylable');



***REMOVED***
***REMOVED*** VML class representing a polygon.
***REMOVED*** @param {Raphael.path} raphael The Raphael path object.
***REMOVED***
***REMOVED*** @extends xrx.canvas.Stylable
***REMOVED***
xrx.vml.Polygon = function(raphael) {

  goog.base(this, raphael, new xrx.geometry.Polygon());
***REMOVED***
goog.inherits(xrx.vml.Polygon, xrx.vml.Stylable);



***REMOVED***
***REMOVED*** Sets the coordinates for the polygon.
***REMOVED*** @param {Array.<Array.<number>>} coords The coordinates.
***REMOVED***
xrx.vml.Polygon.prototype.setCoords = function(coords) {
  this.geometry_.coords = coords;
  xrx.vml.setCoords(this.raphael_, coords);
***REMOVED***



***REMOVED***
***REMOVED*** Returns the coordinates of the polygon.
***REMOVED*** @return {Array.<Array.<number>>} The coordinates.
***REMOVED***
xrx.vml.Polygon.prototype.getCoords = function(coords) {
  return this.geometry_.coords;
***REMOVED***



***REMOVED***
***REMOVED*** Updates one coordinate in the list of coordinates.
***REMOVED*** @param {number} pos Index of the coordinate to be updated.
***REMOVED*** @param {Array.<number>} coord The new coordinate.
***REMOVED***
xrx.vml.Polygon.prototype.setCoordAt = function(pos, coord) {
  this.geometry_.coords[pos] = coord;
  xrx.vml.setCoords(this.raphael_, this.geometry_.coords);
***REMOVED***



***REMOVED***
***REMOVED*** Draws the polygon.
***REMOVED***
xrx.vml.Polygon.prototype.draw = function() {
  this.raphael_.show();
***REMOVED***



***REMOVED***
***REMOVED*** Creates a new polygon.
***REMOVED*** @param {xrx.vml.Canvas} canvas The parent canvas object.
***REMOVED***
xrx.vml.Polygon.create = function(canvas) {
  var raphael = canvas.getRaphael().path('M0 0');
  raphael.hide();
  return new xrx.vml.Polygon(raphael);
***REMOVED***
