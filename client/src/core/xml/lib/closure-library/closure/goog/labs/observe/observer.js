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
***REMOVED*** @fileoverview Provide definition of an observer. This is meant to
***REMOVED*** be used with {@code goog.labs.observe.Observable}.
***REMOVED***
***REMOVED*** This file also provides convenient functions to compare and create
***REMOVED*** Observer objects.
***REMOVED***
***REMOVED***

goog.provide('goog.labs.observe.Observer');



***REMOVED***
***REMOVED*** A class implementing {@code Observer} may be informed of changes in
***REMOVED*** observable object.
***REMOVED*** @see {goog.labs.observe.Observable}
***REMOVED*** @interface
***REMOVED***
goog.labs.observe.Observer = function() {***REMOVED***


***REMOVED***
***REMOVED*** Notifies the observer of changes to the observable object.
***REMOVED*** @param {!goog.labs.observe.Notice} notice The notice object.
***REMOVED***
goog.labs.observe.Observer.prototype.notify;


***REMOVED***
***REMOVED*** Whether this observer is equal to the given observer.
***REMOVED*** @param {!goog.labs.observe.Observer} observer The observer to compare with.
***REMOVED*** @return {boolean} Whether the two observers are equal.
***REMOVED***
goog.labs.observe.Observer.prototype.equals;


***REMOVED***
***REMOVED*** @param {!goog.labs.observe.Observer} observer1 Observer to compare.
***REMOVED*** @param {!goog.labs.observe.Observer} observer2 Observer to compare.
***REMOVED*** @return {boolean} Whether observer1 and observer2 are equal, as
***REMOVED***     determined by the first observer1's {@code equals} method.
***REMOVED***
goog.labs.observe.Observer.equals = function(observer1, observer2) {
  return observer1 == observer2 || observer1.equals(observer2);
***REMOVED***


***REMOVED***
***REMOVED*** Creates an observer that calls the given function.
***REMOVED*** @param {function(!goog.labs.observe.Notice)} fn Function to be converted.
***REMOVED*** @param {!Object=} opt_scope Optional scope to execute the function.
***REMOVED*** @return {!goog.labs.observe.Observer} An observer object.
***REMOVED***
goog.labs.observe.Observer.fromFunction = function(fn, opt_scope) {
  return new goog.labs.observe.Observer.FunctionObserver_(fn, opt_scope);
***REMOVED***



***REMOVED***
***REMOVED*** An observer that calls the given function on {@code notify}.
***REMOVED*** @param {function(!goog.labs.observe.Notice)} fn Function to delegate to.
***REMOVED*** @param {!Object=} opt_scope Optional scope to execute the function.
***REMOVED***
***REMOVED*** @implements {goog.labs.observe.Observer}
***REMOVED*** @private
***REMOVED***
goog.labs.observe.Observer.FunctionObserver_ = function(fn, opt_scope) {
  this.fn_ = fn;
  this.scope_ = opt_scope;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.labs.observe.Observer.FunctionObserver_.prototype.notify = function(
    notice) {
  this.fn_.call(this.scope_, notice);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.labs.observe.Observer.FunctionObserver_.prototype.equals = function(
    observer) {
  return this.fn_ === observer.fn_ && this.scope_ === observer.scope_;
***REMOVED***
