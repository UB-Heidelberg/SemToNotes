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
***REMOVED*** @fileoverview An event manager for both native browser event
***REMOVED*** targets and custom JavaScript event targets
***REMOVED*** ({@code goog.events.Listenable}). This provides an abstraction
***REMOVED*** over browsers' event systems.
***REMOVED***
***REMOVED*** It also provides a simulation of W3C event model's capture phase in
***REMOVED*** Internet Explorer (IE 8 and below). Caveat: the simulation does not
***REMOVED*** interact well with listeners registered directly on the elements
***REMOVED*** (bypassing goog.events) or even with listeners registered via
***REMOVED*** goog.events in a separate JS binary. In these cases, we provide
***REMOVED*** no ordering guarantees.
***REMOVED***
***REMOVED*** The listeners will receive a "patched" event object. Such event object
***REMOVED*** contains normalized values for certain event properties that differs in
***REMOVED*** different browsers.
***REMOVED***
***REMOVED*** Example usage:
***REMOVED*** <pre>
***REMOVED*** goog.events.listen(myNode, 'click', function(e) { alert('woo') });
***REMOVED*** goog.events.listen(myNode, 'mouseover', mouseHandler, true);
***REMOVED*** goog.events.unlisten(myNode, 'mouseover', mouseHandler, true);
***REMOVED*** goog.events.removeAll(myNode);
***REMOVED*** </pre>
***REMOVED***
***REMOVED***                                            in IE and event object patching]
***REMOVED***
***REMOVED*** @see ../demos/events.html
***REMOVED*** @see ../demos/event-propagation.html
***REMOVED*** @see ../demos/stopevent.html
***REMOVED***

// IMPLEMENTATION NOTES:
// goog.events stores an auxiliary data structure on each EventTarget
// source being listened on. This allows us to take advantage of GC,
// having the data structure GC'd when the EventTarget is GC'd. This
// GC behavior is equivalent to using W3C DOM Events directly.

goog.provide('goog.events');
goog.provide('goog.events.CaptureSimulationMode');
goog.provide('goog.events.Key');
goog.provide('goog.events.ListenableType');

goog.require('goog.asserts');
goog.require('goog.debug.entryPointRegistry');
goog.require('goog.events.BrowserEvent');
goog.require('goog.events.BrowserFeature');
goog.require('goog.events.Listenable');
goog.require('goog.events.ListenerMap');


***REMOVED***
***REMOVED*** @typedef {number|goog.events.ListenableKey}
***REMOVED***
goog.events.Key;


***REMOVED***
***REMOVED*** @typedef {EventTarget|goog.events.Listenable}
***REMOVED***
goog.events.ListenableType;


