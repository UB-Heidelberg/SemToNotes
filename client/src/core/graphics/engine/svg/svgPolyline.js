***REMOVED***
***REMOVED*** @fileoverview SVG class representing a poly-line.
***REMOVED***

goog.provide('xrx.svg.Polyline');



goog.require('xrx.geometry.Path');
goog.require('xrx.svg');
goog.require('xrx.svg.Stylable');



***REMOVED***
***REMOVED*** SVG class representing a poly-line.
***REMOVED*** @param {SVGPolylineElement} element The SVG polyline element.
***REMOVED***
***REMOVED*** @extends xrx.svg.Stylable
***REMOVED***
xrx.svg.Polyline = function(element) {

  goog.base(this, element, new xrx.geometry.Path());
***REMOVED***
goog.inherits(xrx.svg.Polyline, xrx.svg.Stylable);



***REMOVED***
***REMOVED*** Sets the coordinates for the poly-line.
***REMOVED*** @param {Array.<Array.<number>>} coords The coordinates.
***REMOVED***
xrx.svg.Polyline.prototype.setCoords = function(coords) {
  this.geometry_.coords = coords;
  xrx.svg.setCoords(this.element_, coords);
***REMOVED***



***REMOVED***
***REMOVED*** Returns the coordinates of the poly-line.
***REMOVED*** @return {Array.<Array.<number>>} The coordinates.
***REMOVED***
xrx.svg.Polyline.prototype.getCoords = function(coords) {
  return this.geometry_.coords;
***REMOVED***



***REMOVED***
***REMOVED*** Appends a coordinate to the poly-line.
***REMOVED*** @param {Array.<number>} coord The new coordinate.
***REMOVED***
xrx.svg.Polyline.prototype.appendCoord = function(coord) {
  this.geometry_.coords.push(coord);
  xrx.svg.setCoords(this.element_, this.geometry_.coords, false);
***REMOVED***



***REMOVED***
***REMOVED*** Draws the poly-line.
***REMOVED***
xrx.svg.Polyline.prototype.draw = function() {***REMOVED***



***REMOVED***
***REMOVED*** Creates a new poly-line.
***REMOVED***
xrx.svg.Polyline.create = function(undefined_) {
  var element = document.createElementNS(xrx.svg.Namespace['svg'], 'polyline');
  return new xrx.svg.Polyline(element);
***REMOVED***
