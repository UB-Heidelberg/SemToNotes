***REMOVED***
***REMOVED*** @fileoverview
***REMOVED***

goog.provide('xrx.canvas.Polygon');



goog.require('xrx.canvas.Stylable');
goog.require('xrx.graphic.Polygon');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.canvas.Polygon = function(canvas) {

  goog.base(this, canvas);

  this.graphic_ = new xrx.graphic.Polygon();
***REMOVED***
goog.inherits(xrx.canvas.Polygon, xrx.canvas.Stylable);



xrx.canvas.Polygon.prototype.setCoords = function(coords) {
  this.graphic_.coords = coords;
***REMOVED***



xrx.canvas.Polygon.prototype.getCoords = function(coords) {
  return this.graphic_.coords;
***REMOVED***



xrx.canvas.Polygon.prototype.setCoordAt = function(pos, coord) {
  this.graphic_.coords[pos] = coord;
***REMOVED***



xrx.canvas.Polygon.prototype.drawPath = function() {
  var coords = this.graphic_.coords;
  this.context_.beginPath();
  this.context_.moveTo(coords[0][0], coords[0][1]);
  for(var i = 1, len = coords.length; i < len; i++) {
    this.context_.lineTo(coords[i][0], coords[i][1]);
  }
  this.context_.lineTo(coords[0][0], coords[0][1]);
  this.context_.closePath();
***REMOVED***



xrx.canvas.Polygon.prototype.draw = function() {
  this.drawPath();
  this.strokeAndFill_();
***REMOVED***



xrx.canvas.Polygon.create = function(canvas) {
  return new xrx.canvas.Polygon(canvas);
***REMOVED***
