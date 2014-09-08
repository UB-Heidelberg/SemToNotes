***REMOVED***
***REMOVED*** @fileoverview
***REMOVED***

goog.provide('xrx.shape.VertexDragger');



goog.require('xrx.drawing.State');
goog.require('xrx.graphics.Graphics');
goog.require('xrx.shape.Shape');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.shape.VertexDragger = function(drawing) {

  goog.base(this, drawing);

  this.pos_;
***REMOVED***
goog.inherits(xrx.shape.VertexDragger, xrx.shape.Shape);



xrx.shape.VertexDragger.prototype.primitiveClass_ = 'Circle';



xrx.shape.VertexDragger.prototype.getPosition = function() {
  return this.pos_;
***REMOVED***



xrx.shape.VertexDragger.prototype.setPosition = function(pos) {
  this.pos_ = pos;
***REMOVED***



xrx.shape.VertexDragger.prototype.getCoords = function() {
  return [this.primitiveShape_.getCenter()];
***REMOVED***



xrx.shape.VertexDragger.prototype.getCoordsCopy = function() {
  var coords = [this.primitiveShape_.getCenter()];
  var len = coords.length;
  var newCoords = new Array(len);
  var coord;
  for (var i = 0; i < len; i++) {
    newCoords[i] = [coords[i][0], coords[i][1]];
  }
  return newCoords;
***REMOVED***



xrx.shape.VertexDragger.prototype.setCoords = function(coords) {
  this.primitiveShape_.setCenter(coords[0][0], coords[0][1]);
***REMOVED***



xrx.shape.VertexDragger.prototype.getRadius = function() {
  return this.primitiveShape_.getRadius();
***REMOVED***



xrx.shape.VertexDragger.prototype.setRadius = function(radius) {
  this.primitiveShape_.setRadius(radius);
***REMOVED***



xrx.shape.VertexDragger.prototype.handleMouseMove = function(e, canvas) {
  if (canvas.getState() === xrx.drawing.State.NONE) return;

  var coords;
  var dragTarget = canvas.getDragElement();
  var gsm = canvas.getLayerShapeModify();
  var vertexDraggers = gsm.getVertexDraggers();
  var position = gsm.getVertexDraggerPosition(dragTarget, vertexDraggers);
  var postProcess = canvas.getSelectedShape().getAffineCoords;

  xrx.graphics.Element.handleMouseMove(e, canvas, xrx.shape.VertexDragger);
  coords = gsm.getVertexDraggerCoords(vertexDraggers);

  if (postProcess) coords = postProcess(coords, position);

  canvas.getLayerShape().update(coords, canvas);
  canvas.getLayerShapeModify().update(coords, position);
***REMOVED***




xrx.shape.VertexDragger.create = function(drawing) {
  var dragger = new xrx.shape.VertexDragger(drawing);
  dragger.setRadius(2);
  dragger.setStrokeColor('black');
  dragger.setFillColor('white');
  dragger.setFillOpacity(1.);
  return dragger;
***REMOVED***



goog.exportProperty(xrx.shape, 'VertexDragger', xrx.shape.VertexDragger);
