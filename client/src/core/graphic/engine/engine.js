/**
 * @fileoverview Engine base class.
 */

goog.provide('xrx.engine');



goog.require('goog.userAgent');



/**
 * Engine base class.
 * @constructor
 */
xrx.engine = function() {};



/**
 * <a href="http://www.w3.org/TR/2014/CR-2dcontext-20140821/">The 2D Canvas rendering engine.</a>
 * @enum {string}
 */
xrx.engine.CANVAS = 'canvas';



/**
 * <a href="http://www.w3.org/TR/SVG/">The SVG rendering engine.</a>
 * @enum {string}
 */
xrx.engine.SVG = 'svg';



/**
 * <a href="http://www.w3.org/TR/NOTE-VML">The VML rendering engine.</a>
 * @enum {string}
 */
xrx.engine.VML = 'vml';
