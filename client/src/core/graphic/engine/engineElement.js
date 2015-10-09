/**
 * @fileoverview Abstract super-class of all engine elements.
 */

goog.provide('xrx.engine.Element');



goog.require('xrx.engine');



/**
 * Abstract super-class of all engine elements.
 * @constructor
 * @private
 */
xrx.engine.Element = function() {};



xrx.engine.Element.prototype.startDrawing = function() {};



xrx.engine.Element.prototype.finishDrawing = function() {};
