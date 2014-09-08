/**
 * @fileoverview
 */

goog.provide('xrx.svg.Polygon');
goog.provide('xrx.svg.PolygonModify');
goog.provide('xrx.svg.PolygonCreate');



goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('xrx.graphics.Coordinate');
goog.require('xrx.svg.Circle');
goog.require('xrx.svg.Element');
goog.require('xrx.svg.Group');
goog.require('xrx.svg.Shape');
goog.require('xrx.svg.VertexDragger');



xrx.svg.Polygon = function() {};



xrx.svg.Polygon.className = 'xrx-shape-polygon';



xrx.svg.Polygon.getCoords = function(element) {
  return xrx.svg.getPoints(element);
};



xrx.svg.Polygon.setCoords = function(element, coords) {
  xrx.svg.setPoints(element, coords);
};



xrx.svg.Polygon.getBBox = function(element) {
  var coords = xrx.svg.Polygon.getCoords(element);
  return xrx.svg.getBBox(coords);
};



xrx.svg.Polygon.onMouseOver = function(element, e) {};



xrx.svg.Polygon.handleMouseDown = function(e, canvas) {
  xrx.svg.Shape.handleMouseDown(e, canvas, xrx.svg.Polygon);
};



xrx.svg.Polygon.handleMouseMove = function(e, canvas) {
  xrx.svg.Shape.handleMouseMove(e, canvas, xrx.svg.Polygon);
};



xrx.svg.Polygon.handleMouseUp = function(e, canvas) {
  xrx.svg.Shape.handleMouseUp(e, canvas, xrx.svg.Polygon);
};



xrx.svg.Polygon.handleClick = function(e, canvas) {
  xrx.svg.Shape.handleClick(e, canvas, xrx.svg.Polygon);
};



xrx.svg.Polygon.createModify = function(polygon, canvas) {
  return xrx.svg.PolygonModify.create(polygon, canvas);
};



xrx.svg.Polygon.create = function(opt_properties) {
  return xrx.svg.Shape.create('polygon', xrx.svg.Polygon.className, opt_properties);
};



xrx.svg.PolygonModify = function() {};



xrx.svg.PolygonModify.create = function(polygon, canvas) {
  var vertexDragger;
  var points = xrx.svg.getPoints(polygon);
  var group = xrx.svg.Group.create();

  for (var i = 0, len = points.length; i < len; i++) {
    vertexDragger = xrx.svg.VertexDragger.create(points[i]);

    goog.dom.append(group, vertexDragger);
  }

  return group;
};



xrx.svg.PolygonCreate = function() {};



xrx.svg.PolygonCreate.isFirstTouch = function(shapes) {
  return shapes.length === 0;
};



xrx.svg.PolygonCreate.isLastTouch = function(element) {
  return element.getAttribute('class') === 'xrx-shape-endpoint';
};



xrx.svg.PolygonCreate.handleMouseClick = function(e, canvas) {
  var eventPoint = [e.clientX, e.clientY];
  var point = new Array(2);
  canvas.getViewBox().ctm.createInverse().transform(eventPoint, 0, point, 0, 1);
  var groupShapeCreate = canvas.getGroupShapeCreate();
  var shapes = groupShapeCreate.getShapes();

  if (xrx.svg.PolygonCreate.isLastTouch(e.target)) {
    var coords = xrx.svg.getPoints(shapes[0]);
    var polygon = xrx.svg.Polygon.create();
    xrx.svg.Polygon.setCoords(polygon, coords);

    canvas.getGroupShape().addShapes(polygon);
    groupShapeCreate.removeShapes();

  } else if (xrx.svg.PolygonCreate.isFirstTouch(shapes)) {
    var polyline = xrx.svg.Shape.create('polyline', 'xrx-shape-polyline', {
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
    var coords = xrx.svg.getPoints(shapes[0]);
    if (!xrx.graphics.Coordinate.equals(coords[coords.length - 1], point)) {
      coords = coords.concat([point]);
      xrx.svg.Polygon.setCoords(shapes[0], coords);
    }
  }
};



goog.exportProperty(xrx.svg, 'PolygonCreate', xrx.svg.PolygonCreate);