***REMOVED***
***REMOVED*** Container for storing event listeners and their proxies
***REMOVED***
***REMOVED*** TODO(user): Remove this when all external usage is
***REMOVED*** purged. goog.events no longer use goog.events.listeners_ for
***REMOVED*** anything meaningful.
***REMOVED***
***REMOVED*** @private {!Object.<goog.events.ListenableKey>}
***REMOVED***
goog.events.listeners_ = {***REMOVED***


***REMOVED***
***REMOVED*** Property name on a native event target for the listener map
***REMOVED*** associated with the event target.
***REMOVED*** @const
***REMOVED*** @private
***REMOVED***
goog.events.LISTENER_MAP_PROP_ = 'closure_lm_' + ((Math.random()***REMOVED*** 1e6) | 0);


***REMOVED***
***REMOVED*** String used to prepend to IE event types.
***REMOVED*** @const
***REMOVED*** @private
***REMOVED***
goog.events.onString_ = 'on';


***REMOVED***
***REMOVED*** Map of computed "on<eventname>" strings for IE event types. Caching
***REMOVED*** this removes an extra object allocation in goog.events.listen which
***REMOVED*** improves IE6 performance.
***REMOVED*** @const
***REMOVED*** @dict
***REMOVED*** @private
***REMOVED***
goog.events.onStringMap_ = {***REMOVED***


***REMOVED***
***REMOVED*** @enum {number} Different capture simulation mode for IE8-.
***REMOVED***
goog.events.CaptureSimulationMode = {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Does not perform capture simulation. Will asserts in IE8- when you
  ***REMOVED*** add capture listeners.
 ***REMOVED*****REMOVED***
  OFF_AND_FAIL: 0,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Does not perform capture simulation, silently ignore capture
  ***REMOVED*** listeners.
 ***REMOVED*****REMOVED***
  OFF_AND_SILENT: 1,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Performs capture simulation.
 ***REMOVED*****REMOVED***
  ON: 2
***REMOVED***


***REMOVED***
***REMOVED*** @define {number} The capture simulation mode for IE8-. By default,
***REMOVED***     this is ON.
***REMOVED***
goog.define('goog.events.CAPTURE_SIMULATION_MODE', 2);


***REMOVED***
***REMOVED*** Estimated count of total native listeners.
***REMOVED*** @private {number}
***REMOVED***
goog.events.listenerCountEstimate_ = 0;


***REMOVED***
***REMOVED*** Adds an event listener for a specific event on a native event
***REMOVED*** target (such as a DOM element) or an object that has implemented
***REMOVED*** {@link goog.events.Listenable}. A listener can only be added once
***REMOVED*** to an object and if it is added again the key for the listener is
***REMOVED*** returned. Note that if the existing listener is a one-off listener
***REMOVED*** (registered via listenOnce), it will no longer be a one-off
***REMOVED*** listener after a call to listen().
***REMOVED***
***REMOVED*** @param {EventTarget|goog.events.Listenable} src The node to listen
***REMOVED***     to events on.
***REMOVED*** @param {string|Array.<string>|
***REMOVED***     !goog.events.EventId.<EVENTOBJ>|!Array.<!goog.events.EventId.<EVENTOBJ>>}
***REMOVED***     type Event type or array of event types.
***REMOVED*** @param {function(this:T, EVENTOBJ):?|{handleEvent:function(?):?}|null}
***REMOVED***     listener Callback method, or an object with a handleEvent function.
***REMOVED***     WARNING: passing an Object is now softly deprecated.
***REMOVED*** @param {boolean=} opt_capt Whether to fire in capture phase (defaults to
***REMOVED***     false).
***REMOVED*** @param {T=} opt_handler Element in whose scope to call the listener.
***REMOVED*** @return {goog.events.Key} Unique key for the listener.
***REMOVED*** @template T,EVENTOBJ
***REMOVED***
goog.events.listen = function(src, type, listener, opt_capt, opt_handler) {
  if (goog.isArray(type)) {
    for (var i = 0; i < type.length; i++) {
    ***REMOVED***src, type[i], listener, opt_capt, opt_handler);
    }
    return null;
  }

  listener = goog.events.wrapListener(listener);
  if (goog.events.Listenable.isImplementedBy(src)) {
    return src.listen(
       ***REMOVED*****REMOVED*** @type {string|!goog.events.EventId}***REMOVED*** (type),
        listener, opt_capt, opt_handler);
  } else {
    return goog.events.listen_(
       ***REMOVED*****REMOVED*** @type {EventTarget}***REMOVED*** (src),
       ***REMOVED*****REMOVED*** @type {string|!goog.events.EventId}***REMOVED*** (type),
        listener, /* callOnce***REMOVED*** false, opt_capt, opt_handler);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Adds an event listener for a specific event on a native event
***REMOVED*** target. A listener can only be added once to an object and if it
***REMOVED*** is added again the key for the listener is returned.
***REMOVED***
***REMOVED*** Note that a one-off listener will not change an existing listener,
***REMOVED*** if any. On the other hand a normal listener will change existing
***REMOVED*** one-off listener to become a normal listener.
***REMOVED***
***REMOVED*** @param {EventTarget} src The node to listen to events on.
***REMOVED*** @param {string|!goog.events.EventId} type Event type.
***REMOVED*** @param {!Function} listener Callback function.
***REMOVED*** @param {boolean} callOnce Whether the listener is a one-off
***REMOVED***     listener or otherwise.
***REMOVED*** @param {boolean=} opt_capt Whether to fire in capture phase (defaults to
***REMOVED***     false).
***REMOVED*** @param {Object=} opt_handler Element in whose scope to call the listener.
***REMOVED*** @return {goog.events.ListenableKey} Unique key for the listener.
***REMOVED*** @private
***REMOVED***
goog.events.listen_ = function(
    src, type, listener, callOnce, opt_capt, opt_handler) {
  if (!type) {
    throw Error('Invalid event type');
  }

  var capture = !!opt_capt;
  if (capture && !goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT) {
    if (goog.events.CAPTURE_SIMULATION_MODE ==
        goog.events.CaptureSimulationMode.OFF_AND_FAIL) {
      goog.asserts.fail('Can not register capture listener in IE8-.');
      return null;
    } else if (goog.events.CAPTURE_SIMULATION_MODE ==
        goog.events.CaptureSimulationMode.OFF_AND_SILENT) {
      return null;
    }
  }

  var listenerMap = goog.events.getListenerMap_(src);
  if (!listenerMap) {
    src[goog.events.LISTENER_MAP_PROP_] = listenerMap =
        new goog.events.ListenerMap(src);
  }

  var listenerObj = listenerMap.add(
      type, listener, callOnce, opt_capt, opt_handler);

  // If the listenerObj already has a proxy, it has been set up
  // previously. We simply return.
  if (listenerObj.proxy) {
    return listenerObj;
  }

  var proxy = goog.events.getProxy();
  listenerObj.proxy = proxy;

  proxy.src = src;
  proxy.listener = listenerObj;

  // Attach the proxy through the browser's API
  if (src.addEventListener) {
    src.addEventListener(type.toString(), proxy, capture);
  } else {
    // The else above used to be else if (src.attachEvent) and then there was
    // another else statement that threw an exception warning the developer
    // they made a mistake. This resulted in an extra object allocation in IE6
    // due to a wrapper object that had to be implemented around the element
    // and so was removed.
    src.attachEvent(goog.events.getOnString_(type.toString()), proxy);
  }

  goog.events.listenerCountEstimate_++;
  return listenerObj;
***REMOVED***


***REMOVED***
***REMOVED*** Helper function for returning a proxy function.
***REMOVED*** @return {!Function} A new or reused function object.
***REMOVED***
goog.events.getProxy = function() {
  var proxyCallbackFunction = goog.events.handleBrowserEvent_;
  // Use a local var f to prevent one allocation.
  var f = goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT ?
      function(eventObject) {
        return proxyCallbackFunction.call(f.src, f.listener, eventObject);
      } :
      function(eventObject) {
        var v = proxyCallbackFunction.call(f.src, f.listener, eventObject);
        // NOTE(user): In IE, we hack in a capture phase. However, if
        // there is inline event handler which tries to prevent default (for
        // example <a href="..." onclick="return false">...</a>) in a
        // descendant element, the prevent default will be overridden
        // by this listener if this listener were to return true. Hence, we
        // return undefined.
        if (!v) return v;
     ***REMOVED*****REMOVED***
  return f;
***REMOVED***


***REMOVED***
***REMOVED*** Adds an event listener for a specific event on a native event
***REMOVED*** target (such as a DOM element) or an object that has implemented
***REMOVED*** {@link goog.events.Listenable}. After the event has fired the event
***REMOVED*** listener is removed from the target.
***REMOVED***
***REMOVED*** If an existing listener already exists, listenOnce will do
***REMOVED*** nothing. In particular, if the listener was previously registered
***REMOVED*** via listen(), listenOnce() will not turn the listener into a
***REMOVED*** one-off listener. Similarly, if there is already an existing
***REMOVED*** one-off listener, listenOnce does not modify the listeners (it is
***REMOVED*** still a once listener).
***REMOVED***
***REMOVED*** @param {EventTarget|goog.events.Listenable} src The node to listen
***REMOVED***     to events on.
***REMOVED*** @param {string|Array.<string>|
***REMOVED***     !goog.events.EventId.<EVENTOBJ>|!Array.<!goog.events.EventId.<EVENTOBJ>>}
***REMOVED***     type Event type or array of event types.
***REMOVED*** @param {function(this:T, EVENTOBJ):?|{handleEvent:function(?):?}|null}
***REMOVED***     listener Callback method.
***REMOVED*** @param {boolean=} opt_capt Fire in capture phase?.
***REMOVED*** @param {T=} opt_handler Element in whose scope to call the listener.
***REMOVED*** @return {goog.events.Key} Unique key for the listener.
***REMOVED*** @template T,EVENTOBJ
***REMOVED***
goog.events.listenOnce = function(src, type, listener, opt_capt, opt_handler) {
  if (goog.isArray(type)) {
    for (var i = 0; i < type.length; i++) {
      goog.events.listenOnce(src, type[i], listener, opt_capt, opt_handler);
    }
    return null;
  }

  listener = goog.events.wrapListener(listener);
  if (goog.events.Listenable.isImplementedBy(src)) {
    return src.listenOnce(
       ***REMOVED*****REMOVED*** @type {string|!goog.events.EventId}***REMOVED*** (type),
        listener, opt_capt, opt_handler);
  } else {
    return goog.events.listen_(
       ***REMOVED*****REMOVED*** @type {EventTarget}***REMOVED*** (src),
       ***REMOVED*****REMOVED*** @type {string|!goog.events.EventId}***REMOVED*** (type),
        listener, /* callOnce***REMOVED*** true, opt_capt, opt_handler);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Adds an event listener with a specific event wrapper on a DOM Node or an
***REMOVED*** object that has implemented {@link goog.events.Listenable}. A listener can
***REMOVED*** only be added once to an object.
***REMOVED***
***REMOVED*** @param {EventTarget|goog.events.Listenable} src The target to
***REMOVED***     listen to events on.
***REMOVED*** @param {goog.events.EventWrapper} wrapper Event wrapper to use.
***REMOVED*** @param {function(this:T, ?):?|{handleEvent:function(?):?}|null} listener
***REMOVED***     Callback method, or an object with a handleEvent function.
***REMOVED*** @param {boolean=} opt_capt Whether to fire in capture phase (defaults to
***REMOVED***     false).
***REMOVED*** @param {T=} opt_handler Element in whose scope to call the listener.
***REMOVED*** @template T
***REMOVED***
goog.events.listenWithWrapper = function(src, wrapper, listener, opt_capt,
    opt_handler) {
  wrapper.listen(src, listener, opt_capt, opt_handler);
***REMOVED***


***REMOVED***
***REMOVED*** Removes an event listener which was added with listen().
***REMOVED***
***REMOVED*** @param {EventTarget|goog.events.Listenable} src The target to stop
***REMOVED***     listening to events on.
***REMOVED*** @param {string|Array.<string>|
***REMOVED***     !goog.events.EventId.<EVENTOBJ>|!Array.<!goog.events.EventId.<EVENTOBJ>>}
***REMOVED***     type Event type or array of event types to unlisten to.
***REMOVED*** @param {function(?):?|{handleEvent:function(?):?}|null} listener The
***REMOVED***     listener function to remove.
***REMOVED*** @param {boolean=} opt_capt In DOM-compliant browsers, this determines
***REMOVED***     whether the listener is fired during the capture or bubble phase of the
***REMOVED***     event.
***REMOVED*** @param {Object=} opt_handler Element in whose scope to call the listener.
***REMOVED*** @return {?boolean} indicating whether the listener was there to remove.
***REMOVED*** @template EVENTOBJ
***REMOVED***
goog.events.unlisten = function(src, type, listener, opt_capt, opt_handler) {
  if (goog.isArray(type)) {
    for (var i = 0; i < type.length; i++) {
      goog.events.unlisten(src, type[i], listener, opt_capt, opt_handler);
    }
    return null;
  }

  listener = goog.events.wrapListener(listener);
  if (goog.events.Listenable.isImplementedBy(src)) {
    return src.unlisten(
       ***REMOVED*****REMOVED*** @type {string|!goog.events.EventId}***REMOVED*** (type),
        listener, opt_capt, opt_handler);
  }

  if (!src) {
    // TODO(user): We should tighten the API to only accept
    // non-null objects, or add an assertion here.
    return false;
  }

  var capture = !!opt_capt;
  var listenerMap = goog.events.getListenerMap_(
     ***REMOVED*****REMOVED*** @type {EventTarget}***REMOVED*** (src));
  if (listenerMap) {
    var listenerObj = listenerMap.getListener(
       ***REMOVED*****REMOVED*** @type {string|!goog.events.EventId}***REMOVED*** (type),
        listener, capture, opt_handler);
    if (listenerObj) {
      return goog.events.unlistenByKey(listenerObj);
    }
  }

  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Removes an event listener which was added with listen() by the key
***REMOVED*** returned by listen().
***REMOVED***
***REMOVED*** @param {goog.events.Key} key The key returned by listen() for this
***REMOVED***     event listener.
***REMOVED*** @return {boolean} indicating whether the listener was there to remove.
***REMOVED***
goog.events.unlistenByKey = function(key) {
  // TODO(user): Remove this check when tests that rely on this
  // are fixed.
  if (goog.isNumber(key)) {
    return false;
  }

  var listener =***REMOVED*****REMOVED*** @type {goog.events.ListenableKey}***REMOVED*** (key);
  if (!listener || listener.removed) {
    return false;
  }

  var src = listener.src;
  if (goog.events.Listenable.isImplementedBy(src)) {
    return src.unlistenByKey(listener);
  }

  var type = listener.type;
  var proxy = listener.proxy;
  if (src.removeEventListener) {
    src.removeEventListener(type, proxy, listener.capture);
  } else if (src.detachEvent) {
    src.detachEvent(goog.events.getOnString_(type), proxy);
  }
  goog.events.listenerCountEstimate_--;

  var listenerMap = goog.events.getListenerMap_(
     ***REMOVED*****REMOVED*** @type {EventTarget}***REMOVED*** (src));
  // TODO(user): Try to remove this conditional and execute the
  // first branch always. This should be safe.
  if (listenerMap) {
    listenerMap.removeByKey(listener);
    if (listenerMap.getTypeCount() == 0) {
      // Null the src, just because this is simple to do (and useful
      // for IE <= 7).
      listenerMap.src = null;
      // We don't use delete here because IE does not allow delete
      // on a window object.
      src[goog.events.LISTENER_MAP_PROP_] = null;
    }
  } else {
    listener.markAsRemoved();
  }

  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Removes an event listener which was added with listenWithWrapper().
***REMOVED***
***REMOVED*** @param {EventTarget|goog.events.Listenable} src The target to stop
***REMOVED***     listening to events on.
***REMOVED*** @param {goog.events.EventWrapper} wrapper Event wrapper to use.
***REMOVED*** @param {function(?):?|{handleEvent:function(?):?}|null} listener The
***REMOVED***     listener function to remove.
***REMOVED*** @param {boolean=} opt_capt In DOM-compliant browsers, this determines
***REMOVED***     whether the listener is fired during the capture or bubble phase of the
***REMOVED***     event.
***REMOVED*** @param {Object=} opt_handler Element in whose scope to call the listener.
***REMOVED***
goog.events.unlistenWithWrapper = function(src, wrapper, listener, opt_capt,
    opt_handler) {
  wrapper.unlisten(src, listener, opt_capt, opt_handler);
***REMOVED***


***REMOVED***
***REMOVED*** Removes all listeners from an object. You can also optionally
***REMOVED*** remove listeners of a particular type.
***REMOVED***
***REMOVED*** @param {Object=} opt_obj Object to remove listeners from. Not
***REMOVED***     specifying opt_obj is now DEPRECATED (it used to remove all
***REMOVED***     registered listeners).
***REMOVED*** @param {string|!goog.events.EventId=} opt_type Type of event to remove.
***REMOVED***     Default is all types.
***REMOVED*** @return {number} Number of listeners removed.
***REMOVED***
goog.events.removeAll = function(opt_obj, opt_type) {
  // TODO(user): Change the type of opt_obj from Object= to
  // !EventTarget|goog.events.Listenable). And replace this with an
  // assertion.
  if (!opt_obj) {
    return 0;
  }

  if (goog.events.Listenable.isImplementedBy(opt_obj)) {
    return opt_obj.removeAllListeners(opt_type);
  }

  var listenerMap = goog.events.getListenerMap_(
     ***REMOVED*****REMOVED*** @type {EventTarget}***REMOVED*** (opt_obj));
  if (!listenerMap) {
    return 0;
  }

  var count = 0;
  var typeStr = opt_type && opt_type.toString();
  for (var type in listenerMap.listeners) {
    if (!typeStr || type == typeStr) {
      // Clone so that we don't need to worry about unlistenByKey
      // changing the content of the ListenerMap.
      var listeners = listenerMap.listeners[type].concat();
      for (var i = 0; i < listeners.length; ++i) {
        if (goog.events.unlistenByKey(listeners[i])) {
          ++count;
        }
      }
    }
  }
  return count;
***REMOVED***


***REMOVED***
***REMOVED*** Removes all native listeners registered via goog.events. Native
***REMOVED*** listeners are listeners on native browser objects (such as DOM
***REMOVED*** elements). In particular, goog.events.Listenable and
***REMOVED*** goog.events.EventTarget listeners will NOT be removed.
***REMOVED*** @return {number} Number of listeners removed.
***REMOVED*** @deprecated This doesn't do anything, now that Closure no longer
***REMOVED*** stores a central listener registry.
***REMOVED***
goog.events.removeAllNativeListeners = function() {
  goog.events.listenerCountEstimate_ = 0;
  return 0;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the listeners for a given object, type and capture phase.
***REMOVED***
***REMOVED*** @param {Object} obj Object to get listeners for.
***REMOVED*** @param {string|!goog.events.EventId} type Event type.
***REMOVED*** @param {boolean} capture Capture phase?.
***REMOVED*** @return {Array.<goog.events.Listener>} Array of listener objects.
***REMOVED***
goog.events.getListeners = function(obj, type, capture) {
  if (goog.events.Listenable.isImplementedBy(obj)) {
    return obj.getListeners(type, capture);
  } else {
    if (!obj) {
      // TODO(user): We should tighten the API to accept
      // !EventTarget|goog.events.Listenable, and add an assertion here.
      return [];
    }

    var listenerMap = goog.events.getListenerMap_(
       ***REMOVED*****REMOVED*** @type {EventTarget}***REMOVED*** (obj));
    return listenerMap ? listenerMap.getListeners(type, capture) : [];
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets the goog.events.Listener for the event or null if no such listener is
***REMOVED*** in use.
***REMOVED***
***REMOVED*** @param {EventTarget|goog.events.Listenable} src The target from
***REMOVED***     which to get listeners.
***REMOVED*** @param {?string|!goog.events.EventId.<EVENTOBJ>} type The type of the event.
***REMOVED*** @param {function(EVENTOBJ):?|{handleEvent:function(?):?}|null} listener The
***REMOVED***     listener function to get.
***REMOVED*** @param {boolean=} opt_capt In DOM-compliant browsers, this determines
***REMOVED***                            whether the listener is fired during the
***REMOVED***                            capture or bubble phase of the event.
***REMOVED*** @param {Object=} opt_handler Element in whose scope to call the listener.
***REMOVED*** @return {goog.events.ListenableKey} the found listener or null if not found.
***REMOVED*** @template EVENTOBJ
***REMOVED***
goog.events.getListener = function(src, type, listener, opt_capt, opt_handler) {
  // TODO(user): Change type from ?string to string, or add assertion.
  type =***REMOVED*****REMOVED*** @type {string}***REMOVED*** (type);
  listener = goog.events.wrapListener(listener);
  var capture = !!opt_capt;
  if (goog.events.Listenable.isImplementedBy(src)) {
    return src.getListener(type, listener, capture, opt_handler);
  }

  if (!src) {
    // TODO(user): We should tighten the API to only accept
    // non-null objects, or add an assertion here.
    return null;
  }

  var listenerMap = goog.events.getListenerMap_(
     ***REMOVED*****REMOVED*** @type {EventTarget}***REMOVED*** (src));
  if (listenerMap) {
    return listenerMap.getListener(type, listener, capture, opt_handler);
  }
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether an event target has any active listeners matching the
***REMOVED*** specified signature. If either the type or capture parameters are
***REMOVED*** unspecified, the function will match on the remaining criteria.
***REMOVED***
***REMOVED*** @param {EventTarget|goog.events.Listenable} obj Target to get
***REMOVED***     listeners for.
***REMOVED*** @param {string|!goog.events.EventId=} opt_type Event type.
***REMOVED*** @param {boolean=} opt_capture Whether to check for capture or bubble-phase
***REMOVED***     listeners.
***REMOVED*** @return {boolean} Whether an event target has one or more listeners matching
***REMOVED***     the requested type and/or capture phase.
***REMOVED***
goog.events.hasListener = function(obj, opt_type, opt_capture) {
  if (goog.events.Listenable.isImplementedBy(obj)) {
    return obj.hasListener(opt_type, opt_capture);
  }

  var listenerMap = goog.events.getListenerMap_(
     ***REMOVED*****REMOVED*** @type {EventTarget}***REMOVED*** (obj));
  return !!listenerMap && listenerMap.hasListener(opt_type, opt_capture);
***REMOVED***


***REMOVED***
***REMOVED*** Provides a nice string showing the normalized event objects public members
***REMOVED*** @param {Object} e Event Object.
***REMOVED*** @return {string} String of the public members of the normalized event object.
***REMOVED***
goog.events.expose = function(e) {
  var str = [];
  for (var key in e) {
    if (e[key] && e[key].id) {
      str.push(key + ' = ' + e[key] + ' (' + e[key].id + ')');
    } else {
      str.push(key + ' = ' + e[key]);
    }
  }
  return str.join('\n');
***REMOVED***


***REMOVED***
***REMOVED*** Returns a string with on prepended to the specified type. This is used for IE
***REMOVED*** which expects "on" to be prepended. This function caches the string in order
***REMOVED*** to avoid extra allocations in steady state.
***REMOVED*** @param {string} type Event type.
***REMOVED*** @return {string} The type string with 'on' prepended.
***REMOVED*** @private
***REMOVED***
goog.events.getOnString_ = function(type) {
  if (type in goog.events.onStringMap_) {
    return goog.events.onStringMap_[type];
  }
  return goog.events.onStringMap_[type] = goog.events.onString_ + type;
***REMOVED***


***REMOVED***
***REMOVED*** Fires an object's listeners of a particular type and phase
***REMOVED***
***REMOVED*** @param {Object} obj Object whose listeners to call.
***REMOVED*** @param {string|!goog.events.EventId} type Event type.
***REMOVED*** @param {boolean} capture Which event phase.
***REMOVED*** @param {Object} eventObject Event object to be passed to listener.
***REMOVED*** @return {boolean} True if all listeners returned true else false.
***REMOVED***
goog.events.fireListeners = function(obj, type, capture, eventObject) {
  if (goog.events.Listenable.isImplementedBy(obj)) {
    return obj.fireListeners(type, capture, eventObject);
  }

  return goog.events.fireListeners_(obj, type, capture, eventObject);
***REMOVED***


***REMOVED***
***REMOVED*** Fires an object's listeners of a particular type and phase.
***REMOVED*** @param {Object} obj Object whose listeners to call.
***REMOVED*** @param {string|!goog.events.EventId} type Event type.
***REMOVED*** @param {boolean} capture Which event phase.
***REMOVED*** @param {Object} eventObject Event object to be passed to listener.
***REMOVED*** @return {boolean} True if all listeners returned true else false.
***REMOVED*** @private
***REMOVED***
goog.events.fireListeners_ = function(obj, type, capture, eventObject) {
  var retval = 1;

  var listenerMap = goog.events.getListenerMap_(
     ***REMOVED*****REMOVED*** @type {EventTarget}***REMOVED*** (obj));
  if (listenerMap) {
    // TODO(user): Original code avoids array creation when there
    // is no listener, so we do the same. If this optimization turns
    // out to be not required, we can replace this with
    // listenerMap.getListeners(type, capture) instead, which is simpler.
    var listenerArray = listenerMap.listeners[type.toString()];
    if (listenerArray) {
      listenerArray = listenerArray.concat();
      for (var i = 0; i < listenerArray.length; i++) {
        var listener = listenerArray[i];
        // We might not have a listener if the listener was removed.
        if (listener && listener.capture == capture && !listener.removed) {
          retval &=
              goog.events.fireListener(listener, eventObject) !== false;
        }
      }
    }
  }
  return Boolean(retval);
***REMOVED***


***REMOVED***
***REMOVED*** Fires a listener with a set of arguments
***REMOVED***
***REMOVED*** @param {goog.events.Listener} listener The listener object to call.
***REMOVED*** @param {Object} eventObject The event object to pass to the listener.
***REMOVED*** @return {boolean} Result of listener.
***REMOVED***
goog.events.fireListener = function(listener, eventObject) {
  var listenerFn = listener.listener;
  var listenerHandler = listener.handler || listener.src;

  if (listener.callOnce) {
    goog.events.unlistenByKey(listener);
  }
  return listenerFn.call(listenerHandler, eventObject);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the total number of listeners currently in the system.
***REMOVED*** @return {number} Number of listeners.
***REMOVED*** @deprecated This returns estimated count, now that Closure no longer
***REMOVED*** stores a central listener registry. We still return an estimation
***REMOVED*** to keep existing listener-related tests passing. In the near future,
***REMOVED*** this function will be removed.
***REMOVED***
goog.events.getTotalListenerCount = function() {
  return goog.events.listenerCountEstimate_;
***REMOVED***


***REMOVED***
***REMOVED*** Dispatches an event (or event like object) and calls all listeners
***REMOVED*** listening for events of this type. The type of the event is decided by the
***REMOVED*** type property on the event object.
***REMOVED***
***REMOVED*** If any of the listeners returns false OR calls preventDefault then this
***REMOVED*** function will return false.  If one of the capture listeners calls
***REMOVED*** stopPropagation, then the bubble listeners won't fire.
***REMOVED***
***REMOVED*** @param {goog.events.Listenable} src The event target.
***REMOVED*** @param {goog.events.EventLike} e Event object.
***REMOVED*** @return {boolean} If anyone called preventDefault on the event object (or
***REMOVED***     if any of the handlers returns false) this will also return false.
***REMOVED***     If there are no handlers, or if all handlers return true, this returns
***REMOVED***     true.
***REMOVED***
goog.events.dispatchEvent = function(src, e) {
  goog.asserts.assert(
      goog.events.Listenable.isImplementedBy(src),
      'Can not use goog.events.dispatchEvent with ' +
      'non-goog.events.Listenable instance.');
  return src.dispatchEvent(e);
***REMOVED***


***REMOVED***
***REMOVED*** Installs exception protection for the browser event entry point using the
***REMOVED*** given error handler.
***REMOVED***
***REMOVED*** @param {goog.debug.ErrorHandler} errorHandler Error handler with which to
***REMOVED***     protect the entry point.
***REMOVED***
goog.events.protectBrowserEventEntryPoint = function(errorHandler) {
  goog.events.handleBrowserEvent_ = errorHandler.protectEntryPoint(
      goog.events.handleBrowserEvent_);
***REMOVED***


***REMOVED***
***REMOVED*** Handles an event and dispatches it to the correct listeners. This
***REMOVED*** function is a proxy for the real listener the user specified.
***REMOVED***
***REMOVED*** @param {goog.events.Listener} listener The listener object.
***REMOVED*** @param {Event=} opt_evt Optional event object that gets passed in via the
***REMOVED***     native event handlers.
***REMOVED*** @return {boolean} Result of the event handler.
***REMOVED*** @this {EventTarget} The object or Element that fired the event.
***REMOVED*** @private
***REMOVED***
goog.events.handleBrowserEvent_ = function(listener, opt_evt) {
  if (listener.removed) {
    return true;
  }

  // Synthesize event propagation if the browser does not support W3C
  // event model.
  if (!goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT) {
    var ieEvent = opt_evt ||
       ***REMOVED*****REMOVED*** @type {Event}***REMOVED*** (goog.getObjectByName('window.event'));
    var evt = new goog.events.BrowserEvent(ieEvent, this);
    var retval = true;

    if (goog.events.CAPTURE_SIMULATION_MODE ==
            goog.events.CaptureSimulationMode.ON) {
      // If we have not marked this event yet, we should perform capture
      // simulation.
      if (!goog.events.isMarkedIeEvent_(ieEvent)) {
        goog.events.markIeEvent_(ieEvent);

        var ancestors = [];
        for (var parent = evt.currentTarget; parent;
             parent = parent.parentNode) {
          ancestors.push(parent);
        }

        // Fire capture listeners.
        var type = listener.type;
        for (var i = ancestors.length - 1; !evt.propagationStopped_ && i >= 0;
             i--) {
          evt.currentTarget = ancestors[i];
          retval &= goog.events.fireListeners_(ancestors[i], type, true, evt);
        }

        // Fire bubble listeners.
        //
        // We can technically rely on IE to perform bubble event
        // propagation. However, it turns out that IE fires events in
        // opposite order of attachEvent registration, which broke
        // some code and tests that rely on the order. (While W3C DOM
        // Level 2 Events TR leaves the event ordering unspecified,
        // modern browsers and W3C DOM Level 3 Events Working Draft
        // actually specify the order as the registration order.)
        for (var i = 0; !evt.propagationStopped_ && i < ancestors.length; i++) {
          evt.currentTarget = ancestors[i];
          retval &= goog.events.fireListeners_(ancestors[i], type, false, evt);
        }
      }
    } else {
      retval = goog.events.fireListener(listener, evt);
    }
    return retval;
  }

  // Otherwise, simply fire the listener.
  return goog.events.fireListener(
      listener, new goog.events.BrowserEvent(opt_evt, this));
***REMOVED***


***REMOVED***
***REMOVED*** This is used to mark the IE event object so we do not do the Closure pass
***REMOVED*** twice for a bubbling event.
***REMOVED*** @param {Event} e The IE browser event.
***REMOVED*** @private
***REMOVED***
goog.events.markIeEvent_ = function(e) {
  // Only the keyCode and the returnValue can be changed. We use keyCode for
  // non keyboard events.
  // event.returnValue is a bit more tricky. It is undefined by default. A
  // boolean false prevents the default action. In a window.onbeforeunload and
  // the returnValue is non undefined it will be alerted. However, we will only
  // modify the returnValue for keyboard events. We can get a problem if non
  // closure events sets the keyCode or the returnValue

  var useReturnValue = false;

  if (e.keyCode == 0) {
    // We cannot change the keyCode in case that srcElement is input[type=file].
    // We could test that that is the case but that would allocate 3 objects.
    // If we use try/catch we will only allocate extra objects in the case of a
    // failure.
   ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
    try {
      e.keyCode = -1;
      return;
    } catch (ex) {
      useReturnValue = true;
    }
  }

  if (useReturnValue ||
     ***REMOVED*****REMOVED*** @type {boolean|undefined}***REMOVED*** (e.returnValue) == undefined) {
    e.returnValue = true;
  }
***REMOVED***


***REMOVED***
***REMOVED*** This is used to check if an IE event has already been handled by the Closure
***REMOVED*** system so we do not do the Closure pass twice for a bubbling event.
***REMOVED*** @param {Event} e  The IE browser event.
***REMOVED*** @return {boolean} True if the event object has been marked.
***REMOVED*** @private
***REMOVED***
goog.events.isMarkedIeEvent_ = function(e) {
  return e.keyCode < 0 || e.returnValue != undefined;
***REMOVED***


***REMOVED***
***REMOVED*** Counter to create unique event ids.
***REMOVED*** @private {number}
***REMOVED***
goog.events.uniqueIdCounter_ = 0;


***REMOVED***
***REMOVED*** Creates a unique event id.
***REMOVED***
***REMOVED*** @param {string} identifier The identifier.
***REMOVED*** @return {string} A unique identifier.
***REMOVED*** @idGenerator
***REMOVED***
goog.events.getUniqueId = function(identifier) {
  return identifier + '_' + goog.events.uniqueIdCounter_++;
***REMOVED***


***REMOVED***
***REMOVED*** @param {EventTarget} src The source object.
***REMOVED*** @return {goog.events.ListenerMap} A listener map for the given
***REMOVED***     source object, or null if none exists.
***REMOVED*** @private
***REMOVED***
goog.events.getListenerMap_ = function(src) {
  var listenerMap = src[goog.events.LISTENER_MAP_PROP_];
  // IE serializes the property as well (e.g. when serializing outer
  // HTML). So we must check that the value is of the correct type.
  return listenerMap instanceof goog.events.ListenerMap ? listenerMap : null;
***REMOVED***


***REMOVED***
***REMOVED*** Expando property for listener function wrapper for Object with
***REMOVED*** handleEvent.
***REMOVED*** @const
***REMOVED*** @private
***REMOVED***
goog.events.LISTENER_WRAPPER_PROP_ = '__closure_events_fn_' +
    ((Math.random()***REMOVED*** 1e9) >>> 0);


***REMOVED***
***REMOVED*** @param {Object|Function} listener The listener function or an
***REMOVED***     object that contains handleEvent method.
***REMOVED*** @return {!Function} Either the original function or a function that
***REMOVED***     calls obj.handleEvent. If the same listener is passed to this
***REMOVED***     function more than once, the same function is guaranteed to be
***REMOVED***     returned.
***REMOVED***
goog.events.wrapListener = function(listener) {
  goog.asserts.assert(listener, 'Listener can not be null.');

  if (goog.isFunction(listener)) {
    return listener;
  }

  goog.asserts.assert(
      listener.handleEvent, 'An object listener must have handleEvent method.');
  return listener[goog.events.LISTENER_WRAPPER_PROP_] ||
      (listener[goog.events.LISTENER_WRAPPER_PROP_] = function(e) {
        return listener.handleEvent(e);
      });
***REMOVED***


// Register the browser event handler as an entry point, so that
// it can be monitored for exception handling, etc.
goog.debug.entryPointRegistry.register(
   ***REMOVED*****REMOVED***
    ***REMOVED*** @param {function(!Function): !Function} transformer The transforming
    ***REMOVED***     function.
   ***REMOVED*****REMOVED***
    function(transformer) {
      goog.events.handleBrowserEvent_ = transformer(
          goog.events.handleBrowserEvent_);
    });
