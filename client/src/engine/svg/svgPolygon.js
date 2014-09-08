***REMOVED***
***REMOVED*** @fileoverview
***REMOVED***

goog.provide('xrx.svg.Polygon');



goog.require('xrx.graphic.Polygon');
goog.require('xrx.svg');
goog.require('xrx.svg.Element');
goog.require('xrx.svg.Stylable');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.svg.Polygon = function(element) {

***REMOVED***

  this.graphic_ = new xrx.graphic.Polygon();
***REMOVED***
goog.inherits(xrx.svg.Polygon, xrx.svg.Stylable);



xrx.svg.Polygon.tagName = 'polygon';



xrx.svg.Polygon.prototype.setCoords = function(coords) {
  this.graphic_.coords = coords;
  xrx.svg.setCoords(this.element_, coords);
***REMOVED***



xrx.svg.Polygon.prototype.getCoords = function(coords) {
  return this.graphic_.coords;
***REMOVED***



xrx.svg.Polygon.prototype.setCoordAt = function(pos, coord) {
  this.graphic_.coords[pos] = coord;
  xrx.svg.setCoords(this.element_, this.graphic_.coords);
***REMOVED***



xrx.svg.Polygon.prototype.draw = function() {***REMOVED***



xrx.svg.Polygon.create = function() {
  var element = xrx.svg.Element.create(xrx.svg.Polygon);
  return new xrx.svg.Polygon(element);
***REMOVED***
