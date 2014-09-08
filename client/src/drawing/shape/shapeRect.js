***REMOVED***
***REMOVED*** @fileoverview
***REMOVED***

goog.provide('xrx.shape.Rect');
goog.provide('xrx.shape.RectCreate');
goog.provide('xrx.shape.RectModify');



goog.require('xrx.graphics.Graphics');
goog.require('xrx.shape.Polygon');
goog.require('xrx.shape.Shape');
goog.require('xrx.shape.VertexDragger');



xrx.shape.Rect = function(drawing) {

  goog.base(this, drawing);
***REMOVED***
goog.inherits(xrx.shape.Rect, xrx.shape.Shape);



xrx.shape.Rect.prototype.primitiveClass_ = 'Polygon';



xrx.shape.Rect.prototype.getBox = function() {
***REMOVED***



xrx.shape.Rect.create = function(drawing) {
  return new xrx.shape.Rect(drawing);
***REMOVED***



xrx.shape.Rect.prototype.createModify = function() {
  return xrx.shape.RectModify.create(this);
***REMOVED***



xrx.shape.Rect.prototype.setAffineCoords = function(position) {
  var coords = this.getCoords();
  if (position === 0 || position === 2) {
    coords[1][0] = coords[2][0];
    coords[1][1] = coords[0][1];
    coords[3][0] = coords[0][0];
    coords[3][1] = coords[2][1];
  } else {
    coords[0][0] = coords[3][0];
    coords[0][1] = coords[1][1];
    coords[2][0] = coords[1][0];
    coords[2][1] = coords[3][1];
  }
  return coords;
***REMOVED***



xrx.shape.RectModify = function() {***REMOVED***



xrx.shape.RectModify.create = xrx.shape.PolygonModify.create;



xrx.shape.RectCreate = function() {***REMOVED***



xrx.shape.RectCreate.isFirstTouch = function(shapes) {
  return shapes.length === 0;
***REMOVED***



xrx.shape.RectCreate.isLastTouch = function(shapes) {
  return !xrx.shape.RectCreate.isFirstTouch(shapes);
***REMOVED***



xrx.shape.RectCreate.handleMouseClick = function(e, canvas) {
  var eventPoint = [e.clientX, e.clientY];
  var point = new Array(2);
  canvas.getViewBox().ctm.createInverse().transform(eventPoint, 0, point, 0, 1);
  var groupShapeCreate = canvas.getLayerShapeCreate();
  var shapes = groupShapeCreate.getShapes();

  if (xrx.shape.RectCreate.isLastTouch(shapes)) {
    var coords = xrx.shape.getCoords(shapes[0]);
    coords.push(point[0], coords[0][1]);
    coords.push(point);
    coords.push(coords[0][0], point[1]);
    var rect = xrx.shape.Rect.create(canvas);

    canvas.getLayerShape().addShapes(rect);
    groupShapeCreate.removeShapes();
  } else {
    var rect = xrx.shape.Rect.create(canvas);
    groupShapeCreate.addShapes(rect);
	/*
    var circle = xrx.shape.Circle.create(canvas)
    groupShapeCreate.addShapes(circle);
	*/
  }
***REMOVED***



goog.exportProperty(xrx.shape, 'RectCreate', xrx.shape.RectCreate);
