/**
 * @fileoverview
 */

goog.provide('xrx.svg.Polygon');



goog.require('xrx.graphic.Polygon');
goog.require('xrx.svg');
goog.require('xrx.svg.Element');
goog.require('xrx.svg.Stylable');



/**
 * @constructor
 */
xrx.svg.Polygon = function(element) {

  goog.base(this, element);

  this.graphic_ = new xrx.graphic.Polygon();
};
goog.inherits(xrx.svg.Polygon, xrx.svg.Stylable);



xrx.svg.Polygon.tagName = 'polygon';



xrx.svg.Polygon.prototype.setCoords = function(coords) {
  this.graphic_.coords = coords;
  xrx.svg.setCoords(this.element_, coords);
};



xrx.svg.Polygon.prototype.getCoords = function(coords) {
  return this.graphic_.coords;
};



xrx.svg.Polygon.prototype.setCoordAt = function(pos, coord) {
  this.graphic_.coords[pos] = coord;
  xrx.svg.setCoords(this.element_, this.graphic_.coords);
};



xrx.svg.Polygon.prototype.draw = function() {};



xrx.svg.Polygon.create = function() {
  var element = xrx.svg.Element.create(xrx.svg.Polygon);
  return new xrx.svg.Polygon(element);
};
