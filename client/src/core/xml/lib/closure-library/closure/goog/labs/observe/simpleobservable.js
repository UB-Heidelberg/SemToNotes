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
***REMOVED*** @fileoverview An implementation of {@code Observable} that can be
***REMOVED*** used as base class or composed into another class that wants to
***REMOVED*** implement {@code Observable}.
***REMOVED***

goog.provide('goog.labs.observe.SimpleObservable');

goog.require('goog.Disposable');
goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.labs.observe.Notice');
goog.require('goog.labs.observe.Observable');
goog.require('goog.labs.observe.Observer');
goog.require('goog.object');



***REMOVED***
***REMOVED*** A simple implementation of {@code goog.labs.observe.Observable} that can
***REMOVED*** be used as a standalone observable or as a base class for other
***REMOVED*** observable object.
***REMOVED***
***REMOVED*** When another class wants to implement observable without extending
***REMOVED*** {@code SimpleObservable}, they can create an instance of
***REMOVED*** {@code SimpleObservable}, specifying {@code opt_actualObservable},
***REMOVED*** and delegate to the instance. Here is a trivial example:
***REMOVED***
***REMOVED*** <pre>
***REMOVED***   ClassA = function() {
***REMOVED***     goog.base(this);
***REMOVED***     this.observable_ = new SimpleObservable(this);
***REMOVED***     this.registerDisposable(this.observable_);
***REMOVED***  ***REMOVED*****REMOVED***
***REMOVED***   goog.inherits(ClassA, goog.Disposable);
***REMOVED***
***REMOVED***   ClassA.prototype.observe = function(observer) {
***REMOVED***     this.observable_.observe(observer);
***REMOVED***  ***REMOVED*****REMOVED***
***REMOVED***
***REMOVED***   ClassA.prototype.unobserve = function(observer) {
***REMOVED***     this.observable_.unobserve(observer);
***REMOVED***  ***REMOVED*****REMOVED***
***REMOVED***
***REMOVED***   ClassA.prototype.notify = function(opt_data) {
***REMOVED***     this.observable_.notify(opt_data);
***REMOVED***  ***REMOVED*****REMOVED***
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** @param {!goog.labs.observe.Observable=} opt_actualObservable
***REMOVED***     Optional observable object. Defaults to 'this'. When used as
***REMOVED***     base class, the parameter need not be given. It is only useful
***REMOVED***     when using this class to implement implement {@code Observable}
***REMOVED***     interface on another object, see example above.
***REMOVED***
***REMOVED*** @implements {goog.labs.observe.Observable}
***REMOVED*** @extends {goog.Disposable}
***REMOVED***
goog.labs.observe.SimpleObservable = function(opt_actualObservable) {
  goog.base(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {!goog.labs.observe.Observable}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.actualObservable_ = opt_actualObservable || this;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Observers registered on this object.
  ***REMOVED*** @type {!Array.<!goog.labs.observe.Observer>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.observers_ = [];
***REMOVED***
goog.inherits(goog.labs.observe.SimpleObservable, goog.Disposable);


***REMOVED*** @override***REMOVED***
goog.labs.observe.SimpleObservable.prototype.observe = function(observer) {
  goog.asserts.assert(!this.isDisposed());

  // Registers the (type, observer) only if it has not been previously
  // registered.
  var shouldRegisterObserver = !goog.array.some(this.observers_, goog.partial(
      goog.labs.observe.Observer.equals, observer));
  if (shouldRegisterObserver) {
    this.observers_.push(observer);
  }
  return shouldRegisterObserver;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.labs.observe.SimpleObservable.prototype.unobserve = function(observer) {
  goog.asserts.assert(!this.isDisposed());
  return goog.array.removeIf(this.observers_, goog.partial(
      goog.labs.observe.Observer.equals, observer));
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.labs.observe.SimpleObservable.prototype.notify = function(opt_data) {
  goog.asserts.assert(!this.isDisposed());
  var notice = new goog.labs.observe.Notice(this.actualObservable_, opt_data);
  goog.array.forEach(
      goog.array.clone(this.observers_), function(observer) {
        observer.notify(notice);
      });
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.labs.observe.SimpleObservable.prototype.disposeInternal = function() {
  this.observers_.length = 0;
***REMOVED***
