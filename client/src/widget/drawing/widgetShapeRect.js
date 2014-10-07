***REMOVED***
***REMOVED*** @fileoverview 
***REMOVED***

goog.provide('xrx.widget.ShapeRect');
goog.provide('xrx.widget.ShapeRectGeometry');
goog.provide('xrx.widget.ShapeRectX');
goog.provide('xrx.widget.ShapeRectY');
goog.provide('xrx.widget.ShapeRectWidth');
goog.provide('xrx.widget.ShapeRectHeight');



goog.require('goog.dom.dataset');
goog.require('xrx.mvc.ComponentView');
goog.require('xrx.shape.Rect');
goog.require('xrx.widget.Shape');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.widget.ShapeRect = function(element, drawing) {

  goog.base(this, element, drawing);

  this.shape_;

  this.x_;

  this.y_;

  this.width_;

  this.height_;
***REMOVED***
goog.inherits(xrx.widget.ShapeRect, xrx.widget.Shape);



xrx.widget.ShapeRect.prototype.setX = function(coord) {
  this.shape_.getCoords()[0][0] = coord;
  this.shape_.setAffineCoords(0);
  this.drawing_.draw();
***REMOVED***



xrx.widget.ShapeRect.prototype.setY = function(coord) {
  this.shape_.getCoords()[0][1] = coord;
  this.shape_.setAffineCoords(0);
  this.drawing_.draw();
***REMOVED***



xrx.widget.ShapeRect.prototype.setWidth = function(width) {
  this.shape_.getCoords()[1][0] = this.shape_.getCoords()[0][0] + width;
  this.shape_.setAffineCoords(1);
  this.drawing_.draw();
***REMOVED***



xrx.widget.ShapeRect.prototype.setHeight = function(height) {
  this.shape_.getCoords()[3][1] = this.shape_.getCoords()[0][1] + height;
  this.shape_.setAffineCoords(3);
  this.drawing_.draw();
***REMOVED***



xrx.widget.ShapeRect.prototype.createDom = function() {
  this.shape_ = xrx.shape.Rect.create(this.drawing_);
  this.x_ = new xrx.widget.ShapeRectX(this.element_, this, 'xrxRefX');
  this.y_ = new xrx.widget.ShapeRectY(this.element_, this, 'xrxRefY');
  this.width_ = new xrx.widget.ShapeRectWidth(this.element_, this, 'xrxRefWidth');
  this.height_ = new xrx.widget.ShapeRectHeight(this.element_, this, 'xrxRefHeight');
  console.log(this);
***REMOVED***



xrx.widget.ShapeRect.prototype.refresh = function() {
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.widget.ShapeRectGeometry = function(element, rect, dataset) {

  this.rect_ = rect;

  this.dataset_ = dataset;

***REMOVED***
***REMOVED***
goog.inherits(xrx.widget.ShapeRectGeometry, xrx.mvc.ComponentView);



***REMOVED***
***REMOVED*** @override
***REMOVED***
xrx.widget.ShapeRectGeometry.prototype.getRefExpression = function() {
  return goog.dom.dataset.get(this.element_, this.dataset_);
***REMOVED***



xrx.widget.ShapeRectGeometry.prototype.createDom = function() {
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.widget.ShapeRectX = function(element, rect, dataset) {

  goog.base(this, element, rect, dataset);
***REMOVED***
goog.inherits(xrx.widget.ShapeRectX, xrx.widget.ShapeRectGeometry);



xrx.widget.ShapeRectX.prototype.refresh = function() {
  var str = this.getNode().getStringValue();
  var point = parseFloat(str);
  this.rect_.setX(point);
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.widget.ShapeRectY = function(element, rect, dataset) {

  goog.base(this, element, rect, dataset);
***REMOVED***
goog.inherits(xrx.widget.ShapeRectY, xrx.widget.ShapeRectGeometry);



xrx.widget.ShapeRectY.prototype.refresh = function() {
  var str = this.getNode().getStringValue();
  var point = parseFloat(str);
  this.rect_.setY(point);
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.widget.ShapeRectWidth = function(element, rect, dataset) {

  goog.base(this, element, rect, dataset);
***REMOVED***
goog.inherits(xrx.widget.ShapeRectWidth, xrx.widget.ShapeRectGeometry);



xrx.widget.ShapeRectWidth.prototype.refresh = function() {
  var str = this.getNode().getStringValue();
  var point = parseFloat(str);
  this.rect_.setWidth(point);
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.widget.ShapeRectHeight = function(element, rect, dataset) {

  goog.base(this, element, rect, dataset);
***REMOVED***
goog.inherits(xrx.widget.ShapeRectHeight, xrx.widget.ShapeRectGeometry);



xrx.widget.ShapeRectHeight.prototype.refresh = function() {
  var str = this.getNode().getStringValue();
  var point = parseFloat(str);
  this.rect_.setHeight(point);
***REMOVED***
