***REMOVED***
***REMOVED*** @fileoverview A class representing a group of a canvas.
***REMOVED***

goog.provide('xrx.canvas.Group');



***REMOVED***
***REMOVED***
***REMOVED***
goog.require('goog.events.MouseWheelHandler');
goog.require('goog.events.MouseWheelHandler.EventType');
goog.require('xrx.canvas.Shield');
goog.require('xrx.graphics.Graphics');
goog.require('xrx.canvas.GroupHandler');



***REMOVED***
***REMOVED*** A class representing a group of a canvas. Groups are used to
***REMOVED*** register mouse events mainly.
***REMOVED***
***REMOVED*** @param {xrx.canvas.Canvas} canvas A canvas object.
***REMOVED***
***REMOVED***
xrx.canvas.Group = function(canvas) {

  this.canvas_ = canvas;

  this.element_;

  this.shapeWrapper_;

  this.shield_;

  this.create_();

  this.registerEvents_();
***REMOVED***



***REMOVED***
***REMOVED*** Returns the canvas element.
***REMOVED*** @return {xrx.canvas.Canvas}
***REMOVED***
xrx.canvas.Group.prototype.getCanvas = function() {
  return this.canvas_;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the DOM element used to install the group.
***REMOVED*** @return {DOMElement} The DOM element.
***REMOVED***
xrx.canvas.Group.prototype.getElement = function() {
  return this.element_;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the shield of the group.
***REMOVED*** @return {xrx.canvas.Shield} The shield.
***REMOVED***
xrx.canvas.Group.prototype.getShield = function() {
  return this.shield_;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the wrapper element which holds the shapes.
***REMOVED*** @return {DOMElement} The wrapper element.
***REMOVED***
xrx.canvas.Group.prototype.getShapeWrapper = function() {
  return this.shapeWrapper_;
***REMOVED***



***REMOVED***
***REMOVED*** Adds shapes to the group.
***REMOVED*** @param {Array.<DOMElement>} shapes The shapes.
***REMOVED***
xrx.canvas.Group.prototype.addShapes = function(shapes) {
  goog.dom.append(this.getShapeWrapper(), shapes);
***REMOVED***



***REMOVED***
***REMOVED*** Returns all shapes available in the group.
***REMOVED*** @return {Array.<DOMElement>} The shapes.
***REMOVED***
xrx.canvas.Group.prototype.getShapes = function() {
  return goog.dom.getChildren(this.getShapeWrapper());
***REMOVED***



***REMOVED***
***REMOVED*** Removes all shapes from the group;
***REMOVED***
xrx.canvas.Group.prototype.removeShapes = function() {
  goog.dom.removeChildren(this.getShapeWrapper());
***REMOVED***



***REMOVED***
***REMOVED*** Removes a shape from the group.
***REMOVED*** @param {DOMElement} shape The shape to remove.
***REMOVED***
xrx.canvas.Group.prototype.removeShape = function(shape) {
  goog.dom.removeNode(shape);
***REMOVED***



***REMOVED***
***REMOVED*** Function forwards an event handler.
***REMOVED*** @param {goog.events.BrowserEvent} e The browser event.
***REMOVED*** @param {Object} handlerClass The class which implements the event handler.
***REMOVED***
xrx.canvas.Group.prototype.handleEvent = function(e, handler) {
  e.preventDefault();
  handler(e, this.getCanvas());
***REMOVED***



***REMOVED***
***REMOVED*** Register all events for mouse-based shape dragging at once.
***REMOVED*** @param {Object} group A canvas group.
***REMOVED*** @param {Object} handlerClass The class which implements the event handler.
***REMOVED***
xrx.canvas.Group.prototype.registerMouseDrag = function(group, handlerClass) {
***REMOVED***
***REMOVED***group,
    [goog.events.EventType.MOUSEDOWN, goog.events.EventType.TOUCHSTART],
    function(e) { self.handleEvent(e, handlerClass.handleMouseDown); }
***REMOVED***
***REMOVED***group,
    [goog.events.EventType.MOUSEMOVE, goog.events.EventType.TOUCHMOVE],
    function(e) { self.handleEvent(e, handlerClass.handleMouseMove); }
***REMOVED***
***REMOVED***group,
    [goog.events.EventType.MOUSEUP, goog.events.EventType.TOUCHEND],
    function(e) { self.handleEvent(e, handlerClass.handleMouseUp); }
***REMOVED***
***REMOVED***



***REMOVED***
***REMOVED*** Register all events for mouse-based view-port zoom at once.
***REMOVED*** @param {Object} group A canvas group.
***REMOVED*** @param {Object} handlerClass The class which implements the event handler.
***REMOVED***
xrx.canvas.Group.prototype.registerMouseZoom = function(group, handlerClass) {
***REMOVED***
  var mwh = new goog.events.MouseWheelHandler(group);
***REMOVED***mwh,
    goog.events.MouseWheelHandler.EventType.MOUSEWHEEL,
    function(e) { self.handleEvent(e, handlerClass.handleMousewheel); }
***REMOVED***
***REMOVED***



***REMOVED***
***REMOVED*** Register all events for view-port rotation at once.
***REMOVED*** @param {Object} group A canvas group.
***REMOVED*** @param {Object} handlerClass The class which implements the event handler.
***REMOVED***
xrx.canvas.Group.prototype.registerMouseRotate = function(group, handlerClass) {
***REMOVED***
***REMOVED***group, [goog.events.EventType.DBLCLICK],
    function(e) { self.handleEvent(e, handlerClass.handleDblClick); }
***REMOVED***
***REMOVED***



***REMOVED***
***REMOVED*** Register all events for shape deletion at once.
***REMOVED*** @param {Object} group A canvas group.
***REMOVED*** @param {Object} handlerClass The class which implements the event handler.
***REMOVED***
xrx.canvas.Group.prototype.registerMouseDelete = function(group, handlerClass) {
***REMOVED***
***REMOVED***group, [goog.events.EventType.CLICK],
    function(e) { self.handleEvent(e, handlerClass.handleClick); }
***REMOVED***
***REMOVED***



***REMOVED***
***REMOVED*** @private
***REMOVED***
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
***REMOVED***



***REMOVED***
***REMOVED*** Abstract method for event registration to be implemented by all subclasses.
***REMOVED*** @private
***REMOVED***
xrx.canvas.Group.prototype.registerEvents_ = goog.abstractMethod;
