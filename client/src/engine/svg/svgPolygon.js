***REMOVED***
***REMOVED*** @fileoverview SVG class representing a polygon.
***REMOVED***

goog.provide('xrx.svg.Polygon');



goog.require('xrx.geometry.Polygon');
goog.require('xrx.svg');
goog.require('xrx.svg.Stylable');



***REMOVED***
***REMOVED*** SVG class representing a polygon
***REMOVED*** @param {SVGPolygonElement} element The SVG polygon element.
***REMOVED***
***REMOVED*** @extends xrx.canvas.Stylable
***REMOVED***
xrx.svg.Polygon = function(element) {

  goog.base(this, element, new xrx.geometry.Polygon());
***REMOVED***
goog.inherits(xrx.svg.Polygon, xrx.svg.Stylable);



***REMOVED***
***REMOVED*** Sets the coordinates for the polygon.
***REMOVED*** @param {Array.<Array.<number>>} coords The coordinates.
***REMOVED***
xrx.svg.Polygon.prototype.setCoords = function(coords) {
  this.geometry_.coords = coords;
  xrx.svg.setCoords(this.element_, coords);
***REMOVED***



***REMOVED***
***REMOVED*** Returns the coordinates of the polygon.
***REMOVED*** @return {Array.<Array.<number>>} The coordinates.
***REMOVED***
xrx.svg.Polygon.prototype.getCoords = function(coords) {
  return this.geometry_.coords;
***REMOVED***



***REMOVED***
***REMOVED*** Updates one coordinate in the list of coordinates.
***REMOVED*** @param {number} pos Index of the coordinate to be updated.
***REMOVED*** @param {Array.<number>} coord The new coordinate.
***REMOVED***
xrx.svg.Polygon.prototype.setCoordAt = function(pos, coord) {
  this.geometry_.coords[pos] = coord;
  xrx.svg.setCoords(this.element_, this.geometry_.coords);
***REMOVED***



***REMOVED***
***REMOVED*** Draws the polygon.
***REMOVED***
xrx.svg.Polygon.prototype.draw = function() {***REMOVED***



***REMOVED***
***REMOVED*** Creates a new polygon.
***REMOVED***
xrx.svg.Polygon.create = function(undefined_) {
  var element = document.createElementNS(xrx.svg.Namespace['svg'], 'polygon');
  return new xrx.svg.Polygon(element);
***REMOVED***
