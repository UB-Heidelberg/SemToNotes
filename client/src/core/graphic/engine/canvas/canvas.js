/**
 * @fileoverview Canvas base class providing static functions.
 */

goog.provide('xrx.canvas');



/**
 * Canvas base class providing static functions.
 * @constructor
 * @namespace xrx.canvas
 * @memberof xrx
 */
xrx.canvas = function() {};



/**
 * Returns whether HTML Canvas rendering is supported by the current browser.
 * @return {boolean} Whether HTML Canvas rendering is supported.
 */
xrx.canvas.isSupported = function() {
  return !!document.createElement('canvas').getContext;
};
