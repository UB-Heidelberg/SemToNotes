***REMOVED***
***REMOVED*** @fileoverview
***REMOVED***

goog.provide('xrx.svg.Shape');



goog.require('goog.dom.classes');
goog.require('xrx.svg.Element');
goog.require('xrx.canvas.Mode');
goog.require('xrx.canvas.State');



xrx.svg.Shape = function() {***REMOVED***



xrx.svg.Shape.isValidEventTarget = function(element, shape) {
  return element && xrx.svg.Element.hasClass(element, shape.className);
***REMOVED***



xrx.svg.Shape.handleMouseDown = function(e, canvas, shape) {
  if (canvas.mode_ !== xrx.canvas.Mode.MODIFY) return;
  if (!xrx.svg.Shape.isValidEventTarget(e.target, shape)) return;

  canvas.setSelectedShape(shape);
  canvas.setSelectedElement(e.target);

  xrx.svg.Element.handleMouseDown(e, canvas, shape);
  canvas.getGroupShapeModify().activate(shape.createModify(e.target));
***REMOVED***



xrx.svg.Shape.handleMouseMove = function(e, canvas, shape) {
  if (canvas.mode_ !== xrx.canvas.Mode.MODIFY) return;
  if (canvas.getState() !== xrx.canvas.State.DRAG) return;
  if (!xrx.svg.Shape.isValidEventTarget(canvas.getDragElement(), shape)) return;

  var coords = xrx.svg.Element.handleMouseMove(e, canvas, shape);
  if (coords) canvas.getGroupShapeModify().update(coords);
***REMOVED***



xrx.svg.Shape.handleMouseUp = function(e, canvas, shape) {
  if (canvas.mode_ !== xrx.canvas.Mode.MODIFY) return;
  if (!xrx.svg.Shape.isValidEventTarget(canvas.getDragElement(), shape)) return;

  xrx.svg.Element.handleMouseUp(e, canvas, shape);
***REMOVED***



xrx.svg.Shape.handleClick = function(e, canvas, shape) {
  if (canvas.mode_ !== xrx.canvas.Mode.DELETE) return;
  if (!xrx.svg.Shape.isValidEventTarget(e.target, shape)) return;

  var element = e.target;
  var isShape = element && xrx.svg.Element.hasClass(element, 'xrx-shape');
  if (!isShape) return;

  canvas.getGroupShapeModify().activate(shape.createModify(element));
  var confirm = window.confirm('Delete forever?');
  if (confirm) {
    canvas.getGroupShape().removeShape(element);
    canvas.getGroupShapeModify().removeShapes();
  }
***REMOVED***



xrx.svg.Shape.create = function(tagName, className, opt_properties) {
  var properties = opt_properties || {***REMOVED***
  var shape = xrx.svg.Element.createNS(tagName);
  properties['class'] = 'xrx-shape ' + className;
  xrx.svg.Element.setProperties(shape, properties);
  return shape;
***REMOVED***
