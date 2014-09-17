/**
 * @fileoverview Engine base class providing enumerations for the engine sub-classes.
 */

goog.provide('xrx.engine');
goog.provide('xrx.engine.Engine');



/**
 * Engine base class providing enumerations for the engine sub-classes.
 * @constructor
 */
xrx.engine = function() {};



/**
 * Enumeration of the rendering engines.
 * @enum {string}
 */
xrx.engine.Engine = {

  /**
   * <a href="http://www.w3.org/TR/SVG/">SVG rendering engine</a>
   */
  SVG: 'svg',

  /**
   * <a href="http://www.w3.org/TR/NOTE-VML">VML rendering engine</a>
   */
  VML: 'vml',

  /**
   * <a href="http://www.w3.org/TR/2014/CR-2dcontext-20140821/">2D Canvas rendering engine</a>
   */
  CANVAS: 'canvas'
};
