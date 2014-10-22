***REMOVED***
***REMOVED*** @fileoverview 
***REMOVED***

goog.provide('xrx.widget.ShapeRect');
goog.provide('xrx.widget.ShapeRectGeometry');
goog.provide('xrx.widget.ShapeRectX');
goog.provide('xrx.widget.ShapeRectY');
goog.provide('xrx.widget.ShapeRectWidth');
goog.provide('xrx.widget.ShapeRectHeight');
goog.provide('xrx.widget.ShapeRectLeft');
goog.provide('xrx.widget.ShapeRectTop');
goog.provide('xrx.widget.ShapeRectRight');
goog.provide('xrx.widget.ShapeRectBottom');



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

  this.rectX_;

  this.rectY_;

  this.rectWidth_;

  this.rectHeight_;

  this.rectLeft_;

  this.rectTop_;

  this.rectRight_;

  this.rectBottom_;
***REMOVED***
goog.inherits(xrx.widget.ShapeRect, xrx.widget.Shape);
xrx.mvc.registerComponent('xrx-widget-shape-rect', xrx.widget.ShapeRect);



xrx.widget.ShapeRect.prototype.getX = function() {
  return this.shape_.getCoords()[0][0];
***REMOVED***



xrx.widget.ShapeRect.prototype.setX = function(coord) {
  var coords = this.shape_.getCoords();
  coords[0][0] = coord;
  this.shape_.setCoords(coords);
  this.shape_.setAffineCoords(0);
***REMOVED***



xrx.widget.ShapeRect.prototype.getLeft = function() {
  return this.getX();
***REMOVED***



xrx.widget.ShapeRect.prototype.setLeft = function(coord) {
  return this.setX(coord);
***REMOVED***



xrx.widget.ShapeRect.prototype.getY = function() {
  return this.shape_.getCoords()[0][1];
***REMOVED***



xrx.widget.ShapeRect.prototype.setY = function(coord) {
  var coords = this.shape_.getCoords();
  coords[0][1] = coord;
  this.shape_.setCoords(coords);
  this.shape_.setAffineCoords(0);
***REMOVED***



xrx.widget.ShapeRect.prototype.getTop = function() {
  return this.getY();
***REMOVED***



xrx.widget.ShapeRect.prototype.setTop = function(coord) {
  return this.setY(coord);
***REMOVED***



xrx.widget.ShapeRect.prototype.getWidth = function() {
  var coords = this.shape_.getCoords();
  return coords[1][0] - coords[0][0];
***REMOVED***



xrx.widget.ShapeRect.prototype.setWidth = function(width) {
  var coords = this.shape_.getCoords();
  coords[1][0] = coords[0][0] + width;
  this.shape_.setCoords(coords);
  this.shape_.setAffineCoords(1);
***REMOVED***



xrx.widget.ShapeRect.prototype.getRight = function() {
  return this.shape_.getCoords()[1][0];
***REMOVED***



xrx.widget.ShapeRect.prototype.setRight = function(coord) {
  var coords = this.shape_.getCoords();
  coords[1][0] = coord;
  this.shape_.setCoords(coords);
  this.shape_.setAffineCoords(1);
***REMOVED***



xrx.widget.ShapeRect.prototype.getHeight = function() {
  var coords = this.shape_.getCoords();
  return coords[3][1] - coords[0][1];
***REMOVED***



xrx.widget.ShapeRect.prototype.setHeight = function(height) {
  var coords = this.shape_.getCoords();
  coords[3][1] = coords[0][1] + height;
  this.shape_.setCoords(coords);
  this.shape_.setAffineCoords(3);
***REMOVED***



xrx.widget.ShapeRect.prototype.getBottom = function() {
  return this.shape_.getCoords()[3][1];
***REMOVED***



xrx.widget.ShapeRect.prototype.setBottom = function(coord) {
  var coords = this.shape_.getCoords();
  coords[3][1] = coord;
  this.shape_.setCoords(coords);
  this.shape_.setAffineCoords(3);
***REMOVED***



xrx.widget.ShapeRect.prototype.mvcRefresh = function() {
  if (!this.getNode()) return;
  if (this.rectX_)      this.rectX_.refresh();
  if (this.rectY_)      this.rectY_.refresh();
  if (this.rectWidth_)  this.rectWidth_.refresh();
  if (this.rectHeight_) this.rectHeight_.refresh();
  if (this.rectLeft_)   this.rectLeft_.refresh();
  if (this.rectTop_)    this.rectTop_.refresh();
  if (this.rectRight_)  this.rectRight_.refresh();
  if (this.rectBottom_) this.rectBottom_.refresh();
***REMOVED***



xrx.widget.ShapeRect.prototype.mvcRemove = function() {
  this.getDrawing().getLayerShape().removeShape(this.shape_);
  this.getDrawing().draw();
***REMOVED***



xrx.widget.ShapeRect.prototype.mvcModelDeleteData = function() {
  xrx.mvc.Controller.removeNode(this);
***REMOVED***



xrx.widget.ShapeRect.prototype.mvcModelUpdateData = function() {
  if (this.rectX_)      this.rectX_.modelUpdateData();
  if (this.rectY_)      this.rectY_.modelUpdateData();
  if (this.rectWidth_)  this.rectWidth_.modelUpdateData();
  if (this.rectHeight_) this.rectHeight_.modelUpdateData();
  if (this.rectLeft_)   this.rectLeft_.modelUpdateData();
  if (this.rectTop_)    this.rectTop_.modelUpdateData();
  if (this.rectRight_)  this.rectRight_.modelUpdateData();
  if (this.rectBottom_) this.rectBottom_.modelUpdateData();
***REMOVED***



xrx.widget.ShapeRect.prototype.createDom = function() {
***REMOVED***
  this.shape_ = xrx.shape.Rect.create(this.getDrawing());
  if (this.getNode()) this.getDrawing().getLayerShape().addShapes(this.shape_);
  // get datasets
  var x      = goog.dom.dataset.get(this.element_, 'xrxRefX');
  var y      = goog.dom.dataset.get(this.element_, 'xrxRefY');
  var width  = goog.dom.dataset.get(this.element_, 'xrxRefWidth');
  var height = goog.dom.dataset.get(this.element_, 'xrxRefHeight');
  var left   = goog.dom.dataset.get(this.element_, 'xrxRefLeft');
  var top    = goog.dom.dataset.get(this.element_, 'xrxRefTop');
  var right  = goog.dom.dataset.get(this.element_, 'xrxRefRight');
  var bottom = goog.dom.dataset.get(this.element_, 'xrxRefBottom');
  // initialize coordinate components
  if (x)      this.rectX_      = new xrx.widget.ShapeRectX(this, x);
  if (y)      this.rectY_      = new xrx.widget.ShapeRectY(this, y);
  if (width)  this.rectWidth_  = new xrx.widget.ShapeRectWidth(this, width);
  if (height) this.rectHeight_ = new xrx.widget.ShapeRectHeight(this, height);
  if (left)   this.rectLeft_   = new xrx.widget.ShapeRectLeft(this, left);
  if (top)    this.rectTop_    = new xrx.widget.ShapeRectTop(this, top);
  if (right)  this.rectRight_  = new xrx.widget.ShapeRectRight(this, right);
  if (bottom) this.rectBottom_ = new xrx.widget.ShapeRectBottom(this, bottom);
  // handle value changed
  this.shape_.handleValueChanged = function() {
    self.mvcModelUpdateData();
  }
  // handle deleted
  this.shape_.handleDeleted = function() {
    self.mvcModelDeleteData();
  }
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.widget.ShapeRectGeometry = function(rect, dataset) {

  this.rect_ = rect;

  this.dataset_ = dataset;

  goog.base(this, rect.getElement());
***REMOVED***
goog.inherits(xrx.widget.ShapeRectGeometry, xrx.mvc.Component);



***REMOVED***
***REMOVED*** @override
***REMOVED***
xrx.widget.ShapeRectGeometry.prototype.getRefExpression = function() {
  return this.dataset_;
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



xrx.widget.ShapeRectX.prototype.modelUpdateData = function() {
  var x = this.rect_.getX().toFixed(1);
  xrx.mvc.Controller.updateNodeValue(this.rect_, this.getNode(), x.toString());
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



xrx.widget.ShapeRectY.prototype.modelUpdateData = function() {
  var y = this.rect_.getY().toFixed(1);
  xrx.mvc.Controller.updateNodeValue(this.rect_, this.getNode(), y.toString());
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



xrx.widget.ShapeRectWidth.prototype.modelUpdateData = function() {
  var width = this.rect_.getWidth().toFixed(1);
  xrx.mvc.Controller.updateNodeValue(this.rect_, this.getNode(), width.toString());
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



xrx.widget.ShapeRectHeight.prototype.modelUpdateData = function() {
  var height = this.rect_.getHeight().toFixed(1);
  xrx.mvc.Controller.updateNodeValue(this.rect_, this.getNode(), height.toString());
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.widget.ShapeRectLeft = function(element, rect, dataset) {

  goog.base(this, element, rect, dataset);
***REMOVED***
goog.inherits(xrx.widget.ShapeRectLeft, xrx.widget.ShapeRectGeometry);



xrx.widget.ShapeRectLeft.prototype.refresh = function() {
  var str = this.getNode().getStringValue();
  var point = parseFloat(str);
  this.rect_.setLeft(point);
***REMOVED***



xrx.widget.ShapeRectLeft.prototype.modelUpdateData = function() {
  var left = this.rect_.getLeft().toFixed(1);
  xrx.mvc.Controller.updateNodeValue(this.rect_, this.getNode(), left.toString());
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.widget.ShapeRectTop = function(element, rect, dataset) {

  goog.base(this, element, rect, dataset);
***REMOVED***
goog.inherits(xrx.widget.ShapeRectTop, xrx.widget.ShapeRectGeometry);



xrx.widget.ShapeRectTop.prototype.refresh = function() {
  var str = this.getNode().getStringValue();
  var point = parseFloat(str);
  this.rect_.setTop(point);
***REMOVED***



xrx.widget.ShapeRectTop.prototype.modelUpdateData = function() {
  var top = this.rect_.getTop().toFixed(1);
  xrx.mvc.Controller.updateNodeValue(this.rect_, this.getNode(), top.toString());
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.widget.ShapeRectRight = function(element, rect, dataset) {

  goog.base(this, element, rect, dataset);
***REMOVED***
goog.inherits(xrx.widget.ShapeRectRight, xrx.widget.ShapeRectGeometry);



xrx.widget.ShapeRectRight.prototype.refresh = function() {
  var str = this.getNode().getStringValue();
  var point = parseFloat(str);
  this.rect_.setRight(point);
***REMOVED***



xrx.widget.ShapeRectRight.prototype.modelUpdateData = function() {
  var right = this.rect_.getRight().toFixed(1);
  xrx.mvc.Controller.updateNodeValue(this.rect_, this.getNode(), right.toString());
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.widget.ShapeRectBottom = function(element, rect, dataset) {

  goog.base(this, element, rect, dataset);
***REMOVED***
goog.inherits(xrx.widget.ShapeRectBottom, xrx.widget.ShapeRectGeometry);



xrx.widget.ShapeRectBottom.prototype.refresh = function() {
  var str = this.getNode().getStringValue();
  var point = parseFloat(str);
  this.rect_.setBottom(point);
***REMOVED***



xrx.widget.ShapeRectBottom.prototype.modelUpdateData = function() {
  var bottom = this.rect_.getBottom().toFixed(1);
  xrx.mvc.Controller.updateNodeValue(this.rect_, this.getNode(), bottom.toString());
***REMOVED***
