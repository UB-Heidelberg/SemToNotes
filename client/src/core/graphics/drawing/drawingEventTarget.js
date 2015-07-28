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
 * It receives events and invokes handler functions in xrx.drawing.EventHandler.
 * @constructor
 */
xrx.event.HandlerTarget = function() {

  goog.base(this);

  this.handler_ = new goog.events.EventHandler(this);

  this.keyClick_;

  this.keyDblClick_;

  this.keyDown_;

  this.keyHover_;

  this.keyMove_;

  this.keyOut_;

  this.keyUp_;

  this.keyWheel_;
};
goog.inherits(xrx.event.HandlerTarget, goog.Disposable);



xrx.event.HandlerTarget.prototype.getHandler = function() {
  return this.handler_;
};



xrx.event.HandlerTarget.prototype.registerEvent_ = function(e, handler, event) {
  // re-initialize the browser event in the case of mobile touch events
  if (e.getBrowserEvent().changedTouches) 
      e.init(e.getBrowserEvent().changedTouches[0], e.currentTarget);
  e.preventDefault();
  e.stopPropagation();
  handler[event](e);
  this.draw();
};



xrx.event.HandlerTarget.prototype.registerClick = function(handler) {
  var self = this;
  if (!this.keyClick_) this.keyClick_ = this.handler_.listen(self.canvas_.getEventTarget(),
    xrx.event.Type.CLICK,
    function(e) { self.registerEvent_(e, handler, xrx.event.Handler.CLICK); },
    true,
    handler
  );
};



xrx.event.HandlerTarget.prototype.registerDblClick = function(handler) {
  var self = this;
  if (!this.keyDblClick_) this.keyDblClick_ = this.handler_.listen(self.canvas_.getEventTarget(),
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
  if (!this.keyDown_) this.keyDown_ = this.handler_.listen(self.canvas_.getEventTarget(),
    xrx.event.Type.DOWN,
    function(e) { self.registerEvent_(e, handler, xrx.event.Handler.DOWN); },
    true,
    handler
  );
};



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
  if (!this.keyMove_) this.keyMove_ = this.handler_.listen(self.canvas_.getEventTarget(),
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
  if (!this.keyHover_) this.keyHover_ = this.handler_.listen(self.canvas_.getEventTarget(),
    xrx.event.Type.MOVE,
    function(e) { self.registerEvent_(e, handler, xrx.event.Handler.MOVE); },
    true,
    handler
  );
};



xrx.event.HandlerTarget.prototype.registerOut = function(handler) {
  var self = this;
  if (!this.keyOut_) this.keyOut_ = this.handler_.listen(self.canvas_.getEventTarget(),
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
  if (!this.keyUp_) this.keyUp_ = this.handler_.listen(self.canvas_.getEventTarget(),
    xrx.event.Type.UP,
    function(e) { self.registerEvent_(e, handler, xrx.event.Handler.UP) },
    true,
    handler
  );
};



xrx.event.HandlerTarget.prototype.registerWheel = function(handler) {
  if (goog.userAgent.MOBILE) return;
  var self = this;
  var mwh = new goog.events.MouseWheelHandler(self.canvas_.getEventTarget());
  if (!this.keyWheel_) this.keyWheel_ = this.handler_.listen(mwh, xrx.event.Type.WHEEL,
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



xrx.event.HandlerTarget.prototype.unregisterAll = function() {
  this.handler_.removeAll();
  this.keyClick_ = null;
  this.keyDblClick_ = null;
  this.keyDown_ = null;
  this.keyHover_ = null;
  this.keyMove_ = null;
  this.keyOut_ = null;
  this.keyUp_ = null;
  this.keyWheel_ = null;
};



xrx.event.HandlerTarget.prototype.registerEvents = function(mode) {
  this.unregisterAll();

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
