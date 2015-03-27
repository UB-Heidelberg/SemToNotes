/**
 * @fileoverview 
 */

goog.provide('xrx.widget.ShapePolygon');
goog.provide('xrx.widget.ShapePolygonCoords');
goog.provide('xrx.widget.ShapePolygonCreate');
goog.provide('xrx.widget.ShapePolygonInsert');



goog.require('goog.dom.dataset');
goog.require('xrx.mvc');
goog.require('xrx.mvc.ChildComponent');
goog.require('xrx.mvc.ComponentView');
goog.require('xrx.mvc.Controller');
goog.require('xrx.shape.Polygon');
goog.require('xrx.shape.PolygonCreate');
goog.require('xrx.widget.Shape');



/**
 * @constructor
 */
xrx.widget.ShapePolygon = function(element) {

  this.shapePolygonCoords_;

  goog.base(this, element);
};
goog.inherits(xrx.widget.ShapePolygon, xrx.widget.Shape);
xrx.mvc.registerComponent('xrx-shape-polygon', xrx.widget.ShapePolygon);



xrx.widget.ShapePolygon.prototype.mvcRefresh = function() {
  if (!this.getResult().getNode(0)) return;
  if (!this.getDrawing().getEngine().isAvailable()) return;
  this.shapePolygonCoords_.refresh();
  this.getDrawing().draw();
};



xrx.widget.ShapePolygon.prototype.mvcRemove = function() {
  if (!this.getDrawing().getEngine().isAvailable()) return;
  this.getDrawing().getLayerShape().removeShape(this.shape_);
  this.getDrawing().draw();
};



xrx.widget.ShapePolygon.prototype.mvcModelUpdateData = function() {
  this.shapePolygonCoords_.modelUpdateData();
};



xrx.widget.ShapePolygon.prototype.mvcModelDeleteData = function() {
  xrx.mvc.Controller.removeNode(this, this.getResult().getNode(0));
};



xrx.widget.ShapePolygon.prototype.createDom = function() {
  var self = this;
  var drawing = this.getDrawing();
  if (!drawing.getEngine().isAvailable()) return;
  this.shape_ = xrx.shape.Polygon.create(drawing);
  drawing.getLayerShape().addShapes(this.shape_);
  this.shapePolygonCoords_ = new xrx.widget.ShapePolygonCoords(this);
  // handle value changes
  this.shape_.handleValueChanged = function() {
    self.mvcModelUpdateData();
  };
  // handle delete component
  this.shape_.handleDeleted = function() {
    self.mvcModelDeleteData();
  };
  this.mvcRefresh();
};



/**
 * @constructor
 */
xrx.widget.ShapePolygonCoords = function(polygon) {

  this.polygon_ = polygon;

  goog.base(this, polygon);
};
goog.inherits(xrx.widget.ShapePolygonCoords, xrx.mvc.ChildComponent);



/**
 * @override
 */
xrx.widget.ShapePolygonCoords.prototype.getBindId = function() {
  return this.getDataset('xrxBindCoords');
};



/**
 * @override
 */
xrx.widget.ShapePolygonCoords.prototype.getRefExpression = function() {
  return this.getDataset('xrxRefCoords');
};



xrx.widget.ShapePolygonCoords.prototype.refresh = function() {
  var str = this.getResult().getNode(0).getStringValue();
  var coords = this.polygon_.parseCoords(str);
  this.polygon_.getShape().setCoords(coords);
};



xrx.widget.ShapePolygonCoords.prototype.modelUpdateData = function(coords) {
  xrx.mvc.Controller.updateNode(this.polygon_, this.getResult().getNode(0),
      this.polygon_.serializeCoords(this.polygon_.getShape().getCoords()));
};



/**
 * @constructor
 */
xrx.widget.ShapePolygonCreate = function(element) {

  this.shapePolygonCoords_;

  goog.base(this, element);
};
goog.inherits(xrx.widget.ShapePolygonCreate, xrx.widget.Shape);
xrx.mvc.registerComponent('xrx-shape-polygon-create', xrx.widget.ShapePolygonCreate);



xrx.widget.ShapePolygonCreate.prototype.mvcRefresh = function() {};



xrx.widget.ShapePolygonCreate.prototype.mvcModelUpdateData = function() {
  this.shapePolygonCoords_.modelUpdateData();
};



xrx.widget.ShapePolygonCreate.prototype.createDom = function() {
  var self = this;
  this.shape_ = new xrx.shape.PolygonCreate(this.getDrawing());
  this.shapePolygonCoords_ = new xrx.widget.ShapePolygonCoords(this);
  // handle value changes
  this.shape_.handleValueChanged = function() {
    self.mvcModelUpdateData();
  };
};



/**
 * @constructor
 */
xrx.widget.ShapePolygonInsert = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.widget.ShapePolygonInsert, xrx.mvc.ComponentView);
xrx.mvc.registerComponent('xrx-shape-polygon-insert', xrx.widget.ShapePolygonInsert);



xrx.widget.ShapePolygonInsert.prototype.getNode = function() {};



xrx.widget.ShapePolygonInsert.prototype.mvcRefresh = function() {};



xrx.widget.ShapePolygonInsert.prototype.getShapeComponent = function() {
  var groupDiv = goog.dom.getParentElement(this.element_);
  var shapeDiv = goog.dom.getChildren(goog.dom.getChildren(groupDiv)[0])[0];
  return xrx.mvc.getViewComponent(shapeDiv.id);
};



xrx.widget.ShapePolygonInsert.prototype.execute = function() {
  var origin = this.getNodeBind(0, 'xrxOrigin');
  var target = this.getNodeBind(0, 'xrxTarget');
  xrx.mvc.Controller.insertNode(this.getShapeComponent(), target, origin);
};



xrx.widget.ShapePolygonInsert.prototype.createDom = function() {};
