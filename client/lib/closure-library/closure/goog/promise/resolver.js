// Copyright 2013 The Closure Library Authors. All Rights Reserved.
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

goog.provide('goog.promise.Resolver');



***REMOVED***
***REMOVED*** Resolver interface for promises. The resolver is a convenience interface that
***REMOVED*** bundles the promise and its associated resolve and reject functions together,
***REMOVED*** for cases where the resolver needs to be persisted internally.
***REMOVED***
***REMOVED*** @interface
***REMOVED*** @template TYPE
***REMOVED***
goog.promise.Resolver = function() {***REMOVED***


***REMOVED***
***REMOVED*** The promise that created this resolver.
***REMOVED*** @const {!goog.Promise.<TYPE>}
***REMOVED***
goog.promise.Resolver.prototype.promise;


***REMOVED***
***REMOVED*** Resolves this resolver with the specified value.
***REMOVED*** @const {function((TYPE|goog.Promise.<TYPE>|Thenable))}
***REMOVED***
goog.promise.Resolver.prototype.resolve;


***REMOVED***
***REMOVED*** Rejects this resolver with the specified reason.
***REMOVED*** @const {function(*): void}
***REMOVED***
goog.promise.Resolver.prototype.reject;
