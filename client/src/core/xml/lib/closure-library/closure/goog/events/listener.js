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
***REMOVED*** @fileoverview Listener object.
***REMOVED*** @see ../demos/events.html
***REMOVED***

goog.provide('goog.events.Listener');

goog.require('goog.events.ListenableKey');



***REMOVED***
***REMOVED*** Simple class that stores information about a listener
***REMOVED*** @implements {goog.events.ListenableKey}
***REMOVED***
***REMOVED***
goog.events.Listener = function() {
  if (goog.events.Listener.ENABLE_MONITORING) {
    this.creationStack = new Error().stack;
  }
***REMOVED***


***REMOVED***
***REMOVED*** @define {boolean} Whether to enable the monitoring of the
***REMOVED***     goog.events.Listener instances. Switching on the monitoring is only
***REMOVED***     recommended for debugging because it has a significant impact on
***REMOVED***     performance and memory usage. If switched off, the monitoring code
***REMOVED***     compiles down to 0 bytes.
***REMOVED***
goog.events.Listener.ENABLE_MONITORING = false;


***REMOVED***
***REMOVED*** Whether the listener is a function or an object that implements handleEvent.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.events.Listener.prototype.isFunctionListener_;


***REMOVED***
***REMOVED*** Call back function or an object with a handleEvent function.
***REMOVED*** @type {Function|Object|null}
***REMOVED***
goog.events.Listener.prototype.listener;


***REMOVED***
***REMOVED*** Proxy for callback that passes through {@link goog.events#HandleEvent_}
***REMOVED*** @type {Function}
***REMOVED***
goog.events.Listener.prototype.proxy;


***REMOVED***
***REMOVED*** Object or node that callback is listening to
***REMOVED*** @type {Object|goog.events.Listenable|goog.events.EventTarget}
***REMOVED***
goog.events.Listener.prototype.src;


***REMOVED***
***REMOVED*** Type of event
***REMOVED*** @type {string}
***REMOVED***
goog.events.Listener.prototype.type;


***REMOVED***
***REMOVED*** Whether the listener is being called in the capture or bubble phase
***REMOVED*** @type {boolean}
***REMOVED***
goog.events.Listener.prototype.capture;


***REMOVED***
***REMOVED*** Optional object whose context to execute the listener in
***REMOVED*** @type {Object|undefined}
***REMOVED***
goog.events.Listener.prototype.handler;


***REMOVED***
***REMOVED*** The key of the listener.
***REMOVED*** @type {number}
***REMOVED*** @override
***REMOVED***
goog.events.Listener.prototype.key = 0;


***REMOVED***
***REMOVED*** Whether the listener has been removed.
***REMOVED*** @type {boolean}
***REMOVED***
goog.events.Listener.prototype.removed = false;


***REMOVED***
***REMOVED*** Whether to remove the listener after it has been called.
***REMOVED*** @type {boolean}
***REMOVED***
goog.events.Listener.prototype.callOnce = false;


***REMOVED***
***REMOVED*** If monitoring the goog.events.Listener instances is enabled, stores the
***REMOVED*** creation stack trace of the Disposable instance.
***REMOVED*** @type {string}
***REMOVED***
goog.events.Listener.prototype.creationStack;


***REMOVED***
***REMOVED*** Initializes the listener.
***REMOVED*** @param {Function|Object} listener Callback function, or an object with a
***REMOVED***     handleEvent function.
***REMOVED*** @param {Function} proxy Wrapper for the listener that patches the event.
***REMOVED*** @param {Object} src Source object for the event.
***REMOVED*** @param {string} type Event type.
***REMOVED*** @param {boolean} capture Whether in capture or bubble phase.
***REMOVED*** @param {Object=} opt_handler Object in whose context to execute the callback.
***REMOVED***
goog.events.Listener.prototype.init = function(listener, proxy, src, type,
                                               capture, opt_handler) {
  // we do the test of the listener here so that we do  not need to
  // continiously do this inside handleEvent
  if (goog.isFunction(listener)) {
    this.isFunctionListener_ = true;
  } else if (listener && listener.handleEvent &&
      goog.isFunction(listener.handleEvent)) {
    this.isFunctionListener_ = false;
  } else {
    throw Error('Invalid listener argument');
  }

  this.listener = listener;
  this.proxy = proxy;
  this.src = src;
  this.type = type;
  this.capture = !!capture;
  this.handler = opt_handler;
  this.callOnce = false;
  this.key = goog.events.ListenableKey.reserveKey();
  this.removed = false;
***REMOVED***


***REMOVED***
***REMOVED*** Calls the internal listener
***REMOVED*** @param {Object} eventObject Event object to be passed to listener.
***REMOVED*** @return {boolean} The result of the internal listener call.
***REMOVED***
goog.events.Listener.prototype.handleEvent = function(eventObject) {
  if (this.isFunctionListener_) {
    return this.listener.call(this.handler || this.src, eventObject);
  }
  return this.listener.handleEvent.call(this.listener, eventObject);
***REMOVED***
