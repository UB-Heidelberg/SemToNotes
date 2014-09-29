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
***REMOVED*** @fileoverview Event Manager.
***REMOVED***
***REMOVED*** Provides an abstracted interface to the browsers' event
***REMOVED*** systems. This uses an indirect lookup of listener functions to avoid circular
***REMOVED*** references between DOM (in IE) or XPCOM (in Mozilla) objects which leak
***REMOVED*** memory. This makes it easier to write OO Javascript/DOM code.
***REMOVED***
***REMOVED*** It simulates capture & bubble in Internet Explorer.
***REMOVED***
***REMOVED*** The listeners will also automagically have their event objects patched, so
***REMOVED*** your handlers don't need to worry about the browser.
***REMOVED***
***REMOVED*** Example usage:
***REMOVED*** <pre>
***REMOVED*** goog.events.listen(myNode, 'click', function(e) { alert('woo') });
***REMOVED*** goog.events.listen(myNode, 'mouseover', mouseHandler, true);
***REMOVED*** goog.events.unlisten(myNode, 'mouseover', mouseHandler, true);
***REMOVED*** goog.events.removeAll(myNode);
***REMOVED*** goog.events.removeAll();
***REMOVED*** </pre>
***REMOVED***
***REMOVED***                                            in IE and event object patching]
***REMOVED***
***REMOVED*** @supported IE6+, FF1.5+, WebKit, Opera.
***REMOVED*** @see ../demos/events.html
***REMOVED*** @see ../demos/event-propagation.html
***REMOVED*** @see ../demos/stopevent.html
***REMOVED***


// This uses 3 lookup tables/trees.
// listenerTree_ is a tree of type -> capture -> src uid -> [Listener]
// listeners_ is a map of key -> [Listener]
//
// The key is a field of the Listener. The Listener class also has the type,
// capture and the src so one can always trace back in the tree
//
// sources_: src uid -> [Listener]


goog.provide('goog.events');
goog.provide('goog.events.Key');

goog.require('goog.array');
goog.require('goog.debug.entryPointRegistry');
goog.require('goog.debug.errorHandlerWeakDep');
goog.require('goog.events.BrowserEvent');
goog.require('goog.events.BrowserFeature');
goog.require('goog.events.Event');
goog.require('goog.events.EventWrapper');
goog.require('goog.events.Listenable');
goog.require('goog.events.Listener');
goog.require('goog.object');
goog.require('goog.userAgent');


***REMOVED***
***REMOVED*** @typedef {number|goog.events.ListenableKey}
***REMOVED***
goog.events.Key;


***REMOVED***
***REMOVED*** @typedef {EventTarget|goog.events.Listenable|goog.events.EventTarget}
***REMOVED***
goog.events.ListenableType;


