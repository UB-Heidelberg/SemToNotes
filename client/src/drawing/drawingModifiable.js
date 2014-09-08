***REMOVED***
***REMOVED*** @fileoverview A class representing a modifiable shape. 
***REMOVED***

goog.provide('xrx.drawing.Modifiable');



goog.require('xrx.drawing');
goog.require('xrx.shape.VertexDragger');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.drawing.Modifiable = function(drawing) {

  this.drawing_ = drawing;

  this.state_ = xrx.drawing.State.NONE;

  this.mode_;

  this.shape_;

  this.shapeOriginCoords_;

  this.dragger_;

  this.draggerOriginCoords_;

  this.mousePoint_ = new Array(2);
***REMOVED***



xrx.drawing.Modifiable.Mode = {
  DRAGSHAPE: 1,
  DRAGVERTEX: 2
***REMOVED***



xrx.drawing.Modifiable.prototype.handleDown = function(e) {
  this.state_ = xrx.drawing.State.DRAG;
  var modifier;
  var modifiable;
  var eventPoint = [e.offsetX, e.offsetY];
  this.drawing_.getViewbox().getCTM().createInverse().transform(eventPoint, 0,
      this.mousePoint_, 0, 1);
  modifier = this.drawing_.getShapeSelected(this.mousePoint_);

  if (!modifier) {
    this.drawing_.getLayerShapeModify().removeShapes();
    this.state_ = xrx.drawing.State.NONE;
  } else if (modifier instanceof xrx.shape.VertexDragger) {
    this.mode_ = xrx.drawing.Modifiable.Mode.DRAGVERTEX;
    this.dragger_ = modifier;
    this.draggerOriginCoords_ = this.dragger_.getCoordsCopy();
  } else {
    this.mode_ = xrx.drawing.Modifiable.Mode.DRAGSHAPE;
    this.shape_ = modifier;
    this.shapeOriginCoords_ = this.shape_.getCoordsCopy();
    modifiable = this.shape_.createModify(this.shape_);
    this.drawing_.getLayerShapeModify().activate(modifiable);
  }
***REMOVED***



xrx.drawing.Modifiable.prototype.handleMove = function(e) {
  if (this.state_ !== xrx.drawing.State.DRAG) return;
  var originCoords;
  if (this.mode_ === xrx.drawing.Modifiable.Mode.DRAGVERTEX) {
    originCoords = this.draggerOriginCoords_;
  } else {
    originCoords = this.shapeOriginCoords_;
  }

  var eventPoint = [e.offsetX, e.offsetY];
  var bboxA = this.drawing_.getViewbox().getBox();
  var diff = {
    x: 0,
    y: 0,
    x2: 0,
    y2: 0
 ***REMOVED*****REMOVED***
  var bboxS;
  var point = new Array(2);
  var coords = new Array(originCoords.length);

  this.drawing_.getViewbox().getCTM().createInverse().transform(eventPoint, 0, point, 0, 1);

  for (var i = 0, len = originCoords.length; i < len; i++) {
    coords[i] = new Array(2);
    coords[i][0] = - this.mousePoint_[0] + point[0] + originCoords[i][0];
    coords[i][1] = - this.mousePoint_[1] + point[1] + originCoords[i][1];
 ***REMOVED*****REMOVED***

  bboxS = xrx.svg.getBBox(coords);

  diff.x = bboxS.x - bboxA.x;
  diff.x2 = bboxA.x2 - bboxS.x2;
  diff.y = bboxS.y - bboxA.y;
  diff.y2 = bboxA.y2 - bboxS.y2;

  if (diff.x < 0) xrx.svg.addCoordsX(coords, -diff.x);
  if (diff.x2 < 0) xrx.svg.addCoordsX(coords, diff.x2);
  if (diff.y < 0) xrx.svg.addCoordsY(coords, -diff.y);
  if (diff.y2 < 0) xrx.svg.addCoordsY(coords, diff.y2);

  if (this.mode_ === xrx.drawing.Modifiable.Mode.DRAGVERTEX) {
    var pos = this.dragger_.getPosition();
    this.shape_.setCoordAt(pos, coords[0]);
    if (this.shape_.setAffineCoords) this.shape_.setAffineCoords(pos);
    this.dragger_.setCoords(coords);
    this.drawing_.getLayerShapeModify().update(this.shape_.getCoords(), pos);
  } else {
    this.shape_.setCoords(coords);
    this.drawing_.getLayerShapeModify().update(this.shape_.getCoords());
  }
***REMOVED***



xrx.drawing.Modifiable.prototype.handleUp = function(e) {
  this.state_ = xrx.drawing.State.NONE;
***REMOVED***



xrx.drawing.Modifiable.prototype.handleClick = function(e) {
  var eventPoint = [e.offsetX, e.offsetY];
  this.drawing_.getViewbox().getCTM().createInverse().transform(eventPoint, 0,
      this.mousePoint_, 0, 1);
  var drawing = this.drawing_;
  var shape = drawing.getShapeSelected(this.mousePoint_);

  drawing.getLayerShapeModify().activate(shape.getVertexDraggers());
  var confirm = window.confirm('Delete forever?');
  if (confirm) {
    drawing.getLayerShape().removeShape(shape);
    drawing.getLayerShapeModify().removeShapes();
  }
***REMOVED***
