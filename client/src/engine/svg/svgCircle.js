***REMOVED***
***REMOVED*** @fileoverview
***REMOVED***

goog.provide('xrx.svg.Circle');



goog.require('xrx.graphic.Circle');
goog.require('xrx.svg.Element');
goog.require('xrx.svg.Stylable');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.svg.Circle = function(element) {

***REMOVED***

  this.graphic_ = new xrx.graphic.Circle();
***REMOVED***
goog.inherits(xrx.svg.Circle, xrx.svg.Stylable);



xrx.svg.Circle.tagName = 'circle';



xrx.svg.Circle.prototype.getCenter = function() {
  return [this.graphic_.cx, this.graphic_.cy];
***REMOVED***



xrx.svg.Circle.prototype.setCenter = function(cx, cy) {
  this.graphic_.cx = cx;
  this.graphic_.cy = cy;
  this.element_.setAttribute('cx', cx);
  this.element_.setAttribute('cy', cy);
***REMOVED***



xrx.svg.Circle.prototype.getRadius = function() {
  return this.graphic_.r;
***REMOVED***



xrx.svg.Circle.prototype.setRadius = function(r) {
  this.graphic_.r = r;
  this.element_.setAttribute('r', r);
***REMOVED***



xrx.svg.Circle.prototype.draw = function() {***REMOVED***



xrx.svg.Circle.create = function(element) {
  var element = xrx.svg.Element.create(xrx.svg.Circle);
  return new xrx.svg.Circle(element);
***REMOVED***
