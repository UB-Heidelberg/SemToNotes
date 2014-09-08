/**
 * @fileoverview
 */

goog.provide('xrx.svg.Circle');



goog.require('xrx.graphic.Circle');
goog.require('xrx.svg.Element');
goog.require('xrx.svg.Stylable');



xrx.svg.Circle = function(element) {

  goog.base(this, element);

  this.graphic_ = new xrx.graphic.Circle();
};
goog.inherits(xrx.svg.Circle, xrx.svg.Stylable);



xrx.svg.Circle.tagName = 'circle';



xrx.svg.Circle.prototype.getCenter = function() {
  return [this.graphic_.cx, this.graphic_.cy];
};



xrx.svg.Circle.prototype.setCenter = function(cx, cy) {
  this.graphic_.cx = cx;
  this.graphic_.cy = cy;
  this.element_.setAttribute('cx', cx);
  this.element_.setAttribute('cy', cy);
};



xrx.svg.Circle.prototype.getRadius = function() {
  return this.graphic_.r;
};



xrx.svg.Circle.prototype.setRadius = function(r) {
  this.graphic_.r = r;
  this.element_.setAttribute('r', r);
};



xrx.svg.Circle.prototype.draw = function() {};



xrx.svg.Circle.create = function(element) {
  var element = xrx.svg.Element.create(xrx.svg.Circle);
  return new xrx.svg.Circle(element);
};
