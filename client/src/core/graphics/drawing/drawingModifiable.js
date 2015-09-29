/**
 * @fileoverview A class representing the shape currently modified
 * by the user. 
 */

goog.provide('xrx.drawing.Modifiable');



goog.require('xrx.drawing');
goog.require('xrx.geometry');
goog.require('xrx.shape.Dragger');



/**
 * A class representing the shape currently modified by the user. 
 * @constructor
 */
xrx.drawing.Modifiable = function(drawing) {

  this.drawing_ = drawing;

  this.mode_ = xrx.drawing.Modifiable.Mode.SHAPEHOVER;

  this.dragger_;

  this.shape_;

  this.origin_;
};



xrx.drawing.Modifiable.Mode = {
  DRAGSHAPE: 1,
  HOVERSHAPE: 2,
  DRAGDRAGGER: 3
};



xrx.drawing.Modifiable.prototype.handleDown = function(e, point, shape) {
  var modifiable;
  this.origin_ = point;
  if (shape && shape.isModifiable()) {
    this.state_ = xrx.drawing.State.DRAG;
    if (shape instanceof xrx.shape.Dragger) {
      this.mode_ = xrx.drawing.Modifiable.Mode.DRAGDRAGGER;
      this.dragger_ = shape;
    } else {
      this.mode_ = xrx.drawing.Modifiable.Mode.DRAGSHAPE;
      this.shape_ = shape;
      modifiable = this.shape_.getModifiable();
      this.drawing_.getLayerShapeModify().activate(modifiable);
    }
  } else {
    this.drawing_.getLayerShapeModify().removeShapes();
    this.resetState_();
  }
};



xrx.drawing.Modifiable.prototype.handleHover_ = function(e, point, shape) {
  console.log('TODO');
};



xrx.drawing.Modifiable.prototype.handleDragShape_ = function(e, point, shape) {
  var distX = point[0] - this.origin_[0];
  var distY = point[1] - this.origin_[1];
  this.shape_.getModifiable().move(distX, distY);
  this.origin_ = point;
};



xrx.drawing.Modifiable.prototype.handleMove = function(e, point, shape) {
  if (this.mode_ === xrx.drawing.Modifiable.Mode.SHAPEHOVER) {
    this.handleHover_(e, point, shape);
  } else if (this.mode_ === xrx.drawing.Modifiable.Mode.DRAGDRAGGER) {
    this.dragger_.setCoord(point);
  } else if (this.mode_ === xrx.drawing.Modifiable.Mode.DRAGSHAPE) {
    this.handleDragShape_(e, point, shape);
  } else {
    return;
  }
};



xrx.drawing.Modifiable.prototype.handleUp = function(e) {
  this.resetState_();
};



xrx.drawing.Modifiable.prototype.resetState_ = function() {
  this.mode_ = xrx.drawing.Modifiable.Mode.SHAPEHOVER;
};
