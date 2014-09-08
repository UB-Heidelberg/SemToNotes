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
***REMOVED*** @fileoverview Defines an interface that represents a Result.
***REMOVED***
***REMOVED*** NOTE: goog.result is soft deprecated - we expect to replace this and
***REMOVED*** {@link goog.async.Deferred} with {@link goog.Promise}.
***REMOVED***

goog.provide('goog.result.Result');

goog.require('goog.Thenable');



***REMOVED***
***REMOVED*** A Result object represents a value returned by an asynchronous
***REMOVED*** operation at some point in the future (e.g. a network fetch). This is akin
***REMOVED*** to a 'Promise' or a 'Future' in other languages and frameworks.
***REMOVED***
***REMOVED*** @interface
***REMOVED*** @extends {goog.Thenable}
***REMOVED*** @deprecated Use {@link goog.Promise} instead - http://go/promisemigration
***REMOVED***
goog.result.Result = function() {***REMOVED***


***REMOVED***
***REMOVED*** Attaches handlers to be called when the value of this Result is available.
***REMOVED*** Handlers are called in the order they were added by wait.
***REMOVED***
***REMOVED*** @param {!function(this:T, !goog.result.Result)} handler The function called
***REMOVED***     when the value is available. The function is passed the Result object as
***REMOVED***     the only argument.
***REMOVED*** @param {T=} opt_scope Optional scope for the handler.
***REMOVED*** @template T
***REMOVED***
goog.result.Result.prototype.wait = function(handler, opt_scope) {***REMOVED***


***REMOVED***
***REMOVED*** The States this object can be in.
***REMOVED***
***REMOVED*** @enum {string}
***REMOVED*** @deprecated Use {@link goog.Promise} instead - http://go/promisemigration
***REMOVED***
goog.result.Result.State = {
 ***REMOVED*****REMOVED*** The operation was a success and the value is available.***REMOVED***
  SUCCESS: 'success',

 ***REMOVED*****REMOVED*** The operation resulted in an error.***REMOVED***
  ERROR: 'error',

 ***REMOVED*****REMOVED*** The operation is incomplete and the value is not yet available.***REMOVED***
  PENDING: 'pending'
***REMOVED***


***REMOVED***
***REMOVED*** @return {!goog.result.Result.State} The state of this Result.
***REMOVED***
goog.result.Result.prototype.getState = function() {***REMOVED***


***REMOVED***
***REMOVED*** @return {*} The value of this Result. Will return undefined if the Result is
***REMOVED***     pending or was an error.
***REMOVED***
goog.result.Result.prototype.getValue = function() {***REMOVED***


***REMOVED***
***REMOVED*** @return {*} The error slug for this Result. Will return undefined if the
***REMOVED***     Result was a success, the error slug was not set, or if the Result is
***REMOVED***     pending.
***REMOVED***
goog.result.Result.prototype.getError = function() {***REMOVED***


***REMOVED***
***REMOVED*** Cancels the current Result, invoking the canceler function, if set.
***REMOVED***
***REMOVED*** @return {boolean} Whether the Result was canceled.
***REMOVED***
goog.result.Result.prototype.cancel = function() {***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether this Result was canceled.
***REMOVED***
goog.result.Result.prototype.isCanceled = function() {***REMOVED***



***REMOVED***
***REMOVED*** The value to be passed to the error handlers invoked upon cancellation.
***REMOVED***
***REMOVED*** @extends {Error}
***REMOVED*** @final
***REMOVED*** @deprecated Use {@link goog.Promise} instead - http://go/promisemigration
***REMOVED***
goog.result.Result.CancelError = function() {
  // Note that this does not derive from goog.debug.Error in order to prevent
  // stack trace capture and reduce the amount of garbage generated during a
  // cancel() operation.
***REMOVED***
goog.inherits(goog.result.Result.CancelError, Error);
