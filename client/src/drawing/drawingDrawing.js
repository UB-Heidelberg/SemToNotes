/**
 * @fileoverview A class representing a drawing canvas.
 */

goog.provide('xrx.drawing.Drawing');



goog.require('goog.dom.DomHelper');
goog.require('goog.dom.ViewportSizeMonitor');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.net.ImageLoader');
goog.require('goog.style');
goog.require('xrx');
goog.require('xrx.drawing');
goog.require('xrx.drawing.EventTarget');
goog.require('xrx.drawing.LayerBackground');
goog.require('xrx.drawing.LayerShape');
goog.require('xrx.drawing.LayerShapeCreate');
goog.require('xrx.drawing.LayerShapeModify');
goog.require('xrx.drawing.Mode');
goog.require('xrx.drawing.Modifiable');
goog.require('xrx.drawing.State');
goog.require('xrx.drawing.Viewbox');
goog.require('xrx.graphics.Engine');
goog.require('xrx.graphics.Graphics');
goog.require('xrx.shape');
goog.require('xrx.shape.Shape');
goog.require('xrx.shape.Shapes');
goog.require('xrx.svg.Canvas');



/**
 * A class representing a drawing canvas. The drawing canvas can have a background
 * image and thereby can serve as an image annotation tool.
 *
 * @param {DOMElement} element The HTML element used to install the canvas.
 * @param {string} The name of the rendering engine.
 * @see xrx.graphics.Engine
 * @constructor
 */
xrx.drawing.Drawing = function(element, opt_engine) {

  goog.base(this);

  /**
   * The graphics engine.
   * @type {string}
   * @private
   */
  this.engine_ = opt_engine || xrx.graphics.Engine.SVG;
  this.graphics_ = goog.getObjectByName('xrx.' + this.engine_);

  /**
   * The DOM element used to install the drawing canvas.
   * @type {DOMElement}
   * @private
   */
  this.element_ = element;

  /**
   * The graphics canvas.
   * @type {xrx.graphics.Canvas}
   * @private
   */
  this.canvas_;

  /**
   * @type {Array}
   * @private
   */
  this.layer_ = [];

  /**
   * @type {number}
   * @private
   */
  this.mode_ = xrx.drawing.Mode.NONE;

  /**
   * The shape currently modified by the user.
   * @type {?}
   * @private
   */
  this.modifiable_ = new xrx.drawing.Modifiable(this);

  /**
   * The shape currently created by the user.
   * @type {Object}
   * @private
   */
  this.created_ = {
    shape: null
  };

  /**
   * The view-box of the drawing canvas.
   * @type {Object}
   * @private
   */
  this.viewbox_;

  // install the canvas
  this.install_();
};
goog.inherits(xrx.drawing.Drawing, xrx.drawing.EventTarget);



xrx.drawing.Drawing.prototype.getEngine = function() {
  return this.engine_;
};



xrx.drawing.Drawing.prototype.getWidth = function() {
  return this.getElement().offsetWidth;
};



xrx.drawing.Drawing.prototype.getHeight = function() {
  return this.getElement().offsetHeight;
};



/**
 * Returns the engine used for rendering.
 * @see xrx.graphics.Engine
 * @return {Object} The rendering engine.
 */
xrx.drawing.Drawing.prototype.getGraphics = function() {
  return this.graphics_;
};



/**
 * Returns the shape which is currently selected.
 * @return {?}
 */
xrx.drawing.Drawing.prototype.getShapeSelected = function(coordinate) {
  var layer;
  var shapes;
  var shape;
  var coords;
  var coord;
  var found = false;
  for (var i = this.layer_.length - 1; i >= 0; i--) {
    layer = this.layer_[i];
    if (!layer.isLocked()) {
      shapes = layer.getShapes() || [];
      for (var j = shapes.length - 1; j >= 0; j--) {
        shape = shapes[j];
        if (shape.getPrimitiveShape().getGraphic().containsPoint(coordinate)) {
          found = true;
          break;
        }
      }
    }
    if (found === true) break;
  }
  return found ? shape : undefined;
};



/**
 * Returns the wrapper element around the canvas.
 * @return {DOMElement} The wrapper.
 */
xrx.drawing.Drawing.prototype.getElement = function() {
  return this.element_;
};



/**
 * Returns the root element of the canvas.
 * @return {DOMElement} The root element.
 */
xrx.drawing.Drawing.prototype.getCanvas = function() {
  return this.canvas_;
};



/**
 * Returns the background group of the canvas.
 * @return {DOMElement} The element representing the background group.
 */
xrx.drawing.Drawing.prototype.getLayerBackground = function() {
  return this.layer_[0];
};



