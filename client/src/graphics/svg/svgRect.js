/**
 * @fileoverview
 */

goog.provide('xrx.svg.Rect');
goog.provide('xrx.svg.RectCreate');
goog.provide('xrx.svg.RectModify');



goog.require('xrx.svg.Element');
goog.require('xrx.svg.Polygon');
goog.require('xrx.svg.Shape');
goog.require('xrx.svg.VertexDragger');



xrx.svg.Rect = function() {};



xrx.svg.Rect.className = 'xrx-shape-rect';



xrx.svg.Rect.getCoords = xrx.svg.Polygon.getCoords;



xrx.svg.Rect.setCoords = xrx.svg.Polygon.setCoords;



xrx.svg.Rect.getBBox = xrx.svg.Polygon.getBBox;



xrx.svg.Rect.handleMouseDown = function(e, canvas) {
  xrx.svg.Shape.handleMouseDown(e, canvas, xrx.svg.Rect);
};



xrx.svg.Rect.handleMouseMove = function(e, canvas) {
  xrx.svg.Shape.handleMouseMove(e, canvas, xrx.svg.Rect);
};



xrx.svg.Rect.handleMouseUp = function(e, canvas) {
  xrx.svg.Shape.handleMouseUp(e, canvas, xrx.svg.Rect);
};



xrx.svg.Rect.handleClick = function(e, canvas) {
  xrx.svg.Shape.handleClick(e, canvas, xrx.svg.Rect);
};



xrx.svg.Rect.createModify = function(rect, canvas) {
  return xrx.svg.RectModify.create(rect, canvas);
};



xrx.svg.Rect.getAffineCoords = function(coords, position) {
  var x = coords[position][0];
  var y = coords[position][1];

  if (position === 0) {
    coords[1][1] = y;
    coords[3][0] = x;
  } else if (position === 1) {
    coords[0][1] = y;
    coords[2][0] = x;
  } else if (position === 2) {
    coords[1][0] = x;
    coords[3][1] = y;
  } else {
    coords[0][0] = x;
    coords[2][1] = y;
  }

  return coords;
};



xrx.svg.Rect.create = function(opt_properties) {
  return xrx.svg.Shape.create('polygon', xrx.svg.Rect.className, opt_properties);
};



xrx.svg.RectModify = function() {};



xrx.svg.RectModify.create = function(rect, canvas) {
  var vertexDragger;
  var group = xrx.svg.Group.create();
  var coords = xrx.svg.Rect.getCoords(rect);

  for(var i = 0, len = coords.length; i < len; i++) {
    vertexDragger = xrx.svg.VertexDragger.create([coords[i][0], coords[i][1]]);

    goog.dom.append(group, vertexDragger);
  }

  return group;
};


xrx.svg.RectCreate = function() {};



xrx.svg.RectCreate.isFirstTouch = function(shapes) {
  return shapes.length === 0;
};



xrx.svg.RectCreate.isLastTouch = function(shapes) {
  return !xrx.svg.RectCreate.isFirstTouch(shapes);
};



xrx.svg.RectCreate.handleMouseClick = function(e, canvas) {
  var eventPoint = [e.clientX, e.clientY];
  var point = new Array(2);
  canvas.getViewBox().ctm.createInverse().transform(eventPoint, 0, point, 0, 1);
  var groupShapeCreate = canvas.getGroupShapeCreate();
  var shapes = groupShapeCreate.getShapes();

  if (xrx.svg.RectCreate.isLastTouch(shapes)) {
    var coords = xrx.svg.getPoints(shapes[0]);
    coords.push(point[0], coords[0][1]);
    coords.push(point);
    coords.push(coords[0][0], point[1]);
    var rect = xrx.svg.Rect.create({
      'points': coords
    });

    canvas.getGroupShape().addShapes(rect);
    groupShapeCreate.removeShapes();
  } else {
    var rect = xrx.svg.Rect.create({
      'points': point
    });
    groupShapeCreate.addShapes(rect);
    var circle = xrx.svg.Circle.create({
      'cx': point[0],
      'cy': point[1],
      'r': '4',
      'style': 'fill:white;stroke:black;stroke-width:1',
      'class': 'xrx-shape-endpoint'
    })
    groupShapeCreate.addShapes(circle);
  }
};



goog.exportProperty(xrx.svg, 'RectCreate', xrx.svg.RectCreate);
