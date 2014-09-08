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
***REMOVED*** @fileoverview A SimpleResult object that implements goog.result.Result.
***REMOVED*** See below for a more detailed description.
***REMOVED***

goog.provide('goog.result.SimpleResult');
goog.provide('goog.result.SimpleResult.StateError');

goog.require('goog.Promise');
goog.require('goog.Thenable');
goog.require('goog.debug.Error');
goog.require('goog.result.Result');



***REMOVED***
***REMOVED*** A SimpleResult object is a basic implementation of the
***REMOVED*** goog.result.Result interface. This could be subclassed(e.g. XHRResult)
***REMOVED*** or instantiated and returned by another class as a form of result. The caller
***REMOVED*** receiving the result could then attach handlers to be called when the result
***REMOVED*** is resolved(success or error).
***REMOVED***
***REMOVED***
***REMOVED*** @implements {goog.result.Result}
***REMOVED*** @deprecated Use {@link goog.Promise} instead - http://go/promisemigration
***REMOVED***
goog.result.SimpleResult = function() {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The current state of this Result.
  ***REMOVED*** @type {goog.result.Result.State}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.state_ = goog.result.Result.State.PENDING;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The list of handlers to call when this Result is resolved.
  ***REMOVED*** @type {!Array.<!goog.result.SimpleResult.HandlerEntry_>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.handlers_ = [];

  // The value_ and error_ properties are initialized in the constructor to
  // ensure that all SimpleResult instances share the same hidden class in
  // modern JavaScript engines.

 ***REMOVED*****REMOVED***
  ***REMOVED*** The 'value' of this Result.
  ***REMOVED*** @type {*}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.value_ = undefined;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The error slug for this Result.
  ***REMOVED*** @type {*}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.error_ = undefined;
***REMOVED***
goog.Thenable.addImplementation(goog.result.SimpleResult);


***REMOVED***
***REMOVED*** A waiting handler entry.
***REMOVED*** @typedef {{
***REMOVED***   callback: !function(goog.result.SimpleResult),
***REMOVED***   scope: Object
***REMOVED*** }}
***REMOVED*** @private
***REMOVED***
goog.result.SimpleResult.HandlerEntry_;



***REMOVED***
***REMOVED*** Error thrown if there is an attempt to set the value or error for this result
***REMOVED*** more than once.
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.debug.Error}
***REMOVED*** @final
***REMOVED*** @deprecated Use {@link goog.Promise} instead - http://go/promisemigration
***REMOVED***
goog.result.SimpleResult.StateError = function() {
  goog.result.SimpleResult.StateError.base(this, 'constructor',
      'Multiple attempts to set the state of this Result');
***REMOVED***
goog.inherits(goog.result.SimpleResult.StateError, goog.debug.Error);


***REMOVED*** @override***REMOVED***
goog.result.SimpleResult.prototype.getState = function() {
  return this.state_;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.result.SimpleResult.prototype.getValue = function() {
  return this.value_;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.result.SimpleResult.prototype.getError = function() {
  return this.error_;
***REMOVED***


***REMOVED***
***REMOVED*** Attaches handlers to be called when the value of this Result is available.
***REMOVED***
***REMOVED*** @param {!function(this:T, !goog.result.SimpleResult)} handler The function
***REMOVED***     called when the value is available. The function is passed the Result
***REMOVED***     object as the only argument.
***REMOVED*** @param {T=} opt_scope Optional scope for the handler.
***REMOVED*** @template T
***REMOVED*** @override
***REMOVED***
goog.result.SimpleResult.prototype.wait = function(handler, opt_scope) {
  if (this.isPending_()) {
    this.handlers_.push({
      callback: handler,
      scope: opt_scope || null
    });
  } else {
    handler.call(opt_scope, this);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the value of this Result, changing the state.
***REMOVED***
***REMOVED*** @param {*} value The value to set for this Result.
***REMOVED***
goog.result.SimpleResult.prototype.setValue = function(value) {
  if (this.isPending_()) {
    this.value_ = value;
    this.state_ = goog.result.Result.State.SUCCESS;
    this.callHandlers_();
  } else if (!this.isCanceled()) {
    // setValue is a no-op if this Result has been canceled.
    throw new goog.result.SimpleResult.StateError();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the Result to be an error Result.
***REMOVED***
***REMOVED*** @param {*=} opt_error Optional error slug to set for this Result.
***REMOVED***
goog.result.SimpleResult.prototype.setError = function(opt_error) {
  if (this.isPending_()) {
    this.error_ = opt_error;
    this.state_ = goog.result.Result.State.ERROR;
    this.callHandlers_();
  } else if (!this.isCanceled()) {
    // setError is a no-op if this Result has been canceled.
    throw new goog.result.SimpleResult.StateError();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Calls the handlers registered for this Result.
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.result.SimpleResult.prototype.callHandlers_ = function() {
  var handlers = this.handlers_;
  this.handlers_ = [];
  for (var n = 0; n < handlers.length; n++) {
    var handlerEntry = handlers[n];
    handlerEntry.callback.call(handlerEntry.scope, this);
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the Result is pending.
***REMOVED*** @private
***REMOVED***
goog.result.SimpleResult.prototype.isPending_ = function() {
  return this.state_ == goog.result.Result.State.PENDING;
***REMOVED***


***REMOVED***
***REMOVED*** Cancels the Result.
***REMOVED***
***REMOVED*** @return {boolean} Whether the result was canceled. It will not be canceled if
***REMOVED***    the result was already canceled or has already resolved.
***REMOVED*** @override
***REMOVED***
goog.result.SimpleResult.prototype.cancel = function() {
  // cancel is a no-op if the result has been resolved.
  if (this.isPending_()) {
    this.setError(new goog.result.Result.CancelError());
    return true;
  }
  return false;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.result.SimpleResult.prototype.isCanceled = function() {
  return this.state_ == goog.result.Result.State.ERROR &&
         this.error_ instanceof goog.result.Result.CancelError;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.result.SimpleResult.prototype.then = function(
    opt_onFulfilled, opt_onRejected, opt_context) {
  var resolve, reject;
  // Copy the resolvers to outer scope, so that they are available
  // when the callback to wait() fires (which may be synchronous).
  var promise = new goog.Promise(function(res, rej) {
    resolve = res;
    reject = rej;
  });
  this.wait(function(result) {
    if (result.isCanceled()) {
      promise.cancel();
    } else if (result.getState() == goog.result.Result.State.SUCCESS) {
      resolve(result.getValue());
    } else if (result.getState() == goog.result.Result.State.ERROR) {
      reject(result.getError());
    }
  });
  return promise.then(opt_onFulfilled, opt_onRejected, opt_context);
***REMOVED***


***REMOVED***
***REMOVED*** Creates a SimpleResult that fires when the given promise resolves.
***REMOVED*** Use only during migration to Promises.
***REMOVED*** @param {!goog.Promise.<?>} promise
***REMOVED*** @return {!goog.result.Result}
***REMOVED***
goog.result.SimpleResult.fromPromise = function(promise) {
  var result = new goog.result.SimpleResult();
  promise.then(result.setValue, result.setError, result);
  return result;
***REMOVED***
