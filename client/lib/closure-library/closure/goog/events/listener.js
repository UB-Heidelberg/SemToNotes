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
***REMOVED*** @param {!Function} listener Callback function.
***REMOVED*** @param {Function} proxy Wrapper for the listener that patches the event.
***REMOVED*** @param {EventTarget|goog.events.Listenable} src Source object for
***REMOVED***     the event.
***REMOVED*** @param {string} type Event type.
***REMOVED*** @param {boolean} capture Whether in capture or bubble phase.
***REMOVED*** @param {Object=} opt_handler Object in whose context to execute the callback.
***REMOVED*** @implements {goog.events.ListenableKey}
***REMOVED***
***REMOVED***
goog.events.Listener = function(
    listener, proxy, src, type, capture, opt_handler) {
  if (goog.events.Listener.ENABLE_MONITORING) {
    this.creationStack = new Error().stack;
  }

 ***REMOVED*****REMOVED***
  ***REMOVED*** Callback function.
  ***REMOVED*** @type {Function}
 ***REMOVED*****REMOVED***
  this.listener = listener;

 ***REMOVED*****REMOVED***
  ***REMOVED*** A wrapper over the original listener. This is used solely to
  ***REMOVED*** handle native browser events (it is used to simulate the capture
  ***REMOVED*** phase and to patch the event object).
  ***REMOVED*** @type {Function}
 ***REMOVED*****REMOVED***
  this.proxy = proxy;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Object or node that callback is listening to
  ***REMOVED*** @type {EventTarget|goog.events.Listenable}
 ***REMOVED*****REMOVED***
  this.src = src;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The event type.
  ***REMOVED*** @const {string}
 ***REMOVED*****REMOVED***
  this.type = type;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether the listener is being called in the capture or bubble phase
  ***REMOVED*** @const {boolean}
 ***REMOVED*****REMOVED***
  this.capture = !!capture;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Optional object whose context to execute the listener in
  ***REMOVED*** @type {Object|undefined}
 ***REMOVED*****REMOVED***
  this.handler = opt_handler;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The key of the listener.
  ***REMOVED*** @const {number}
  ***REMOVED*** @override
 ***REMOVED*****REMOVED***
  this.key = goog.events.ListenableKey.reserveKey();

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether to remove the listener after it has been called.
  ***REMOVED*** @type {boolean}
 ***REMOVED*****REMOVED***
  this.callOnce = false;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether the listener has been removed.
  ***REMOVED*** @type {boolean}
 ***REMOVED*****REMOVED***
  this.removed = false;
***REMOVED***


***REMOVED***
***REMOVED*** @define {boolean} Whether to enable the monitoring of the
***REMOVED***     goog.events.Listener instances. Switching on the monitoring is only
***REMOVED***     recommended for debugging because it has a significant impact on
***REMOVED***     performance and memory usage. If switched off, the monitoring code
***REMOVED***     compiles down to 0 bytes.
***REMOVED***
goog.define('goog.events.Listener.ENABLE_MONITORING', false);


***REMOVED***
***REMOVED*** If monitoring the goog.events.Listener instances is enabled, stores the
***REMOVED*** creation stack trace of the Disposable instance.
***REMOVED*** @type {string}
***REMOVED***
goog.events.Listener.prototype.creationStack;


***REMOVED***
***REMOVED*** Marks this listener as removed. This also remove references held by
***REMOVED*** this listener object (such as listener and event source).
***REMOVED***
goog.events.Listener.prototype.markAsRemoved = function() {
  this.removed = true;
  this.listener = null;
  this.proxy = null;
  this.src = null;
  this.handler = null;
***REMOVED***
