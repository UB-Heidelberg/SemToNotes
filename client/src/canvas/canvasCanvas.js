***REMOVED***
***REMOVED*** @fileoverview A class representing a canvas.
***REMOVED***

goog.provide('xrx.canvas.Canvas');



***REMOVED***
***REMOVED***
***REMOVED***
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



***REMOVED***
***REMOVED*** A class representing a canvas. The canvas can have a background
***REMOVED*** image and thereby can serve as an image annotation tool.
***REMOVED***
***REMOVED*** @param {DOMElement} element The HTML element used to install the canvas.
***REMOVED*** @param {string} The name of the rendering engine.
***REMOVED***
***REMOVED***
xrx.canvas.Canvas = function(element, opt_graphics) {

 ***REMOVED*****REMOVED***
  ***REMOVED*** The graphics engine.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.graphics_ = opt_graphics ||
      goog.getObjectByName('xrx.' + xrx.graphics.Engine.SVG);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The DOM element used to install the canvas.
  ***REMOVED*** @type {DOMElement}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.element_ = element;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The root element of the canvas.
  ***REMOVED*** @type {DOMElement}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.elementCanvas_;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {DOMElement}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.groupBackground_;

  ***REMOVED*****REMOVED***
  ***REMOVED*** @type {DOMElement}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.groupShape_;
  
 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {DOMElement}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.groupShapeModify_;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {DOMElement}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.groupShapeCreate_;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.state = xrx.canvas.State.NONE;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.mode_ = xrx.canvas.Mode.PAN;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The shape currently selected by the user.
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.selected_ = {
    shape: null,
    element: null
 ***REMOVED*****REMOVED***

 ***REMOVED*****REMOVED***
  ***REMOVED*** The shape currently dragged by the user.
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.dragged_ = {
    element: null,
    mousePoint: null,
    coords: null
 ***REMOVED*****REMOVED***

 ***REMOVED*****REMOVED***
  ***REMOVED*** The shape currently created by the user.
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.created_ = {
    shape: null
 ***REMOVED*****REMOVED***

 ***REMOVED*****REMOVED***
  ***REMOVED*** The background image of the canvas.
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
   this.image_ = {
     object: null,
     element: null
  ***REMOVED*****REMOVED***

 ***REMOVED*****REMOVED***
  ***REMOVED*** The view-box of the canvas.
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
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
 ***REMOVED*****REMOVED***

  // install the canvas
  this.install_();
***REMOVED***



***REMOVED***
***REMOVED*** Returns the engine used for rendering.
***REMOVED*** @see xrx.graphics.Engine
***REMOVED*** @return {Object} The rendering engine.
***REMOVED***
xrx.canvas.Canvas.prototype.getGraphics = function() {
  return this.graphics_;
***REMOVED***




***REMOVED***
***REMOVED*** Returns the current state of the canvas.
***REMOVED*** @see xrx.canvas.State
***REMOVED*** @return {number}
***REMOVED***
xrx.canvas.Canvas.prototype.getState = function() {
  return this.state ? this.state : xrx.canvas.State.NONE;
***REMOVED***



***REMOVED***
***REMOVED*** Sets the current state of the canvas.
***REMOVED*** @see xrx.canvas.State
***REMOVED*** @param {number} state The state.
***REMOVED***
xrx.canvas.Canvas.prototype.setState = function(state) {
  state ? this.state = state : this.state = xrx.canvas.State.NONE;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the class of the shape which is currently selected.
***REMOVED*** @return {?}
***REMOVED***
xrx.canvas.Canvas.prototype.getSelectedShape = function() {
  return this.selected_.shape;
***REMOVED***



***REMOVED***
***REMOVED*** Sets the class of a shape as the currently selected.
***REMOVED*** @param {?} shape The rendered shape.
***REMOVED***
xrx.canvas.Canvas.prototype.setSelectedShape = function(shape) {
  this.selected_.shape = shape;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the rendered shape which is currently selected.
***REMOVED*** @return {DOMElement} The rendered shape.
***REMOVED***
xrx.canvas.Canvas.prototype.getSelectedElement = function() {
  return this.selected_.element;
***REMOVED***



***REMOVED***
***REMOVED*** Sets a rendered shape as the currently selected.
***REMOVED*** @param {DOMElement} element The shape element.
***REMOVED***
xrx.canvas.Canvas.prototype.setSelectedElement = function(element) {
  this.selected_.element = element;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the rendered shape which is currently dragged.
***REMOVED*** @return {DOMElement}
***REMOVED***
xrx.canvas.Canvas.prototype.getDragElement = function() {
  return this.dragged_.element;
***REMOVED***



***REMOVED***
***REMOVED*** Sets a rendered shape as the currently dragged.
***REMOVED*** @param {DOMElement} element The element.
***REMOVED***
xrx.canvas.Canvas.prototype.setDragElement = function(element) {
  this.dragged_.element = element;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the mouse point where dragging started.
***REMOVED*** @return {Array.<number>} The mouse point. 
***REMOVED***
xrx.canvas.Canvas.prototype.getDragMousePoint = function() {
  if (!this.dragged_.mousePoint) this.dragged_.mousePoint = new Array(2);

  return this.dragged_.mousePoint;
***REMOVED***



***REMOVED***
***REMOVED*** Keeps the mouse point where dragging started.
***REMOVED*** @param {Array.<number>} point The mouse point. 
***REMOVED***
xrx.canvas.Canvas.prototype.setDragMousePoint = function(point) {
  this.dragged_.mousePoint = point;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the original coordinates of the shape before dragging.
***REMOVED*** @return {Array.<number>} The original coordinates. 
***REMOVED***
xrx.canvas.Canvas.prototype.getDragCoords = function() {
  return this.dragged_.coords;
***REMOVED***



***REMOVED***
***REMOVED*** Keeps the original coordinates of the shape before dragging.
***REMOVED*** @param {Array.<number>} The actual coordinates. 
***REMOVED***
xrx.canvas.Canvas.prototype.setDragCoords = function(coords) {
  this.dragged_.coords = coords;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the wrapper element around the canvas.
***REMOVED*** @return {DOMElement} The wrapper.
***REMOVED***
xrx.canvas.Canvas.prototype.getElement = function() {
  return this.element_;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the root element of the canvas.
***REMOVED*** @return {DOMElement} The root element.
***REMOVED***
xrx.canvas.Canvas.prototype.getElementCanvas = function() {
  return this.elementCanvas_;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the background group of the canvas.
***REMOVED*** @return {DOMElement} The element representing the background group.
***REMOVED***
xrx.canvas.Canvas.prototype.getGroupBackground = function() {
  return this.groupBackground_;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the group of the canvas where shapes are rendered.
***REMOVED*** @return {DOMElement} The element representing the shape group.
***REMOVED***
xrx.canvas.Canvas.prototype.getGroupShape = function() {
  return this.groupShape_;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the group of the canvas where shapes can be modified.
***REMOVED*** @return {DOMElement} The element representing the shape modify group.
***REMOVED***
xrx.canvas.Canvas.prototype.getGroupShapeModify = function() {
  return this.groupShapeModify_;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the group of the canvas where new shapes can be drawn.
***REMOVED*** @return {DOMElement} The element representing the shape create group.
***REMOVED***
xrx.canvas.Canvas.prototype.getGroupShapeCreate = function() {
  return this.groupShapeCreate_;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the DOM element of the background image.
***REMOVED*** @return {DOMElement} The DOM element.
***REMOVED***
xrx.canvas.Canvas.prototype.getImageElement = function() {
  return this.image_.element;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the URL of the current background image.
***REMOVED*** @return {string} The URL.
***REMOVED***
xrx.canvas.Canvas.prototype.getImageUrl = function() {
  return '../data/SachsenspiegelHeidelberg/Bilder-34553-28167-1600.jpg';
***REMOVED***



***REMOVED***
***REMOVED*** Returns the current background image object.
***REMOVED*** @return {Image} The image object. 
***REMOVED***
xrx.canvas.Canvas.prototype.getImage = function() {
  return this.image_.object;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the view-box of the canvas.
***REMOVED*** @return {Object} The view-box.
***REMOVED***
xrx.canvas.Canvas.prototype.getViewBox = function() {
  return this.viewbox_;
***REMOVED***



***REMOVED***
***REMOVED*** Returns all groups of the canvas as an array.
***REMOVED*** @return {Array} The layers.
***REMOVED***
xrx.canvas.Canvas.prototype.getGroups = function() {
  return [this.groupBackground_, this.groupShape_, this.groupShapeModify_,
      this.groupShapeCreate_];
***REMOVED***



***REMOVED***
***REMOVED*** Deactivates all shields of the canvas.
***REMOVED***
xrx.canvas.Canvas.prototype.shieldsDeactivate = function() {
  var groups = this.getGroups();
  for (var i = 0, len = groups.length; i < len; i++) {
    groups[i].getShield().deactivate();
  }
***REMOVED***



***REMOVED***
***REMOVED*** Whether a point is inside the current view-box.
***REMOVED*** @param {Array.<number>} point The point.
***REMOVED***
xrx.canvas.Canvas.prototype.isValidPoint = function(point) {
  return point[0] >= this.viewbox_.box.x && point[0] <= this.viewbox_.box.x2 &&
      point[1] >= this.viewbox_.box.y && point[1] <= this.viewbox_.box.y2;
***REMOVED***



***REMOVED***
***REMOVED*** Whether the bounding box of a shape is inside the current view-box.
***REMOVED*** @param {Object} bbox The bounding box.
***REMOVED***
xrx.canvas.Canvas.prototype.isValidBBox = function(bbox) {
  return bbox.x >= this.viewbox_.box.x && bbox.x2 <= this.viewbox_.box.x2 &&
      bbox.y >= this.viewbox_.box.y && bbox.y2 <= this.viewbox_.box.y2;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the current transformation matrix of the view-port.
***REMOVED*** @return {goog.math.AffineTransform}
***REMOVED***
xrx.canvas.Canvas.prototype.getCTM = function() {
  return this.getGraphics().getCTM(this.getImageElement());
***REMOVED***



***REMOVED***
***REMOVED*** Returns the current transformation matrix of the canvas.
***REMOVED*** @return {goog.math.AffineTransform}
***REMOVED***
xrx.canvas.Canvas.prototype.setCTM = function(matrix) {
  this.getGraphics().setCTM(this.getImageElement(), matrix);
  this.getGraphics().setCTM(this.groupShape_.getElement(), matrix);
  this.getGraphics().setCTM(this.groupShapeModify_.getElement(), matrix);
  this.getGraphics().setCTM(this.groupShapeCreate_.getElement(), matrix);
***REMOVED***



xrx.canvas.Canvas.prototype.setMode = function(mode) {
  this.mode_ = mode;
***REMOVED***



***REMOVED***
***REMOVED*** @private
***REMOVED***
xrx.canvas.Canvas.prototype.installCanvas_ = function(image) {
  this.elementCanvas_ = this.getGraphics().Canvas.create({
    'width': '100%',
    'height': '100%'
  });
  goog.dom.append(this.element_, this.elementCanvas_);
***REMOVED***



***REMOVED***
***REMOVED*** @private
***REMOVED***
xrx.canvas.Canvas.prototype.installGroupBackground_ = function(image) {
  this.groupBackground_ = new xrx.canvas.GroupBackground(this);
  goog.dom.append(this.elementCanvas_, this.groupBackground_.getElement());
***REMOVED***



***REMOVED***
***REMOVED*** @private
***REMOVED***
xrx.canvas.Canvas.prototype.installGroupShape_ = function() {
  this.groupShape_ = new xrx.canvas.GroupShape(this);
  goog.dom.append(this.elementCanvas_, this.groupShape_.getElement());
***REMOVED***



***REMOVED***
***REMOVED*** @private
***REMOVED***
xrx.canvas.Canvas.prototype.installGroupShapeModify_ = function(image) {
  this.groupShapeModify_ = new xrx.canvas.GroupShapeModify(this);
  goog.dom.append(this.elementCanvas_, this.groupShapeModify_.getElement());
***REMOVED***



***REMOVED***
***REMOVED*** @private
***REMOVED***
xrx.canvas.Canvas.prototype.installGroupShapeCreate_ = function(image) {
  this.groupShapeCreate_ = new xrx.canvas.GroupShapeCreate(this);
  goog.dom.append(this.elementCanvas_, this.groupShapeCreate_.getElement());
***REMOVED***



***REMOVED***
***REMOVED*** @private
***REMOVED***
xrx.canvas.Canvas.prototype.install_ = function() {
***REMOVED***
  var imageLoader = new goog.net.ImageLoader();

***REMOVED***imageLoader, goog.events.EventType.LOAD, function(e) {
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
***REMOVED***
