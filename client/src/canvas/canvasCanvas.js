/**
 * @fileoverview A class representing a canvas.
 */

goog.provide('xrx.canvas.Canvas');



goog.require('goog.dom.DomHelper');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.math.AffineTransform');
goog.require('goog.net.ImageLoader');
goog.require('xrx');
goog.require('xrx.canvas');
goog.require('xrx.canvas.GroupBackground');
goog.require('xrx.canvas.GroupShape');
goog.require('xrx.canvas.GroupShapeCreate');
goog.require('xrx.canvas.GroupShapeModify');
goog.require('xrx.canvas.Mode');
goog.require('xrx.canvas.Shield');
goog.require('xrx.canvas.State');
goog.require('xrx.graphics.Engine');
goog.require('xrx.graphics.Graphics');



/**
 * A class representing a canvas. The canvas can have a background
 * image and thereby can serve as an image annotation tool.
 *
 * @param {DOMElement} element The HTML element used to install the canvas.
 * @param {string} The name of the rendering engine.
 * @constructor
 */
xrx.canvas.Canvas = function(element, opt_graphics) {

  /**
   * The graphics engine.
   * @type {string}
   * @private
   */
  this.graphics_ = opt_graphics ||
      goog.getObjectByName('xrx.' + xrx.graphics.Engine.SVG);

  /**
   * The DOM element used to install the canvas.
   * @type {DOMElement}
   * @private
   */
  this.element_ = element;

  /**
   * The root element of the canvas.
   * @type {DOMElement}
   * @private
   */
  this.elementCanvas_;

  /**
   * @type {DOMElement}
   * @private
   */
  this.groupBackground_;

   /**
   * @type {DOMElement}
   * @private
   */
  this.groupShape_;
  
  /**
   * @type {DOMElement}
   * @private
   */
  this.groupShapeModify_;

  /**
   * @type {DOMElement}
   * @private
   */
  this.groupShapeCreate_;

  /**
   * @type {number}
   * @private
   */
  this.state = xrx.canvas.State.NONE;

  /**
   * @type {number}
   * @private
   */
  this.mode_ = xrx.canvas.Mode.PAN;

  /**
   * The shape currently selected by the user.
   * @type {Object}
   * @private
   */
  this.selected_ = {
    shape: null,
    element: null
  };

  /**
   * The shape currently dragged by the user.
   * @type {Object}
   * @private
   */
  this.dragged_ = {
    element: null,
    mousePoint: null,
    coords: null
  };

  /**
   * The shape currently created by the user.
   * @type {Object}
   * @private
   */
  this.created_ = {
    shape: null
  };

  /**
   * The background image of the canvas.
   * @type {Object}
   * @private
   */
   this.image_ = {
     object: null,
     element: null
   };

  /**
   * The view-box of the canvas.
   * @type {Object}
   * @private
   */
  this.viewbox_ = {
    centerPoint: null,
    ctm: new goog.math.AffineTransform(),
    box: {
      x: 0,
      y: 0,
      x2: 0,
      y2: 0,
      width: 0,
      height: 0
    }
  };

  // install the canvas
  this.install_();
};



/**
 * Returns the engine used for rendering.
 * @see xrx.graphics.Engine
 * @return {Object} The rendering engine.
 */
xrx.canvas.Canvas.prototype.getGraphics = function() {
  return this.graphics_;
};




/**
 * Returns the current state of the canvas.
 * @see xrx.canvas.State
 * @return {number}
 */
xrx.canvas.Canvas.prototype.getState = function() {
  return this.state ? this.state : xrx.canvas.State.NONE;
};



/**
 * Sets the current state of the canvas.
 * @see xrx.canvas.State
 * @param {number} state The state.
 */
xrx.canvas.Canvas.prototype.setState = function(state) {
  state ? this.state = state : this.state = xrx.canvas.State.NONE;
};



/**
 * Returns the class of the shape which is currently selected.
 * @return {?}
 */
xrx.canvas.Canvas.prototype.getSelectedShape = function() {
  return this.selected_.shape;
};



/**
 * Sets the class of a shape as the currently selected.
 * @param {?} shape The rendered shape.
 */
xrx.canvas.Canvas.prototype.setSelectedShape = function(shape) {
  this.selected_.shape = shape;
};



/**
 * Returns the rendered shape which is currently selected.
 * @return {DOMElement} The rendered shape.
 */
