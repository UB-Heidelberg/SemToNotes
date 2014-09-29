// Copyright 2005 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

***REMOVED***
***REMOVED*** @fileoverview Class to create objects which want to handle multiple events
***REMOVED*** and have their listeners easily cleaned up via a dispose method.
***REMOVED***
***REMOVED*** Example:
***REMOVED*** <pre>
***REMOVED*** function Something() {
***REMOVED***   goog.base(this);
***REMOVED***
***REMOVED***   ... set up object ...
***REMOVED***
***REMOVED***   // Add event listeners
***REMOVED***   this.listen(this.starEl, goog.events.EventType.CLICK, this.handleStar);
***REMOVED***   this.listen(this.headerEl, goog.events.EventType.CLICK, this.expand);
***REMOVED***   this.listen(this.collapseEl, goog.events.EventType.CLICK, this.collapse);
***REMOVED***   this.listen(this.infoEl, goog.events.EventType.MOUSEOVER, this.showHover);
***REMOVED***   this.listen(this.infoEl, goog.events.EventType.MOUSEOUT, this.hideHover);
***REMOVED*** }
***REMOVED*** goog.inherits(Something, goog.events.EventHandler);
***REMOVED***
***REMOVED*** Something.prototype.disposeInternal = function() {
***REMOVED***   goog.base(this, 'disposeInternal');
***REMOVED***   goog.dom.removeNode(this.container);
***REMOVED******REMOVED*****REMOVED***
***REMOVED***
***REMOVED***
***REMOVED*** // Then elsewhere:
***REMOVED***
***REMOVED*** var activeSomething = null;
***REMOVED*** function openSomething() {
***REMOVED***   activeSomething = new Something();
***REMOVED*** }
***REMOVED***
***REMOVED*** function closeSomething() {
***REMOVED***   if (activeSomething) {
***REMOVED***     activeSomething.dispose();  // Remove event listeners
***REMOVED***     activeSomething = null;
***REMOVED***   }
***REMOVED*** }
***REMOVED*** </pre>
***REMOVED***
***REMOVED***

goog.provide('goog.events.EventHandler');

goog.require('goog.Disposable');
goog.require('goog.array');
***REMOVED***
goog.require('goog.events.EventWrapper');



***REMOVED***
***REMOVED*** Super class for objects that want to easily manage a number of event
***REMOVED*** listeners.  It allows a short cut to listen and also provides a quick way
***REMOVED*** to remove all events listeners belonging to this object.
***REMOVED*** @param {Object=} opt_handler Object in whose scope to call the listeners.
***REMOVED***
***REMOVED*** @extends {goog.Disposable}
***REMOVED***
goog.events.EventHandler = function(opt_handler) {
  goog.Disposable.call(this);
  this.handler_ = opt_handler;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Keys for events that are being listened to.
  ***REMOVED*** @type {Array.<number>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.keys_ = [];
***REMOVED***
goog.inherits(goog.events.EventHandler, goog.Disposable);


***REMOVED***
***REMOVED*** Utility array used to unify the cases of listening for an array of types
***REMOVED*** and listening for a single event, without using recursion or allocating
***REMOVED*** an array each time.
***REMOVED*** @type {Array.<string>}
***REMOVED*** @private
***REMOVED***
goog.events.EventHandler.typeArray_ = [];


***REMOVED***
***REMOVED*** Listen to an event on a DOM node or EventTarget.  If the function is omitted
***REMOVED*** then the EventHandler's handleEvent method will be used.
***REMOVED*** @param {goog.events.EventTarget|EventTarget} src Event source.
***REMOVED*** @param {string|Array.<string>} type Event type to listen for or array of
***REMOVED***     event types.
***REMOVED*** @param {Function|Object=} opt_fn Optional callback function to be used as the
***REMOVED***    listener or an object with handleEvent function.
***REMOVED*** @param {boolean=} opt_capture Optional whether to use capture phase.
***REMOVED*** @param {Object=} opt_handler Object in whose scope to call the listener.
***REMOVED*** @return {goog.events.EventHandler} This object, allowing for chaining of
***REMOVED***     calls.
***REMOVED***
goog.events.EventHandler.prototype.listen = function(src, type, opt_fn,
                                                     opt_capture,
                                                     opt_handler) {
  if (!goog.isArray(type)) {
    goog.events.EventHandler.typeArray_[0] =***REMOVED*****REMOVED*** @type {string}***REMOVED***(type);
    type = goog.events.EventHandler.typeArray_;
  }
  for (var i = 0; i < type.length; i++) {
    // goog.events.listen generates unique keys so we don't have to check their
    // presence in the this.keys_ array.
    var key =***REMOVED*****REMOVED*** @type {number}***REMOVED*** (
      ***REMOVED***src, type[i], opt_fn || this,
                           opt_capture || false,
                           opt_handler || this.handler_ || this));
    this.keys_.push(key);
  }

  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Listen to an event on a DOM node or EventTarget.  If the function is omitted
***REMOVED*** then the EventHandler's handleEvent method will be used. After the event has
***REMOVED*** fired the event listener is removed from the target. If an array of event
***REMOVED*** types is provided, each event type will be listened to once.
***REMOVED*** @param {goog.events.EventTarget|EventTarget} src Event source.
***REMOVED*** @param {string|Array.<string>} type Event type to listen for or array of
***REMOVED***     event types.
***REMOVED*** @param {Function|Object=} opt_fn Optional callback function to be used as the
***REMOVED***    listener or an object with handleEvent function.
***REMOVED*** @param {boolean=} opt_capture Optional whether to use capture phase.
***REMOVED*** @param {Object=} opt_handler Object in whose scope to call the listener.
***REMOVED*** @return {goog.events.EventHandler} This object, allowing for chaining of
***REMOVED***     calls.
***REMOVED***
goog.events.EventHandler.prototype.listenOnce = function(src, type, opt_fn,
                                                         opt_capture,
                                                         opt_handler) {
  if (goog.isArray(type)) {
    for (var i = 0; i < type.length; i++) {
      this.listenOnce(src, type[i], opt_fn, opt_capture, opt_handler);
    }
  } else {
    var key =***REMOVED*****REMOVED*** @type {number}***REMOVED*** (
        goog.events.listenOnce(src, type, opt_fn || this, opt_capture,
                               opt_handler || this.handler_ || this));
    this.keys_.push(key);
  }

  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Adds an event listener with a specific event wrapper on a DOM Node or an
***REMOVED*** object that has implemented {@link goog.events.EventTarget}. A listener can
***REMOVED*** only be added once to an object.
***REMOVED***
***REMOVED*** @param {EventTarget|goog.events.EventTarget} src The node to listen to
***REMOVED***     events on.
***REMOVED*** @param {goog.events.EventWrapper} wrapper Event wrapper to use.
***REMOVED*** @param {Function|Object} listener Callback method, or an object with a
***REMOVED***     handleEvent function.
***REMOVED*** @param {boolean=} opt_capt Whether to fire in capture phase (defaults to
***REMOVED***     false).
***REMOVED*** @param {Object=} opt_handler Element in whose scope to call the listener.
***REMOVED*** @return {goog.events.EventHandler} This object, allowing for chaining of
***REMOVED***     calls.
***REMOVED***
goog.events.EventHandler.prototype.listenWithWrapper = function(src, wrapper,
    listener, opt_capt, opt_handler) {
  wrapper.listen(src, listener, opt_capt, opt_handler || this.handler_ || this,
                 this);
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} Number of listeners registered by this handler.
***REMOVED***
goog.events.EventHandler.prototype.getListenerCount = function() {
  return this.keys_.length;
***REMOVED***


***REMOVED***
***REMOVED*** Unlistens on an event.
***REMOVED*** @param {goog.events.EventTarget|EventTarget} src Event source.
***REMOVED*** @param {string|Array.<string>} type Event type to listen for.
***REMOVED*** @param {Function|Object=} opt_fn Optional callback function to be used as the
***REMOVED***    listener or an object with handleEvent function.
***REMOVED*** @param {boolean=} opt_capture Optional whether to use capture phase.
***REMOVED*** @param {Object=} opt_handler Object in whose scope to call the listener.
***REMOVED*** @return {goog.events.EventHandler} This object, allowing for chaining of
***REMOVED***     calls.
***REMOVED***
goog.events.EventHandler.prototype.unlisten = function(src, type, opt_fn,
                                                       opt_capture,
                                                       opt_handler) {
  if (goog.isArray(type)) {
    for (var i = 0; i < type.length; i++) {
      this.unlisten(src, type[i], opt_fn, opt_capture, opt_handler);
    }
  } else {
    var listener = goog.events.getListener(src, type, opt_fn || this,
        opt_capture, opt_handler || this.handler_ || this);

    if (listener) {
      var key = listener.key;
      goog.events.unlistenByKey(key);
      goog.array.remove(this.keys_, key);
    }
  }

  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Removes an event listener which was added with listenWithWrapper().
***REMOVED***
***REMOVED*** @param {EventTarget|goog.events.EventTarget} src The target to stop
***REMOVED***     listening to events on.
***REMOVED*** @param {goog.events.EventWrapper} wrapper Event wrapper to use.
***REMOVED*** @param {Function|Object} listener The listener function to remove.
***REMOVED*** @param {boolean=} opt_capt In DOM-compliant browsers, this determines
***REMOVED***     whether the listener is fired during the capture or bubble phase of the
***REMOVED***     event.
***REMOVED*** @param {Object=} opt_handler Element in whose scope to call the listener.
***REMOVED*** @return {goog.events.EventHandler} This object, allowing for chaining of
***REMOVED***     calls.
***REMOVED***
goog.events.EventHandler.prototype.unlistenWithWrapper = function(src, wrapper,
    listener, opt_capt, opt_handler) {
  wrapper.unlisten(src, listener, opt_capt,
                   opt_handler || this.handler_ || this, this);
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Unlistens to all events.
***REMOVED***
goog.events.EventHandler.prototype.removeAll = function() {
  goog.array.forEach(this.keys_, goog.events.unlistenByKey);
  this.keys_.length = 0;
***REMOVED***


***REMOVED***
***REMOVED*** Disposes of this EventHandler and removes all listeners that it registered.
***REMOVED*** @override
***REMOVED*** @protected
***REMOVED***
goog.events.EventHandler.prototype.disposeInternal = function() {
  goog.events.EventHandler.superClass_.disposeInternal.call(this);
  this.removeAll();
***REMOVED***


***REMOVED***
***REMOVED*** Default event handler
***REMOVED*** @param {goog.events.Event} e Event object.
***REMOVED***
goog.events.EventHandler.prototype.handleEvent = function(e) {
  throw Error('EventHandler.handleEvent not implemented');
***REMOVED***
