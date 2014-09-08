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
***REMOVED*** @fileoverview Datastructure: Queue.
***REMOVED***
***REMOVED***
***REMOVED*** This file provides the implementation of a FIFO Queue structure.
***REMOVED*** API is similar to that of com.google.common.collect.IntQueue
***REMOVED***
***REMOVED*** The implementation is a classic 2-stack queue.
***REMOVED*** There's a "front" stack and a "back" stack.
***REMOVED*** Items are pushed onto "back" and popped from "front".
***REMOVED*** When "front" is empty, we replace "front" with reverse(back).
***REMOVED***
***REMOVED*** Example:
***REMOVED*** front                         back            op
***REMOVED*** []                            []              enqueue 1
***REMOVED*** []                            [1]             enqueue 2
***REMOVED*** []                            [1,2]           enqueue 3
***REMOVED*** []                            [1,2,3]         dequeue -> ...
***REMOVED*** [3,2,1]                       []              ... -> 1
***REMOVED*** [3,2]                         []              enqueue 4
***REMOVED*** [3,2]                         [4]             dequeue -> 2
***REMOVED*** [3]                           [4]
***REMOVED***
***REMOVED*** Front and back are simple javascript arrays. We rely on
***REMOVED*** Array.push and Array.pop being O(1) amortized.
***REMOVED***
***REMOVED*** Note: In V8, queues, up to a certain size, can be implemented
***REMOVED*** just fine using Array.push and Array.shift, but other JavaScript
***REMOVED*** engines do not have the optimization of Array.shift.
***REMOVED***
***REMOVED***

goog.provide('goog.structs.Queue');

goog.require('goog.array');



***REMOVED***
***REMOVED*** Class for FIFO Queue data structure.
***REMOVED***
***REMOVED***
***REMOVED*** @template T
***REMOVED***
goog.structs.Queue = function() {
 ***REMOVED*****REMOVED***
  ***REMOVED*** @private {!Array.<T>} Front stack. Items are pop()'ed from here.
 ***REMOVED*****REMOVED***
  this.front_ = [];
 ***REMOVED*****REMOVED***
  ***REMOVED*** @private {!Array.<T>} Back stack. Items are push()'ed here.
 ***REMOVED*****REMOVED***
  this.back_ = [];
***REMOVED***


***REMOVED***
***REMOVED*** Flips the back stack onto the front stack if front is empty,
***REMOVED*** to prepare for peek() or dequeue().
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.structs.Queue.prototype.maybeFlip_ = function() {
  if (goog.array.isEmpty(this.front_)) {
    this.front_ = this.back_;
    this.front_.reverse();
    this.back_ = [];
  }
***REMOVED***


***REMOVED***
***REMOVED*** Puts the specified element on this queue.
***REMOVED*** @param {T} element The element to be added to the queue.
***REMOVED***
goog.structs.Queue.prototype.enqueue = function(element) {
  this.back_.push(element);
***REMOVED***


***REMOVED***
***REMOVED*** Retrieves and removes the head of this queue.
***REMOVED*** @return {T} The element at the head of this queue. Returns undefined if the
***REMOVED***     queue is empty.
***REMOVED***
goog.structs.Queue.prototype.dequeue = function() {
  this.maybeFlip_();
  return this.front_.pop();
***REMOVED***


***REMOVED***
***REMOVED*** Retrieves but does not remove the head of this queue.
***REMOVED*** @return {T} The element at the head of this queue. Returns undefined if the
***REMOVED***     queue is empty.
***REMOVED***
goog.structs.Queue.prototype.peek = function() {
  this.maybeFlip_();
  return goog.array.peek(this.front_);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the number of elements in this queue.
***REMOVED*** @return {number} The number of elements in this queue.
***REMOVED***
goog.structs.Queue.prototype.getCount = function() {
  return this.front_.length + this.back_.length;
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if this queue contains no elements.
***REMOVED*** @return {boolean} true if this queue contains no elements.
***REMOVED***
goog.structs.Queue.prototype.isEmpty = function() {
  return goog.array.isEmpty(this.front_) &&
         goog.array.isEmpty(this.back_);
***REMOVED***


***REMOVED***
***REMOVED*** Removes all elements from the queue.
***REMOVED***
goog.structs.Queue.prototype.clear = function() {
  this.front_ = [];
  this.back_ = [];
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the given value is in the queue.
***REMOVED*** @param {T} obj The value to look for.
***REMOVED*** @return {boolean} Whether the object is in the queue.
***REMOVED***
goog.structs.Queue.prototype.contains = function(obj) {
  return goog.array.contains(this.front_, obj) ||
         goog.array.contains(this.back_, obj);
***REMOVED***


***REMOVED***
***REMOVED*** Removes the first occurrence of a particular value from the queue.
***REMOVED*** @param {T} obj Object to remove.
***REMOVED*** @return {boolean} True if an element was removed.
***REMOVED***
goog.structs.Queue.prototype.remove = function(obj) {
  // TODO(user): Implement goog.array.removeLast() and use it here.
  var index = goog.array.lastIndexOf(this.front_, obj);
  if (index < 0) {
    return goog.array.remove(this.back_, obj);
  }
  goog.array.removeAt(this.front_, index);
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Returns all the values in the queue.
***REMOVED*** @return {!Array.<T>} An array of the values in the queue.
***REMOVED***
goog.structs.Queue.prototype.getValues = function() {
  var res = [];
  // Add the front array in reverse, then the back array.
  for (var i = this.front_.length - 1; i >= 0; --i) {
    res.push(this.front_[i]);
  }
  var len = this.back_.length;
  for (var i = 0; i < len; ++i) {
    res.push(this.back_[i]);
  }
  return res;
***REMOVED***