xrx.canvas.Canvas.prototype.getSelectedElement = function() {
  return this.selected_.element;
};



/**
 * Sets a rendered shape as the currently selected.
 * @param {DOMElement} element The shape element.
 */
xrx.canvas.Canvas.prototype.setSelectedElement = function(element) {
  this.selected_.element = element;
};



/**
 * Returns the rendered shape which is currently dragged.
 * @return {DOMElement}
 */
xrx.canvas.Canvas.prototype.getDragElement = function() {
  return this.dragged_.element;
};



/**
 * Sets a rendered shape as the currently dragged.
 * @param {DOMElement} element The element.
 */
xrx.canvas.Canvas.prototype.setDragElement = function(element) {
  this.dragged_.element = element;
};



/**
 * Returns the mouse point where dragging started.
 * @return {Array.<number>} The mouse point. 
 */
xrx.canvas.Canvas.prototype.getDragMousePoint = function() {
  if (!this.dragged_.mousePoint) this.dragged_.mousePoint = new Array(2);

  return this.dragged_.mousePoint;
};



/**
 * Keeps the mouse point where dragging started.
 * @param {Array.<number>} point The mouse point. 
 */
xrx.canvas.Canvas.prototype.setDragMousePoint = function(point) {
  this.dragged_.mousePoint = point;
};



/**
 * Returns the original coordinates of the shape before dragging.
 * @return {Array.<number>} The original coordinates. 
 */
xrx.canvas.Canvas.prototype.getDragCoords = function() {
  return this.dragged_.coords;
};



/**
 * Keeps the original coordinates of the shape before dragging.
 * @param {Array.<number>} The actual coordinates. 
 */
xrx.canvas.Canvas.prototype.setDragCoords = function(coords) {
  this.dragged_.coords = coords;
};



/**
 * Returns the wrapper element around the canvas.
 * @return {DOMElement} The wrapper.
 */
xrx.canvas.Canvas.prototype.getElement = function() {
  return this.element_;
};



/**
 * Returns the root element of the canvas.
 * @return {DOMElement} The root element.
 */
xrx.canvas.Canvas.prototype.getElementCanvas = function() {
  return this.elementCanvas_;
};



/**
 * Returns the background group of the canvas.
 * @return {DOMElement} The element representing the background group.
 */
xrx.canvas.Canvas.prototype.getGroupBackground = function() {
  return this.groupBackground_;
};



/**
 * Returns the group of the canvas where shapes are rendered.
 * @return {DOMElement} The element representing the shape group.
 */
xrx.canvas.Canvas.prototype.getGroupShape = function() {
  return this.groupShape_;
};



/**
 * Returns the group of the canvas where shapes can be modified.
 * @return {DOMElement} The element representing the shape modify group.
 */
xrx.canvas.Canvas.prototype.getGroupShapeModify = function() {
  return this.groupShapeModify_;
};



/**
 * Returns the group of the canvas where new shapes can be drawn.
 * @return {DOMElement} The element representing the shape create group.
 */
xrx.canvas.Canvas.prototype.getGroupShapeCreate = function() {
  return this.groupShapeCreate_;
};



/**
 * Returns the DOM element of the background image.
 * @return {DOMElement} The DOM element.
 */
xrx.canvas.Canvas.prototype.getImageElement = function() {
  return this.image_.element;
};



/**
 * Returns the URL of the current background image.
 * @return {string} The URL.
 */
xrx.canvas.Canvas.prototype.getImageUrl = function() {
  return '../data/SachsenspiegelHeidelberg/Bilder-34553-28167-1600.jpg';
};



/**
 * Returns the current background image object.
 * @return {Image} The image object. 
 */
xrx.canvas.Canvas.prototype.getImage = function() {
  return this.image_.object;
};



/**
 * Returns the view-box of the canvas.
 * @return {Object} The view-box.
 */
xrx.canvas.Canvas.prototype.getViewBox = function() {
  return this.viewbox_;
};



/**
 * Returns all groups of the canvas as an array.
 * @return {Array} The layers.
 */
xrx.canvas.Canvas.prototype.getGroups = function() {
  return [this.groupBackground_, this.groupShape_, this.groupShapeModify_,
      this.groupShapeCreate_];
};



/**
 * Deactivates all shields of the canvas.
 */
