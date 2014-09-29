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
***REMOVED*** @fileoverview Implementation of EventTarget as defined by W3C DOM 2/3.
***REMOVED***
***REMOVED*** @author arv@google.com (Erik Arvidsson) [Original implementation]
***REMOVED*** @author pupius@google.com (Daniel Pupius) [Port to use goog.events]
***REMOVED*** @see ../demos/eventtarget.html
***REMOVED***

goog.provide('goog.events.EventTarget');

goog.require('goog.Disposable');
***REMOVED***
goog.require('goog.events.Event');
goog.require('goog.events.Listenable');
goog.require('goog.events.Listener');
goog.require('goog.object');



***REMOVED***
***REMOVED*** Inherit from this class to give your object the ability to dispatch events.
***REMOVED*** Note that this class provides event <em>sending</em> behaviour, not event
***REMOVED*** receiving behaviour: your object will be able to broadcast events, and other
***REMOVED*** objects will be able to listen for those events using goog.events.listen().
***REMOVED***
***REMOVED*** <p>The name "EventTarget" reflects the fact that this class implements the
***REMOVED*** <a href="http://www.w3.org/TR/DOM-Level-2-Events/events.html">
***REMOVED*** EventTarget interface</a> as defined by W3C DOM 2/3, with a few differences:
***REMOVED*** <ul>
***REMOVED*** <li>Event objects do not have to implement the Event interface. An object
***REMOVED***     is treated as an event object if it has a 'type' property.
***REMOVED*** <li>You can use a plain string instead of an event object; an event-like
***REMOVED***     object will be created with the 'type' set to the string value.
***REMOVED*** </ul>
***REMOVED***
***REMOVED*** <p>Unless propagation is stopped, an event dispatched by an EventTarget
***REMOVED*** will bubble to the parent returned by <code>getParentEventTarget</code>.
***REMOVED*** To set the parent, call <code>setParentEventTarget</code> or override
***REMOVED*** <code>getParentEventTarget</code> in a subclass.  Subclasses that don't
***REMOVED*** support changing the parent should override the setter to throw an error.
***REMOVED***
***REMOVED*** <p>Example usage:
***REMOVED*** <pre>
***REMOVED***   var source = new goog.events.EventTarget();
***REMOVED***   function handleEvent(event) {
***REMOVED***     alert('Type: ' + e.type + '\nTarget: ' + e.target);
***REMOVED***   }
***REMOVED*** ***REMOVED***source, 'foo', handleEvent);
***REMOVED***   ...
***REMOVED***   source.dispatchEvent({type: 'foo'}); // will call handleEvent
***REMOVED***   // or source.dispatchEvent('foo');
***REMOVED***   ...
***REMOVED***   goog.events.unlisten(source, 'foo', handleEvent);
***REMOVED***
***REMOVED***   // You can also use the Listener interface:
***REMOVED***   var listener = {
***REMOVED***     handleEvent: function(event) {
***REMOVED***       ...
***REMOVED***     }
***REMOVED***  ***REMOVED*****REMOVED***
***REMOVED*** ***REMOVED***source, 'bar', listener);
***REMOVED*** </pre>
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.Disposable}
***REMOVED*** @implements {goog.events.Listenable}
***REMOVED***
goog.events.EventTarget = function() {
  goog.Disposable.call(this);

  if (goog.events.Listenable.USE_LISTENABLE_INTERFACE) {
   ***REMOVED*****REMOVED***
    ***REMOVED*** Maps of event type to an array of listeners.
    ***REMOVED***
    ***REMOVED*** @type {Object.<string, !Array.<!goog.events.ListenableKey>>}
    ***REMOVED*** @private
   ***REMOVED*****REMOVED***
    this.eventTargetListeners_ = {***REMOVED***

   ***REMOVED*****REMOVED***
    ***REMOVED*** Whether the EventTarget has been disposed. This is only true
    ***REMOVED*** when disposeInternal of EventTarget is completed (whereas
    ***REMOVED*** this.isDisposed() is true the moment obj.dispose() is called,
    ***REMOVED*** even before calling its disposeInternal).
    ***REMOVED*** @type {boolean}
    ***REMOVED*** @private
   ***REMOVED*****REMOVED***
    this.reallyDisposed_ = false;

   ***REMOVED*****REMOVED***
    ***REMOVED*** The object to use for event.target. Useful when mixing in an
    ***REMOVED*** EventTarget to another object.
    ***REMOVED*** @type {!Object}
    ***REMOVED*** @private
   ***REMOVED*****REMOVED***
    this.actualEventTarget_ = this;
  }
***REMOVED***
goog.inherits(goog.events.EventTarget, goog.Disposable);


if (goog.events.Listenable.USE_LISTENABLE_INTERFACE) {
  goog.events.Listenable.addImplementation(goog.events.EventTarget);
}


***REMOVED***
***REMOVED*** An artificial cap on the number of ancestors you can have. This is mainly
***REMOVED*** for loop detection.
***REMOVED*** @const {number}
***REMOVED*** @private
***REMOVED***
goog.events.EventTarget.MAX_ANCESTORS_ = 1000;


***REMOVED***
***REMOVED*** Used to tell if an event is a real event in goog.events.listen() so we don't
***REMOVED*** get listen() calling addEventListener() and vice-versa.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.events.EventTarget.prototype.customEvent_ = true;


***REMOVED***
***REMOVED*** Parent event target, used during event bubbling.
***REMOVED*** @type {goog.events.EventTarget?}
***REMOVED*** @private
***REMOVED***
goog.events.EventTarget.prototype.parentEventTarget_ = null;


***REMOVED***
***REMOVED*** Returns the parent of this event target to use for bubbling.
***REMOVED***
***REMOVED*** @return {goog.events.EventTarget} The parent EventTarget or null if there
***REMOVED*** is no parent.
***REMOVED***
goog.events.EventTarget.prototype.getParentEventTarget = function() {
  return this.parentEventTarget_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the parent of this event target to use for bubbling.
***REMOVED***
***REMOVED*** @param {goog.events.EventTarget?} parent Parent EventTarget (null if none).
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
***REMOVED*** Supported for legacy but use goog.events.listen(src, type, handler) instead.
***REMOVED***
***REMOVED*** @param {string} type The type of the event to listen for.
***REMOVED*** @param {Function|Object} handler The function to handle the event. The
***REMOVED***     handler can also be an object that implements the handleEvent method
***REMOVED***     which takes the event object as argument.
***REMOVED*** @param {boolean=} opt_capture In DOM-compliant browsers, this determines
***REMOVED***     whether the listener is fired during the capture or bubble phase
***REMOVED***     of the event.
***REMOVED*** @param {Object=} opt_handlerScope Object in whose scope to call
***REMOVED***     the listener.
***REMOVED***
goog.events.EventTarget.prototype.addEventListener = function(
    type, handler, opt_capture, opt_handlerScope) {
***REMOVED***this, type, handler, opt_capture, opt_handlerScope);
***REMOVED***


***REMOVED***
***REMOVED*** Removes an event listener from the event target. The handler must be the
***REMOVED*** same object as the one added. If the handler has not been added then
***REMOVED*** nothing is done.
***REMOVED*** @param {string} type The type of the event to listen for.
***REMOVED*** @param {Function|Object} handler The function to handle the event. The
***REMOVED***     handler can also be an object that implements the handleEvent method
***REMOVED***     which takes the event object as argument.
***REMOVED*** @param {boolean=} opt_capture In DOM-compliant browsers, this determines
***REMOVED***     whether the listener is fired during the capture or bubble phase
***REMOVED***     of the event.
***REMOVED*** @param {Object=} opt_handlerScope Object in whose scope to call
***REMOVED***     the listener.
***REMOVED***
goog.events.EventTarget.prototype.removeEventListener = function(
    type, handler, opt_capture, opt_handlerScope) {
  goog.events.unlisten(this, type, handler, opt_capture, opt_handlerScope);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.events.EventTarget.prototype.dispatchEvent = function(e) {
  if (goog.events.Listenable.USE_LISTENABLE_INTERFACE) {
    if (this.reallyDisposed_) {
      return true;
    }

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
  } else {
    return goog.events.dispatchEvent(this, e);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Unattach listeners from this object.  Classes that extend EventTarget may
***REMOVED*** need to override this method in order to remove references to DOM Elements
***REMOVED*** and additional listeners, it should be something like this:
***REMOVED*** <pre>
***REMOVED*** MyClass.prototype.disposeInternal = function() {
***REMOVED***   MyClass.superClass_.disposeInternal.call(this);
***REMOVED***   // Dispose logic for MyClass
***REMOVED******REMOVED*****REMOVED***
***REMOVED*** </pre>
***REMOVED*** @override
***REMOVED*** @protected
***REMOVED***
goog.events.EventTarget.prototype.disposeInternal = function() {
  goog.events.EventTarget.superClass_.disposeInternal.call(this);

  if (goog.events.Listenable.USE_LISTENABLE_INTERFACE) {
    this.removeAllListeners();
    this.reallyDisposed_ = true;
  } else {
    goog.events.removeAll(this);
  }

  this.parentEventTarget_ = null;
***REMOVED***


if (goog.events.Listenable.USE_LISTENABLE_INTERFACE) {

***REMOVED*** @override***REMOVED***
goog.events.EventTarget.prototype.listen = function(
    type, listener, opt_useCapture, opt_listenerScope) {
  return this.listenInternal_(
      type, listener, false /* callOnce***REMOVED***, opt_useCapture, opt_listenerScope);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.events.EventTarget.prototype.listenOnce = function(
    type, listener, opt_useCapture, opt_listenerScope) {
  return this.listenInternal_(
      type, listener, true /* callOnce***REMOVED***, opt_useCapture, opt_listenerScope);
***REMOVED***


***REMOVED***
***REMOVED*** Adds an event listener. A listener can only be added once to an
***REMOVED*** object and if it is added again the key for the listener is
***REMOVED*** returned.
***REMOVED***
***REMOVED*** Note that a one-off listener will not change an existing listener,
***REMOVED*** if any. On the other hand a normal listener will change existing
***REMOVED*** one-off listener to become a normal listener.
***REMOVED***
***REMOVED*** @param {string} type Event type to listen to.
***REMOVED*** @param {!Function} listener Callback method.
***REMOVED*** @param {boolean} callOnce Whether the listener is a one-off
***REMOVED***     listener or otherwise.
***REMOVED*** @param {boolean=} opt_useCapture Whether to fire in capture phase
***REMOVED***     (defaults to false).
***REMOVED*** @param {Object=} opt_listenerScope Object in whose scope to call the
***REMOVED***     listener.
***REMOVED*** @return {goog.events.ListenableKey} Unique key for the listener.
***REMOVED*** @private
***REMOVED***
goog.events.EventTarget.prototype.listenInternal_ = function(
    type, listener, callOnce, opt_useCapture, opt_listenerScope) {
  goog.asserts.assert(
      !this.reallyDisposed_, 'Can not listen on disposed object.');

  var listenerArray = this.eventTargetListeners_[type] ||
      (this.eventTargetListeners_[type] = []);

  var listenerObj;
  var index = goog.events.EventTarget.findListenerIndex_(
      listenerArray, listener, opt_useCapture, opt_listenerScope);
  if (index > -1) {
    listenerObj = listenerArray[index];
    if (!callOnce) {
      // Ensure that, if there is an existing callOnce listener, it is no
      // longer a callOnce listener.
      listenerObj.callOnce = false;
    }
    return listenerObj;
  }

  listenerObj = new goog.events.Listener();
  listenerObj.init(
      listener, null, this, type, !!opt_useCapture, opt_listenerScope);
  listenerObj.callOnce = callOnce;
  listenerArray.push(listenerObj);

  return listenerObj;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.events.EventTarget.prototype.unlisten = function(
    type, listener, opt_useCapture, opt_listenerScope) {
  if (!(type in this.eventTargetListeners_)) {
    return false;
  }

  var listenerArray = this.eventTargetListeners_[type];
  var index = goog.events.EventTarget.findListenerIndex_(
      listenerArray, listener, opt_useCapture, opt_listenerScope);
  if (index > -1) {
    var listenerObj = listenerArray[index];
    goog.events.cleanUp(listenerObj);
    listenerObj.removed = true;
    return goog.array.removeAt(listenerArray, index);
  }
  return false;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.events.EventTarget.prototype.unlistenByKey = function(key) {
  var type = key.type;
  if (!(type in this.eventTargetListeners_)) {
    return false;
  }

  var removed = goog.array.remove(this.eventTargetListeners_[type], key);
  if (removed) {
    goog.events.cleanUp(key);
    key.removed = true;
  }
  return removed;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.events.EventTarget.prototype.removeAllListeners = function(
    opt_type, opt_capture) {
  var count = 0;
  for (var type in this.eventTargetListeners_) {
    if (!opt_type || type == opt_type) {
      var listenerArray = this.eventTargetListeners_[type];
      for (var i = 0; i < listenerArray.length; i++) {
        ++count;
        goog.events.cleanUp(listenerArray[i]);
        listenerArray[i].removed = true;
      }
      listenerArray.length = 0;
    }
  }
  return count;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.events.EventTarget.prototype.fireListeners = function(
    type, capture, eventObject) {
  goog.asserts.assert(
      !this.reallyDisposed_,
      'Can not fire listeners after dispose() completed.');

  if (!(type in this.eventTargetListeners_)) {
    return true;
  }

  var rv = true;
  var listenerArray = goog.array.clone(this.eventTargetListeners_[type]);
  for (var i = 0; i < listenerArray.length; ++i) {
    var listener = listenerArray[i];
    // We might not have a listener if the listener was removed.
    if (listener && !listener.removed && listener.capture == capture) {
      // TODO(user): This logic probably should be in the Listener
      // object instead.
      if (listener.callOnce) {
        this.unlistenByKey(listener);
      }
      rv = listener.handleEvent(eventObject) !== false && rv;
    }
  }

  return rv && eventObject.returnValue_ != false;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.events.EventTarget.prototype.getListeners = function(type, capture) {
  var listenerArray = this.eventTargetListeners_[type];
  var rv = [];
  if (listenerArray) {
    for (var i = 0; i < listenerArray.length; ++i) {
      var listenerObj = listenerArray[i];
      if (listenerObj.capture == capture) {
        rv.push(listenerObj);
      }
    }
  }
  return rv;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.events.EventTarget.prototype.getListener = function(
    type, listener, capture, opt_listenerScope) {
  var listenerArray = this.eventTargetListeners_[type];
  var i = -1;
  if (listenerArray) {
    i = goog.events.EventTarget.findListenerIndex_(
        listenerArray, listener, capture, opt_listenerScope);
  }
  return i > -1 ? listenerArray[i] : null;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.events.EventTarget.prototype.hasListener = function(
    opt_type, opt_capture) {
  var hasType = goog.isDef(opt_type);
  var hasCapture = goog.isDef(opt_capture);

  return goog.object.some(
      this.eventTargetListeners_, function(listenersArray, type) {
        for (var i = 0; i < listenersArray.length; ++i) {
          if ((!hasType || listenersArray[i].type == opt_type) &&
              (!hasCapture || listenersArray[i].capture == opt_capture)) {
            return true;
          }
        }

        return false;
      });
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
***REMOVED*** Dispatches the given event on the ancestorsTree.
***REMOVED***
***REMOVED*** TODO(user): Look for a way to reuse this logic in
***REMOVED*** goog.events, if possible.
***REMOVED***
***REMOVED*** @param {!Object} target The target to dispatch on.
***REMOVED*** @param {goog.events.Event|Object|string} e The event object.
***REMOVED*** @param {Array.<goog.events.Listenable>=} opt_ancestorsTree The ancestors
***REMOVED***     tree of the target, in reverse order from the closest ancestor
***REMOVED***     to the root event target. May be null if the target has no ancestor.
***REMOVED*** @return {boolean} If anyone called preventDefault on the event object (or
***REMOVED***     if any of the listeners returns false this will also return false.
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


***REMOVED***
***REMOVED*** Finds the index of a matching goog.events.Listener in the given
***REMOVED*** listenerArray.
***REMOVED*** @param {!Array.<!goog.events.Listener>} listenerArray Array of listener.
***REMOVED*** @param {!Function} listener The listener function.
***REMOVED*** @param {boolean=} opt_useCapture The capture flag for the listener.
***REMOVED*** @param {Object=} opt_listenerScope The listener scope.
***REMOVED*** @return {number} The index of the matching listener within the
***REMOVED***     listenerArray.
***REMOVED*** @private
***REMOVED***
goog.events.EventTarget.findListenerIndex_ = function(
    listenerArray, listener, opt_useCapture, opt_listenerScope) {
  for (var i = 0; i < listenerArray.length; ++i) {
    var listenerObj = listenerArray[i];
    if (listenerObj.listener == listener &&
        listenerObj.capture == !!opt_useCapture &&
        listenerObj.handler == opt_listenerScope) {
      return i;
    }
  }
  return -1;
***REMOVED***

}  // if (goog.events.Listenable.USE_LISTENABLE_INTERFACE)
