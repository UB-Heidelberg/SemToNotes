/**
 * @fileoverview A class representing a graphics rendering engine.
 */

goog.provide('xrx.engine.Engine');



goog.require('xrx.canvas');
goog.require('xrx.engine');
goog.require('xrx.svg');
goog.require('xrx.vml');



/**
 * A class representing a graphics rendering engine.
 * @param {string} opt_engine The rendering engine to be used. If no
 *   parameter is overloaded, the engine class searches for the
 *   best rendering engine available.
 * @constructor
 */
xrx.engine.Engine = function(opt_engine) {

  /**
   * Name of the rendering engine.
   * @see xrx.engine
   * @type {string}
   * @private
   */
  this.name_ = opt_engine;

  /**
   * Indicates whether a rendering engine could be initialized
   * successfully.
   * @type {boolean}
   * @private
   */
  this.available_ = false;

  this.init_();
};



/**
 * Returns the name of this rendering engine.
 * @return {(xrx.canvas|xrx.svg|xrx.vml)} The name.
 */
xrx.engine.Engine.prototype.getName = function() {
  return this.name_;
};



/**
 * Whether the overloaded renderer name is the current.
 * @param {(xrx.engine.CANVAS|xrx.engine.SVG|xrx.engine.VML)} name The
 *     renderer name.
 * @return {boolean} Whether the renderer matches.
 */
xrx.engine.Engine.prototype.typeOf = function(name) {
  return this.name_ === name;
}; 



/**
 * Whether the rendering engine could be initialized successfully.
 * @return {boolean} Whether the engine is available for use.
 */
xrx.engine.Engine.prototype.isAvailable = function() {
  return this.available_;
};



/**
 * @private
 */
xrx.engine.Engine.prototype.findOptimalRenderer_ = function() {
  if (xrx.canvas.isSupported()) {
    this.name_ = xrx.engine.CANVAS;
    this.renderer_ = xrx.canvas;
    this.available_ = true;
  } else if (xrx.svg.isSupported()) {
    this.name_ = xrx.engine.SVG;
    this.renderer_ = xrx.svg;
    this.available_ = true;
  } else if (xrx.vml.isSupported()) {
    this.name_ = xrx.engine.VML;
    this.renderer_ = xrx.vml;
    this.available_ = true;
  } else {
    throw Error('There is no graphics rendering engine available.');
  }
};



/**
 * @private
 */
xrx.engine.Engine.prototype.forceRenderer_ = function() {
  if (this.name_ === xrx.engine.CANVAS) {
    this.renderer_ = xrx.canvas;
    this.available_ = xrx.canvas.isSupported();
  } else if (this.name_ === xrx.engine.SVG) {
    this.renderer_ = xrx.svg;
    this.available_ = xrx.svg.isSupported();
  } else if (this.name_ === xrx.engine.VML) {
    this.renderer_ = xrx.vml;
    this.available_ = xrx.vml.isSupported();
  } else {
    this.available_ = false;
    throw Error('Unknown graphics rendering engine.');
  }
};



/**
 * @private
 */
xrx.engine.Engine.prototype.init_ = function() {
  if (this.name_) {
    this.forceRenderer_();
  } else {
    this.findOptimalRenderer_();
  }
};
