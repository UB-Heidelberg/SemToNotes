***REMOVED***
***REMOVED*** @fileoverview 
***REMOVED***

goog.provide('xrx.widget.ShapePolygon');
goog.provide('xrx.widget.ShapePolygonCoords');
goog.provide('xrx.widget.ShapePolygonCreate');
goog.provide('xrx.widget.ShapePolygonInsert');



goog.require('goog.dom.dataset');
goog.require('xrx.mvc');
goog.require('xrx.mvc.ComponentView');
goog.require('xrx.mvc.Controller');
goog.require('xrx.shape.Polygon');
goog.require('xrx.widget.Shape');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.widget.ShapePolygon = function(element) {

  this.shapePolygonCoords_;

  this.shapePolygonInsert_;

***REMOVED***
***REMOVED***
goog.inherits(xrx.widget.ShapePolygon, xrx.widget.Shape);
xrx.mvc.registerComponent('xrx-widget-shape-polygon', xrx.widget.ShapePolygon);



xrx.widget.ShapePolygon.prototype.mvcRefresh = function() {
  if (!this.getNode()) return;
  this.shapePolygonCoords_.refresh();
  this.getDrawing().draw();
***REMOVED***



xrx.widget.ShapePolygon.prototype.mvcRemove = function() {
  this.getDrawing().getLayerShape().removeShape(this.shape_);
  this.getDrawing().draw();
***REMOVED***



xrx.widget.ShapePolygon.prototype.mvcModelUpdateData = function() {
  this.shapePolygonCoords_.modelUpdateData();
***REMOVED***



xrx.widget.ShapePolygon.prototype.mvcModelDeleteData = function() {
  xrx.mvc.Controller.removeNode(this, this.getNode());
***REMOVED***



xrx.widget.ShapePolygon.prototype.mvcModelInsertData = function() {
  this.shapePolygonInsert_.modelInsertData();
***REMOVED***



xrx.widget.ShapePolygon.prototype.createDom = function() {
***REMOVED***
  this.shape_ = xrx.shape.Polygon.create(this.getDrawing());
  if (this.getNode()) this.getDrawing().getLayerShape().addShapes(this.shape_);
  this.shapePolygonCoords_ = new xrx.widget.ShapePolygonCoords(this);
  // handle value changes
  this.shape_.handleValueChanged = function() {
    self.mvcModelUpdateData();
  }
  // handle delete component
  this.shape_.handleDeleted = function() {
    self.mvcModelDeleteData();
  }
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.widget.ShapePolygonCoords = function(polygon) {

  this.polygon_ = polygon;

  goog.base(this, polygon.getElement());
***REMOVED***
goog.inherits(xrx.widget.ShapePolygonCoords, xrx.mvc.Component);



***REMOVED***
***REMOVED*** @override
***REMOVED***
xrx.widget.ShapePolygonCoords.prototype.getRefExpression = function() {
  return goog.dom.dataset.get(this.element_, 'xrxRefCoords');
***REMOVED***



xrx.widget.ShapePolygonCoords.prototype.refresh = function() {
  var str = this.getNode().getStringValue();
  var coords = this.polygon_.parseCoords(str);
  this.polygon_.getShape().setCoords(coords);
***REMOVED***



xrx.widget.ShapePolygonCoords.prototype.modelUpdateData = function(coords) {
  xrx.mvc.Controller.updateNodeValue(this.polygon_, this.getNode(),
      this.polygon_.serializeCoords(this.polygon_.getShape().getCoords()));
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.widget.ShapePolygonCreate = function(element) {

  this.shape_;

***REMOVED***
***REMOVED***
goog.inherits(xrx.widget.ShapePolygonCreate, xrx.mvc.Insert);
xrx.mvc.registerComponent('xrx-widget-shape-polygon-create', xrx.widget.ShapePolygonCreate);



xrx.widget.ShapePolygonCreate.prototype.getShape = xrx.widget.Shape.prototype.getShape;



xrx.widget.ShapePolygonCreate.prototype.findDrawing_ = xrx.widget.Shape.prototype.findDrawing_;



xrx.widget.ShapePolygonCreate.prototype.getDrawing = xrx.widget.Shape.prototype.getDrawing;



xrx.widget.ShapePolygonCreate.prototype.mvcRefresh = function() {***REMOVED***



xrx.widget.ShapePolygonCreate.prototype.createDom = function() {
  var drawing = this.getDrawing();
  this.shape_ = new xrx.shape.PolygonCreate(drawing);
***REMOVED***
