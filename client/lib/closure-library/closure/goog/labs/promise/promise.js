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

goog.provide('goog.labs.Promise');
goog.provide('goog.labs.Resolver');

goog.require('goog.Promise');
goog.require('goog.Thenable');
goog.require('goog.promise.Resolver');



***REMOVED***
***REMOVED*** Alias for the {@code goog.Promise} class. Closure Promises were developed
***REMOVED*** under the temporary namespace {@code goog.labs.Promise}. This alias will be
***REMOVED*** removed once existing users have had a chance to migrate to the new name.
***REMOVED***
***REMOVED*** @see goog.Promise
***REMOVED***
***REMOVED*** @deprecated Use goog.Promise instead.
***REMOVED*** @param {function(
***REMOVED***             this:RESOLVER_CONTEXT,
***REMOVED***             function((TYPE|IThenable.<TYPE>|Thenable)),
***REMOVED***             function(*)): void} resolver
***REMOVED*** @param {RESOLVER_CONTEXT=} opt_context
***REMOVED***
***REMOVED*** @struct
***REMOVED*** @final
***REMOVED*** @implements {goog.Thenable.<TYPE>}
***REMOVED*** @template TYPE,RESOLVER_CONTEXT
***REMOVED***
goog.labs.Promise = goog.Promise;



***REMOVED***
***REMOVED*** Alias for the {@code goog.promise.Resolver} interface. This alias will be
***REMOVED*** removed once existing users have had a chance to migrate to the new name.
***REMOVED***
***REMOVED*** @deprecated Use goog.promise.Resolver instead.
***REMOVED*** @interface
***REMOVED*** @template TYPE
***REMOVED***
goog.labs.Resolver = goog.promise.Resolver;