xrx.canvas.Canvas.prototype.shieldsDeactivate = function() {
  var groups = this.getGroups();
  for (var i = 0, len = groups.length; i < len; i++) {
    groups[i].getShield().deactivate();
  }
};



/**
 * Whether a point is inside the current view-box.
 * @param {Array.<number>} point The point.
 */
xrx.canvas.Canvas.prototype.isValidPoint = function(point) {
  return point[0] >= this.viewbox_.box.x && point[0] <= this.viewbox_.box.x2 &&
      point[1] >= this.viewbox_.box.y && point[1] <= this.viewbox_.box.y2;
};



/**
 * Whether the bounding box of a shape is inside the current view-box.
 * @param {Object} bbox The bounding box.
 */
xrx.canvas.Canvas.prototype.isValidBBox = function(bbox) {
  return bbox.x >= this.viewbox_.box.x && bbox.x2 <= this.viewbox_.box.x2 &&
      bbox.y >= this.viewbox_.box.y && bbox.y2 <= this.viewbox_.box.y2;
};



/**
 * Returns the current transformation matrix of the view-port.
 * @return {goog.math.AffineTransform}
 */
xrx.canvas.Canvas.prototype.getCTM = function() {
  return this.getGraphics().getCTM(this.getImageElement());
};



/**
 * Returns the current transformation matrix of the canvas.
 * @return {goog.math.AffineTransform}
 */
xrx.canvas.Canvas.prototype.setCTM = function(matrix) {
  this.getGraphics().setCTM(this.getImageElement(), matrix);
  this.getGraphics().setCTM(this.groupShape_.getElement(), matrix);
  this.getGraphics().setCTM(this.groupShapeModify_.getElement(), matrix);
  this.getGraphics().setCTM(this.groupShapeCreate_.getElement(), matrix);
};



xrx.canvas.Canvas.prototype.setMode = function(mode) {
  this.mode_ = mode;
};



/**
 * @private
 */
xrx.canvas.Canvas.prototype.installCanvas_ = function(image) {
  this.elementCanvas_ = this.getGraphics().Canvas.create({
    'width': '100%',
    'height': '100%'
  });
  goog.dom.append(this.element_, this.elementCanvas_);
};



/**
 * @private
 */
xrx.canvas.Canvas.prototype.installGroupBackground_ = function(image) {
  this.groupBackground_ = new xrx.canvas.GroupBackground(this);
  goog.dom.append(this.elementCanvas_, this.groupBackground_.getElement());
};



/**
 * @private
 */
xrx.canvas.Canvas.prototype.installGroupShape_ = function() {
  this.groupShape_ = new xrx.canvas.GroupShape(this);
  goog.dom.append(this.elementCanvas_, this.groupShape_.getElement());
};



/**
 * @private
 */
xrx.canvas.Canvas.prototype.installGroupShapeModify_ = function(image) {
  this.groupShapeModify_ = new xrx.canvas.GroupShapeModify(this);
  goog.dom.append(this.elementCanvas_, this.groupShapeModify_.getElement());
};



/**
 * @private
 */
xrx.canvas.Canvas.prototype.installGroupShapeCreate_ = function(image) {
  this.groupShapeCreate_ = new xrx.canvas.GroupShapeCreate(this);
  goog.dom.append(this.elementCanvas_, this.groupShapeCreate_.getElement());
};



/**
 * @private
 */
xrx.canvas.Canvas.prototype.install_ = function() {
  var self = this;
  var imageLoader = new goog.net.ImageLoader();

  goog.events.listen(imageLoader, goog.events.EventType.LOAD, function(e) {
    self.image_.object = e.target;

    // install the canvas
    self.installCanvas_(self.image_.object);

    // install groups
    self.installGroupBackground_(self.image_.object);
    self.installGroupShape_();
    self.installGroupShapeModify_(self.image_.object);
    self.installGroupShapeCreate_(self.image_.object);

    // initialize the center point
    self.viewbox_.centerPoint = [self.image_.object.naturalWidth / 2, self.image_.object.naturalHeight / 2];

    // initialize the bounding box
    self.viewbox_.box.x2 = self.image_.object.naturalWidth;
    self.viewbox_.box.y2 = self.image_.object.naturalHeight;
    self.viewbox_.box.width = self.image_.object.naturalWidth;
    self.viewbox_.box.height = self.image_.object.naturalHeight;
  });

  imageLoader.addImage('xrxImage', self.getImageUrl());
  imageLoader.start();
};
