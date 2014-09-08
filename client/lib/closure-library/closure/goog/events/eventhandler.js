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
***REMOVED***   Something.base(this);
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
***REMOVED***   Something.base(this, 'disposeInternal');
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
***REMOVED***
goog.require('goog.object');



***REMOVED***
***REMOVED*** Super class for objects that want to easily manage a number of event
***REMOVED*** listeners.  It allows a short cut to listen and also provides a quick way
***REMOVED*** to remove all events listeners belonging to this object.
***REMOVED*** @param {SCOPE=} opt_scope Object in whose scope to call the listeners.
***REMOVED***
***REMOVED*** @extends {goog.Disposable}
***REMOVED*** @template SCOPE
***REMOVED***
goog.events.EventHandler = function(opt_scope) {
  goog.Disposable.call(this);
  // TODO(user): Rename this to this.scope_ and fix the classes in google3
  // that access this private variable. :(
  this.handler_ = opt_scope;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Keys for events that are being listened to.
  ***REMOVED*** @type {!Object.<!goog.events.Key>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.keys_ = {***REMOVED***
***REMOVED***
goog.inherits(goog.events.EventHandler, goog.Disposable);


***REMOVED***
***REMOVED*** Utility array used to unify the cases of listening for an array of types
***REMOVED*** and listening for a single event, without using recursion or allocating
***REMOVED*** an array each time.
***REMOVED*** @type {!Array.<string>}
***REMOVED*** @const
***REMOVED*** @private
***REMOVED***
goog.events.EventHandler.typeArray_ = [];


***REMOVED***
***REMOVED*** Listen to an event on a Listenable.  If the function is omitted then the
***REMOVED*** EventHandler's handleEvent method will be used.
***REMOVED*** @param {goog.events.ListenableType} src Event source.
***REMOVED*** @param {string|Array.<string>|
***REMOVED***     !goog.events.EventId.<EVENTOBJ>|!Array.<!goog.events.EventId.<EVENTOBJ>>}
***REMOVED***     type Event type to listen for or array of event types.
***REMOVED*** @param {function(this:SCOPE, EVENTOBJ):?|{handleEvent:function(?):?}|null=}
***REMOVED***     opt_fn Optional callback function to be used as the listener or an object
***REMOVED***     with handleEvent function.
***REMOVED*** @param {boolean=} opt_capture Optional whether to use capture phase.
***REMOVED*** @return {!goog.events.EventHandler.<SCOPE>} This object, allowing for
***REMOVED***     chaining of calls.
***REMOVED*** @template EVENTOBJ
***REMOVED***
goog.events.EventHandler.prototype.listen = function(
    src, type, opt_fn, opt_capture) {
  return this.listen_(src, type, opt_fn, opt_capture);
***REMOVED***


***REMOVED***
***REMOVED*** Listen to an event on a Listenable.  If the function is omitted then the
***REMOVED*** EventHandler's handleEvent method will be used.
***REMOVED*** @param {goog.events.ListenableType} src Event source.
***REMOVED*** @param {string|Array.<string>|
***REMOVED***     !goog.events.EventId.<EVENTOBJ>|!Array.<!goog.events.EventId.<EVENTOBJ>>}
***REMOVED***     type Event type to listen for or array of event types.
***REMOVED*** @param {function(this:T, EVENTOBJ):?|{handleEvent:function(this:T, ?):?}|
***REMOVED***     null|undefined} fn Optional callback function to be used as the
***REMOVED***     listener or an object with handleEvent function.
***REMOVED*** @param {boolean|undefined} capture Optional whether to use capture phase.
***REMOVED*** @param {T} scope Object in whose scope to call the listener.
***REMOVED*** @return {!goog.events.EventHandler.<SCOPE>} This object, allowing for
***REMOVED***     chaining of calls.
***REMOVED*** @template T,EVENTOBJ
***REMOVED***
goog.events.EventHandler.prototype.listenWithScope = function(
    src, type, fn, capture, scope) {
  // TODO(user): Deprecate this function.
  return this.listen_(src, type, fn, capture, scope);
***REMOVED***


***REMOVED***
***REMOVED*** Listen to an event on a Listenable.  If the function is omitted then the
***REMOVED*** EventHandler's handleEvent method will be used.
***REMOVED*** @param {goog.events.ListenableType} src Event source.
***REMOVED*** @param {string|Array.<string>|
***REMOVED***     !goog.events.EventId.<EVENTOBJ>|!Array.<!goog.events.EventId.<EVENTOBJ>>}
***REMOVED***     type Event type to listen for or array of event types.
***REMOVED*** @param {function(EVENTOBJ):?|{handleEvent:function(?):?}|null=} opt_fn
***REMOVED***     Optional callback function to be used as the listener or an object with
***REMOVED***     handleEvent function.
***REMOVED*** @param {boolean=} opt_capture Optional whether to use capture phase.
***REMOVED*** @param {Object=} opt_scope Object in whose scope to call the listener.
***REMOVED*** @return {!goog.events.EventHandler.<SCOPE>} This object, allowing for
***REMOVED***     chaining of calls.
***REMOVED*** @template EVENTOBJ
***REMOVED*** @private
***REMOVED***
goog.events.EventHandler.prototype.listen_ = function(src, type, opt_fn,
                                                      opt_capture,
                                                      opt_scope) {
  if (!goog.isArray(type)) {
    if (type) {
      goog.events.EventHandler.typeArray_[0] = type.toString();
    }
    type = goog.events.EventHandler.typeArray_;
  }
  for (var i = 0; i < type.length; i++) {
    var listenerObj = goog.events.listen(
        src, type[i], opt_fn || this.handleEvent,
        opt_capture || false,
        opt_scope || this.handler_ || this);

    if (!listenerObj) {
      // When goog.events.listen run on OFF_AND_FAIL or OFF_AND_SILENT
      // (goog.events.CaptureSimulationMode) in IE8-, it will return null
      // value.
      return this;
    }

    var key = listenerObj.key;
    this.keys_[key] = listenerObj;
  }

  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Listen to an event on a Listenable.  If the function is omitted, then the
***REMOVED*** EventHandler's handleEvent method will be used. After the event has fired the
***REMOVED*** event listener is removed from the target. If an array of event types is
***REMOVED*** provided, each event type will be listened to once.
***REMOVED*** @param {goog.events.ListenableType} src Event source.
***REMOVED*** @param {string|Array.<string>|
***REMOVED***     !goog.events.EventId.<EVENTOBJ>|!Array.<!goog.events.EventId.<EVENTOBJ>>}
***REMOVED***     type Event type to listen for or array of event types.
***REMOVED*** @param {function(this:SCOPE, EVENTOBJ):?|{handleEvent:function(?):?}|null=} opt_fn
***REMOVED***    Optional callback function to be used as the listener or an object with
***REMOVED***    handleEvent function.
***REMOVED*** @param {boolean=} opt_capture Optional whether to use capture phase.
***REMOVED*** @return {!goog.events.EventHandler.<SCOPE>} This object, allowing for
***REMOVED***     chaining of calls.
***REMOVED*** @template EVENTOBJ
***REMOVED***
goog.events.EventHandler.prototype.listenOnce = function(
    src, type, opt_fn, opt_capture) {
  // TODO(user): Remove the opt_scope from this function and then
  // templatize it.
  return this.listenOnce_(src, type, opt_fn, opt_capture);
***REMOVED***


***REMOVED***
***REMOVED*** Listen to an event on a Listenable.  If the function is omitted, then the
***REMOVED*** EventHandler's handleEvent method will be used. After the event has fired the
***REMOVED*** event listener is removed from the target. If an array of event types is
***REMOVED*** provided, each event type will be listened to once.
***REMOVED*** @param {goog.events.ListenableType} src Event source.
***REMOVED*** @param {string|Array.<string>|
***REMOVED***     !goog.events.EventId.<EVENTOBJ>|!Array.<!goog.events.EventId.<EVENTOBJ>>}
***REMOVED***     type Event type to listen for or array of event types.
***REMOVED*** @param {function(this:T, EVENTOBJ):?|{handleEvent:function(this:T, ?):?}|
***REMOVED***     null|undefined} fn Optional callback function to be used as the
***REMOVED***     listener or an object with handleEvent function.
***REMOVED*** @param {boolean|undefined} capture Optional whether to use capture phase.
***REMOVED*** @param {T} scope Object in whose scope to call the listener.
***REMOVED*** @return {!goog.events.EventHandler.<SCOPE>} This object, allowing for
***REMOVED***     chaining of calls.
***REMOVED*** @template T,EVENTOBJ
***REMOVED***
goog.events.EventHandler.prototype.listenOnceWithScope = function(
    src, type, fn, capture, scope) {
  // TODO(user): Deprecate this function.
  return this.listenOnce_(src, type, fn, capture, scope);
***REMOVED***


***REMOVED***
***REMOVED*** Listen to an event on a Listenable.  If the function is omitted, then the
***REMOVED*** EventHandler's handleEvent method will be used. After the event has fired
***REMOVED*** the event listener is removed from the target. If an array of event types is
***REMOVED*** provided, each event type will be listened to once.
***REMOVED*** @param {goog.events.ListenableType} src Event source.
***REMOVED*** @param {string|Array.<string>|
***REMOVED***     !goog.events.EventId.<EVENTOBJ>|!Array.<!goog.events.EventId.<EVENTOBJ>>}
***REMOVED***     type Event type to listen for or array of event types.
***REMOVED*** @param {function(EVENTOBJ):?|{handleEvent:function(?):?}|null=} opt_fn
***REMOVED***    Optional callback function to be used as the listener or an object with
***REMOVED***    handleEvent function.
***REMOVED*** @param {boolean=} opt_capture Optional whether to use capture phase.
***REMOVED*** @param {Object=} opt_scope Object in whose scope to call the listener.
***REMOVED*** @return {!goog.events.EventHandler.<SCOPE>} This object, allowing for
***REMOVED***     chaining of calls.
***REMOVED*** @template EVENTOBJ
***REMOVED*** @private
***REMOVED***
goog.events.EventHandler.prototype.listenOnce_ = function(
    src, type, opt_fn, opt_capture, opt_scope) {
  if (goog.isArray(type)) {
    for (var i = 0; i < type.length; i++) {
      this.listenOnce_(src, type[i], opt_fn, opt_capture, opt_scope);
    }
  } else {
    var listenerObj = goog.events.listenOnce(
        src, type, opt_fn || this.handleEvent, opt_capture,
        opt_scope || this.handler_ || this);
    if (!listenerObj) {
      // When goog.events.listen run on OFF_AND_FAIL or OFF_AND_SILENT
      // (goog.events.CaptureSimulationMode) in IE8-, it will return null
      // value.
      return this;
    }

    var key = listenerObj.key;
    this.keys_[key] = listenerObj;
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
***REMOVED*** @param {function(this:SCOPE, ?):?|{handleEvent:function(?):?}|null} listener
***REMOVED***     Callback method, or an object with a handleEvent function.
***REMOVED*** @param {boolean=} opt_capt Whether to fire in capture phase (defaults to
***REMOVED***     false).
***REMOVED*** @return {!goog.events.EventHandler.<SCOPE>} This object, allowing for
***REMOVED***     chaining of calls.
***REMOVED***
goog.events.EventHandler.prototype.listenWithWrapper = function(
    src, wrapper, listener, opt_capt) {
  // TODO(user): Remove the opt_scope from this function and then
  // templatize it.
  return this.listenWithWrapper_(src, wrapper, listener, opt_capt);
***REMOVED***


***REMOVED***
***REMOVED*** Adds an event listener with a specific event wrapper on a DOM Node or an
***REMOVED*** object that has implemented {@link goog.events.EventTarget}. A listener can
***REMOVED*** only be added once to an object.
***REMOVED***
***REMOVED*** @param {EventTarget|goog.events.EventTarget} src The node to listen to
***REMOVED***     events on.
***REMOVED*** @param {goog.events.EventWrapper} wrapper Event wrapper to use.
***REMOVED*** @param {function(this:T, ?):?|{handleEvent:function(this:T, ?):?}|null}
***REMOVED***     listener Optional callback function to be used as the
***REMOVED***     listener or an object with handleEvent function.
***REMOVED*** @param {boolean|undefined} capture Optional whether to use capture phase.
***REMOVED*** @param {T} scope Object in whose scope to call the listener.
***REMOVED*** @return {!goog.events.EventHandler.<SCOPE>} This object, allowing for
***REMOVED***     chaining of calls.
***REMOVED*** @template T
***REMOVED***
goog.events.EventHandler.prototype.listenWithWrapperAndScope = function(
    src, wrapper, listener, capture, scope) {
  // TODO(user): Deprecate this function.
  return this.listenWithWrapper_(src, wrapper, listener, capture, scope);
***REMOVED***


***REMOVED***
***REMOVED*** Adds an event listener with a specific event wrapper on a DOM Node or an
***REMOVED*** object that has implemented {@link goog.events.EventTarget}. A listener can
***REMOVED*** only be added once to an object.
***REMOVED***
***REMOVED*** @param {EventTarget|goog.events.EventTarget} src The node to listen to
***REMOVED***     events on.
***REMOVED*** @param {goog.events.EventWrapper} wrapper Event wrapper to use.
***REMOVED*** @param {function(?):?|{handleEvent:function(?):?}|null} listener Callback
***REMOVED***     method, or an object with a handleEvent function.
***REMOVED*** @param {boolean=} opt_capt Whether to fire in capture phase (defaults to
***REMOVED***     false).
***REMOVED*** @param {Object=} opt_scope Element in whose scope to call the listener.
***REMOVED*** @return {!goog.events.EventHandler.<SCOPE>} This object, allowing for
***REMOVED***     chaining of calls.
***REMOVED*** @private
***REMOVED***
goog.events.EventHandler.prototype.listenWithWrapper_ = function(
    src, wrapper, listener, opt_capt, opt_scope) {
  wrapper.listen(src, listener, opt_capt, opt_scope || this.handler_ || this,
                 this);
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} Number of listeners registered by this handler.
***REMOVED***
goog.events.EventHandler.prototype.getListenerCount = function() {
  var count = 0;
  for (var key in this.keys_) {
    if (Object.prototype.hasOwnProperty.call(this.keys_, key)) {
      count++;
    }
  }
  return count;
***REMOVED***


***REMOVED***
***REMOVED*** Unlistens on an event.
***REMOVED*** @param {goog.events.ListenableType} src Event source.
***REMOVED*** @param {string|Array.<string>|
***REMOVED***     !goog.events.EventId.<EVENTOBJ>|!Array.<!goog.events.EventId.<EVENTOBJ>>}
***REMOVED***     type Event type or array of event types to unlisten to.
***REMOVED*** @param {function(EVENTOBJ):?|{handleEvent:function(?):?}|null=} opt_fn
***REMOVED***     Optional callback function to be used as the listener or an object with
***REMOVED***     handleEvent function.
***REMOVED*** @param {boolean=} opt_capture Optional whether to use capture phase.
***REMOVED*** @param {Object=} opt_scope Object in whose scope to call the listener.
***REMOVED*** @return {!goog.events.EventHandler} This object, allowing for chaining of
***REMOVED***     calls.
***REMOVED*** @template EVENTOBJ
***REMOVED***
goog.events.EventHandler.prototype.unlisten = function(src, type, opt_fn,
                                                       opt_capture,
                                                       opt_scope) {
  if (goog.isArray(type)) {
    for (var i = 0; i < type.length; i++) {
      this.unlisten(src, type[i], opt_fn, opt_capture, opt_scope);
    }
  } else {
    var listener = goog.events.getListener(src, type,
        opt_fn || this.handleEvent,
        opt_capture, opt_scope || this.handler_ || this);

    if (listener) {
      goog.events.unlistenByKey(listener);
      delete this.keys_[listener.key];
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
***REMOVED*** @param {function(?):?|{handleEvent:function(?):?}|null} listener The
***REMOVED***     listener function to remove.
***REMOVED*** @param {boolean=} opt_capt In DOM-compliant browsers, this determines
***REMOVED***     whether the listener is fired during the capture or bubble phase of the
***REMOVED***     event.
***REMOVED*** @param {Object=} opt_scope Element in whose scope to call the listener.
***REMOVED*** @return {!goog.events.EventHandler} This object, allowing for chaining of
***REMOVED***     calls.
***REMOVED***
goog.events.EventHandler.prototype.unlistenWithWrapper = function(src, wrapper,
    listener, opt_capt, opt_scope) {
  wrapper.unlisten(src, listener, opt_capt,
                   opt_scope || this.handler_ || this, this);
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Unlistens to all events.
***REMOVED***
goog.events.EventHandler.prototype.removeAll = function() {
  goog.object.forEach(this.keys_, goog.events.unlistenByKey);
  this.keys_ = {***REMOVED***
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
