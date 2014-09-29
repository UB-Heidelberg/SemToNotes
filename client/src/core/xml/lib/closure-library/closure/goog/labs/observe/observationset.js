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
***REMOVED*** @fileoverview A set of observations. This set provides a convenient
***REMOVED*** means of observing many observables at once.
***REMOVED***
***REMOVED*** This is similar in purpose to {@code goog.events.EventHandler}.
***REMOVED***
***REMOVED***

goog.provide('goog.labs.observe.ObservationSet');

goog.require('goog.array');
goog.require('goog.labs.observe.Observer');



***REMOVED***
***REMOVED*** A set of observations. An observation is defined by an observable
***REMOVED*** and an observer. The set keeps track of observations and
***REMOVED*** allows their removal.
***REMOVED*** @param {!Object=} opt_defaultScope Optional function scope to use
***REMOVED***     when using {@code observeWithFunction} and
***REMOVED***     {@code unobserveWithFunction}.
***REMOVED***
***REMOVED***
goog.labs.observe.ObservationSet = function(opt_defaultScope) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {!Array.<!goog.labs.observe.ObservationSet.Observation_>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.storedObservations_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {!Object|undefined}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.defaultScope_ = opt_defaultScope;
***REMOVED***


***REMOVED***
***REMOVED*** Observes the given observer on the observable.
***REMOVED*** @param {!goog.labs.observe.Observable} observable The observable to
***REMOVED***     observe on.
***REMOVED*** @param {!goog.labs.observe.Observer} observer The observer.
***REMOVED*** @return {boolean} True if the observer is successfully registered.
***REMOVED***
goog.labs.observe.ObservationSet.prototype.observe = function(
    observable, observer) {
  var success = observable.observe(observer);
  if (success) {
    this.storedObservations_.push(
        new goog.labs.observe.ObservationSet.Observation_(
            observable, observer));
  }
  return success;
***REMOVED***


***REMOVED***
***REMOVED*** Observes the given function on the observable.
***REMOVED*** @param {!goog.labs.observe.Observable} observable The observable to
***REMOVED***     observe on.
***REMOVED*** @param {function(!goog.labs.observe.Notice)} fn The handler function.
***REMOVED*** @param {!Object=} opt_scope Optional scope.
***REMOVED*** @return {goog.labs.observe.Observer} The registered observer object.
***REMOVED***     If the observer is not successfully registered, this will be null.
***REMOVED***
goog.labs.observe.ObservationSet.prototype.observeWithFunction = function(
    observable, fn, opt_scope) {
  var observer = goog.labs.observe.Observer.fromFunction(
      fn, opt_scope || this.defaultScope_);
  if (this.observe(observable, observer)) {
    return observer;
  }
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Unobserves the given observer from the observable.
***REMOVED*** @param {!goog.labs.observe.Observable} observable The observable to
***REMOVED***     unobserve from.
***REMOVED*** @param {!goog.labs.observe.Observer} observer The observer.
***REMOVED*** @return {boolean} True if the observer is successfully removed.
***REMOVED***
goog.labs.observe.ObservationSet.prototype.unobserve = function(
    observable, observer) {
  var removed = goog.array.removeIf(
      this.storedObservations_, function(o) {
        return o.observable == observable &&
            goog.labs.observe.Observer.equals(o.observer, observer);
      });

  if (removed) {
    observable.unobserve(observer);
  }
  return removed;
***REMOVED***


***REMOVED***
***REMOVED*** Unobserves the given function from the observable.
***REMOVED*** @param {!goog.labs.observe.Observable} observable The observable to
***REMOVED***     unobserve from.
***REMOVED*** @param {function(!goog.labs.observe.Notice)} fn The handler function.
***REMOVED*** @param {!Object=} opt_scope Optional scope.
***REMOVED*** @return {boolean} True if the observer is successfully removed.
***REMOVED***
goog.labs.observe.ObservationSet.prototype.unobserveWithFunction = function(
    observable, fn, opt_scope) {
  var observer = goog.labs.observe.Observer.fromFunction(
      fn, opt_scope || this.defaultScope_);
  return this.unobserve(observable, observer);
***REMOVED***


***REMOVED***
***REMOVED*** Removes all observations registered through this set.
***REMOVED***
goog.labs.observe.ObservationSet.prototype.removeAll = function() {
  goog.array.forEach(this.storedObservations_, function(observation) {
    var observable = observation.observable;
    var observer = observation.observer;
    observable.unobserve(observer);
  });
***REMOVED***



***REMOVED***
***REMOVED*** A representation of an observation, which is defined uniquely by
***REMOVED*** the observable and observer.
***REMOVED*** @param {!goog.labs.observe.Observable} observable The observable.
***REMOVED*** @param {!goog.labs.observe.Observer} observer The observer.
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.labs.observe.ObservationSet.Observation_ = function(
    observable, observer) {
  this.observable = observable;
  this.observer = observer;
***REMOVED***
