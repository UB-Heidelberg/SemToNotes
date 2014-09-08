/**
 * @fileoverview A class offering event handlers for canvas groups.
 */

goog.provide('xrx.canvas.GroupHandler');



goog.require('goog.math.AffineTransform');
goog.require('xrx.canvas.Handler');
goog.require('xrx.canvas.Mode');
goog.require('xrx.canvas.State');



xrx.canvas.GroupHandler = function() {};



/**
 * Double click event handler.
 * @param {goog.events.BrowserEvent} e The browser event.
 * @param {xrx.canvas.Canvas} canvas The canvas object.
 */
xrx.canvas.GroupHandler.handleDblClick = function(e, canvas) {
  xrx.canvas.Handler.rotateRight(canvas);
};



/**
 * Mouse down event handler.
 * @param {goog.events.BrowserEvent} e The browser event.
 * @param {xrx.canvas.Canvas} canvas The canvas object.
 */
xrx.canvas.GroupHandler.handleMouseDown = function(e, canvas) {
  if (canvas.mode_ !== xrx.canvas.Mode.PAN) return;
  var eventPoint = [e.clientX, e.clientY];
  var transform = new goog.math.AffineTransform();

  if (!canvas.stateOrigin) canvas.stateOrigin = new Array(2);

  transform.createInverse().transform(eventPoint, 0, canvas.stateOrigin, 0, 1);

  canvas.state = xrx.canvas.State.DRAG;
};



/**
 * Mouse move event handler.
 * @param {goog.events.BrowserEvent} e The browser event.
 * @param {xrx.canvas.Canvas} canvas The canvas object.
 */
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
};



/**
 * Mouse up event handler.
 * @param {goog.events.BrowserEvent} e The browser event.
 * @param {xrx.canvas.Canvas} canvas The canvas object.
 */
xrx.canvas.GroupHandler.handleMouseUp = function(e, canvas) {
  if (canvas.mode_ !== xrx.canvas.Mode.PAN) return;
  canvas.state = xrx.canvas.State.NONE;
};



/**
 * Mouse-wheel event handler.
 * @param {goog.events.BrowserEvent} e The browser event.
 * @param {xrx.canvas.Canvas} canvas The canvas object.
 */
xrx.canvas.GroupHandler.handleMousewheel = function(e, canvas) {
  e.deltaY < 0 ? xrx.canvas.Handler.zoomIn(canvas) :
      xrx.canvas.Handler.zoomOut(canvas);
};
