/**
 * @fileoverview A class representing a drawing canvas.
 */

goog.provide('xrx.drawing.Drawing');



goog.require('goog.array');
goog.require('goog.dom.DomHelper');
goog.require('goog.dom.ViewportSizeMonitor');
goog.require('xrx.engine.Engine');
goog.require('xrx.engine.Engines');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.net.ImageLoader');
goog.require('goog.style');
goog.require('goog.userAgent');
goog.require('xrx.drawing.Creatable');
goog.require('xrx.drawing.EventHandler');
goog.require('xrx.drawing.Hoverable');
goog.require('xrx.drawing.LayerBackground');
goog.require('xrx.drawing.LayerShape');
goog.require('xrx.drawing.LayerShapeCreate');
goog.require('xrx.drawing.LayerShapeModify');
goog.require('xrx.drawing.LayerTool');
goog.require('xrx.drawing.Mode');
goog.require('xrx.drawing.Modifiable');
goog.require('xrx.drawing.Selectable');
goog.require('xrx.drawing.State');
goog.require('xrx.engine.Engine');
goog.require('xrx.viewbox.Viewbox');
goog.require('xrx.shape');
goog.require('xrx.shape.Shapes');



/**
 * A class representing a drawing canvas. The drawing canvas can have a background
 * image and thereby can serve as an image annotation tool.
 * @param {DOMElement} element The HTML element used to install the canvas.
 * @param {(xrx.engine.Canvas|xrx.engine.SVG|xrx.engine.VML)} opt_engine The
 *   rendering engine type.
 * @constructor
 */
xrx.drawing.Drawing = function(element, opt_engine) {

  goog.base(this);

  /**
   * The DOM element used to install the drawing canvas.
   * @type {DOMElement}
   * @private
   */
  this.element_ = element;

  /**
   * The graphics rendering engine.
   * @type {xrx.engine.Engine}
   * @private
   */
  this.engine_;

  /**
   * The graphics canvas.
   * @type {xrx.shape.Canvas}
   * @private
   */
  this.canvas_;

  /**
   * The layers of the drawing canvas.
   * @type {Array}
   * @private
   */
  this.layer_ = [];

  /**
   * A shield in front of the canvas needed by the SVG and the
   * VML rendering engine for smooth dragging of elements.
   * @type {xrx.shape.Rect}
   * @private
   */
  this.shield_;

  /**
   * @type {number}
   * @private
   */
  this.mode_ = xrx.drawing.Mode.NONE;

  /**
   * The shape currently modified by the user.
   * @type {xrx.drawing.Modifiable}
   * @private
   */
  this.modifiable_ = new xrx.drawing.Modifiable(this);

  /**
   * The shape currently selected by the user.
   * @type {xrx.drawing.Selectable}
   * @private
   */
  this.selectable_ = new xrx.drawing.Selectable(this);

  /**
   * The shape currently hovered by the user.
   * @type {xrx.drawing.Hoverable}
   * @private
   */
  this.hoverable_ = new xrx.drawing.Hoverable(this);

  /**
   * The shape currently created by the user.
   * @type {Object}
   * @private
   */
  this.creatable_ = new xrx.drawing.Creatable(this);

  /**
   * The view-box of the drawing canvas.
   * @type {xrx.viewbox.Viewbox}
   * @private
   */
  this.viewbox_;

  /**
   * The width of this drawing canvas.
   * @type {number}
   * @private
   */
  this.width_;

  /**
   * The height of this drawing canvas.
   * @type {number}
   * @private
   */
  this.height_;

  /**
   * Just for debugging.
   * @private
   */
  this.eventBeforeRendering;

  /**
   * Viewport size monitor. Fires events whenever the size of
   * the browser window changes.
   * @type {goog.dom.VieportSizeMonitor}
   * @private
   */
  this.vsm_;

  /**
   * Timeout function for function draw() to improve performance.
   * @type {function}
   * @private
   */
  this.timeoutDraw_;

  /**
   * Timeout function for function handleResize() to improve performance.
   * @type {function}
   * @private
   */
  this.timeoutResize_;

  // install the canvas
  this.install_(opt_engine);
};
goog.inherits(xrx.drawing.Drawing, xrx.drawing.EventHandler);



