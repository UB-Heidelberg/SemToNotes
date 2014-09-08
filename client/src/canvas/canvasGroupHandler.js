***REMOVED***
***REMOVED*** @fileoverview A class offering event handlers for canvas groups.
***REMOVED***

goog.provide('xrx.canvas.GroupHandler');



goog.require('goog.math.AffineTransform');
goog.require('xrx.canvas.Handler');
goog.require('xrx.canvas.Mode');
goog.require('xrx.canvas.State');



xrx.canvas.GroupHandler = function() {***REMOVED***



***REMOVED***
***REMOVED*** Double click event handler.
***REMOVED*** @param {goog.events.BrowserEvent} e The browser event.
***REMOVED*** @param {xrx.canvas.Canvas} canvas The canvas object.
***REMOVED***
xrx.canvas.GroupHandler.handleDblClick = function(e, canvas) {
  xrx.canvas.Handler.rotateRight(canvas);
***REMOVED***



***REMOVED***
***REMOVED*** Mouse down event handler.
***REMOVED*** @param {goog.events.BrowserEvent} e The browser event.
***REMOVED*** @param {xrx.canvas.Canvas} canvas The canvas object.
***REMOVED***
xrx.canvas.GroupHandler.handleMouseDown = function(e, canvas) {
  if (canvas.mode_ !== xrx.canvas.Mode.PAN) return;
  var eventPoint = [e.clientX, e.clientY];
  var transform = new goog.math.AffineTransform();

  if (!canvas.stateOrigin) canvas.stateOrigin = new Array(2);

  transform.createInverse().transform(eventPoint, 0, canvas.stateOrigin, 0, 1);

  canvas.state = xrx.canvas.State.DRAG;
***REMOVED***



***REMOVED***
***REMOVED*** Mouse move event handler.
***REMOVED*** @param {goog.events.BrowserEvent} e The browser event.
***REMOVED*** @param {xrx.canvas.Canvas} canvas The canvas object.
***REMOVED***
xrx.canvas.GroupHandler.handleMouseMove = function(e, canvas) {
  if (canvas.mode_ !== xrx.canvas.Mode.PAN) return;
  if (canvas.state !== xrx.canvas.State.DRAG) return;

  var point = new Array(2);
  var eventPoint = [e.clientX, e.clientY];
  var transform = new goog.math.AffineTransform();

  transform.createInverse().transform(eventPoint, 0, point, 0, 1);

  var x = point[0] - canvas.stateOrigin[0];
  var y = point[1] - canvas.stateOrigin[1];

  canvas.getViewBox().ctm = transform.translate(x, y).concatenate(canvas.getViewBox().ctm);

  canvas.setCTM(canvas.getViewBox().ctm);

  canvas.stateOrigin = point;
***REMOVED***



***REMOVED***
***REMOVED*** Mouse up event handler.
***REMOVED*** @param {goog.events.BrowserEvent} e The browser event.
***REMOVED*** @param {xrx.canvas.Canvas} canvas The canvas object.
***REMOVED***
xrx.canvas.GroupHandler.handleMouseUp = function(e, canvas) {
  if (canvas.mode_ !== xrx.canvas.Mode.PAN) return;
  canvas.state = xrx.canvas.State.NONE;
***REMOVED***



***REMOVED***
***REMOVED*** Mouse-wheel event handler.
***REMOVED*** @param {goog.events.BrowserEvent} e The browser event.
***REMOVED*** @param {xrx.canvas.Canvas} canvas The canvas object.
***REMOVED***
xrx.canvas.GroupHandler.handleMousewheel = function(e, canvas) {
  e.deltaY < 0 ? xrx.canvas.Handler.zoomIn(canvas) :
      xrx.canvas.Handler.zoomOut(canvas);
***REMOVED***
