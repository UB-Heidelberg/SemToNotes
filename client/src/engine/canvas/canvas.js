***REMOVED***
***REMOVED*** @fileoverview Canvas base class providing static functions for the
***REMOVED***     canvas sub-classes.
***REMOVED***

goog.provide('xrx.canvas');



goog.require('xrx');



***REMOVED***
***REMOVED*** Canvas base class providing static functions for the canvas sub-classes.
***REMOVED***
***REMOVED***
xrx.canvas = function() {***REMOVED***



***REMOVED***
***REMOVED*** Returns whether HTML Canvas rendering is supported by the current user agent.
***REMOVED*** @return {boolean} Whether HTML Canvas rendering is supported.
***REMOVED***
xrx.canvas.isSupported = function() {
  return !!document.createElement('canvas').getContext;
***REMOVED***



***REMOVED***
***REMOVED*** @private
***REMOVED***
xrx.canvas.setTransform_ = function(context, matrix) {
  context.setTransform(matrix.m00_, matrix.m10_, matrix.m01_,
      matrix.m11_, matrix.m02_, matrix.m12_);
***REMOVED***



***REMOVED***
***REMOVED*** Re-renders 2D HTML Canvas elements according to a transformation matrix.
***REMOVED*** @param {HTMLCanvasElement} canvas The HTML canvas element.
***REMOVED*** @param {goog.math.AffineTransform} affineTransform Transformation matrix to
***REMOVED***     be applied before rendering.
***REMOVED*** @param {function} callback Callback function, called after the canvas is cleaned
***REMOVED***     and the matrix is transformed.
***REMOVED***
xrx.canvas.render = function(canvas, affineTransform, callback) {
  var ctx = canvas.getContext('2d');
  ctx.save();
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  xrx.canvas.setTransform_(ctx, affineTransform);
  callback();
  ctx.closePath();
  ctx.restore();
***REMOVED***



goog.exportProperty(xrx, 'canvas', xrx.canvas);
