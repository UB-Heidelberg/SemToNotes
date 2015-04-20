/**
 * @fileoverview Canvas base class providing static functions for the
 *     canvas sub-classes.
 */

goog.provide('xrx.canvas');



/**
 * Canvas base class providing static functions for the canvas sub-classes.
 * @constructor
 */
xrx.canvas = function() {};



/**
 * Returns whether HTML Canvas rendering is supported by the current user agent.
 * @return {boolean} Whether HTML Canvas rendering is supported.
 */
xrx.canvas.isSupported = function() {
  return !!document.createElement('canvas').getContext;
};



/**
 * @private
 */
xrx.canvas.setTransform_ = function(context, matrix) {
  context.setTransform(matrix.m00_, matrix.m10_, matrix.m01_,
      matrix.m11_, matrix.m02_, matrix.m12_);
};



/**
 * Re-renders 2D HTML Canvas elements according to a transformation matrix.
 * @param {HTMLCanvasElement} canvas The HTML canvas element.
 * @param {goog.math.AffineTransform} affineTransform Transformation matrix to
 *     be applied before rendering.
 * @param {function} callback Callback function, called after the canvas is cleaned
 *     and the matrix is transformed.
 */
xrx.canvas.render = function(canvas, affineTransform, callback) {
  var ctx = canvas.getContext('2d');
  ctx.save();
  ctx.fillStyle = '#DDDDDD';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  xrx.canvas.setTransform_(ctx, affineTransform);
  callback();
  ctx.closePath();
  ctx.restore();
};



goog.exportSymbol('xrx.canvas', xrx.canvas);
