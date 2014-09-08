/**
 * @fileoverview
 */

goog.provide('xrx.vml.Polygon');



goog.require('xrx.graphic.Polygon');
goog.require('xrx.vml');
goog.require('xrx.vml.Element');
goog.require('xrx.vml.Stylable');



/**
 * @constructor
 */
xrx.vml.Polygon = function(raphael) {

  goog.base(this, raphael);

  this.graphic_ = new xrx.graphic.Polygon();
};
goog.inherits(xrx.vml.Polygon, xrx.vml.Stylable);



xrx.vml.Polygon.prototype.setCoords = function(coords) {
  this.graphic_.coords = coords;
  xrx.vml.setCoords(this.raphael_, coords);
};



xrx.vml.Polygon.prototype.getCoords = function(coords) {
  return this.graphic_.coords;
};



xrx.vml.Polygon.prototype.setCoordAt = function(pos, coord) {
  this.graphic_.coords[pos] = coord;
  xrx.vml.setCoords(this.raphael_, this.graphic_.coords);
};



xrx.vml.Polygon.prototype.draw = function() {
  this.raphael_.show();
};



xrx.vml.Polygon.create = function(canvas) {
  var raphael = canvas.getRaphael().path('M0 0');
  raphael.hide();
  return new xrx.vml.Polygon(raphael);
};
