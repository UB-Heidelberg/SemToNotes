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
***REMOVED*** @fileoverview Defines the collection interface.
***REMOVED***
***REMOVED*** @author nnaze@google.com (Nathan Naze)
***REMOVED***

goog.provide('goog.structs.Collection');



***REMOVED***
***REMOVED*** An interface for a collection of values.
***REMOVED*** @interface
***REMOVED***
goog.structs.Collection = function() {***REMOVED***


***REMOVED***
***REMOVED*** @param {*} value Value to add to the collection.
***REMOVED***
goog.structs.Collection.prototype.add;


***REMOVED***
***REMOVED*** @param {*} value Value to remove from the collection.
***REMOVED***
goog.structs.Collection.prototype.remove;


***REMOVED***
***REMOVED*** @param {*} value Value to find in the tree.
***REMOVED*** @return {boolean} Whether the collection contains the specified value.
***REMOVED***
goog.structs.Collection.prototype.contains;


***REMOVED***
***REMOVED*** @return {number} The number of values stored in the collection.
***REMOVED***
goog.structs.Collection.prototype.getCount;

