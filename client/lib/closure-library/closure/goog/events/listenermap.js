// Copyright 2013 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview A map of listeners that provides utility functions to
***REMOVED*** deal with listeners on an event target. Used by
***REMOVED*** {@code goog.events.EventTarget}.
***REMOVED***
***REMOVED*** WARNING: Do not use this class from outside goog.events package.
***REMOVED***
***REMOVED*** @visibility {//closure/goog/bin/sizetests:__pkg__}
***REMOVED*** @visibility {//closure/goog/events:__pkg__}
***REMOVED*** @visibility {//closure/goog/labs/events:__pkg__}
***REMOVED***

goog.provide('goog.events.ListenerMap');

goog.require('goog.array');
goog.require('goog.events.Listener');
goog.require('goog.object');



***REMOVED***
***REMOVED*** Creates a new listener map.
***REMOVED*** @param {EventTarget|goog.events.Listenable} src The src object.
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.events.ListenerMap = function(src) {
 ***REMOVED*****REMOVED*** @type {EventTarget|goog.events.Listenable}***REMOVED***
  this.src = src;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Maps of event type to an array of listeners.
  ***REMOVED*** @type {Object.<string, !Array.<!goog.events.Listener>>}
 ***REMOVED*****REMOVED***
  this.listeners = {***REMOVED***

 ***REMOVED*****REMOVED***
  ***REMOVED*** The count of types in this map that have registered listeners.
  ***REMOVED*** @private {number}
 ***REMOVED*****REMOVED***
  this.typeCount_ = 0;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The count of event types in this map that actually
***REMOVED***     have registered listeners.
***REMOVED***
goog.events.ListenerMap.prototype.getTypeCount = function() {
  return this.typeCount_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} Total number of registered listeners.
***REMOVED***
goog.events.ListenerMap.prototype.getListenerCount = function() {
  var count = 0;
  for (var type in this.listeners) {
    count += this.listeners[type].length;
  }
  return count;
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
***REMOVED*** @param {string|!goog.events.EventId} type The listener event type.
***REMOVED*** @param {!Function} listener This listener callback method.
***REMOVED*** @param {boolean} callOnce Whether the listener is a one-off
***REMOVED***     listener.
***REMOVED*** @param {boolean=} opt_useCapture The capture mode of the listener.
***REMOVED*** @param {Object=} opt_listenerScope Object in whose scope to call the
***REMOVED***     listener.
***REMOVED*** @return {goog.events.ListenableKey} Unique key for the listener.
***REMOVED***
goog.events.ListenerMap.prototype.add = function(
    type, listener, callOnce, opt_useCapture, opt_listenerScope) {
  var typeStr = type.toString();
  var listenerArray = this.listeners[typeStr];
  if (!listenerArray) {
    listenerArray = this.listeners[typeStr] = [];
    this.typeCount_++;
  }

  var listenerObj;
  var index = goog.events.ListenerMap.findListenerIndex_(
      listenerArray, listener, opt_useCapture, opt_listenerScope);
  if (index > -1) {
    listenerObj = listenerArray[index];
    if (!callOnce) {
      // Ensure that, if there is an existing callOnce listener, it is no
      // longer a callOnce listener.
      listenerObj.callOnce = false;
    }
  } else {
    listenerObj = new goog.events.Listener(
        listener, null, this.src, typeStr, !!opt_useCapture, opt_listenerScope);
    listenerObj.callOnce = callOnce;
    listenerArray.push(listenerObj);
  }
  return listenerObj;
***REMOVED***


***REMOVED***
***REMOVED*** Removes a matching listener.
***REMOVED*** @param {string|!goog.events.EventId} type The listener event type.
***REMOVED*** @param {!Function} listener This listener callback method.
***REMOVED*** @param {boolean=} opt_useCapture The capture mode of the listener.
***REMOVED*** @param {Object=} opt_listenerScope Object in whose scope to call the
***REMOVED***     listener.
***REMOVED*** @return {boolean} Whether any listener was removed.
***REMOVED***
goog.events.ListenerMap.prototype.remove = function(
    type, listener, opt_useCapture, opt_listenerScope) {
  var typeStr = type.toString();
  if (!(typeStr in this.listeners)) {
    return false;
  }

  var listenerArray = this.listeners[typeStr];
  var index = goog.events.ListenerMap.findListenerIndex_(
      listenerArray, listener, opt_useCapture, opt_listenerScope);
  if (index > -1) {
    var listenerObj = listenerArray[index];
    listenerObj.markAsRemoved();
    goog.array.removeAt(listenerArray, index);
    if (listenerArray.length == 0) {
      delete this.listeners[typeStr];
      this.typeCount_--;
    }
    return true;
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Removes the given listener object.
***REMOVED*** @param {goog.events.ListenableKey} listener The listener to remove.
***REMOVED*** @return {boolean} Whether the listener is removed.
***REMOVED***
goog.events.ListenerMap.prototype.removeByKey = function(listener) {
  var type = listener.type;
  if (!(type in this.listeners)) {
    return false;
  }

  var removed = goog.array.remove(this.listeners[type], listener);
  if (removed) {
    listener.markAsRemoved();
    if (this.listeners[type].length == 0) {
      delete this.listeners[type];
      this.typeCount_--;
    }
  }
  return removed;
***REMOVED***


***REMOVED***
***REMOVED*** Removes all listeners from this map. If opt_type is provided, only
***REMOVED*** listeners that match the given type are removed.
***REMOVED*** @param {string|!goog.events.EventId=} opt_type Type of event to remove.
***REMOVED*** @return {number} Number of listeners removed.
***REMOVED***
goog.events.ListenerMap.prototype.removeAll = function(opt_type) {
  var typeStr = opt_type && opt_type.toString();
  var count = 0;
  for (var type in this.listeners) {
    if (!typeStr || type == typeStr) {
      var listenerArray = this.listeners[type];
      for (var i = 0; i < listenerArray.length; i++) {
        ++count;
        listenerArray[i].markAsRemoved();
      }
      delete this.listeners[type];
      this.typeCount_--;
    }
  }
  return count;
***REMOVED***


***REMOVED***
***REMOVED*** Gets all listeners that match the given type and capture mode. The
***REMOVED*** returned array is a copy (but the listener objects are not).
***REMOVED*** @param {string|!goog.events.EventId} type The type of the listeners
***REMOVED***     to retrieve.
***REMOVED*** @param {boolean} capture The capture mode of the listeners to retrieve.
***REMOVED*** @return {!Array.<goog.events.ListenableKey>} An array of matching
***REMOVED***     listeners.
***REMOVED***
goog.events.ListenerMap.prototype.getListeners = function(type, capture) {
  var listenerArray = this.listeners[type.toString()];
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


***REMOVED***
***REMOVED*** Gets the goog.events.ListenableKey for the event or null if no such
***REMOVED*** listener is in use.
***REMOVED***
***REMOVED*** @param {string|!goog.events.EventId} type The type of the listener
***REMOVED***     to retrieve.
***REMOVED*** @param {!Function} listener The listener function to get.
***REMOVED*** @param {boolean} capture Whether the listener is a capturing listener.
***REMOVED*** @param {Object=} opt_listenerScope Object in whose scope to call the
***REMOVED***     listener.
***REMOVED*** @return {goog.events.ListenableKey} the found listener or null if not found.
***REMOVED***
goog.events.ListenerMap.prototype.getListener = function(
    type, listener, capture, opt_listenerScope) {
  var listenerArray = this.listeners[type.toString()];
  var i = -1;
  if (listenerArray) {
    i = goog.events.ListenerMap.findListenerIndex_(
        listenerArray, listener, capture, opt_listenerScope);
  }
  return i > -1 ? listenerArray[i] : null;
***REMOVED***


***REMOVED***
***REMOVED*** Whether there is a matching listener. If either the type or capture
***REMOVED*** parameters are unspecified, the function will match on the
***REMOVED*** remaining criteria.
***REMOVED***
***REMOVED*** @param {string|!goog.events.EventId=} opt_type The type of the listener.
***REMOVED*** @param {boolean=} opt_capture The capture mode of the listener.
***REMOVED*** @return {boolean} Whether there is an active listener matching
***REMOVED***     the requested type and/or capture phase.
***REMOVED***
goog.events.ListenerMap.prototype.hasListener = function(
    opt_type, opt_capture) {
  var hasType = goog.isDef(opt_type);
  var typeStr = hasType ? opt_type.toString() : '';
  var hasCapture = goog.isDef(opt_capture);

  return goog.object.some(
      this.listeners, function(listenerArray, type) {
        for (var i = 0; i < listenerArray.length; ++i) {
          if ((!hasType || listenerArray[i].type == typeStr) &&
              (!hasCapture || listenerArray[i].capture == opt_capture)) {
            return true;
          }
        }

        return false;
      });
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
goog.events.ListenerMap.findListenerIndex_ = function(
    listenerArray, listener, opt_useCapture, opt_listenerScope) {
  for (var i = 0; i < listenerArray.length; ++i) {
    var listenerObj = listenerArray[i];
    if (!listenerObj.removed &&
        listenerObj.listener == listener &&
        listenerObj.capture == !!opt_useCapture &&
        listenerObj.handler == opt_listenerScope) {
      return i;
    }
  }
  return -1;
***REMOVED***
