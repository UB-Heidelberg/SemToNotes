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
goog.require('goog.userAgent');
goog.require('xrx.canvas');
goog.require('xrx.drawing');
goog.require('xrx.drawing.EventHandler');
goog.require('xrx.drawing.LayerBackground');
goog.require('xrx.drawing.LayerShape');
goog.require('xrx.drawing.LayerShapeCreate');
goog.require('xrx.drawing.LayerShapeModify');
goog.require('xrx.drawing.LayerTool');
goog.require('xrx.drawing.Mode');
goog.require('xrx.drawing.Modifiable');
goog.require('xrx.drawing.Selectable');
goog.require('xrx.drawing.State');
goog.require('xrx.drawing.Viewbox');
goog.require('xrx.engine');
goog.require('xrx.engine.Engine');
goog.require('xrx.engine.Engines');
goog.require('xrx.shape.Shape');
goog.require('xrx.shape.Shapes');
goog.require('xrx.svg');
goog.require('xrx.vml');



/**
 * A class representing a drawing canvas. The drawing canvas can have a background
 * image and thereby can serve as an image annotation tool.
 *
 * @param {DOMElement} element The HTML element used to install the canvas.
 * @param {string} The name of the rendering engine.
 * @see xrx.engine
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
   * @type {xrx.engine.Canvas}
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
   * @type {?}
   */
  this.shield_;

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
   * The shape currently selected by the user.
   * @type {?}
   * @private
   */
  this.selectable_ = new xrx.drawing.Selectable(this);

  /**
   * The shape currently created by the user.
   * @type {Object}
   * @private
   */
  this.create_;

  /**
   * The view-box of the drawing canvas.
   * @type {Object}
   * @private
   */
  this.viewbox_;

  // install the canvas
  this.install_(opt_engine);
};
goog.inherits(xrx.drawing.Drawing, xrx.drawing.EventHandler);



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
 * @see xrx.engine
 * @return {Object} The rendering engine.
 */
