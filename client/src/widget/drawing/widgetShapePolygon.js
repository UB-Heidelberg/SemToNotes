/**
 * @fileoverview 
 */

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



/**
 * @constructor
 */
xrx.widget.ShapePolygon = function(element) {

  this.shapePolygonCoords_;

  goog.base(this, element);
};
goog.inherits(xrx.widget.ShapePolygon, xrx.widget.Shape);
xrx.mvc.registerComponent('xrx-widget-shape-polygon', xrx.widget.ShapePolygon);



xrx.widget.ShapePolygon.prototype.mvcRefresh = function() {
  if (!this.getNode()) return;
  this.shapePolygonCoords_.refresh();
  this.getDrawing().draw();
};



xrx.widget.ShapePolygon.prototype.mvcRemove = function() {
  this.getDrawing().getLayerShape().removeShape(this.shape_);
  console.log('remove');
  this.getDrawing().draw();
};



xrx.widget.ShapePolygon.prototype.mvcModelUpdateData = function() {
  this.shapePolygonCoords_.modelUpdateData();
};



xrx.widget.ShapePolygon.prototype.mvcModelDeleteData = function() {
  xrx.mvc.Controller.removeNode(this, this.getNode());
};



xrx.widget.ShapePolygon.prototype.createDom = function() {
  var self = this;
  this.shape_ = xrx.shape.Polygon.create(this.getDrawing());
  if (this.getNode()) this.getDrawing().getLayerShape().addShapes(this.shape_);
  this.shapePolygonCoords_ = new xrx.widget.ShapePolygonCoords(this);
  // handle value changes
  this.shape_.handleValueChanged = function() {
    self.mvcModelUpdateData();
  };
  // handle delete component
  this.shape_.handleDeleted = function() {
    self.mvcModelDeleteData();
  };
};



/**
 * @constructor
 */
xrx.widget.ShapePolygonCoords = function(polygon) {

  this.polygon_ = polygon;

  goog.base(this, polygon.getElement());
};
goog.inherits(xrx.widget.ShapePolygonCoords, xrx.mvc.Component);



/**
 * @override
 */
xrx.widget.ShapePolygonCoords.prototype.getRefExpression = function() {
  return goog.dom.dataset.get(this.element_, 'xrxRefCoords');
};



xrx.widget.ShapePolygonCoords.prototype.refresh = function() {
  var str = this.getNode().getStringValue();
  var coords = this.polygon_.parseCoords(str);
  this.polygon_.getShape().setCoords(coords);
};



xrx.widget.ShapePolygonCoords.prototype.modelUpdateData = function(coords) {
  xrx.mvc.Controller.updateNodeValue(this.polygon_, this.getNode(),
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
xrx.mvc.registerComponent('xrx-widget-shape-polygon-create', xrx.widget.ShapePolygonCreate);



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

  this.shape_;
};
goog.inherits(xrx.widget.ShapePolygonInsert, xrx.mvc.Insert);
xrx.mvc.registerComponent('xrx-widget-shape-polygon-insert', xrx.widget.ShapePolygonInsert);



xrx.widget.ShapePolygonInsert.prototype.getShape = xrx.widget.Shape.prototype.getShape;



xrx.widget.ShapePolygonInsert.prototype.findDrawing_ = xrx.widget.Shape.prototype.findDrawing_;



xrx.widget.ShapePolygonInsert.prototype.getDrawing = xrx.widget.Shape.prototype.getDrawing;



xrx.widget.ShapePolygonInsert.prototype.getRefExpression =
    xrx.widget.ShapePolygonCoords.prototype.getRefExpression;
