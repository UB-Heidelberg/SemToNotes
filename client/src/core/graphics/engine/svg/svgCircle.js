***REMOVED***
***REMOVED*** @fileoverview SVG rendering class representing a circle.
***REMOVED***

goog.provide('xrx.svg.Circle');



goog.require('xrx.geometry.Circle');
goog.require('xrx.svg');
goog.require('xrx.svg.Stylable');



***REMOVED***
***REMOVED*** SVG rendering class representing a circle.
***REMOVED*** @param {SVGCircleElement} element The SVG circle element.
***REMOVED***
***REMOVED*** @extends xrx.svg.Stylable
***REMOVED***
xrx.svg.Circle = function(element) {

  goog.base(this, element, new xrx.geometry.Circle());
***REMOVED***
goog.inherits(xrx.svg.Circle, xrx.svg.Stylable);



***REMOVED***
***REMOVED*** Returns the centre point of the circle.
***REMOVED*** @return {Array.<number>}
***REMOVED***
xrx.svg.Circle.prototype.getCenter = function() {
  return [this.geometry_.cx, this.geometry_.cy];
***REMOVED***



***REMOVED***
***REMOVED*** Sets the centre point of a circle.
***REMOVED*** @param {number} cx The X coordinate of the centre point.
***REMOVED*** @param {number} cy The Y coordinate of the centre point.
***REMOVED***
xrx.svg.Circle.prototype.setCenter = function(cx, cy) {
  this.geometry_.cx = cx;
  this.geometry_.cy = cy;
  this.element_.setAttribute('cx', cx);
  this.element_.setAttribute('cy', cy);
***REMOVED***



***REMOVED***
***REMOVED*** Returns the radius of the circle.
***REMOVED*** @return {number} The radius.
***REMOVED***
xrx.svg.Circle.prototype.getRadius = function() {
  return this.geometry_.r;
***REMOVED***



***REMOVED***
***REMOVED*** Sets the radius of the circle.
***REMOVED*** @param {number} r The radius.
***REMOVED***
xrx.svg.Circle.prototype.setRadius = function(r) {
  this.geometry_.r = r;
  this.element_.setAttribute('r', r);
***REMOVED***



***REMOVED***
***REMOVED*** Draws the circle on the canvas.
***REMOVED***
xrx.svg.Circle.prototype.draw = function() {***REMOVED***



***REMOVED***
***REMOVED*** Creates a new circle.
***REMOVED***
xrx.svg.Circle.create = function(undefined_) {
  var element = document.createElementNS(xrx.svg.Namespace['svg'], 'circle');
  return new xrx.svg.Circle(element);
***REMOVED***
