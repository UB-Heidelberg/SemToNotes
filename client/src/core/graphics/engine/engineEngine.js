/**
 * @fileoverview A class representing a graphics rendering engine.
 */

goog.provide('xrx.engine.Engine');



goog.require('xrx.canvas');
goog.require('xrx.engine');
goog.require('xrx.engine.Engines');
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
 * Creates a new canvas element.
 * @param {HTMLElement} The HTML element to append the new canvas.
 * @return {(xrx.canvas.Canvas|xrx.svg.Canvas|xrx.vml.Canvas)} The canvas element.
 */
xrx.engine.Engine.prototype.createCanvas = function(element) {
  if (this.typeOf(xrx.engine.CANVAS)) {
    return xrx.canvas.Canvas.create(element);
  } else if (this.typeOf(xrx.engine.SVG)) {
    return xrx.svg.Canvas.create(element);
  } else if (this.typeOf(xrx.engine.VML)) {
    return xrx.vml.Canvas.create(element);
  } else {
    throw Error('Unknown engine.');
  }
};



/**
 * Creates a new circle element.
 * @param {(xrx.canvas.Canvas|xrx.svg.Canvas|xrx.vml.Canvas)} The parent
 *   canvas element.
 * @return {(xrx.canvas.Circle|xrx.svg.Circle|xrx.vml.Circle)} The circle element.
 */
xrx.engine.Engine.prototype.createCircle = function(canvas) {
  if (this.typeOf(xrx.engine.CANVAS)) {
    return xrx.canvas.Circle.create(canvas);
  } else if (this.typeOf(xrx.engine.SVG)) {
    return xrx.svg.Circle.create(canvas);
  } else if (this.typeOf(xrx.engine.VML)) {
    return xrx.vml.Circle.create(canvas);
  } else {
    throw Error('Unknown engine.');
  }
};



/**
 * Creates a new ellipse element.
 * @param {(xrx.canvas.Canvas|xrx.svg.Canvas|xrx.vml.Canvas)} The parent
 *   canvas element.
 * @return {(xrx.canvas.Ellipse|xrx.svg.Ellipse|xrx.vml.Ellipse)} The ellipse element.
 */
xrx.engine.Engine.prototype.createEllipse = function(canvas) {
  if (this.typeOf(xrx.engine.CANVAS)) {
    return xrx.canvas.Ellipse.create(canvas);
  } else if (this.typeOf(xrx.engine.SVG)) {
    return xrx.svg.Ellipse.create(canvas);
  } else if (this.typeOf(xrx.engine.VML)) {
    return xrx.vml.Ellipse.create(canvas);
  } else {
    throw Error('Unknown engine.');
  }
};


/**
 * Creates a new group element.
 * @param {(xrx.canvas.Canvas|xrx.svg.Canvas|xrx.vml.Canvas)} The parent
 *   canvas element.
 * @return {(xrx.canvas.Group|xrx.svg.Group|xrx.vml.Group)} The group element.
 */
xrx.engine.Engine.prototype.createGroup = function(canvas) {
  if (this.typeOf(xrx.engine.CANVAS)) {
    return xrx.canvas.Group.create(canvas);
  } else if (this.typeOf(xrx.engine.SVG)) {
    return xrx.svg.Group.create(canvas);
  } else if (this.typeOf(xrx.engine.VML)) {
    return xrx.vml.Group.create(canvas);
  } else {
    throw Error('Unknown engine.');
  }
};


/**
 * Creates a new image element.
 * @param {(xrx.canvas.Canvas|xrx.svg.Canvas|xrx.vml.Canvas)} The parent
 *   canvas element.
 * @return {(xrx.canvas.Image|xrx.svg.Image|xrx.vml.Image)} The image element.
 */
xrx.engine.Engine.prototype.createImage = function(canvas) {
  if (this.typeOf(xrx.engine.CANVAS)) {
    return xrx.canvas.Image.create(canvas);
  } else if (this.typeOf(xrx.engine.SVG)) {
    return xrx.svg.Image.create(canvas);
  } else if (this.typeOf(xrx.engine.VML)) {
    return xrx.vml.Image.create(canvas);
  } else {
    throw Error('Unknown engine.');
  }
};


