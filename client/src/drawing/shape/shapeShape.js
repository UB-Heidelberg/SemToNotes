***REMOVED***
***REMOVED*** @fileoverview
***REMOVED***

goog.provide('xrx.shape.Shape');



goog.require('xrx.drawing.Mode');
goog.require('xrx.drawing.State');
goog.require('xrx.engine.Engines');
goog.require('xrx.shape');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.shape.Shape = function(drawing, id) {

  this.drawing_ = drawing;

  this.id_ = id;

  this.primitiveShape_;

  this.create_();
***REMOVED***



xrx.shape.Shape.prototype.getDrawing = function() {
  return this.drawing_;
***REMOVED***



xrx.shape.Shape.prototype.getPrimitiveShape = function() {
  return this.primitiveShape_;
***REMOVED***



xrx.shape.Shape.prototype.getCoords = function() {
  return this.primitiveShape_.getCoords();
***REMOVED***



xrx.shape.Shape.prototype.getCoordsCopy = function() {
  var coords = this.primitiveShape_.getCoords();
  var len = coords.length;
  var newCoords = new Array(len);
  var coord;
  for (var i = 0; i < len; i++) {
    newCoords[i] = new Array(2);
    newCoords[i][0] = coords[i][0];
    newCoords[i][1] = coords[i][1];
  }
  return newCoords;
***REMOVED***



xrx.shape.Shape.prototype.setCoords = function(coords) {
  this.primitiveShape_.setCoords(coords);
***REMOVED***



xrx.shape.Shape.prototype.setCoordAt = function(pos, coord) {
  this.primitiveShape_.setCoordAt(pos, coord);
***REMOVED*** 



xrx.shape.Shape.prototype.getBBox = function(element) {
  var coords = xrx.shape.Polygon.getCoords(element);
  return xrx.svg.getBBox(coords);
***REMOVED***



xrx.shape.Shape.prototype.setFillColor = function(color) {
  this.primitiveShape_.setFillColor(color);
***REMOVED***



xrx.shape.Shape.prototype.setFillOpacity = function(factor) {
  this.primitiveShape_.setFillOpacity(factor);
***REMOVED***



xrx.shape.Shape.prototype.setStrokeWidth = function(width) {
  this.primitiveShape_.setStrokeWidth(width);
***REMOVED***



xrx.shape.Shape.prototype.setStrokeColor = function(color) {
  this.primitiveShape_.setStrokeColor(color);
***REMOVED***



xrx.shape.Shape.prototype.getVertexDraggers = function() {
  var coords = this.getCoords();
  var draggers = [];
  var dragger;

  for(var i = 0, len = coords.length; i < len; i++) {
    dragger = xrx.shape.VertexDragger.create(this.drawing_);
    dragger.setCoords([coords[i]]);
    draggers.push(dragger);
  }

  return draggers;
***REMOVED***



xrx.shape.Shape.prototype.create_ = function() {
  var primitiveShape = this.drawing_.getGraphics()[this.primitiveClass_];
  this.primitiveShape_ = primitiveShape.create(this.drawing_.getCanvas());
  this.primitiveShape_.setStrokeColor('#47D1FF');
  this.primitiveShape_.setStrokeWidth(1.);
  this.primitiveShape_.setFillOpacity(0.);
***REMOVED***
