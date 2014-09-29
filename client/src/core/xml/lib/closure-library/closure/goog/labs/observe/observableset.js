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
***REMOVED*** @fileoverview A set of {@code goog.labs.observe.Observable}s that
***REMOVED*** allow registering and removing observers to all of the observables
***REMOVED*** in the set.
***REMOVED***

goog.provide('goog.labs.observe.ObservableSet');

goog.require('goog.array');
goog.require('goog.labs.observe.Observer');



***REMOVED***
***REMOVED*** Creates a set of observables.
***REMOVED***
***REMOVED*** An ObservableSet is a collection of observables. Observers may be
***REMOVED*** reigstered and will receive notifications when any of the
***REMOVED*** observables notify. This class is meant to simplify management of
***REMOVED*** observations on multiple observables of the same nature.
***REMOVED***
***REMOVED***
***REMOVED***
goog.labs.observe.ObservableSet = function() {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The observers registered with this set.
  ***REMOVED*** @type {!Array.<!goog.labs.observe.Observer>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.observers_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** The observables in this set.
  ***REMOVED*** @type {!Array.<!goog.labs.observe.Observable>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.observables_ = [];
***REMOVED***


***REMOVED***
***REMOVED*** Adds an observer that observes all observables in the set. If new
***REMOVED*** observables are added to or removed from the set, the observer will
***REMOVED*** be registered or unregistered accordingly.
***REMOVED***
***REMOVED*** The observer will not be added if there is already an equivalent
***REMOVED*** observer.
***REMOVED***
***REMOVED*** @param {!goog.labs.observe.Observer} observer The observer to invoke.
***REMOVED*** @return {boolean} Whether the observer is actually added.
***REMOVED***
goog.labs.observe.ObservableSet.prototype.addObserver = function(observer) {
  // Check whether the observer already exists.
  if (goog.array.find(this.observers_, goog.partial(
          goog.labs.observe.Observer.equals, observer))) {
    return false;
  }

  this.observers_.push(observer);
  goog.array.forEach(this.observables_, function(o) {
    o.observe(observer);
  });
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Removes an observer from the set. The observer will be removed from
***REMOVED*** all observables in the set. Does nothing if the observer is not in
***REMOVED*** the set.
***REMOVED*** @param {!goog.labs.observe.Observer} observer The observer to remove.
***REMOVED*** @return {boolean} Whether the observer is actually removed.
***REMOVED***
goog.labs.observe.ObservableSet.prototype.removeObserver = function(observer) {
  // Check that the observer exists before removing.
  var removed = goog.array.removeIf(this.observers_, goog.partial(
      goog.labs.observe.Observer.equals, observer));

  if (removed) {
    goog.array.forEach(this.observables_, function(o) {
      o.unobserve(observer);
    });
  }
  return removed;
***REMOVED***


***REMOVED***
***REMOVED*** Removes all registered observers.
***REMOVED***
goog.labs.observe.ObservableSet.prototype.removeAllObservers = function() {
  this.unregisterAll_();
  this.observers_.length = 0;
***REMOVED***


***REMOVED***
***REMOVED*** Adds an observable to the set. All previously added and future
***REMOVED*** observers will be added to the new observable as well.
***REMOVED***
***REMOVED*** The observable will not be added if it is already registered in the
***REMOVED*** set.
***REMOVED***
***REMOVED*** @param {!goog.labs.observe.Observable} observable The observable to add.
***REMOVED*** @return {boolean} Whether the observable is actually added.
***REMOVED***
goog.labs.observe.ObservableSet.prototype.addObservable = function(observable) {
  if (goog.array.contains(this.observables_, observable)) {
    return false;
  }

  this.observables_.push(observable);
  goog.array.forEach(this.observers_, function(observer) {
    observable.observe(observer);
  });
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Removes an observable from the set. All observers registered on the
***REMOVED*** set will be removed from the observable as well.
***REMOVED*** @param {!goog.labs.observe.Observable} observable The observable to remove.
***REMOVED*** @return {boolean} Whether the observable is actually removed.
***REMOVED***
goog.labs.observe.ObservableSet.prototype.removeObservable = function(
    observable) {
  var removed = goog.array.remove(this.observables_, observable);
  if (removed) {
    goog.array.forEach(this.observers_, function(observer) {
      observable.unobserve(observer);
    });
  }
  return removed;
***REMOVED***


***REMOVED***
***REMOVED*** Removes all registered observables.
***REMOVED***
goog.labs.observe.ObservableSet.prototype.removeAllObservables = function() {
  this.unregisterAll_();
  this.observables_.length = 0;
***REMOVED***


***REMOVED***
***REMOVED*** Removes all registered observations and observables.
***REMOVED***
goog.labs.observe.ObservableSet.prototype.removeAll = function() {
  this.removeAllObservers();
  this.observables_.length = 0;
***REMOVED***


***REMOVED***
***REMOVED*** Unregisters all registered observers from all registered observables.
***REMOVED*** @private
***REMOVED***
goog.labs.observe.ObservableSet.prototype.unregisterAll_ = function() {
  goog.array.forEach(this.observers_, function(observer) {
    goog.array.forEach(this.observables_, function(o) {
      o.unobserve(observer);
    });
  }, this);
***REMOVED***