/**
 * Returns the group of the canvas where shapes are rendered.
 * @return {DOMElement} The element representing the shape group.
 */
xrx.drawing.Drawing.prototype.getLayerShape = function() {
  return this.layer_[1];
};



/**
 * Returns the group of the canvas where shapes can be modified.
 * @return {DOMElement} The element representing the shape modify group.
 */
xrx.drawing.Drawing.prototype.getLayerShapeModify = function() {
  return this.layer_[2];
};



/**
 * Returns the group of the canvas where new shapes can be drawn.
 * @return {DOMElement} The element representing the shape create group.
 */
xrx.drawing.Drawing.prototype.getLayerShapeCreate = function() {
  return this.layer_[3];
};



/**
 * Returns the view-box of the drawing canvas.
 * @return {Object} The view-box.
 */
xrx.drawing.Drawing.prototype.getViewbox = function() {
  return this.viewbox_;
};



/**
 * Whether a point is inside the current view-box.
 * @param {Array.<number>} point The point.
 */
xrx.drawing.Drawing.prototype.isValidPoint = function(point) {
  return point[0] >= this.viewbox_.box.x && point[0] <= this.viewbox_.box.x2 &&
      point[1] >= this.viewbox_.box.y && point[1] <= this.viewbox_.box.y2;
};



/**
 * Whether the bounding box of a shape is inside the current view-box.
 * @param {Object} bbox The bounding box.
 */
xrx.drawing.Drawing.prototype.isValidBBox = function(bbox) {
  return bbox.x >= this.viewbox_.box.x && bbox.x2 <= this.viewbox_.box.x2 &&
      bbox.y >= this.viewbox_.box.y && bbox.y2 <= this.viewbox_.box.y2;
};



xrx.drawing.Drawing.prototype.setBackgroundImage = function(url, callback) {
  var self = this;
  var imageLoader = new goog.net.ImageLoader();
  var tmpImage = goog.dom.createElement('img');
  tmpImage.id = '_tmp';
  tmpImage.src = url;

  goog.events.listen(imageLoader, goog.events.EventType.LOAD, function(e) {

    self.layer_[0].setImage(e.target);
    self.draw();
    if (callback) callback();
  });

  imageLoader.addImage('_tmp', tmpImage);
  imageLoader.start();
};



xrx.drawing.Drawing.prototype.draw = function() {

  if (this.engine_ === xrx.graphics.Engine.CANVAS) {
    var c = this.canvas_.getElement();
    var ctx = c.getContext('2d');
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.beginPath();
    xrx.canvas.setTransform(ctx, this.viewbox_.getCTM());
    this.layer_[0].draw();
    this.layer_[1].draw();
    this.layer_[2].draw();
    this.layer_[3].draw();
    ctx.closePath();
    ctx.restore();
  } else if (this.engine_ === xrx.graphics.Engine.SVG) {
    xrx.svg.setCTM(this.viewbox_.getGroup().getElement(),
        this.viewbox_.getCTM());
  } else if (this.engine_ === xrx.graphics.Engine.VML) {
    xrx.vml.setCTM(this.canvas_.getRaphael(),
        this.viewbox_.getCTM());
    this.viewbox_.getGroup().draw();
  } else {
    throw Error('Unknown engine.');
  }
};



/**
 * @private
 */
xrx.drawing.Drawing.prototype.setMode_ = function(mode) {
  if (mode !== this.mode_) {
    this.mode_ = mode;
    this.registerEvents(mode);
  }
};



/**
 * Switch a canvas over into mode <i>disabled</i>.
 */
xrx.drawing.Drawing.prototype.setModeDisabled = function() {
  this.getLayerBackground().setLocked(true);
  this.getLayerShape().setLocked(true);
  this.getLayerShapeModify().setLocked(true);
  this.getLayerShapeCreate().setLocked(true);
  this.getLayerShapeModify().removeShapes();
  this.getLayerShapeCreate().removeShapes();
  this.setMode_(xrx.drawing.Mode.DISABLED);
};



/**
 * Switch a canvas over into mode <i>view</i> to allow view-box panning
 * zooming and rotating.
 */
xrx.drawing.Drawing.prototype.setModeView = function() {
  this.getLayerBackground().setLocked(false);
  this.getLayerShape().setLocked(true);
  this.getLayerShapeModify().setLocked(true);
  this.getLayerShapeCreate().setLocked(true);
  this.getLayerShapeModify().removeShapes();
  this.getLayerShapeCreate().removeShapes();
  this.setMode_(xrx.drawing.Mode.VIEW);
};



/**
 * Switch the drawing canvas over into mode <i>delete</i> to allow deletion of shapes.
 * @see xrx.drawing.Mode
 */