xrx.drawing.Drawing.prototype.getGraphics = function() {
  return this.engine_.getRenderer();
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
 * @return {?} The element representing the shape create group.
 */
xrx.drawing.Drawing.prototype.getLayerShapeCreate = function() {
  return this.layer_[3];
};



xrx.drawing.Drawing.prototype.getLayers = function() {
  return [this.layer_[0], this.layer_[1], this.layer_[2], this.layer_[3]];
};



/**
 * Returns the layer of the canvas where tools can be plugged in.
 * @return {?} The element representing the shape create group.
 */
xrx.drawing.Drawing.prototype.getLayerTool = function() {
  return this.layer_[4];
};



/**
 * Returns the shape currently created by the user.
 * @return {xrx.shape.Shape} The shape.
 */
xrx.drawing.Drawing.prototype.getCreate = function() {
  return this.create_;
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
  var img = this.layer_[0].getImage().getImage();
  if (img && img.src === url) return;
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
  var self = this;
  if (this.engine_.hasRenderer(xrx.engine.CANVAS)) {
    xrx.canvas.render(this.canvas_.getElement(), this.viewbox_.getCTM(),
        function() {
          self.layer_[0].draw();
          self.layer_[1].draw();
          self.layer_[2].draw();
          self.layer_[3].draw();
  });
  } else if (this.engine_.hasRenderer(xrx.engine.SVG)) {
    xrx.svg.render(this.viewbox_.getGroup().getElement(),
        this.viewbox_.getCTM());
  } else if (this.engine_.hasRenderer(xrx.engine.VML)) {
    xrx.vml.render(this.viewbox_.getGroup().getRaphael(),
        this.viewbox_.getCTM());
    this.viewbox_.getGroup().draw();
  } else {
    throw Error('Unknown engine.');
  }
};



/**
 * Returns the mode.
 * @return {number} The mode.
 */
xrx.drawing.Drawing.prototype.getMode = function() {
  return this.mode_;
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
 * shapes.
 */
xrx.drawing.Drawing.prototype.setModeHover = function() {
  this.getLayerBackground().setLocked(false);
  this.getLayerShape().setLocked(true);
  this.getLayerShapeModify().setLocked(true);
  this.getLayerShapeCreate().setLocked(true);
  this.getLayerShapeModify().removeShapes();
  this.getLayerShapeCreate().removeShapes();
  this.setMode_(xrx.drawing.Mode.HOVER);
};



/**
 * Switch the drawing canvas over into mode <i>select</i> to allow selecting
 * shapes.
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
 * @param {string} shape The shape to create.
 */
xrx.drawing.Drawing.prototype.setModeCreate = function(shape) {
  if (!shape) return;
  var self = this;
  this.getLayerBackground().setLocked(true);
  this.getLayerShape().setLocked(true);
  this.getLayerShapeModify().setLocked(true);
  this.getLayerShapeCreate().setLocked(false);
  this.getLayerShapeModify().removeShapes();
  this.getLayerShapeCreate().removeShapes();
  this.create_ = shape instanceof String ? new xrx.shape[shape](this) : shape;
  if (this.drawEvent_) goog.events.unlistenByKey(this.drawEvent_);
  this.drawEvent_ = goog.events.listen(self.canvas_.getElement(),
      xrx.drawing.EventType.DOWN,
      function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (self.mode_ === xrx.drawing.Mode.CREATE) self.create_.handleClick(e);
      },
      true
  );
  this.setMode_(xrx.drawing.Mode.CREATE);
};



xrx.drawing.Drawing.prototype.handleResize = function() {
  this.canvas_.setHeight(this.element_.clientHeight);
  this.canvas_.setWidth(this.element_.clientWidth);
  this.shield_.setHeight(this.element_.clientHeight);
  this.shield_.setWidth(this.element_.clientWidth);
  this.draw();
};



/**
 * @private
 */
xrx.drawing.Drawing.prototype.installCanvas_ = function() {
  var self = this;

  var vsm = new goog.dom.ViewportSizeMonitor();
  goog.events.listen(vsm, goog.events.EventType.RESIZE, function(e) {
    self.handleResize();
  }, false, self);

  this.canvas_ = this.getGraphics().Canvas.create(self.element_);
  this.canvas_.setHeight(this.element_.clientHeight);
  this.canvas_.setWidth(this.element_.clientWidth);
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
xrx.drawing.Drawing.prototype.installShield_ = function() {
  this.shield_ = this.engine_.getRenderer().Rect.create(this.canvas_);
  this.shield_.setX(0);
  this.shield_.setY(0);
  this.shield_.setWidth(this.element_.clientWidth);
  this.shield_.setHeight(this.element_.clientHeight);
  this.shield_.setFillOpacity(0);
  this.shield_.setStrokeWidth(0);
  if (this.shield_.raphael_) { // hack for Raphael rendering
    this.shield_.raphael_.id = 'shield';
  }
  this.canvas_.addChild(this.shield_);
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
xrx.drawing.Drawing.prototype.installFallback_ = function(opt_engine) {
  var span = goog.dom.createElement('span');
  goog.dom.setTextContent(span, 'Your browser does not support ' + opt_engine +
      ' rendering.');
  goog.dom.classes.add(span, 'xrx-canvas-error');
  goog.dom.appendChild(this.element_, span);
};



/**
 * @private
 */
xrx.drawing.Drawing.prototype.initEngine_ = function(opt_engine) {
  this.engine_ = new xrx.engine.Engine(opt_engine);
};



/**
 * @private
 */
xrx.drawing.Drawing.prototype.install_ = function(opt_engine) {

  // initialize the graphics rendering engine
  this.initEngine_(opt_engine);

  if (this.engine_.isAvailable()) {
    // install the drawing canvas
    this.installCanvas_();

    // install the drawing view-box
    this.installViewbox_();

    // install the drawing layers
    this.installLayerBackground_();
    this.installLayerShape_();
    this.installLayerShapeModify_();
    this.installLayerShapeCreate_();

    // install a shield
    this.installShield_();

    // install the tool layer
    this.installLayerTool_();

    if (goog.userAgent.IE && !goog.userAgent.isVersionOrHigher(9)) {
      // IE 7 and IE 8 z-index fix
      var divs = goog.dom.getElementsByTagNameAndClass('div', undefined, this.element_);
      var zIndex = 1000;
      goog.array.forEach(divs, function(e, i, a) {
        goog.style.setStyle(e, 'z-index', zIndex);
        zIndex -= 10;
      })
    };

  } else {
    // install an unavailable message
    this.installFallback_(opt_engine);
  }
};
