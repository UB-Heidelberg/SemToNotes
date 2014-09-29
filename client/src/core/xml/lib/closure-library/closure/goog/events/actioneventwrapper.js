// Copyright 2009 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Action event wrapper implementation.
***REMOVED*** @author eae@google.com (Emil A Eklund)
***REMOVED***

goog.provide('goog.events.actionEventWrapper');

***REMOVED***
goog.require('goog.events.EventHandler');
***REMOVED***
goog.require('goog.events.EventWrapper');
goog.require('goog.events.KeyCodes');



***REMOVED***
***REMOVED*** Event wrapper for action handling. Fires when an element is activated either
***REMOVED*** by clicking it or by focusing it and pressing Enter.
***REMOVED***
***REMOVED***
***REMOVED*** @implements {goog.events.EventWrapper}
***REMOVED*** @private
***REMOVED***
goog.events.ActionEventWrapper_ = function() {
***REMOVED***


***REMOVED***
***REMOVED*** Singleton instance of ActionEventWrapper_.
***REMOVED*** @type {goog.events.ActionEventWrapper_}
***REMOVED***
goog.events.actionEventWrapper = new goog.events.ActionEventWrapper_();


***REMOVED***
***REMOVED*** Event types used by the wrapper.
***REMOVED***
***REMOVED*** @type {Array.<goog.events.EventType>}
***REMOVED*** @private
***REMOVED***
goog.events.ActionEventWrapper_.EVENT_TYPES_ = [
  goog.events.EventType.CLICK,
  goog.userAgent.GECKO ?
      goog.events.EventType.KEYPRESS :
      goog.events.EventType.KEYDOWN
];


***REMOVED***
***REMOVED*** Adds an event listener using the wrapper on a DOM Node or an object that has
***REMOVED*** implemented {@link goog.events.EventTarget}. A listener can only be added
***REMOVED*** once to an object.
***REMOVED***
***REMOVED*** @param {EventTarget|goog.events.EventTarget} target The node to listen to
***REMOVED***     events on.
***REMOVED*** @param {Function|Object} listener Callback method, or an object with a
***REMOVED***     handleEvent function.
***REMOVED*** @param {boolean=} opt_capt Whether to fire in capture phase (defaults to
***REMOVED***     false).
***REMOVED*** @param {Object=} opt_scope Element in whose scope to call the listener.
***REMOVED*** @param {goog.events.EventHandler=} opt_eventHandler Event handler to add
***REMOVED***     listener to.
***REMOVED*** @override
***REMOVED***
goog.events.ActionEventWrapper_.prototype.listen = function(target, listener,
    opt_capt, opt_scope, opt_eventHandler) {
  var callback = function(e) {
    if (e.type == goog.events.EventType.CLICK && e.isMouseActionButton()) {
      listener.call(opt_scope, e);
    } else if (e.keyCode == goog.events.KeyCodes.ENTER ||
        e.keyCode == goog.events.KeyCodes.MAC_ENTER) {
      // convert keydown to keypress for backward compatibility.
      e.type = goog.events.EventType.KEYPRESS;
      listener.call(opt_scope, e);
    }
 ***REMOVED*****REMOVED***
  callback.listener_ = listener;
  callback.scope_ = opt_scope;

  if (opt_eventHandler) {
    opt_eventHandler.listen(target,
        goog.events.ActionEventWrapper_.EVENT_TYPES_,
        callback, opt_capt);
  } else {
  ***REMOVED***target,
        goog.events.ActionEventWrapper_.EVENT_TYPES_,
        callback, opt_capt);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Removes an event listener added using goog.events.EventWrapper.listen.
***REMOVED***
***REMOVED*** @param {EventTarget|goog.events.EventTarget} target The node to remove
***REMOVED***    listener from.
***REMOVED*** @param {Function|Object} listener Callback method, or an object with a
***REMOVED***     handleEvent function.
***REMOVED*** @param {boolean=} opt_capt Whether to fire in capture phase (defaults to
***REMOVED***     false).
***REMOVED*** @param {Object=} opt_scope Element in whose scope to call the listener.
***REMOVED*** @param {goog.events.EventHandler=} opt_eventHandler Event handler to remove
***REMOVED***     listener from.
***REMOVED*** @override
***REMOVED***
goog.events.ActionEventWrapper_.prototype.unlisten = function(target, listener,
    opt_capt, opt_scope, opt_eventHandler) {
  for (var type, j = 0; type = goog.events.ActionEventWrapper_.EVENT_TYPES_[j];
      j++) {
    var listeners = goog.events.getListeners(target, type, !!opt_capt);
    for (var obj, i = 0; obj = listeners[i]; i++) {
      if (obj.listener.listener_ == listener &&
          obj.listener.scope_ == opt_scope) {
        if (opt_eventHandler) {
          opt_eventHandler.unlisten(target, type, obj.listener, opt_capt,
              opt_scope);
        } else {
          goog.events.unlisten(target, type, obj.listener, opt_capt, opt_scope);
        }
        break;
      }
    }
  }
***REMOVED***