/**
 * Event that is thrown whenever a shape is modified.
 * @param {xrx.shape.Shape} shape The shape that was modified.
 * @event
 */
 xrx.drawing.Drawing.prototype.eventShapeModify = function(shape) {};



/**
 * Returns the wrapper element of this drawing canvas.
 * @return {DOMElement} The wrapper.
 */
xrx.drawing.Drawing.prototype.getElement = function() {
  return this.element_;
};



/**
 * Returns the engine used for rendering.
 * @return {xrx.engine.Engine} The engine.
 */
xrx.drawing.Drawing.prototype.getEngine = function() {
  return this.engine_;
};



/**
 * Returns the canvas object of this drawing canvas.
 * @return {xrx.shape.Canvas} The canvas object.
 */
xrx.drawing.Drawing.prototype.getCanvas = function() {
  return this.canvas_;
};



/**
 * Returns the background layer of this drawing canvas.
 * @return {xrx.drawing.LayerBackground} The background layer object.
 */
xrx.drawing.Drawing.prototype.getLayerBackground = function() {
  return this.layer_[0];
};



/**
 * Returns the shape layer of this drawing canvas.
 * @return {xrx.drawing.LayerShape} The shape layer object.
 */
xrx.drawing.Drawing.prototype.getLayerShape = function() {
  return this.layer_[1];
};



/**
 * Returns the layer where shapes can be modified. 
 * @return {xrx.drawing.LayerShapeModify} The shape modify layer object.
 */
xrx.drawing.Drawing.prototype.getLayerShapeModify = function() {
  return this.layer_[3];
};



/**
 * Returns the layer where new shapes can be drawn.
 * @return {xrx.drawing.LayerShapeCreate} The create layer object.
 */
xrx.drawing.Drawing.prototype.getLayerShapeCreate = function() {
  return this.layer_[2];
};



/**
 * Returns the layer where tools can be plugged in.
 * @return {xrx.drawing.LayerTool} The tool layer object.
 */
xrx.drawing.Drawing.prototype.getLayerTool = function() {
  return this.layer_[4];
};



/**
 * Returns the view-box of this drawing canvas.
 * @return {Object} The view-box.
 */
xrx.drawing.Drawing.prototype.getViewbox = function() {
  return this.viewbox_;
};



/**
 * Sets the size of this drawing canvas.
 * @param {number} width The width in pixel.
 * @param {number} height The height in pixel.
 */
xrx.drawing.Drawing.prototype.setSize = function(width, height) {
  goog.style.setSize(this.element_, width + 'px', height + 'px');
  this.handleResize();
};



/**
 * Returns the width of this drawing canvas.
 * @param {number} width The width in pixel.
 */
xrx.drawing.Drawing.prototype.getWidth = function() {
  return this.width_;
};



/**
 * Sets the width of this drawing canvas.
 * @param {number} width The width in pixel.
 */
xrx.drawing.Drawing.prototype.setWidth = function(width) {
  this.setSize(width, this.height_);
};



/**
 * Returns the height of this drawing canvas.
 * @param {number} height The height in pixel.
 */
xrx.drawing.Drawing.prototype.getHeight = function() {
  return this.height_;
};



/**
 * Sets the height of this drawing canvas.
 * @param {number} height The height in pixel.
 */
xrx.drawing.Drawing.prototype.setHeight = function(height) {
  this.setSize(this.width_, height);
};



/**
 * Sets a CSS style for this drawing canvas.
 * @param {string} The style name such as 'padding'.
 * @param {string} The style value such as '20px'.
 */
xrx.drawing.Drawing.prototype.setStyle = function(name, value) {
  goog.style.setStyle(this.element_, name, value);
  this.handleResize();
};



