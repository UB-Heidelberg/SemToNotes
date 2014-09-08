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
***REMOVED*** @fileoverview Wraps a storage mechanism with a custom error handler.
***REMOVED***
***REMOVED***

goog.provide('goog.storage.mechanism.ErrorHandlingMechanism');

goog.require('goog.storage.mechanism.Mechanism');



***REMOVED***
***REMOVED*** Wraps a storage mechanism with a custom error handler.
***REMOVED***
***REMOVED*** @param {!goog.storage.mechanism.Mechanism} mechanism Underlying storage
***REMOVED***     mechanism.
***REMOVED*** @param {goog.storage.mechanism.ErrorHandlingMechanism.ErrorHandler}
***REMOVED***     errorHandler An error handler.
***REMOVED***
***REMOVED*** @extends {goog.storage.mechanism.Mechanism}
***REMOVED*** @final
***REMOVED***
goog.storage.mechanism.ErrorHandlingMechanism = function(mechanism,
                                                         errorHandler) {
  goog.storage.mechanism.ErrorHandlingMechanism.base(this, 'constructor');

 ***REMOVED*****REMOVED***
  ***REMOVED*** The mechanism to be wrapped.
  ***REMOVED*** @type {!goog.storage.mechanism.Mechanism}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.mechanism_ = mechanism;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The error handler.
  ***REMOVED*** @type {goog.storage.mechanism.ErrorHandlingMechanism.ErrorHandler}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.errorHandler_ = errorHandler;
***REMOVED***
goog.inherits(goog.storage.mechanism.ErrorHandlingMechanism,
              goog.storage.mechanism.Mechanism);


***REMOVED***
***REMOVED*** Valid storage mechanism operations.
***REMOVED*** @enum {string}
***REMOVED***
goog.storage.mechanism.ErrorHandlingMechanism.Operation = {
  SET: 'set',
  GET: 'get',
  REMOVE: 'remove'
***REMOVED***


***REMOVED***
***REMOVED*** A function that handles errors raised in goog.storage.  Since some places in
***REMOVED*** the goog.storage codebase throw strings instead of Error objects, we accept
***REMOVED*** these as a valid parameter type.  It supports the following arguments:
***REMOVED***
***REMOVED*** 1) The raised error (either in Error or string form);
***REMOVED*** 2) The operation name which triggered the error, as defined per the
***REMOVED***    ErrorHandlingMechanism.Operation enum;
***REMOVED*** 3) The key that is passed to a storage method;
***REMOVED*** 4) An optional value that is passed to a storage method (only used in set
***REMOVED***    operations).
***REMOVED***
***REMOVED*** @typedef {function(
***REMOVED***   (!Error|string),
***REMOVED***   goog.storage.mechanism.ErrorHandlingMechanism.Operation,
***REMOVED***   string,
***REMOVED***  ***REMOVED***=)}
***REMOVED***
goog.storage.mechanism.ErrorHandlingMechanism.ErrorHandler;


***REMOVED*** @override***REMOVED***
goog.storage.mechanism.ErrorHandlingMechanism.prototype.set = function(key,
                                                                       value) {
  try {
    this.mechanism_.set(key, value);
  } catch (e) {
    this.errorHandler_(
        e,
        goog.storage.mechanism.ErrorHandlingMechanism.Operation.SET,
        key,
        value);
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.storage.mechanism.ErrorHandlingMechanism.prototype.get = function(key) {
  try {
    return this.mechanism_.get(key);
  } catch (e) {
    this.errorHandler_(
        e,
        goog.storage.mechanism.ErrorHandlingMechanism.Operation.GET,
        key);
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.storage.mechanism.ErrorHandlingMechanism.prototype.remove = function(key) {
  try {
    this.mechanism_.remove(key);
  } catch (e) {
    this.errorHandler_(
        e,
        goog.storage.mechanism.ErrorHandlingMechanism.Operation.REMOVE,
        key);
  }
***REMOVED***
