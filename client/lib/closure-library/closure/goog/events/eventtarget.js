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
***REMOVED*** @fileoverview A disposable implementation of a custom
***REMOVED*** listenable/event target. See also: documentation for
***REMOVED*** {@code goog.events.Listenable}.
***REMOVED***
***REMOVED*** @author arv@google.com (Erik Arvidsson) [Original implementation]
***REMOVED*** @author pupius@google.com (Daniel Pupius) [Port to use goog.events]
***REMOVED*** @see ../demos/eventtarget.html
***REMOVED*** @see goog.events.Listenable
***REMOVED***

goog.provide('goog.events.EventTarget');

goog.require('goog.Disposable');
goog.require('goog.asserts');
***REMOVED***
goog.require('goog.events.Event');
goog.require('goog.events.Listenable');
goog.require('goog.events.ListenerMap');
goog.require('goog.object');



***REMOVED***
***REMOVED*** An implementation of {@code goog.events.Listenable} with full W3C
***REMOVED*** EventTarget-like support (capture/bubble mechanism, stopping event
***REMOVED*** propagation, preventing default actions).
***REMOVED***
***REMOVED*** You may subclass this class to turn your class into a Listenable.
***REMOVED***
***REMOVED*** Unless propagation is stopped, an event dispatched by an
***REMOVED*** EventTarget will bubble to the parent returned by
***REMOVED*** {@code getParentEventTarget}. To set the parent, call
***REMOVED*** {@code setParentEventTarget}. Subclasses that don't support
***REMOVED*** changing the parent can override the setter to throw an error.
***REMOVED***
***REMOVED*** Example usage:
***REMOVED*** <pre>
***REMOVED***   var source = new goog.events.EventTarget();
***REMOVED***   function handleEvent(e) {
***REMOVED***     alert('Type: ' + e.type + '; Target: ' + e.target);
***REMOVED***   }
***REMOVED***   source.listen('foo', handleEvent);
***REMOVED***   // Or: goog.events.listen(source, 'foo', handleEvent);
***REMOVED***   ...
***REMOVED***   source.dispatchEvent('foo');  // will call handleEvent
***REMOVED***   ...
***REMOVED***   source.unlisten('foo', handleEvent);
***REMOVED***   // Or: goog.events.unlisten(source, 'foo', handleEvent);
***REMOVED*** </pre>
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.Disposable}
***REMOVED*** @implements {goog.events.Listenable}
***REMOVED***
goog.events.EventTarget = function() {
  goog.Disposable.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Maps of event type to an array of listeners.
  ***REMOVED*** @private {!goog.events.ListenerMap}
 ***REMOVED*****REMOVED***
  this.eventTargetListeners_ = new goog.events.ListenerMap(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The object to use for event.target. Useful when mixing in an
  ***REMOVED*** EventTarget to another object.
  ***REMOVED*** @private {!Object}
 ***REMOVED*****REMOVED***
  this.actualEventTarget_ = this;
***REMOVED***
goog.inherits(goog.events.EventTarget, goog.Disposable);
goog.events.Listenable.addImplementation(goog.events.EventTarget);


***REMOVED***
***REMOVED*** An artificial cap on the number of ancestors you can have. This is mainly
***REMOVED*** for loop detection.
***REMOVED*** @const {number}
***REMOVED*** @private
***REMOVED***
goog.events.EventTarget.MAX_ANCESTORS_ = 1000;


***REMOVED***
***REMOVED*** Parent event target, used during event bubbling.
***REMOVED***
***REMOVED*** TODO(user): Change this to goog.events.Listenable. This
***REMOVED*** currently breaks people who expect getParentEventTarget to return
***REMOVED*** goog.events.EventTarget.
***REMOVED***
***REMOVED*** @type {goog.events.EventTarget}
***REMOVED*** @private
***REMOVED***
goog.events.EventTarget.prototype.parentEventTarget_ = null;


***REMOVED***
***REMOVED*** Returns the parent of this event target to use for bubbling.
***REMOVED***
***REMOVED*** @return {goog.events.EventTarget} The parent EventTarget or null if
***REMOVED***     there is no parent.
***REMOVED*** @override
***REMOVED***
goog.events.EventTarget.prototype.getParentEventTarget = function() {
  return this.parentEventTarget_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the parent of this event target to use for capture/bubble
***REMOVED*** mechanism.
***REMOVED*** @param {goog.events.EventTarget} parent Parent listenable (null if none).
***REMOVED***
goog.events.EventTarget.prototype.setParentEventTarget = function(parent) {
  this.parentEventTarget_ = parent;
***REMOVED***


***REMOVED***
***REMOVED*** Adds an event listener to the event target. The same handler can only be
***REMOVED*** added once per the type. Even if you add the same handler multiple times
***REMOVED*** using the same type then it will only be called once when the event is
***REMOVED*** dispatched.
***REMOVED***
***REMOVED*** @param {string} type The type of the event to listen for.
***REMOVED*** @param {function(?):?|{handleEvent:function(?):?}|null} handler The function
***REMOVED***     to handle the event. The handler can also be an object that implements
***REMOVED***     the handleEvent method which takes the event object as argument.
***REMOVED*** @param {boolean=} opt_capture In DOM-compliant browsers, this determines
***REMOVED***     whether the listener is fired during the capture or bubble phase
***REMOVED***     of the event.
***REMOVED*** @param {Object=} opt_handlerScope Object in whose scope to call
***REMOVED***     the listener.
***REMOVED*** @deprecated Use {@code #listen} instead, when possible. Otherwise, use
***REMOVED***     {@code goog.events.listen} if you are passing Object
***REMOVED***     (instead of Function) as handler.
***REMOVED***
goog.events.EventTarget.prototype.addEventListener = function(
    type, handler, opt_capture, opt_handlerScope) {
***REMOVED***this, type, handler, opt_capture, opt_handlerScope);
***REMOVED***


***REMOVED***
***REMOVED*** Removes an event listener from the event target. The handler must be the
***REMOVED*** same object as the one added. If the handler has not been added then
***REMOVED*** nothing is done.
***REMOVED***
***REMOVED*** @param {string} type The type of the event to listen for.
***REMOVED*** @param {function(?):?|{handleEvent:function(?):?}|null} handler The function
***REMOVED***     to handle the event. The handler can also be an object that implements
***REMOVED***     the handleEvent method which takes the event object as argument.
***REMOVED*** @param {boolean=} opt_capture In DOM-compliant browsers, this determines
***REMOVED***     whether the listener is fired during the capture or bubble phase
***REMOVED***     of the event.
***REMOVED*** @param {Object=} opt_handlerScope Object in whose scope to call
***REMOVED***     the listener.
***REMOVED*** @deprecated Use {@code #unlisten} instead, when possible. Otherwise, use
***REMOVED***     {@code goog.events.unlisten} if you are passing Object
***REMOVED***     (instead of Function) as handler.
***REMOVED***
goog.events.EventTarget.prototype.removeEventListener = function(
    type, handler, opt_capture, opt_handlerScope) {
  goog.events.unlisten(this, type, handler, opt_capture, opt_handlerScope);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.events.EventTarget.prototype.dispatchEvent = function(e) {
  this.assertInitialized_();

  var ancestorsTree, ancestor = this.getParentEventTarget();
  if (ancestor) {
    ancestorsTree = [];
    var ancestorCount = 1;
    for (; ancestor; ancestor = ancestor.getParentEventTarget()) {
      ancestorsTree.push(ancestor);
      goog.asserts.assert(
          (++ancestorCount < goog.events.EventTarget.MAX_ANCESTORS_),
          'infinite loop');
    }
  }

  return goog.events.EventTarget.dispatchEventInternal_(
      this.actualEventTarget_, e, ancestorsTree);
***REMOVED***


***REMOVED***
***REMOVED*** Removes listeners from this object.  Classes that extend EventTarget may
***REMOVED*** need to override this method in order to remove references to DOM Elements
***REMOVED*** and additional listeners.
***REMOVED*** @override
***REMOVED***
goog.events.EventTarget.prototype.disposeInternal = function() {
  goog.events.EventTarget.superClass_.disposeInternal.call(this);

  this.removeAllListeners();
  this.parentEventTarget_ = null;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.events.EventTarget.prototype.listen = function(
    type, listener, opt_useCapture, opt_listenerScope) {
  this.assertInitialized_();
  return this.eventTargetListeners_.add(
      String(type), listener, false /* callOnce***REMOVED***, opt_useCapture,
      opt_listenerScope);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.events.EventTarget.prototype.listenOnce = function(
    type, listener, opt_useCapture, opt_listenerScope) {
  return this.eventTargetListeners_.add(
      String(type), listener, true /* callOnce***REMOVED***, opt_useCapture,
      opt_listenerScope);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.events.EventTarget.prototype.unlisten = function(
    type, listener, opt_useCapture, opt_listenerScope) {
  return this.eventTargetListeners_.remove(
      String(type), listener, opt_useCapture, opt_listenerScope);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.events.EventTarget.prototype.unlistenByKey = function(key) {
  return this.eventTargetListeners_.removeByKey(key);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.events.EventTarget.prototype.removeAllListeners = function(opt_type) {
  // TODO(user): Previously, removeAllListeners can be called on
  // uninitialized EventTarget, so we preserve that behavior. We
  // should remove this when usages that rely on that fact are purged.
  if (!this.eventTargetListeners_) {
    return 0;
  }
  return this.eventTargetListeners_.removeAll(opt_type);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.events.EventTarget.prototype.fireListeners = function(
    type, capture, eventObject) {
  // TODO(user): Original code avoids array creation when there
  // is no listener, so we do the same. If this optimization turns
  // out to be not required, we can replace this with
  // getListeners(type, capture) instead, which is simpler.
  var listenerArray = this.eventTargetListeners_.listeners[String(type)];
  if (!listenerArray) {
    return true;
  }
  listenerArray = listenerArray.concat();

  var rv = true;
  for (var i = 0; i < listenerArray.length; ++i) {
    var listener = listenerArray[i];
    // We might not have a listener if the listener was removed.
    if (listener && !listener.removed && listener.capture == capture) {
      var listenerFn = listener.listener;
      var listenerHandler = listener.handler || listener.src;

      if (listener.callOnce) {
        this.unlistenByKey(listener);
      }
      rv = listenerFn.call(listenerHandler, eventObject) !== false && rv;
    }
  }

  return rv && eventObject.returnValue_ != false;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.events.EventTarget.prototype.getListeners = function(type, capture) {
  return this.eventTargetListeners_.getListeners(String(type), capture);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.events.EventTarget.prototype.getListener = function(
    type, listener, capture, opt_listenerScope) {
  return this.eventTargetListeners_.getListener(
      String(type), listener, capture, opt_listenerScope);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.events.EventTarget.prototype.hasListener = function(
    opt_type, opt_capture) {
  var id = goog.isDef(opt_type) ? String(opt_type) : undefined;
  return this.eventTargetListeners_.hasListener(id, opt_capture);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the target to be used for {@code event.target} when firing
***REMOVED*** event. Mainly used for testing. For example, see
***REMOVED*** {@code goog.testing.events.mixinListenable}.
***REMOVED*** @param {!Object} target The target.
***REMOVED***
goog.events.EventTarget.prototype.setTargetForTesting = function(target) {
  this.actualEventTarget_ = target;
***REMOVED***


***REMOVED***
***REMOVED*** Asserts that the event target instance is initialized properly.
***REMOVED*** @private
***REMOVED***
goog.events.EventTarget.prototype.assertInitialized_ = function() {
  goog.asserts.assert(
      this.eventTargetListeners_,
      'Event target is not initialized. Did you call the superclass ' +
      '(goog.events.EventTarget) constructor?');
***REMOVED***


***REMOVED***
***REMOVED*** Dispatches the given event on the ancestorsTree.
***REMOVED***
***REMOVED*** @param {!Object} target The target to dispatch on.
***REMOVED*** @param {goog.events.Event|Object|string} e The event object.
***REMOVED*** @param {Array.<goog.events.Listenable>=} opt_ancestorsTree The ancestors
***REMOVED***     tree of the target, in reverse order from the closest ancestor
***REMOVED***     to the root event target. May be null if the target has no ancestor.
***REMOVED*** @return {boolean} If anyone called preventDefault on the event object (or
***REMOVED***     if any of the listeners returns false) this will also return false.
***REMOVED*** @private
***REMOVED***
goog.events.EventTarget.dispatchEventInternal_ = function(
    target, e, opt_ancestorsTree) {
  var type = e.type ||***REMOVED*****REMOVED*** @type {string}***REMOVED*** (e);

  // If accepting a string or object, create a custom event object so that
  // preventDefault and stopPropagation work with the event.
  if (goog.isString(e)) {
    e = new goog.events.Event(e, target);
  } else if (!(e instanceof goog.events.Event)) {
    var oldEvent = e;
    e = new goog.events.Event(type, target);
    goog.object.extend(e, oldEvent);
  } else {
    e.target = e.target || target;
  }

  var rv = true, currentTarget;

  // Executes all capture listeners on the ancestors, if any.
  if (opt_ancestorsTree) {
    for (var i = opt_ancestorsTree.length - 1; !e.propagationStopped_ && i >= 0;
         i--) {
      currentTarget = e.currentTarget = opt_ancestorsTree[i];
      rv = currentTarget.fireListeners(type, true, e) && rv;
    }
  }

  // Executes capture and bubble listeners on the target.
  if (!e.propagationStopped_) {
    currentTarget = e.currentTarget = target;
    rv = currentTarget.fireListeners(type, true, e) && rv;
    if (!e.propagationStopped_) {
      rv = currentTarget.fireListeners(type, false, e) && rv;
    }
  }

  // Executes all bubble listeners on the ancestors, if any.
  if (opt_ancestorsTree) {
    for (i = 0; !e.propagationStopped_ && i < opt_ancestorsTree.length; i++) {
      currentTarget = e.currentTarget = opt_ancestorsTree[i];
      rv = currentTarget.fireListeners(type, false, e) && rv;
    }
  }

  return rv;
***REMOVED***