/**
 * Returns the current background image of this drawing canvas.
 * @return {HTMLImage} The background image.
 */
xrx.drawing.Drawing.prototype.getBackgroundImage = function() {
  return this.layer_[0].getImage().getImage();
};



/**
 * Sets a background image to this drawing canvas.
 * @param {string} url The URL of the image.
 * @param {function} opt_callback A callback function that is evaluated after
 *   the image is loaded.
 */
xrx.drawing.Drawing.prototype.setBackgroundImage = function(url, opt_callback) {
  var img = this.layer_[0].getImage();
  if (img && img.src === url) return;
  var self = this;
  var imageLoader = new goog.net.ImageLoader();
  var tmpImage = goog.dom.createElement('img');
  tmpImage.id = '_tmp';
  tmpImage.src = url;
  goog.events.listen(imageLoader, goog.events.EventType.LOAD, function(e) {
    self.layer_[0].setImage(e.target);
    if (opt_callback) opt_callback.apply(self);
    self.draw();
  });
  imageLoader.addImage('_tmp', tmpImage);
  imageLoader.start();
};



/**
 * Adds one or more shapes to this drawing canvas.
 * @param {xrx.shape.Shape} var_args The shapes.
 */
xrx.drawing.Drawing.prototype.addShapes = function(var_args) {
  this.layer_[1].addShapes(goog.array.toArray(arguments));
  this.draw();
};



/**
 * Returns the shapes currently rendered by this drawing canvas.
 * @return {Array<xrx.shape.Shape>} The shapes.
 */
xrx.drawing.Drawing.prototype.getShapes = function() {
  return this.layer_[1].getShapes() || [];
};



xrx.drawing.Drawing.prototype.removeShape = function(shape) {
  this.layer_[1].removeShape(shape);
  this.layer_[3].removeShapes();
  this.draw();
};



xrx.drawing.Drawing.prototype.getSelectedShape = function() {
  if (this.mode_ === xrx.drawing.Mode.SELECT) {
    return this.selectable_.getShape();
  } else if (this.mode_ === xrx.drawing.Mode.MODIFY) {
    return this.modifiable_.getShape();
  }
  return null;
};



/**
 * Draws this canvas and all its layers, tools and shapes contained.
 */
xrx.drawing.Drawing.prototype.draw = function() {
  var self = this;
  var viewbox = this.getViewbox();
  this.eventBeforeRendering = function(element) {
    // apply the current view-box matrix to the view-box group
    if (element === viewbox.getGroup()) {
      element.setCTM(viewbox.getCTM());
    }
    // tell each stylable shape the current scale of the viewbox
    else if (element instanceof xrx.shape.Style) {
      element.setZoomFactor(viewbox.getZoomValue());
    }
    else {};
  };
  goog.dom.getWindow().clearTimeout(this.timeoutDraw_);
  this.timeoutDraw_ = goog.dom.getWindow().setTimeout(function() {
    if (self.eventBeforeDraw) self.eventBeforeDraw();
    self.canvas_.draw();
  });
};



/**
 * Returns the current mode of this drawing canvas.
 * @return {number} The mode.
 */
xrx.drawing.Drawing.prototype.getMode = function() {
  return this.mode_;
};



/**
 * @private
 */
xrx.drawing.Drawing.prototype.setMode_ = function(mode) {
  if (mode !== this.mode_ || mode === xrx.drawing.Mode.CREATE) {
    this.mode_ = mode;
    this.registerEvents(mode);
    this.draw();
  }
};



/**
 * Switch the drawing canvas over into mode <i>disabled</i>.
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
 * Switch the drawing canvas over into mode <i>view</i> to allow view-box panning
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
 * Switch the drawing canvas over into mode <i>hover</i> to allow hovering
 * of shapes.
 * @param {boolean} opt_overlapping Whether to highlight all hovered shapes that
 *   lie on top of each other or just the most forward. opt_overlapping defaults
 *   to false.
 */