xrx.drawing.Drawing.prototype.setModeDelete = function() {
  this.getLayerBackground().setLocked(true);
  this.getLayerShape().setLocked(false);
  this.getLayerShapeModify().setLocked(true);
  this.getLayerShapeCreate().setLocked(true);
  this.getLayerShapeModify().removeShapes();
  this.getLayerShapeCreate().removeShapes();
  this.setMode_(xrx.drawing.Mode.DELETE);
};



/**
 * Switch the drawing canvas over into mode <i>modify</i> to allow modification of shapes.
 * @see xrx.drawing.Mode
 */
xrx.drawing.Drawing.prototype.setModeModify = function() {
  this.getLayerBackground().setLocked(true);
  this.getLayerShape().setLocked(false);
  this.getLayerShapeModify().setLocked(false);
  this.getLayerShapeCreate().setLocked(true);
  this.getLayerShapeModify().removeShapes();
  this.getLayerShapeCreate().removeShapes();
  this.setMode_(xrx.drawing.Mode.MODIFY);
};



/**
 * Switch the drawing canvas over into mode <i>create</i> to allow drawing of new shapes.
 * @see xrx.drawing.Mode
 * @param {xrx.shape.Shape} shape The shape to create.
 */
xrx.drawing.Drawing.prototype.setModeCreate = function(shape) {
  this.getLayerBackground().setLocked(true);
  this.getLayerShape().setLocked(true);
  this.getLayerShapeModify().setLocked(true);
  this.getLayerShapeCreate().setLocked(false);
  this.getLayerShapeModify().removeShapes();
  this.getLayerShapeCreate().removeShapes();

  //TODO: move to event handler
  canvas.created_.shape = xrx.shape[shapeCreate];
  if (canvas.drawEvent) goog.events.unlistenByKey(canvas.drawEvent);
  canvas.drawEvent = goog.events.listen(canvas.getLayerShapeCreate().getElement(),
      goog.events.EventType.CLICK,
      function(e) { canvas.created_.shape.handleMouseClick(e, canvas); }
  );
  this.setMode_(xrx.drawing.Mode.CREATE);
};



xrx.drawing.Drawing.prototype.handleResize = function() {
  var size = goog.style.getSize(this.element_);
  this.canvas_.setHeight(size.height);
  this.canvas_.setWidth(size.width);
  this.draw();
};



/**
 * @private
 */
xrx.drawing.Drawing.prototype.installCanvas_ = function() {
  var self = this;
  var size = goog.style.getSize(self.element_);

  var vsm = new goog.dom.ViewportSizeMonitor();
  goog.events.listen(vsm, goog.events.EventType.RESIZE, function(e) {
    self.handleResize();
  }, false, self);

  this.canvas_ = this.getGraphics().Canvas.create(self.element_);
  this.canvas_.setHeight(size.height);
  this.canvas_.setWidth(size.width);
};



/**
 * @private
 */
xrx.drawing.Drawing.prototype.installViewbox_ = function() {
  this.viewbox_ = new xrx.drawing.Viewbox(this);
  this.canvas_.addChild(this.viewbox_.getGroup());
};



/**
 * @private
 */
xrx.drawing.Drawing.prototype.installLayerBackground_ = function() {
  this.layer_[0] = new xrx.drawing.LayerBackground(this);
  this.viewbox_.getGroup().addChildren(this.layer_[0].getGroup());
};



/**
 * @private
 */
xrx.drawing.Drawing.prototype.installLayerShape_ = function() {
  this.layer_[1] = new xrx.drawing.LayerShape(this);
  this.viewbox_.getGroup().addChildren(this.layer_[1].getGroup());
};



/**
 * @private
 */
xrx.drawing.Drawing.prototype.installLayerShapeModify_ = function() {
  this.layer_[2] = new xrx.drawing.LayerShapeModify(this);
  this.viewbox_.getGroup().addChildren(this.layer_[2].getGroup());
};



/**
 * @private
 */
xrx.drawing.Drawing.prototype.installLayerShapeCreate_ = function() {
  this.layer_[3] = new xrx.drawing.LayerShapeCreate(this);
  this.viewbox_.getGroup().addChildren(this.layer_[3].getGroup());
};



/**
 * @private
 */
xrx.drawing.Drawing.prototype.install_ = function() {

  // install the drawing canvas
  this.installCanvas_();

  // install the drawing view-box
  this.installViewbox_();

  // install the drawing layers
  this.installLayerBackground_();
  this.installLayerShape_();
  this.installLayerShapeModify_();
  this.installLayerShapeCreate_();
};
