// Copyright 2011 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Abstract interface for storing and retrieving data using
***REMOVED*** some persistence mechanism.
***REMOVED***
***REMOVED***

goog.provide('goog.storage.mechanism.Mechanism');



***REMOVED***
***REMOVED*** Basic interface for all storage mechanisms.
***REMOVED***
***REMOVED***
***REMOVED***
goog.storage.mechanism.Mechanism = function() {***REMOVED***


***REMOVED***
***REMOVED*** Set a value for a key.
***REMOVED***
***REMOVED*** @param {string} key The key to set.
***REMOVED*** @param {string} value The string to save.
***REMOVED***
goog.storage.mechanism.Mechanism.prototype.set = goog.abstractMethod;


***REMOVED***
***REMOVED*** Get the value stored under a key.
***REMOVED***
***REMOVED*** @param {string} key The key to get.
***REMOVED*** @return {?string} The corresponding value, null if not found.
***REMOVED***
goog.storage.mechanism.Mechanism.prototype.get = goog.abstractMethod;


***REMOVED***
***REMOVED*** Remove a key and its value.
***REMOVED***
***REMOVED*** @param {string} key The key to remove.
***REMOVED***
goog.storage.mechanism.Mechanism.prototype.remove = goog.abstractMethod;