xrx.drawing.Drawing.prototype.setModeHover = function(opt_overlapping) {
  this.getLayerBackground().setLocked(true);
  this.getLayerShape().setLocked(false);
  this.getLayerShapeModify().setLocked(true);
  this.getLayerShapeCreate().setLocked(true);
  this.getLayerShapeModify().removeShapes();
  this.getLayerShapeCreate().removeShapes();
  this.hoverable_.setMultiple(opt_overlapping);
  if (opt_overlapping === true) {
    this.setMode_(xrx.drawing.Mode.HOVERMULTIPLE);
  } else {
    this.setMode_(xrx.drawing.Mode.HOVER);
  }
};



/**
 * Switch the drawing canvas over into mode <i>select</i> to allow selecting
 * of shapes.
 */
xrx.drawing.Drawing.prototype.setModeSelect = function() {
  this.getLayerBackground().setLocked(true);
  this.getLayerShape().setLocked(false);
  this.getLayerShapeModify().setLocked(true);
  this.getLayerShapeCreate().setLocked(true);
  this.getLayerShapeModify().removeShapes();
  this.getLayerShapeCreate().removeShapes();
  this.setMode_(xrx.drawing.Mode.SELECT);
};



/**
 * Sets a shape as the selected.
 * @param {xrx.shape.Shape} shape The shape to be selected.
 */
