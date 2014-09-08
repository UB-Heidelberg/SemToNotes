***REMOVED***
***REMOVED*** @fileoverview
***REMOVED***

goog.provide('xrx.svg.VertexDragger');



goog.require('xrx.canvas.State');
goog.require('xrx.svg.Circle');
goog.require('xrx.svg.Element');



xrx.svg.VertexDragger = function() {***REMOVED***



xrx.svg.VertexDragger.getCX = function(element) {
  return parseInt(element.getAttribute('cx'));
***REMOVED***



xrx.svg.VertexDragger.getCY = function(element) {
  return parseInt(element.getAttribute('cy'));
***REMOVED***



xrx.svg.VertexDragger.getCoords = function(element) {
  return [[xrx.svg.VertexDragger.getCX(element),
      xrx.svg.VertexDragger.getCY(element)]];
***REMOVED***



xrx.svg.VertexDragger.setCoords = function(element, coords) {
  element.setAttribute('cx', coords[0][0]);
  element.setAttribute('cy', coords[0][1]);
***REMOVED***



xrx.svg.VertexDragger.handleMouseDown = function(e, canvas) {
  canvas.getGroupShapeModify().getShield().activate();
  xrx.svg.Element.handleMouseDown(e, canvas, xrx.svg.VertexDragger);
***REMOVED***



xrx.svg.VertexDragger.handleMouseMove = function(e, canvas) {
  if (canvas.getState() === xrx.canvas.State.NONE) return;

  var coords;
  var dragTarget = canvas.getDragElement();
  var gsm = canvas.getGroupShapeModify();
  var vertexDraggers = gsm.getVertexDraggers();
  var position = gsm.getVertexDraggerPosition(dragTarget, vertexDraggers);
  var postProcess = canvas.getSelectedShape().getAffineCoords;

  xrx.svg.Element.handleMouseMove(e, canvas, xrx.svg.VertexDragger);
  coords = gsm.getVertexDraggerCoords(vertexDraggers);

  if (postProcess) coords = postProcess(coords, position);

  canvas.getGroupShape().update(coords);
  canvas.getGroupShapeModify().update(coords, position);
***REMOVED***




xrx.svg.VertexDragger.handleMouseUp = function(e, canvas) {
  canvas.getGroupShape().getShield().activate();
  xrx.svg.Element.handleMouseUp(e, canvas, xrx.svg.VertexDragger);
***REMOVED***




xrx.svg.VertexDragger.create = function(point) {
  return xrx.svg.Circle.create({
    'cx': point[0],
    'cy': point[1],
    'r': '2',
    'style': 'fill:white;'
  });
***REMOVED***
