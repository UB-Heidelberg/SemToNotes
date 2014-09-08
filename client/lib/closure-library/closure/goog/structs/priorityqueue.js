// Copyright 2006 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Datastructure: Priority Queue.
***REMOVED***
***REMOVED***
***REMOVED*** This file provides the implementation of a Priority Queue. Smaller priorities
***REMOVED*** move to the front of the queue. If two values have the same priority,
***REMOVED*** it is arbitrary which value will come to the front of the queue first.
***REMOVED***

// TODO(user): Should this rely on natural ordering via some Comparable
//     interface?


goog.provide('goog.structs.PriorityQueue');

goog.require('goog.structs.Heap');



***REMOVED***
***REMOVED*** Class for Priority Queue datastructure.
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.structs.Heap.<number, VALUE>}
***REMOVED*** @template VALUE
***REMOVED*** @final
***REMOVED***
goog.structs.PriorityQueue = function() {
  goog.structs.Heap.call(this);
***REMOVED***
goog.inherits(goog.structs.PriorityQueue, goog.structs.Heap);


***REMOVED***
***REMOVED*** Puts the specified value in the queue.
***REMOVED*** @param {number} priority The priority of the value. A smaller value here
***REMOVED***     means a higher priority.
***REMOVED*** @param {VALUE} value The value.
***REMOVED***
goog.structs.PriorityQueue.prototype.enqueue = function(priority, value) {
  this.insert(priority, value);
***REMOVED***


***REMOVED***
***REMOVED*** Retrieves and removes the head of this queue.
***REMOVED*** @return {VALUE} The element at the head of this queue. Returns undefined if
***REMOVED***     the queue is empty.
***REMOVED***
goog.structs.PriorityQueue.prototype.dequeue = function() {
  return this.remove();
***REMOVED***