xrx.drawing.Drawing.prototype.setSelected = function(shape) {
  this.selectable_.setSelected(shape);
  this.draw();
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
 * @param {xrx.shape.Creatable} creatable The shape to be created.
 */
xrx.drawing.Drawing.prototype.setModeCreate = function(creatable) {
  if (!creatable) return;
  if (!(creatable instanceof xrx.shape.Creatable)) {
    throw Error('Instance of xrx.shape.Creatable expected.');
  }
  this.creatable_.setShapeCreatable(creatable);
  this.getLayerBackground().setLocked(true);
  this.getLayerShape().setLocked(true);
  this.getLayerShapeModify().setLocked(false);
  this.getLayerShapeCreate().setLocked(false);
  this.getLayerShapeModify().removeShapes();
  this.getLayerShapeCreate().removeShapes();
  this.setMode_(xrx.drawing.Mode.CREATE);
};



/**
 * Handles resizing of this drawing canvas. This function is
 * automatically called whenever the size of the browser window
 * changes. It can be also called by an application that manually
 * changes the size of this drawing canvas during live time.
 */
xrx.drawing.Drawing.prototype.handleResize = function() {
  var self = this;
  goog.dom.getWindow().clearTimeout(this.timeoutResize_);
  this.timeoutResize_ = goog.dom.getWindow().setTimeout(function() {
    self.calculateSize_();
    self.canvas_.setHeight(self.height_);
    self.canvas_.setWidth(self.width_);
    self.shield_.setHeight(self.height_);
    self.shield_.setWidth(self.width_);
  });
  this.draw();
};



/**
 * @private
 */
xrx.drawing.Drawing.prototype.calculateSize_ = function() {
  var size = goog.style.getSize(this.element_);
  var paddingBox = goog.style.getPaddingBox(this.element_);
  var borderBox = goog.style.getBorderBox(this.element_);
  var height = size.height - paddingBox.top - paddingBox.bottom -
      borderBox.top - borderBox.bottom;
  var width = size.width - paddingBox.left - paddingBox.right -
      borderBox.left - borderBox.right;
  this.width_ = width;
  this.height_ = height;
};



/**
 * @private
 */
xrx.drawing.Drawing.prototype.installCanvas_ = function() {
  var self = this;
  this.vsm_ = new goog.dom.ViewportSizeMonitor();
  goog.events.listen(this.vsm_, goog.events.EventType.RESIZE, function(e) {
    self.handleResize();
  }, false, self);
  this.canvas_ = new xrx.shape.Canvas(this);
  this.canvas_.setHeight(this.height_);
  this.canvas_.setWidth(this.width_);
};



/**
 * @private
 */
xrx.drawing.Drawing.prototype.installViewbox_ = function() {
  this.viewbox_ = new xrx.viewbox.Viewbox(this);
  this.canvas_.addChildren(this.viewbox_.getGroup());
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
  this.layer_[3] = new xrx.drawing.LayerShapeModify(this);
  this.viewbox_.getGroup().addChildren(this.layer_[3].getGroup());
};



/**
 * @private
 */
xrx.drawing.Drawing.prototype.installLayerShapecreatable_ = function() {
  this.layer_[2] = new xrx.drawing.LayerShapeCreate(this);
  this.viewbox_.getGroup().addChildren(this.layer_[2].getGroup());
};



/**
 * @private
 */
xrx.drawing.Drawing.prototype.installShield_ = function() {
  this.shield_ = new xrx.shape.Rect(this);
  this.shield_.setX(0);
  this.shield_.setY(0);
  this.shield_.setWidth(this.width_);
  this.shield_.setHeight(this.height_);
  this.shield_.setFillOpacity(0);
  this.shield_.setStrokeWidth(0);
  this.canvas_.addChildren(this.shield_);
};



/**
 * @private
 */
xrx.drawing.Drawing.prototype.installLayerTool_ = function() {
  this.layer_[4] = new xrx.drawing.LayerTool(this);
};



/**
 * @private
 */
xrx.drawing.Drawing.prototype.initEngine_ = function(opt_engine) {
  this.engine_ = new xrx.engine.Engine(opt_engine, this.element_);
};



/**
 * @private
 */
xrx.drawing.Drawing.prototype.install_ = function(opt_engine) {

  // initialize the rendering engine
  this.initEngine_(opt_engine);

  if (this.engine_.isAvailable()) {
    // remove the fall-back message if some exists
    goog.dom.removeChildren(this.element_);

    // calculate the size of the canvas
    this.calculateSize_();

    // install the drawing canvas
    this.installCanvas_();

    // install the drawing view-box
    this.installViewbox_();

    // install the drawing layers
    this.installLayerBackground_();
    this.installLayerShape_();
    this.installLayerShapecreatable_();
    this.installLayerShapeModify_();

    // install a shield
    this.installShield_();

    // install the tool layer
    this.installLayerTool_();
    /*
    if (goog.userAgent.IE && !goog.userAgent.isVersionOrHigher(9)) {
      // IE 7 and IE 8 z-index fix
      var divs = goog.dom.getElementsByTagNameAndClass('div', undefined, this.element_);
      var zIndex = 1000;
      goog.array.forEach(divs, function(e, i, a) {
        goog.style.setStyle(e, 'z-index', zIndex);
        zIndex -= 10;
      })
    };
    */

  }
};



xrx.drawing.Drawing.prototype.disposeInternal = function() {
  goog.dom.removeNode(this.element_);
  this.element_ = null;
  this.engine_.dispose();
  this.engine_ = null;
  this.canvas_.dispose();
  this.canvas_ = null;
  var layer;
  while(layer = this.layer_.pop()) {
    layer.dispose();
    layer = null;
  }
  this.layer_ = null;
  this.shield_.dispose();
  this.shield_ = null;
  this.modifiable_.dispose();
  this.modifiable_ = null;
  this.selectable_.dispose();
  this.selectable_ = null;
  this.hoverable_.dispose();
  this.hoverable_ = null;
  goog.dispose(this.creatable_);
  this.creatable_ = null;
  this.viewbox_.dispose();
  this.viewbox_ = null;
  this.eventBeforeRendering = null;
  this.vsm_.removeAllListeners();
  this.vsm_.dispose();
  this.vsm_ = null;
  this.timeoutDraw_ = null;
  this.timeoutResize_ = null;
  goog.base(this, 'disposeInternal');
};
