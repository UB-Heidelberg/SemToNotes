// Copyright 2012 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Experimental observer-observable API. This is
***REMOVED*** intended as super lightweight replacement of
***REMOVED*** goog.events.EventTarget when w3c event model bubble/capture
***REMOVED*** behavior is not required.
***REMOVED***
***REMOVED*** This is similar to {@code goog.pubsub.PubSub} but with different
***REMOVED*** intent and naming so that it is more discoverable. The API is
***REMOVED*** tighter while allowing for more flexibility offered by the
***REMOVED*** interface {@code Observable}.
***REMOVED***
***REMOVED*** WARNING: This is still highly experimental. Please contact author
***REMOVED*** before using this.
***REMOVED***
***REMOVED***

goog.provide('goog.labs.observe.Observable');

goog.require('goog.disposable.IDisposable');



***REMOVED***
***REMOVED*** Interface for an observable object.
***REMOVED*** @interface
***REMOVED*** @extends {goog.disposable.IDisposable}
***REMOVED***
goog.labs.observe.Observable = function() {***REMOVED***


***REMOVED***
***REMOVED*** Registers an observer on the observable.
***REMOVED***
***REMOVED*** Note that no guarantee is provided on order of execution of the
***REMOVED*** observers. For a single notification, one Notice object is reused
***REMOVED*** across all invoked observers.
***REMOVED***
***REMOVED*** Note that if an observation with the same observer is already
***REMOVED*** registered, it will not be registered again. Comparison is done via
***REMOVED*** observer's {@code equals} method.
***REMOVED***
***REMOVED*** @param {!goog.labs.observe.Observer} observer The observer to add.
***REMOVED*** @return {boolean} Whether the observer was successfully added.
***REMOVED***
goog.labs.observe.Observable.prototype.observe = function(observer) {***REMOVED***


***REMOVED***
***REMOVED*** Unregisters an observer from the observable. The parameter must be
***REMOVED*** the same as those passed to {@code observe} method. Comparison is
***REMOVED*** done via observer's {@code equals} method.
***REMOVED*** @param {!goog.labs.observe.Observer} observer The observer to remove.
***REMOVED*** @return {boolean} Whether the observer is removed.
***REMOVED***
goog.labs.observe.Observable.prototype.unobserve = function(observer) {***REMOVED***


***REMOVED***
***REMOVED*** Notifies observers by invoking them. Optionally, a data object may be
***REMOVED*** given to be passed to each observer.
***REMOVED*** @param {*=} opt_data An optional data object.
***REMOVED***
goog.labs.observe.Observable.prototype.notify = function(opt_data) {***REMOVED***