/**
 * Creates a new line element.
 * @param {(xrx.canvas.Canvas|xrx.svg.Canvas|xrx.vml.Canvas)} The parent
 *   canvas element.
 * @return {(xrx.canvas.Line|xrx.svg.Line|xrx.vml.Line)} The line element.
 */
xrx.engine.Engine.prototype.createLine = function(canvas) {
  if (this.typeOf(xrx.engine.CANVAS)) {
    return xrx.canvas.Line.create(canvas);
  } else if (this.typeOf(xrx.engine.SVG)) {
    return xrx.svg.Line.create(canvas);
  } else if (this.typeOf(xrx.engine.VML)) {
    return xrx.vml.Line.create(canvas);
  } else {
    throw Error('Unknown engine.');
  }
};


/**
 * Creates a new polygon element.
 * @param {(xrx.canvas.Canvas|xrx.svg.Canvas|xrx.vml.Canvas)} The parent
 *   canvas element.
 * @return {(xrx.canvas.Polygon|xrx.svg.Polygon|xrx.vml.Polygon)} The polygon element.
 */
xrx.engine.Engine.prototype.createPolygon = function(canvas) {
  if (this.typeOf(xrx.engine.CANVAS)) {
    return xrx.canvas.Polygon.create(canvas);
  } else if (this.typeOf(xrx.engine.SVG)) {
    return xrx.svg.Polygon.create(canvas);
  } else if (this.typeOf(xrx.engine.VML)) {
    return xrx.vml.Polygon.create(canvas);
  } else {
    throw Error('Unknown engine.');
  }
};


/**
 * Creates a new polyline element.
 * @param {(xrx.canvas.Canvas|xrx.svg.Canvas|xrx.vml.Canvas)} The parent
 *   canvas element.
 * @return {(xrx.canvas.Polyline|xrx.svg.Polyline|xrx.vml.Polyline)} The polyline element.
 */
xrx.engine.Engine.prototype.createPolyline = function(canvas) {
  if (this.typeOf(xrx.engine.CANVAS)) {
    return xrx.canvas.Polyline.create(canvas);
  } else if (this.typeOf(xrx.engine.SVG)) {
    return xrx.svg.Polyline.create(canvas);
  } else if (this.typeOf(xrx.engine.VML)) {
    return xrx.vml.Polyline.create(canvas);
  } else {
    throw Error('Unknown engine.');
  }
};


/**
 * Creates a new rect element.
 * @param {(xrx.canvas.Canvas|xrx.svg.Canvas|xrx.vml.Canvas)} The parent
 *   canvas element.
 * @return {(xrx.canvas.Rect|xrx.svg.Rect|xrx.vml.Rect)} The rect element.
 */
xrx.engine.Engine.prototype.createRect = function(canvas) {
  if (this.typeOf(xrx.engine.CANVAS)) {
    return xrx.canvas.Polygon.create(canvas);
  } else if (this.typeOf(xrx.engine.SVG)) {
    return xrx.svg.Polygon.create(canvas);
  } else if (this.typeOf(xrx.engine.VML)) {
    return xrx.vml.Polygon.create(canvas);
  } else {
    throw Error('Unknown engine.');
  }
};



/**
 * Returns the name of this rendering engine.
 * @return {(xrx.canvas|xrx.svg|xrx.vml)} The name.
 */
xrx.engine.Engine.prototype.getName = function() {
  return this.name_;
};



/**
 * Whether the overloaded engine name is the current.
 * @param {(xrx.engine.CANVAS|xrx.engine.SVG|xrx.engine.VML)} name The
 *     engine name.
 * @return {boolean} Whether the engine matches.
 */
xrx.engine.Engine.prototype.typeOf = function(name) {
  return this.name_ === name;
}; 



/**
 * Whether this rendering engine could be initialized successfully.
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
