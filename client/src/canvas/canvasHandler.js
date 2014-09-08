***REMOVED***
***REMOVED*** @fileoverview A class offering event handlers for a canvas.
***REMOVED***

goog.provide('xrx.canvas.Handler');



***REMOVED***
***REMOVED***
goog.require('goog.math');
goog.require('xrx.canvas.Mode');
goog.require('xrx.graphics.Graphics');



xrx.canvas.Handler = function() {***REMOVED***



***REMOVED***
***REMOVED*** Zoom in on the view-box of a canvas.
***REMOVED*** @param {xrx.canvas.Canvas} canvas The canvas.
***REMOVED***
xrx.canvas.Handler.zoomIn = function(canvas) {
  canvas.setCTM(canvas.getViewBox().ctm.scale(1.05, 1.05));
***REMOVED***



***REMOVED***
***REMOVED*** Zoom out the view-box of a canvas.
***REMOVED*** @param {xrx.canvas.Canvas} canvas The canvas.
***REMOVED***
xrx.canvas.Handler.zoomOut = function(canvas) {
  canvas.setCTM(canvas.getViewBox().ctm.scale(.95, .95));
***REMOVED***



***REMOVED***
***REMOVED*** Switch a canvas over into mode <i>background</i> to allow view-box panning.
***REMOVED*** @see xrx.canvas.Mode
***REMOVED*** @param {xrx.canvas.Canvas} canvas The canvas.
***REMOVED***
xrx.canvas.Handler.setModeBackground = function(canvas) {
  canvas.setMode(xrx.canvas.Mode.PAN);
  canvas.getGroupBackground().getShield().activate();
  canvas.getGroupShapeModify().removeShapes();
  canvas.getGroupShapeCreate().removeShapes();
***REMOVED***



***REMOVED***
***REMOVED*** Switch the canvas over into mode <i>delete</i> to allow deletion of shapes.
***REMOVED*** @see xrx.canvas.Mode
***REMOVED*** @param {boolean} flag Whether to switch the mode on or off.
***REMOVED*** @param {xrx.canvas.Canvas} canvas The canvas.
***REMOVED***
xrx.canvas.Handler.setModeDelete = function(flag, canvas) {
  if (flag === false) {
    xrx.canvas.Handler.setModeBackground(canvas);
  } else {
    canvas.setMode(xrx.canvas.Mode.DELETE);
    canvas.getGroupShape().getShield().activate();
    canvas.getGroupShapeModify().removeShapes();
    canvas.getGroupShapeCreate().removeShapes();
  }
***REMOVED***



***REMOVED***
***REMOVED*** Switch the canvas over into mode <i>modify</i> to allow modification of shapes.
***REMOVED*** @see xrx.canvas.Mode
***REMOVED*** @param {boolean} flag Whether to switch the mode on or off.
***REMOVED*** @param {xrx.canvas.Canvas} canvas The canvas.
***REMOVED***
xrx.canvas.Handler.setModeModify = function(flag, canvas) {
  if (flag === false) {
    xrx.canvas.Handler.setModeBackground(canvas);
  } else {
    canvas.setMode(xrx.canvas.Mode.MODIFY);
    canvas.getGroupShape().getShield().activate();
    canvas.getGroupShapeModify().removeShapes();
    canvas.getGroupShapeCreate().removeShapes();
  }
***REMOVED***



***REMOVED***
***REMOVED*** Switch the canvas over into mode <i>create</i> to allow drawing of new shapes.
***REMOVED*** @see xrx.canvas.Mode
***REMOVED*** @param {boolean} flag Whether to switch the mode on or off.
***REMOVED*** @param {string} The name of the shape-class which shall be drawn.
***REMOVED***
xrx.canvas.Handler.setModeCreate = function(flag, canvas, shapeCreate) {
  if (flag === false) {
    xrx.canvas.Handler.setModeBackground(canvas);
  } else {
    canvas.getGroupShapeCreate().getShield().activate();
    canvas.getGroupShapeModify().removeShapes();
    canvas.getGroupShapeCreate().removeShapes();

    canvas.created_.shape = canvas.getGraphics()[shapeCreate];
    if (canvas.drawEvent) goog.events.unlistenByKey(canvas.drawEvent);
    canvas.drawEvent = goog.events.listen(canvas.getGroupShapeCreate().getElement(),
        goog.events.EventType.CLICK,
        function(e) { canvas.created_.shape.handleMouseClick(e, canvas); }
  ***REMOVED***
  }
***REMOVED***



***REMOVED***
***REMOVED*** Rotates the view-box by 90° in left direction.
***REMOVED*** @param {xrx.canvas.Canvas} canvas The canvas.
***REMOVED***
xrx.canvas.Handler.rotateLeft = function(canvas) {
  canvas.setCTM(canvas.getViewBox().ctm.rotate(goog.math.toRadians(-90),
      canvas.viewbox_.centerPoint[0], canvas.viewbox_.centerPoint[1]));
***REMOVED***



***REMOVED***
***REMOVED*** Rotates the view-box by 90° in right direction.
***REMOVED*** @param {xrx.canvas.Canvas} canvas The canvas.
***REMOVED***
xrx.canvas.Handler.rotateRight = function(canvas) {
  canvas.setCTM(canvas.getViewBox().ctm.rotate(goog.math.toRadians(90),
      canvas.viewbox_.centerPoint[0], canvas.viewbox_.centerPoint[1]));
***REMOVED***
