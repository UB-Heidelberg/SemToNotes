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
***REMOVED*** @fileoverview Definition of the goog.events.EventWrapper interface.
***REMOVED***
***REMOVED*** @author eae@google.com (Emil A Eklund)
***REMOVED***

goog.provide('goog.events.EventWrapper');



***REMOVED***
***REMOVED*** Interface for event wrappers.
***REMOVED*** @interface
***REMOVED***
goog.events.EventWrapper = function() {
***REMOVED***


***REMOVED***
***REMOVED*** Adds an event listener using the wrapper on a DOM Node or an object that has
***REMOVED*** implemented {@link goog.events.EventTarget}. A listener can only be added
***REMOVED*** once to an object.
***REMOVED***
***REMOVED*** @param {goog.events.ListenableType} src The node to listen to events on.
***REMOVED*** @param {function(?):?|{handleEvent:function(?):?}|null} listener Callback
***REMOVED***     method, or an object with a handleEvent function.
***REMOVED*** @param {boolean=} opt_capt Whether to fire in capture phase (defaults to
***REMOVED***     false).
***REMOVED*** @param {Object=} opt_scope Element in whose scope to call the listener.
***REMOVED*** @param {goog.events.EventHandler=} opt_eventHandler Event handler to add
***REMOVED***     listener to.
***REMOVED***
goog.events.EventWrapper.prototype.listen = function(src, listener, opt_capt,
    opt_scope, opt_eventHandler) {
***REMOVED***


***REMOVED***
***REMOVED*** Removes an event listener added using goog.events.EventWrapper.listen.
***REMOVED***
***REMOVED*** @param {goog.events.ListenableType} src The node to remove listener from.
***REMOVED*** @param {function(?):?|{handleEvent:function(?):?}|null} listener Callback
***REMOVED***     method, or an object with a handleEvent function.
***REMOVED*** @param {boolean=} opt_capt Whether to fire in capture phase (defaults to
***REMOVED***     false).
***REMOVED*** @param {Object=} opt_scope Element in whose scope to call the listener.
***REMOVED*** @param {goog.events.EventHandler=} opt_eventHandler Event handler to remove
***REMOVED***     listener from.
***REMOVED***
goog.events.EventWrapper.prototype.unlisten = function(src, listener, opt_capt,
    opt_scope, opt_eventHandler) {
***REMOVED***