***REMOVED***
***REMOVED*** Container for storing event listeners and their proxies
***REMOVED*** @private
***REMOVED*** @type {Object.<goog.events.ListenableKey>}
***REMOVED***
goog.events.listeners_ = {***REMOVED***


***REMOVED***
***REMOVED*** The root of the listener tree
***REMOVED*** @private
***REMOVED*** @type {Object}
***REMOVED***
goog.events.listenerTree_ = {***REMOVED***


***REMOVED***
***REMOVED*** Lookup for mapping source UIDs to listeners.
***REMOVED*** @private
***REMOVED*** @type {Object}
***REMOVED***
goog.events.sources_ = {***REMOVED***


***REMOVED***
***REMOVED*** String used to prepend to IE event types.  Not a constant so that it is not
***REMOVED*** inlined.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.events.onString_ = 'on';


***REMOVED***
***REMOVED*** Map of computed on strings for IE event types. Caching this removes an extra
***REMOVED*** object allocation in goog.events.listen which improves IE6 performance.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.events.onStringMap_ = {***REMOVED***


***REMOVED***
***REMOVED*** Separator used to split up the various parts of an event key, to help avoid
***REMOVED*** the possibilities of collisions.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.events.keySeparator_ = '_';


***REMOVED***
***REMOVED*** Adds an event listener for a specific event on a DOM Node or an
***REMOVED*** object that has implemented {@link goog.events.EventTarget}. A
***REMOVED*** listener can only be added once to an object and if it is added
***REMOVED*** again the key for the listener is returned. Note that if the
***REMOVED*** existing listener is a one-off listener (registered via
***REMOVED*** listenOnce), it will no longer be a one-off listener after a call
***REMOVED*** to listen().
***REMOVED***
***REMOVED*** @param {goog.events.ListenableType} src The node to listen to
***REMOVED***     events on.
***REMOVED*** @param {string|Array.<string>} type Event type or array of event types.
***REMOVED*** @param {Function|Object} listener Callback method, or an object with a
***REMOVED***     handleEvent function.
***REMOVED*** @param {boolean=} opt_capt Whether to fire in capture phase (defaults to
***REMOVED***     false).
***REMOVED*** @param {Object=} opt_handler Element in whose scope to call the listener.
***REMOVED*** @return {goog.events.Key} Unique key for the listener.
***REMOVED***
goog.events.listen = function(src, type, listener, opt_capt, opt_handler) {
  if (goog.isArray(type)) {
    for (var i = 0; i < type.length; i++) {
    ***REMOVED***src, type[i], listener, opt_capt, opt_handler);
    }
    return null;
  }

  var listenableKey;
  if (goog.events.Listenable.USE_LISTENABLE_INTERFACE &&
      goog.events.Listenable.isImplementedBy(src)) {
    listenableKey = src.listen(
       ***REMOVED*****REMOVED*** @type {string}***REMOVED*** (type),
        goog.events.wrapListener_(listener), opt_capt, opt_handler);
  } else {
    listenableKey = goog.events.listen_(
       ***REMOVED*****REMOVED*** @type {EventTarget|goog.events.EventTarget}***REMOVED*** (src),
        type, listener, /* callOnce***REMOVED*** false, opt_capt, opt_handler);
  }

  var key = listenableKey.key;
  goog.events.listeners_[key] = listenableKey;
  return key;
***REMOVED***


***REMOVED***
***REMOVED*** Adds an event listener for a specific event on a DOM Node or an object that
***REMOVED*** has implemented {@link goog.events.EventTarget}. A listener can only be
***REMOVED*** added once to an object and if it is added again the key for the listener
***REMOVED*** is returned.
***REMOVED***
***REMOVED*** Note that a one-off listener will not change an existing listener,
***REMOVED*** if any. On the other hand a normal listener will change existing
***REMOVED*** one-off listener to become a normal listener.
***REMOVED***
***REMOVED*** @param {EventTarget|goog.events.EventTarget} src The node to listen to
***REMOVED***     events on.
***REMOVED*** @param {?string} type Event type or array of event types.
***REMOVED*** @param {Function|Object} listener Callback method, or an object with a
***REMOVED***     handleEvent function.
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
  var map = goog.events.listenerTree_;

  if (!(type in map)) {
    map[type] = {count_: 0, remaining_: 0***REMOVED***
  }
  map = map[type];

  if (!(capture in map)) {
    map[capture] = {count_: 0, remaining_: 0***REMOVED***
    map.count_++;
  }
  map = map[capture];

  var srcUid = goog.getUid(src);
  var listenerArray, listenerObj;

  // The remaining_ property is used to be able to short circuit the iteration
  // of the event listeners.
  //
  // Increment the remaining event listeners to call even if this event might
  // already have been fired. At this point we do not know if the event has
  // been fired and it is too expensive to find out. By incrementing it we are
  // guaranteed that we will not skip any event listeners.
  map.remaining_++;

  // Do not use srcUid in map here since that will cast the number to a
  // string which will allocate one string object.
  if (!map[srcUid]) {
    listenerArray = map[srcUid] = [];
    map.count_++;
  } else {
    listenerArray = map[srcUid];
    // Ensure that the listeners do not already contain the current listener
    for (var i = 0; i < listenerArray.length; i++) {
      listenerObj = listenerArray[i];
      if (listenerObj.listener == listener &&
          listenerObj.handler == opt_handler) {

        // If this listener has been removed we should not return its key. It
        // is OK that we create new listenerObj below since the removed one
        // will be cleaned up later.
        if (listenerObj.removed) {
          break;
        }

        if (!callOnce) {
          // Ensure that, if there is an existing callOnce listener, it is no
          // longer a callOnce listener.
          listenerArray[i].callOnce = false;
        }

        // We already have this listener. Return its key.
        return listenerArray[i];
      }
    }
  }

  var proxy = goog.events.getProxy();
  listenerObj = new goog.events.Listener();
  listenerObj.init(listener, proxy, src, type, capture, opt_handler);
  listenerObj.callOnce = callOnce;

  proxy.src = src;
  proxy.listener = listenerObj;

  listenerArray.push(listenerObj);

  if (!goog.events.sources_[srcUid]) {
    goog.events.sources_[srcUid] = [];
  }
  goog.events.sources_[srcUid].push(listenerObj);

  // Attach the proxy through the browser's API
  if (src.addEventListener) {
    if (src == goog.global || !src.customEvent_) {
      src.addEventListener(type, proxy, capture);
    }
  } else {
    // The else above used to be else if (src.attachEvent) and then there was
    // another else statement that threw an exception warning the developer
    // they made a mistake. This resulted in an extra object allocation in IE6
    // due to a wrapper object that had to be implemented around the element
    // and so was removed.
    src.attachEvent(goog.events.getOnString_(type), proxy);
  }

  return listenerObj;
***REMOVED***


***REMOVED***
***REMOVED*** Helper function for returning a proxy function.
***REMOVED*** @return {Function} A new or reused function object.
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
***REMOVED*** Adds an event listener for a specific event on a DomNode or an object that
***REMOVED*** has implemented {@link goog.events.EventTarget}. After the event has fired
***REMOVED*** the event listener is removed from the target.
***REMOVED***
***REMOVED*** If an existing listener already exists, listenOnce will do
***REMOVED*** nothing. In particular, if the listener was previously registered
***REMOVED*** via listen(), listenOnce() will not turn the listener into a
***REMOVED*** one-off listener. Similarly, if there is already an existing
***REMOVED*** one-off listener, listenOnce does not modify the listeners (it is
***REMOVED*** still a once listener).
***REMOVED***
***REMOVED*** @param {goog.events.ListenableType} src The node to listen to
***REMOVED***     events on.
***REMOVED*** @param {string|Array.<string>} type Event type or array of event types.
***REMOVED*** @param {Function|Object} listener Callback method.
***REMOVED*** @param {boolean=} opt_capt Fire in capture phase?.
***REMOVED*** @param {Object=} opt_handler Element in whose scope to call the listener.
***REMOVED*** @return {goog.events.Key} Unique key for the listener.
***REMOVED***
goog.events.listenOnce = function(src, type, listener, opt_capt, opt_handler) {
  if (goog.isArray(type)) {
    for (var i = 0; i < type.length; i++) {
      goog.events.listenOnce(src, type[i], listener, opt_capt, opt_handler);
    }
    return null;
  }

  var listenableKey;
  if (goog.events.Listenable.USE_LISTENABLE_INTERFACE &&
      goog.events.Listenable.isImplementedBy(src)) {
    listenableKey = src.listenOnce(
       ***REMOVED*****REMOVED*** @type {string}***REMOVED*** (type),
        goog.events.wrapListener_(listener), opt_capt, opt_handler);
  } else {
    listenableKey = goog.events.listen_(
       ***REMOVED*****REMOVED*** @type {EventTarget|goog.events.EventTarget}***REMOVED*** (src),
        type, listener, /* callOnce***REMOVED*** true, opt_capt, opt_handler);
  }

  var key = listenableKey.key;
  goog.events.listeners_[key] = listenableKey;
  return key;
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
***REMOVED***
goog.events.listenWithWrapper = function(src, wrapper, listener, opt_capt,
    opt_handler) {
  wrapper.listen(src, listener, opt_capt, opt_handler);
***REMOVED***


***REMOVED***
***REMOVED*** Removes an event listener which was added with listen().
***REMOVED***
***REMOVED*** @param {goog.events.ListenableType} src The target to stop
***REMOVED***     listening to events on.
***REMOVED*** @param {string|Array.<string>} type The name of the event without the 'on'
***REMOVED***     prefix.
***REMOVED*** @param {Function|Object} listener The listener function to remove.
***REMOVED*** @param {boolean=} opt_capt In DOM-compliant browsers, this determines
***REMOVED***     whether the listener is fired during the capture or bubble phase of the
***REMOVED***     event.
***REMOVED*** @param {Object=} opt_handler Element in whose scope to call the listener.
***REMOVED*** @return {?boolean} indicating whether the listener was there to remove.
***REMOVED***
goog.events.unlisten = function(src, type, listener, opt_capt, opt_handler) {
  if (goog.isArray(type)) {
    for (var i = 0; i < type.length; i++) {
      goog.events.unlisten(src, type[i], listener, opt_capt, opt_handler);
    }
    return null;
  }

  if (goog.events.Listenable.USE_LISTENABLE_INTERFACE &&
      goog.events.Listenable.isImplementedBy(src)) {
    return src.unlisten(
       ***REMOVED*****REMOVED*** @type {string}***REMOVED*** (type),
        goog.events.wrapListener_(listener), opt_capt, opt_handler);
  }

  var capture = !!opt_capt;

  var listenerArray = goog.events.getListeners_(src, type, capture);
  if (!listenerArray) {
    return false;
  }

  for (var i = 0; i < listenerArray.length; i++) {
    if (listenerArray[i].listener == listener &&
        listenerArray[i].capture == capture &&
        listenerArray[i].handler == opt_handler) {
      return goog.events.unlistenByKey(listenerArray[i].key);
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
  // TODO(user): When we flip goog.events.Key to be ListenableKey,
  // we need to change this.
  var listener = goog.events.listeners_[key];
  if (!listener) {
    return false;
  }
  if (listener.removed) {
    return false;
  }

  var src = listener.src;
  if (goog.events.Listenable.USE_LISTENABLE_INTERFACE &&
      goog.events.Listenable.isImplementedBy(src)) {
    return src.unlistenByKey(listener);
  }

  var type = listener.type;
  var proxy = listener.proxy;
  var capture = listener.capture;

  if (src.removeEventListener) {
    // EventTarget calls unlisten so we need to ensure that the source is not
    // an event target to prevent re-entry.
    // TODO(arv): What is this goog.global for? Why would anyone listen to
    // events on the [[Global]] object? Is it supposed to be window? Why would
    // we not want to allow removing event listeners on the window?
    if (src == goog.global || !src.customEvent_) {
      src.removeEventListener(type, proxy, capture);
    }
  } else if (src.detachEvent) {
    src.detachEvent(goog.events.getOnString_(type), proxy);
  }

  var srcUid = goog.getUid(src);

  // In a perfect implementation we would decrement the remaining_ field here
  // but then we would need to know if the listener has already been fired or
  // not. We therefore skip doing this and in this uncommon case the entire
  // ancestor chain will need to be traversed as before.

  // Remove from sources_
  if (goog.events.sources_[srcUid]) {
    var sourcesArray = goog.events.sources_[srcUid];
    goog.array.remove(sourcesArray, listener);
    if (sourcesArray.length == 0) {
      delete goog.events.sources_[srcUid];
    }
  }

  listener.removed = true;

  // There are some esoteric situations where the hash code of an object
  // can change, and we won't be able to find the listenerArray anymore.
  // For example, if you're listening on a window, and the user navigates to
  // a different window, the UID will disappear.
  //
  // It should be impossible to ever find the original listenerArray, so it
  // doesn't really matter if we can't clean it up in this case.
  var listenerArray = goog.events.listenerTree_[type][capture][srcUid];
  if (listenerArray) {
    listenerArray.needsCleanup_ = true;
    goog.events.cleanUp_(type, capture, srcUid, listenerArray);
  }

  delete goog.events.listeners_[key];

  return true;
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
***REMOVED***
goog.events.unlistenWithWrapper = function(src, wrapper, listener, opt_capt,
    opt_handler) {
  wrapper.unlisten(src, listener, opt_capt, opt_handler);
***REMOVED***


***REMOVED***
***REMOVED*** Cleans up goog.events internal data structure. This should be
***REMOVED*** called by all implementations of goog.events.Listenable when
***REMOVED*** removing listeners.
***REMOVED***
***REMOVED*** TODO(user): Once we remove numeric key support from
***REMOVED*** goog.events.listen and friend, we will be able to remove this
***REMOVED*** requirement.
***REMOVED***
***REMOVED*** @param {goog.events.ListenableKey} listenableKey The key to clean up.
***REMOVED***
goog.events.cleanUp = function(listenableKey) {
  delete goog.events.listeners_[listenableKey.key];
***REMOVED***


***REMOVED***
***REMOVED*** Cleans up the listener array as well as the listener tree
***REMOVED*** @param {string} type  The type of the event.
***REMOVED*** @param {boolean} capture Whether to clean up capture phase listeners instead
***REMOVED***     bubble phase listeners.
***REMOVED*** @param {number} srcUid  The unique ID of the source.
***REMOVED*** @param {Array.<goog.events.Listener>} listenerArray The array being cleaned.
***REMOVED*** @private
***REMOVED***
goog.events.cleanUp_ = function(type, capture, srcUid, listenerArray) {
  // The listener array gets locked during the dispatch phase so that removals
  // of listeners during this phase does not screw up the indeces. This method
  // is called after we have removed a listener as well as after the dispatch
  // phase in case any listeners were removed.
  if (!listenerArray.locked_) { // catches both 0 and not set
    if (listenerArray.needsCleanup_) {
      // Loop over the listener array and remove listeners that have removed set
      // to true. This could have been done with filter or something similar but
      // we want to change the array in place and we want to minimize
      // allocations. Adding a listener during this phase adds to the end of the
      // array so that works fine as long as the length is rechecked every in
      // iteration.
      for (var oldIndex = 0, newIndex = 0;
           oldIndex < listenerArray.length;
           oldIndex++) {
        if (listenerArray[oldIndex].removed) {
          var proxy = listenerArray[oldIndex].proxy;
          proxy.src = null;
          continue;
        }
        if (oldIndex != newIndex) {
          listenerArray[newIndex] = listenerArray[oldIndex];
        }
        newIndex++;
      }
      listenerArray.length = newIndex;

      listenerArray.needsCleanup_ = false;

      // In case the length is now zero we release the object.
      if (newIndex == 0) {
        delete goog.events.listenerTree_[type][capture][srcUid];
        goog.events.listenerTree_[type][capture].count_--;

        if (goog.events.listenerTree_[type][capture].count_ == 0) {
          delete goog.events.listenerTree_[type][capture];
          goog.events.listenerTree_[type].count_--;
        }

        if (goog.events.listenerTree_[type].count_ == 0) {
          delete goog.events.listenerTree_[type];
        }
      }

    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Removes all listeners from an object, if no object is specified it will
***REMOVED*** remove all listeners that have been registered.  You can also optionally
***REMOVED*** remove listeners of a particular type or capture phase.
***REMOVED***
***REMOVED*** removeAll() will not remove listeners registered directly on a
***REMOVED*** goog.events.Listenable and listeners registered via add(Once)Listener.
***REMOVED***
***REMOVED*** @param {Object=} opt_obj Object to remove listeners from.
***REMOVED*** @param {string=} opt_type Type of event to, default is all types.
***REMOVED*** @return {number} Number of listeners removed.
***REMOVED***
goog.events.removeAll = function(opt_obj, opt_type) {
  var count = 0;

  var noObj = opt_obj == null;
  var noType = opt_type == null;

  if (!noObj) {
    if (goog.events.Listenable.USE_LISTENABLE_INTERFACE &&
        opt_obj && goog.events.Listenable.isImplementedBy(opt_obj)) {
      return opt_obj.removeAllListeners(opt_type);
    }

    var srcUid = goog.getUid(***REMOVED*** @type {Object}***REMOVED*** (opt_obj));
    if (goog.events.sources_[srcUid]) {
      var sourcesArray = goog.events.sources_[srcUid];
      for (var i = sourcesArray.length - 1; i >= 0; i--) {
        var listener = sourcesArray[i];
        if (noType || opt_type == listener.type) {
          goog.events.unlistenByKey(listener.key);
          count++;
        }
      }
    }
  } else {
    goog.object.forEach(goog.events.listeners_, function(listener, key) {
      goog.events.unlistenByKey(key);
      count++;
    });
  }

  return count;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the listeners for a given object, type and capture phase.
***REMOVED***
***REMOVED*** @param {Object} obj Object to get listeners for.
***REMOVED*** @param {string} type Event type.
***REMOVED*** @param {boolean} capture Capture phase?.
***REMOVED*** @return {Array.<goog.events.Listener>} Array of listener objects.
***REMOVED***
goog.events.getListeners = function(obj, type, capture) {
  if (goog.events.Listenable.USE_LISTENABLE_INTERFACE &&
      goog.events.Listenable.isImplementedBy(obj)) {
    return obj.getListeners(type, capture);
  } else {
    return goog.events.getListeners_(obj, type, capture) || [];
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets the listeners for a given object, type and capture phase.
***REMOVED***
***REMOVED*** @param {Object} obj Object to get listeners for.
***REMOVED*** @param {?string} type Event type.
***REMOVED*** @param {boolean} capture Capture phase?.
***REMOVED*** @return {Array.<goog.events.Listener>?} Array of listener objects.
***REMOVED***     Returns null if object has no listeners of that type.
***REMOVED*** @private
***REMOVED***
goog.events.getListeners_ = function(obj, type, capture) {
  var map = goog.events.listenerTree_;
  if (type in map) {
    map = map[type];
    if (capture in map) {
      map = map[capture];
      var objUid = goog.getUid(obj);
      if (map[objUid]) {
        return map[objUid];
      }
    }
  }

  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the goog.events.Listener for the event or null if no such listener is
***REMOVED*** in use.
***REMOVED***
***REMOVED*** @param {EventTarget|goog.events.EventTarget} src The node from which to get
***REMOVED***     listeners.
***REMOVED*** @param {?string} type The name of the event without the 'on' prefix.
***REMOVED*** @param {Function|Object} listener The listener function to get.
***REMOVED*** @param {boolean=} opt_capt In DOM-compliant browsers, this determines
***REMOVED***                            whether the listener is fired during the
***REMOVED***                            capture or bubble phase of the event.
***REMOVED*** @param {Object=} opt_handler Element in whose scope to call the listener.
***REMOVED*** @return {goog.events.ListenableKey} the found listener or null if not found.
***REMOVED***
goog.events.getListener = function(src, type, listener, opt_capt, opt_handler) {
  var capture = !!opt_capt;

  if (goog.events.Listenable.USE_LISTENABLE_INTERFACE &&
      goog.events.Listenable.isImplementedBy(src)) {
    return src.getListener(
       ***REMOVED*****REMOVED*** @type {string}***REMOVED*** (type),
        goog.events.wrapListener_(listener), capture, opt_handler);
  }

  var listenerArray = goog.events.getListeners_(src, type, capture);
  if (listenerArray) {
    for (var i = 0; i < listenerArray.length; i++) {
      // If goog.events.unlistenByKey is called during an event dispatch
      // then the listener array won't get cleaned up and there might be
      // 'removed' listeners in the list. Ignore those.
      if (!listenerArray[i].removed &&
          listenerArray[i].listener == listener &&
          listenerArray[i].capture == capture &&
          listenerArray[i].handler == opt_handler) {
        // We already have this listener. Return its key.
        return listenerArray[i];
      }
    }
  }
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether an event target has any active listeners matching the
***REMOVED*** specified signature. If either the type or capture parameters are
***REMOVED*** unspecified, the function will match on the remaining criteria.
***REMOVED***
***REMOVED*** @param {EventTarget|goog.events.EventTarget} obj Target to get listeners for.
***REMOVED*** @param {string=} opt_type Event type.
***REMOVED*** @param {boolean=} opt_capture Whether to check for capture or bubble-phase
***REMOVED***     listeners.
***REMOVED*** @return {boolean} Whether an event target has one or more listeners matching
***REMOVED***     the requested type and/or capture phase.
***REMOVED***
goog.events.hasListener = function(obj, opt_type, opt_capture) {
  if (goog.events.Listenable.USE_LISTENABLE_INTERFACE &&
      goog.events.Listenable.isImplementedBy(obj)) {
    return obj.hasListener(opt_type, opt_capture);
  }

  var objUid = goog.getUid(obj);
  var listeners = goog.events.sources_[objUid];

  if (listeners) {
    var hasType = goog.isDef(opt_type);
    var hasCapture = goog.isDef(opt_capture);

    if (hasType && hasCapture) {
      // Lookup in the listener tree whether the specified listener exists.
      var map = goog.events.listenerTree_[opt_type];
      return !!map && !!map[opt_capture] && objUid in map[opt_capture];

    } else if (!(hasType || hasCapture)) {
      // Simple check for whether the event target has any listeners at all.
      return true;

    } else {
      // Iterate through the listeners for the event target to find a match.
      return goog.array.some(listeners, function(listener) {
        return (hasType && listener.type == opt_type) ||
               (hasCapture && listener.capture == opt_capture);
      });
    }
  }

  return false;
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
***REMOVED*** Returns a string wth on prepended to the specified type. This is used for IE
***REMOVED*** which expects "on" to be prepended. This function caches the string in order
***REMOVED*** to avoid extra allocations in steady state.
***REMOVED*** @param {string} type Event type strng.
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
***REMOVED*** @param {string} type Event type.
***REMOVED*** @param {boolean} capture Which event phase.
***REMOVED*** @param {Object} eventObject Event object to be passed to listener.
***REMOVED*** @return {boolean} True if all listeners returned true else false.
***REMOVED***
goog.events.fireListeners = function(obj, type, capture, eventObject) {
  if (goog.events.Listenable.USE_LISTENABLE_INTERFACE &&
      goog.events.Listenable.isImplementedBy(obj)) {
    return obj.fireListeners(type, capture, eventObject);
  }

  var map = goog.events.listenerTree_;
  if (type in map) {
    map = map[type];
    if (capture in map) {
      return goog.events.fireListeners_(map[capture], obj, type,
                                        capture, eventObject);
    }
  }
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Fires an object's listeners of a particular type and phase.
***REMOVED***
***REMOVED*** @param {Object} map Object with listeners in it.
***REMOVED*** @param {Object} obj Object whose listeners to call.
***REMOVED*** @param {string} type Event type.
***REMOVED*** @param {boolean} capture Which event phase.
***REMOVED*** @param {Object} eventObject Event object to be passed to listener.
***REMOVED*** @return {boolean} True if all listeners returned true else false.
***REMOVED*** @private
***REMOVED***
goog.events.fireListeners_ = function(map, obj, type, capture, eventObject) {
  var retval = 1;

  var objUid = goog.getUid(obj);
  if (map[objUid]) {
    var remaining = --map.remaining_;
    var listenerArray = map[objUid];

    // If locked_ is not set (and if already 0) initialize it to 1.
    if (!listenerArray.locked_) {
      listenerArray.locked_ = 1;
    } else {
      listenerArray.locked_++;
    }

    try {
      // Events added in the dispatch phase should not be dispatched in
      // the current dispatch phase. They will be included in the next
      // dispatch phase though.
      var length = listenerArray.length;
      for (var i = 0; i < length; i++) {
        var listener = listenerArray[i];
        // We might not have a listener if the listener was removed.
        if (listener && !listener.removed) {
          retval &=
              goog.events.fireListener(listener, eventObject) !== false;
        }
      }
    } finally {
      // Allow the count of targets remaining to increase (if perhaps we have
      // added listeners) but do not allow it to decrease if we have reentered
      // this method through a listener dispatching the same event type,
      // resetting and exhausted the remaining count.
      map.remaining_ = Math.max(remaining, map.remaining_);
      listenerArray.locked_--;
      goog.events.cleanUp_(type, capture, objUid, listenerArray);
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
  if (listener.callOnce) {
    goog.events.unlistenByKey(listener.key);
  }
  return listener.handleEvent(eventObject);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the total number of listeners currently in the system.
***REMOVED*** @return {number} Number of listeners.
***REMOVED***
goog.events.getTotalListenerCount = function() {
  return goog.object.getCount(goog.events.listeners_);
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
***REMOVED*** @param {goog.events.Listenable|goog.events.EventTarget} src The
***REMOVED***     event target.
***REMOVED*** @param {goog.events.EventLike} e Event object.
***REMOVED*** @return {boolean} If anyone called preventDefault on the event object (or
***REMOVED***     if any of the handlers returns false) this will also return false.
***REMOVED***     If there are no handlers, or if all handlers return true, this returns
***REMOVED***     true.
***REMOVED***
goog.events.dispatchEvent = function(src, e) {
  if (goog.events.Listenable.USE_LISTENABLE_INTERFACE) {
    return src.dispatchEvent(e);
  }

  var type = e.type || e;
  var map = goog.events.listenerTree_;
  if (!(type in map)) {
    return true;
  }

  // If accepting a string or object, create a custom event object so that
  // preventDefault and stopPropagation work with the event.
  if (goog.isString(e)) {
    e = new goog.events.Event(e, src);
  } else if (!(e instanceof goog.events.Event)) {
    var oldEvent = e;
    e = new goog.events.Event(***REMOVED*** @type {string}***REMOVED*** (type), src);
    goog.object.extend(e, oldEvent);
  } else {
    e.target = e.target || src;
  }

  var rv = 1, ancestors;

  map = map[type];
  var hasCapture = true in map;
  var targetsMap;

  if (hasCapture) {
    // Build ancestors now
    ancestors = [];
    for (var parent = src; parent; parent = parent.getParentEventTarget()) {
      ancestors.push(parent);
    }

    targetsMap = map[true];
    targetsMap.remaining_ = targetsMap.count_;

    // Call capture listeners
    for (var i = ancestors.length - 1;
         !e.propagationStopped_ && i >= 0 && targetsMap.remaining_;
         i--) {
      e.currentTarget = ancestors[i];
      rv &= goog.events.fireListeners_(targetsMap, ancestors[i], e.type,
                                       true, e) &&
            e.returnValue_ != false;
    }
  }

  var hasBubble = false in map;
  if (hasBubble) {
    targetsMap = map[false];
    targetsMap.remaining_ = targetsMap.count_;

    if (hasCapture) { // We have the ancestors.

      // Call bubble listeners
      for (var i = 0; !e.propagationStopped_ && i < ancestors.length &&
           targetsMap.remaining_;
           i++) {
        e.currentTarget = ancestors[i];
        rv &= goog.events.fireListeners_(targetsMap, ancestors[i], e.type,
                                         false, e) &&
              e.returnValue_ != false;
      }
    } else {
      // In case we don't have capture we don't have to build up the
      // ancestors array.

      for (var current = src;
           !e.propagationStopped_ && current && targetsMap.remaining_;
           current = current.getParentEventTarget()) {
        e.currentTarget = current;
        rv &= goog.events.fireListeners_(targetsMap, current, e.type,
                                         false, e) &&
              e.returnValue_ != false;
      }
    }
  }

  return Boolean(rv);
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
***REMOVED*** @this {goog.events.EventTarget|Object} The object or Element that
***REMOVED***     fired the event.
***REMOVED*** @private
***REMOVED***
goog.events.handleBrowserEvent_ = function(listener, opt_evt) {
  if (listener.removed) {
    return true;
  }

  var type = listener.type;
  var map = goog.events.listenerTree_;

  if (!(type in map)) {
    return true;
  }
  map = map[type];
  var retval, targetsMap;
  // Synthesize event propagation if the browser does not support W3C
  // event model.
  if (!goog.events.BrowserFeature.HAS_W3C_EVENT_SUPPORT) {
    var ieEvent = opt_evt ||
       ***REMOVED*****REMOVED*** @type {Event}***REMOVED*** (goog.getObjectByName('window.event'));

    // Check if we have any capturing event listeners for this type.
    var hasCapture = true in map;
    var hasBubble = false in map;

    if (hasCapture) {
      if (goog.events.isMarkedIeEvent_(ieEvent)) {
        return true;
      }

      goog.events.markIeEvent_(ieEvent);
    }

    var evt = new goog.events.BrowserEvent();
    // TODO(user): update @this for this function
    evt.init(ieEvent,***REMOVED*****REMOVED*** @type {EventTarget}***REMOVED*** (this));

    retval = true;
    try {
      if (hasCapture) {
        var ancestors = [];

        for (var parent = evt.currentTarget;
             parent;
             parent = parent.parentNode) {
          ancestors.push(parent);
        }

        targetsMap = map[true];
        targetsMap.remaining_ = targetsMap.count_;

        // Call capture listeners
        for (var i = ancestors.length - 1;
             !evt.propagationStopped_ && i >= 0 && targetsMap.remaining_;
             i--) {
          evt.currentTarget = ancestors[i];
          retval &= goog.events.fireListeners_(targetsMap, ancestors[i], type,
                                               true, evt);
        }

        if (hasBubble) {
          targetsMap = map[false];
          targetsMap.remaining_ = targetsMap.count_;

          // Call bubble listeners
          for (var i = 0;
               !evt.propagationStopped_ && i < ancestors.length &&
               targetsMap.remaining_;
               i++) {
            evt.currentTarget = ancestors[i];
            retval &= goog.events.fireListeners_(targetsMap, ancestors[i], type,
                                                 false, evt);
          }
        }

      } else {
        // Bubbling, let IE handle the propagation.
        retval = goog.events.fireListener(listener, evt);
      }

    } finally {
      if (ancestors) {
        ancestors.length = 0;
      }
    }
    return retval;
  } // IE

  // Caught a non-IE DOM event. 1 additional argument which is the event object
  var be = new goog.events.BrowserEvent(
      opt_evt,***REMOVED*****REMOVED*** @type {EventTarget}***REMOVED*** (this));
  retval = goog.events.fireListener(listener, be);
  return retval;
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
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.events.uniqueIdCounter_ = 0;


***REMOVED***
***REMOVED*** Creates a unique event id.
***REMOVED***
***REMOVED*** @param {string} identifier The identifier.
***REMOVED*** @return {string} A unique identifier.
***REMOVED***
goog.events.getUniqueId = function(identifier) {
  return identifier + '_' + goog.events.uniqueIdCounter_++;
***REMOVED***


***REMOVED***
***REMOVED*** Expando property for listener function wrapper for Object with
***REMOVED*** handleEvent.
***REMOVED*** @type {string}
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
***REMOVED*** @private
***REMOVED***
goog.events.wrapListener_ = function(listener) {
  if (goog.isFunction(listener)) {
    return listener;
  }

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
