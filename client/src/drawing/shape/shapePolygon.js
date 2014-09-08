/**
 * @fileoverview
 */

goog.provide('xrx.shape.Polygon');
goog.provide('xrx.shape.PolygonModify');
goog.provide('xrx.shape.PolygonCreate');



goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('xrx.graphics.Coordinate');
goog.require('xrx.graphics.Graphics');
goog.require('xrx.shape.Shape');
goog.require('xrx.shape.VertexDragger');



/**
 * @constructor
 */
xrx.shape.Polygon = function(drawing) {

  goog.base(this, drawing);
};
goog.inherits(xrx.shape.Polygon, xrx.shape.Shape);



xrx.shape.Polygon.prototype.primitiveClass_ = 'Polygon';



xrx.shape.Polygon.create = function(drawing) {
  return new xrx.shape.Polygon(drawing);
};



xrx.shape.Polygon.prototype.createModify = function(drawing) {
  return xrx.shape.PolygonModify.create(this);
};



xrx.shape.PolygonModify = function() {};



xrx.shape.PolygonModify.create = function(polygon) {
  var drawing = polygon.getDrawing();
  var graphics = drawing.getGraphics();
  var coords = polygon.getCoords();
  var draggers = [];
  var dragger;

  for(var i = 0, len = coords.length; i < len; i++) {
    dragger = xrx.shape.VertexDragger.create(drawing);
    dragger.setCoords([coords[i]]);
    dragger.setPosition(i);
    draggers.push(dragger);
  }

  return draggers;
};



xrx.shape.PolygonCreate = function() {};



xrx.shape.PolygonCreate.isFirstTouch = function(shapes) {
  return shapes.length === 0;
};



xrx.shape.PolygonCreate.isLastTouch = function(element) {
  return element.getAttribute('class') === 'xrx-shape-endpoint';
};



xrx.shape.PolygonCreate.handleMouseClick = function(e, canvas) {
  var eventPoint = [e.clientX, e.clientY];
  var point = new Array(2);
  canvas.getViewBox().ctm.createInverse().transform(eventPoint, 0, point, 0, 1);
  var groupShapeCreate = canvas.getLayerShapeCreate();
  var shapes = groupShapeCreate.getShapes();

  if (xrx.shape.PolygonCreate.isLastTouch(e.target)) {
    var coords = xrx.svg.getCoords(shapes[0]);
    var polygon = xrx.shape.Polygon.create(canvas);
    xrx.shape.Polygon.setCoords(polygon, coords, canvas);

    canvas.getLayerShape().addShapes(polygon);
    groupShapeCreate.removeShapes();

  } else if (xrx.shape.PolygonCreate.isFirstTouch(shapes)) {
    var polyline = xrx.shape.Shape.create('polyline', 'xrx-shape-polyline', {
      'points': point
    });
    groupShapeCreate.addShapes(polyline);
    var circle = xrx.svg.Circle.create({
      'cx': point[0],
      'cy': point[1],
      'r': '4',
      'style': 'fill:white;stroke:black;stroke-width:1',
      'class': 'xrx-shape-endpoint'
    })
    groupShapeCreate.addShapes(circle);
  } else {
    var coords = xrx.svg.getCoords(shapes[0]);
    if (!xrx.graphics.Coordinate.equals(coords[coords.length - 1], point)) {
      coords = coords.concat([point]);
      xrx.shape.Polygon.setCoords(shapes[0], coords, canvas);
    }
  }
};



goog.exportProperty(xrx.shape, 'PolygonCreate', xrx.shape.PolygonCreate);
