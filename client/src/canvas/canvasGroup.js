/**
 * @fileoverview A class representing a group of a canvas.
 */

goog.provide('xrx.canvas.Group');



goog.require('goog.dom.DomHelper');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.events.MouseWheelHandler');
goog.require('goog.events.MouseWheelHandler.EventType');
goog.require('xrx.canvas.Shield');
goog.require('xrx.graphics.Graphics');
goog.require('xrx.canvas.GroupHandler');



/**
 * A class representing a group of a canvas. Groups are used to
 * register mouse events mainly.
 *
 * @param {xrx.canvas.Canvas} canvas A canvas object.
 * @constructor
 */
xrx.canvas.Group = function(canvas) {

  this.canvas_ = canvas;

  this.element_;

  this.shapeWrapper_;

  this.shield_;

  this.create_();

  this.registerEvents_();
};



/**
 * Returns the canvas element.
 * @return {xrx.canvas.Canvas}
 */
xrx.canvas.Group.prototype.getCanvas = function() {
  return this.canvas_;
};



/**
 * Returns the DOM element used to install the group.
 * @return {DOMElement} The DOM element.
 */
xrx.canvas.Group.prototype.getElement = function() {
  return this.element_;
};



/**
 * Returns the shield of the group.
 * @return {xrx.canvas.Shield} The shield.
 */
xrx.canvas.Group.prototype.getShield = function() {
  return this.shield_;
};



/**
 * Returns the wrapper element which holds the shapes.
 * @return {DOMElement} The wrapper element.
 */
xrx.canvas.Group.prototype.getShapeWrapper = function() {
  return this.shapeWrapper_;
};



/**
 * Adds shapes to the group.
 * @param {Array.<DOMElement>} shapes The shapes.
 */
xrx.canvas.Group.prototype.addShapes = function(shapes) {
  goog.dom.append(this.getShapeWrapper(), shapes);
};



/**
 * Returns all shapes available in the group.
 * @return {Array.<DOMElement>} The shapes.
 */
xrx.canvas.Group.prototype.getShapes = function() {
  return goog.dom.getChildren(this.getShapeWrapper());
};



/**
 * Removes all shapes from the group;
 */
xrx.canvas.Group.prototype.removeShapes = function() {
  goog.dom.removeChildren(this.getShapeWrapper());
};



/**
 * Removes a shape from the group.
 * @param {DOMElement} shape The shape to remove.
 */
xrx.canvas.Group.prototype.removeShape = function(shape) {
  goog.dom.removeNode(shape);
};



/**
 * Function forwards an event handler.
 * @param {goog.events.BrowserEvent} e The browser event.
 * @param {Object} handlerClass The class which implements the event handler.
 */
xrx.canvas.Group.prototype.handleEvent = function(e, handler) {
  e.preventDefault();
  handler(e, this.getCanvas());
};



/**
 * Register all events for mouse-based shape dragging at once.
 * @param {Object} group A canvas group.
 * @param {Object} handlerClass The class which implements the event handler.
 */
xrx.canvas.Group.prototype.registerMouseDrag = function(group, handlerClass) {
  var self = this;
  goog.events.listen(group,
    [goog.events.EventType.MOUSEDOWN, goog.events.EventType.TOUCHSTART],
    function(e) { self.handleEvent(e, handlerClass.handleMouseDown); }
  );
  goog.events.listen(group,
    [goog.events.EventType.MOUSEMOVE, goog.events.EventType.TOUCHMOVE],
    function(e) { self.handleEvent(e, handlerClass.handleMouseMove); }
  );
  goog.events.listen(group,
    [goog.events.EventType.MOUSEUP, goog.events.EventType.TOUCHEND],
    function(e) { self.handleEvent(e, handlerClass.handleMouseUp); }
  );
};



/**
 * Register all events for mouse-based view-port zoom at once.
 * @param {Object} group A canvas group.
 * @param {Object} handlerClass The class which implements the event handler.
 */
xrx.canvas.Group.prototype.registerMouseZoom = function(group, handlerClass) {
  var self = this;
  var mwh = new goog.events.MouseWheelHandler(group);
  goog.events.listen(mwh,
    goog.events.MouseWheelHandler.EventType.MOUSEWHEEL,
    function(e) { self.handleEvent(e, handlerClass.handleMousewheel); }
  );
};



/**
 * Register all events for view-port rotation at once.
 * @param {Object} group A canvas group.
 * @param {Object} handlerClass The class which implements the event handler.
 */
xrx.canvas.Group.prototype.registerMouseRotate = function(group, handlerClass) {
  var self = this;
  goog.events.listen(group, [goog.events.EventType.DBLCLICK],
    function(e) { self.handleEvent(e, handlerClass.handleDblClick); }
  );
};



/**
 * Register all events for shape deletion at once.
 * @param {Object} group A canvas group.
 * @param {Object} handlerClass The class which implements the event handler.
 */
xrx.canvas.Group.prototype.registerMouseDelete = function(group, handlerClass) {
  var self = this;
  goog.events.listen(group, [goog.events.EventType.CLICK],
    function(e) { self.handleEvent(e, handlerClass.handleClick); }
  );
};



/**
 * @private
 */
xrx.canvas.Group.prototype.create_ = function() {
  var graphics = this.getCanvas().getGraphics();
  this.element_ = graphics.Group.create();
  this.shapeWrapper_ = graphics.Group.create();

  // install a shield
  this.shield_ = new xrx.canvas.Shield(this.canvas_);
  goog.dom.append(this.element_, this.shield_.getElement());

  // install a shape wrapper
  goog.dom.append(this.element_, this.shapeWrapper_);

  return this.element_;
};



/**
 * Abstract method for event registration to be implemented by all subclasses.
 * @private
 */
xrx.canvas.Group.prototype.registerEvents_ = goog.abstractMethod;
