/**
 * @fileoverview
 */

goog.provide('xrx.svg.Element');



goog.require('goog.array');
goog.require('xrx.canvas.State');
goog.require('xrx.svg');
goog.require('xrx.svg.Namespace');



xrx.svg.Element = function() {};



xrx.svg.Element.handleMouseDown = function(e, canvas, shape) {
  var eventPoint = [e.clientX, e.clientY];

  canvas.getViewBox().ctm.createInverse().transform(eventPoint, 0, canvas.getDragMousePoint(), 0, 1);

  canvas.setState(xrx.canvas.State.DRAG);

  canvas.setDragElement(e.target);

  canvas.setDragCoords(shape.getCoords(e.target));
};



xrx.svg.Element.handleMouseMove = function(e, canvas, shape) {
  var eventPoint = [e.clientX, e.clientY];
  var dragTarget = canvas.getDragElement();
  var dragCoords = canvas.getDragCoords();
  var dragMousePoint = canvas.getDragMousePoint();
  var bboxA = canvas.getViewBox().box;
  var diff = {
    x: 0,
    y: 0,
    x2: 0,
    y2: 0
  };
  var bboxS;
  var point = new Array(2);
  var coords = new Array(dragCoords.length);

  canvas.getViewBox().ctm.createInverse().transform(eventPoint, 0, point, 0, 1);

  for (var i = 0, len = dragCoords.length; i < len; i++) {
    coords[i] = new Array(2);
    coords[i][0] = - dragMousePoint[0] + point[0] + dragCoords[i][0];
    coords[i][1] = - dragMousePoint[1] + point[1] + dragCoords[i][1];
  };

  bboxS = xrx.svg.getBBox(coords);

  diff.x = bboxS.x - bboxA.x;
  diff.x2 = bboxA.x2 - bboxS.x2;
  diff.y = bboxS.y - bboxA.y;
  diff.y2 = bboxA.y2 - bboxS.y2;

  if (diff.x < 0) xrx.svg.addCoordsX(coords, -diff.x);
  if (diff.x2 < 0) xrx.svg.addCoordsX(coords, diff.x2);
  if (diff.y < 0) xrx.svg.addCoordsY(coords, -diff.y);
  if (diff.y2 < 0) xrx.svg.addCoordsY(coords, diff.y2);

  shape.setCoords(dragTarget, coords);

  return coords;
};



xrx.svg.Element.hasClass = function(element, className) {
  var classes;
  var string = element.getAttribute('class');
  if (string) classes = string.split(/\s+/);
  return !classes ? false : goog.array.contains(classes, className);
};



xrx.svg.Element.handleMouseUp = function(e, canvas, shape) {
  canvas.setState(xrx.canvas.State.NONE);
};



xrx.svg.Element.createNS = function(tagName) {
  return document.createElementNS(xrx.svg.Namespace['svg'], tagName);
};



xrx.svg.Element.setProperties = function(element, properties) {

  for(var key in properties) {
    var val = properties[key];
    var colonIndex = key.indexOf(':');

    if (colonIndex === -1) {
      element.setAttribute(key, val);
    } else {
      var prefix = key.substring(0, colonIndex);
      element.setAttributeNS(xrx.svg.Namespace[prefix], key, val);
    }
  };  
};



xrx.svg.Element.create = function(svgElementImpl, opt_properties) {
  var svgElement = xrx.svg.Element.createNS(svgElementImpl.tagName);
  if (opt_properties) xrx.svg.Element.setProperties(svgElement, opt_properties);
  return svgElement;
};


