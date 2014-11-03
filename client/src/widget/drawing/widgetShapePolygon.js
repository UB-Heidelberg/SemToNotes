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
goog.require('xrx.shape.PolygonCreate');
goog.require('xrx.widget.Shape');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.widget.ShapePolygon = function(element) {

  this.shapePolygonCoords_;

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



xrx.widget.ShapePolygon.prototype.createDom = function() {
***REMOVED***
  var drawing = this.getDrawing();
  if (!drawing.getEngine().isAvailable()) return;
  this.shape_ = xrx.shape.Polygon.create(drawing);
  if (this.getNode()) drawing.getLayerShape().addShapes(this.shape_);
  this.shapePolygonCoords_ = new xrx.widget.ShapePolygonCoords(this);
  // handle value changes
  this.shape_.handleValueChanged = function() {
    self.mvcModelUpdateData();
 ***REMOVED*****REMOVED***
  // handle delete component
  this.shape_.handleDeleted = function() {
    self.mvcModelDeleteData();
 ***REMOVED*****REMOVED***
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.widget.ShapePolygonCoords = function(polygon) {

  this.polygon_ = polygon;

  goog.base(this, polygon.getElement());
***REMOVED***
goog.inherits(xrx.widget.ShapePolygonCoords, xrx.mvc.Component);



xrx.widget.ShapePolygonCoords.prototype.getContext = function() {
  return this.polygon_.getNode();
***REMOVED***



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
  xrx.mvc.Controller.updateNode(this.polygon_, this.getNode(),
      this.polygon_.serializeCoords(this.polygon_.getShape().getCoords()));
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.widget.ShapePolygonCreate = function(element) {

  this.shapePolygonCoords_;

***REMOVED***
***REMOVED***
goog.inherits(xrx.widget.ShapePolygonCreate, xrx.widget.Shape);
xrx.mvc.registerComponent('xrx-widget-shape-polygon-create', xrx.widget.ShapePolygonCreate);



xrx.widget.ShapePolygonCreate.prototype.mvcRefresh = function() {***REMOVED***



xrx.widget.ShapePolygonCreate.prototype.mvcModelUpdateData = function() {
  this.shapePolygonCoords_.modelUpdateData();
***REMOVED***



xrx.widget.ShapePolygonCreate.prototype.createDom = function() {
***REMOVED***
  this.shape_ = new xrx.shape.PolygonCreate(this.getDrawing());
  this.shapePolygonCoords_ = new xrx.widget.ShapePolygonCoords(this);
  // handle value changes
  this.shape_.handleValueChanged = function() {
    self.mvcModelUpdateData();
 ***REMOVED*****REMOVED***
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.widget.ShapePolygonInsert = function(element) {

***REMOVED***
***REMOVED***
goog.inherits(xrx.widget.ShapePolygonInsert, xrx.mvc.ComponentView);
xrx.mvc.registerComponent('xrx-widget-shape-polygon-insert', xrx.widget.ShapePolygonInsert);



xrx.widget.ShapePolygonInsert.prototype.getNode = function() {***REMOVED***



xrx.widget.ShapePolygonInsert.prototype.mvcRefresh = function() {***REMOVED***



xrx.widget.ShapePolygonInsert.prototype.getShapeComponent = function() {
  var groupDiv = goog.dom.getParentElement(this.element_);
  var shapeDiv = goog.dom.getChildren(goog.dom.getChildren(groupDiv)[0])[0];
  return xrx.mvc.getViewComponent(shapeDiv.id);
***REMOVED***



xrx.widget.ShapePolygonInsert.prototype.execute = function() {
  var origin = this.getNodeBind(0, 'xrxOrigin');
  var target = this.getNodeBind(0, 'xrxTarget');
  xrx.mvc.Controller.insertNode(this.getShapeComponent(), target, origin);
***REMOVED***



xrx.widget.ShapePolygonInsert.prototype.createDom = function() {***REMOVED***
