/**
 * @fileoverview A class implementing the event target behavior of a
 *     drawing canvas.
 */

goog.provide('xrx.event.HandlerTarget');



goog.require('goog.events');
goog.require('goog.Disposable');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventType');
goog.require('goog.events.MouseWheelHandler');
goog.require('goog.events.MouseWheelHandler.EventType');
goog.require('goog.math');
goog.require('goog.style');
goog.require('goog.userAgent');
goog.require('xrx.event.Handler');
goog.require('xrx.event.Type');
goog.require('xrx.drawing');
goog.require('xrx.drawing.Mode');
goog.require('xrx.shape.Shapes');



/**
 * A class implementing the event target behavior of a drawing canvas.
 * It receives events and invokes handler functions.
 * @constructor
 */
xrx.event.HandlerTarget = function() {

  /**
   * The event handler of this drawing canvas.
   * @type {goog.events.EventHandler}
   */
  this.handler_ = new goog.events.EventHandler(this);
};



/**
 * Returns the event handler of this drawing canvas.
 * @return {goog.events.EventHandler} The event handler.
 */
xrx.event.HandlerTarget.prototype.getHandler = function() {
  return this.handler_;
};



/**
 * @private
 */
xrx.event.HandlerTarget.prototype.registerEvent_ = function(e, handler, event) {
  // re-initialize the browser event in the case of mobile touch events
  if (e.getBrowserEvent().changedTouches) 
      e.init(e.getBrowserEvent().changedTouches[0], e.currentTarget);
  e.preventDefault();
  e.stopPropagation();
  handler[event](e);
  this.draw();
};



/**
 * Function registers a click event which is propagated to a handler object.
 * @param {Object} The handler object.
 */
xrx.event.HandlerTarget.prototype.registerClick = function(handler) {
  var self = this;
  this.handler_.listen(
    self.canvas_.getEngineElement().getEventTarget(),
    xrx.event.Type.CLICK,
    function(e) { self.registerEvent_(e, handler, xrx.event.Handler.CLICK); },
    true,
    handler
  );
};



/**
 * Function registers a double-click event which is propagated to a handler object.
 * @param {Object} The handler object.
 */
xrx.event.HandlerTarget.prototype.registerDblClick = function(handler) {
  var self = this;
  this.handler_.listen(
    self.canvas_.getEngineElement().getEventTarget(),
    xrx.event.Type.DBLCLICK,
    function(e) { self.registerEvent_(e, handler, xrx.event.Handler.DBLCLICK); },
    true,
    handler
  );
};



/**
 * @private
 */
xrx.event.HandlerTarget.prototype.registerDown_ = function(handler) {
  var self = this;
  this.handler_.listen(
    self.canvas_.getEngineElement().getEventTarget(),
    xrx.event.Type.DOWN,
    function(e) { self.registerEvent_(e, handler, xrx.event.Handler.DOWN); },
    true,
    handler
  );
};



/**
 * Function registers a drag event which is propagated to a handler object.
 * @param {Object} The handler object.
 */
xrx.event.HandlerTarget.prototype.registerDrag = function(handler) {
  this.registerDown_(handler);
  this.registerMove_(handler);
  this.registerUp_(handler);
};



/**
 * @private
 */
xrx.event.HandlerTarget.prototype.registerMove_ = function(handler) {
  var self = this;
  this.handler_.listen(
    self.canvas_.getEngineElement().getEventTarget(),
    xrx.event.Type.MOVE,
    function(e) { self.registerEvent_(e, handler, xrx.event.Handler.MOVE); },
    true,
    handler
  );
};



/**
 * @private
 */
xrx.event.HandlerTarget.prototype.registerHover_ = function(handler) {
  var self = this;
  this.handler_.listen(
    self.canvas_.getEngineElement().getEventTarget(),
    xrx.event.Type.MOVE,
    function(e) { self.registerEvent_(e, handler, xrx.event.Handler.MOVE); },
    true,
    handler
  );
};



/**
 * Function registers a mouse out event which is propagated to a handler object.
 * @param {Object} The handler object.
 */
xrx.event.HandlerTarget.prototype.registerOut = function(handler) {
  var self = this;
  this.handler_.listen(
    self.canvas_.getEngineElement().getEventTarget(),
    xrx.event.Type.OUT,
    function(e) { self.registerEvent_(e, handler, xrx.event.Handler.OUT); },
    true,
    handler
  );
};



/**
 * @private
 */
xrx.event.HandlerTarget.prototype.registerUp_ = function(handler) {
  var self = this;
  this.handler_.listen(
    self.canvas_.getEngineElement().getEventTarget(),
    xrx.event.Type.UP,
    function(e) { self.registerEvent_(e, handler, xrx.event.Handler.UP) },
    true,
    handler
  );
};



/**
 * Function registers a wheel event which is propagated to a handler object.
 * @param {Object} The handler object.
 */
xrx.event.HandlerTarget.prototype.registerWheel = function(handler) {
  if (goog.userAgent.MOBILE) return;
  var self = this;
  var mwh = new goog.events.MouseWheelHandler(self.canvas_.getEngineElement().getEventTarget());
  this.handler_.listen(mwh, xrx.event.Type.WHEEL,
    function(e) { self.registerEvent_(e, handler, xrx.event.Handler.WHEEL) },
    true,
    handler
  );
};



/**
 * @override
 */
xrx.event.HandlerTarget.prototype.disposeInternal = function() {
  if (this.handler_) {
    this.handler_.dispose();
    this.handler_ = null;
  }
  goog.base(this, 'disposeInternal');
};



/**
 * Function registers all events necessary for a specific mode of this
 * drawing canvas.
 * @param {string} The mode.
 */
xrx.event.HandlerTarget.prototype.registerEvents = function(mode) {
  this.handler_.removeAll();

  switch(mode) {
  case undefined:
  case xrx.drawing.Mode.DISABLED:
    break;
  case xrx.drawing.Mode.VIEW:
    this.registerDblClick(this.viewbox_);
    this.registerDrag(this.viewbox_);
    this.registerOut(this.viewbox_);
    this.registerWheel(this.viewbox_);
    break;
  case xrx.drawing.Mode.SELECT:
    this.registerClick(this.selectable_);
    this.registerWheel(this.viewbox_);
    break;
  case xrx.drawing.Mode.MODIFY:
    this.registerDrag(this.modifiable_);
    this.registerWheel(this.viewbox_);
    break;
  case xrx.drawing.Mode.DELETE:
    this.registerClick(this.modifiable_);
    this.registerWheel(this.viewbox_);
    break;
  case xrx.drawing.Mode.CREATE:
    this.registerWheel(this.viewbox_);
    break;
  case xrx.drawing.Mode.HOVER:
    this.registerHover_(this.hoverable_);
    this.registerOut(this.hoverable_);
    this.registerWheel(this.viewbox_);
    this.registerDrag(this.viewbox_);
    break;
  default:
    break;
  }
};
