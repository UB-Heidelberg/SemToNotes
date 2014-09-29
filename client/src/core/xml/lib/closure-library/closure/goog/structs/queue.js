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

goog.provide('goog.structs.Queue');

goog.require('goog.array');



***REMOVED***
***REMOVED*** Class for FIFO Queue data structure.
***REMOVED***
***REMOVED***
***REMOVED***
goog.structs.Queue = function() {
  this.elements_ = [];
***REMOVED***


***REMOVED***
***REMOVED*** The index of the next element to be removed from the queue.
***REMOVED*** @private
***REMOVED*** @type {number}
***REMOVED***
goog.structs.Queue.prototype.head_ = 0;


***REMOVED***
***REMOVED*** The index at which the next element would be added to the queue.
***REMOVED*** @private
***REMOVED*** @type {number}
***REMOVED***
goog.structs.Queue.prototype.tail_ = 0;


***REMOVED***
***REMOVED*** Puts the specified element on this queue.
***REMOVED*** @param {*} element The element to be added to the queue.
***REMOVED***
goog.structs.Queue.prototype.enqueue = function(element) {
  this.elements_[this.tail_++] = element;
***REMOVED***


***REMOVED***
***REMOVED*** Retrieves and removes the head of this queue.
***REMOVED*** @return {*} The element at the head of this queue. Returns undefined if the
***REMOVED***     queue is empty.
***REMOVED***
goog.structs.Queue.prototype.dequeue = function() {
  if (this.head_ == this.tail_) {
    return undefined;
  }
  var result = this.elements_[this.head_];
  delete this.elements_[this.head_];
  this.head_++;
  return result;
***REMOVED***


***REMOVED***
***REMOVED*** Retrieves but does not remove the head of this queue.
***REMOVED*** @return {*} The element at the head of this queue. Returns undefined if the
***REMOVED***     queue is empty.
***REMOVED***
goog.structs.Queue.prototype.peek = function() {
  if (this.head_ == this.tail_) {
    return undefined;
  }
  return this.elements_[this.head_];
***REMOVED***


***REMOVED***
***REMOVED*** Returns the number of elements in this queue.
***REMOVED*** @return {number} The number of elements in this queue.
***REMOVED***
goog.structs.Queue.prototype.getCount = function() {
  return this.tail_ - this.head_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if this queue contains no elements.
***REMOVED*** @return {boolean} true if this queue contains no elements.
***REMOVED***
goog.structs.Queue.prototype.isEmpty = function() {
  return this.tail_ - this.head_ == 0;
***REMOVED***


***REMOVED***
***REMOVED*** Removes all elements from the queue.
***REMOVED***
goog.structs.Queue.prototype.clear = function() {
  this.elements_.length = 0;
  this.head_ = 0;
  this.tail_ = 0;
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the given value is in the queue.
***REMOVED*** @param {*} obj The value to look for.
***REMOVED*** @return {boolean} Whether the object is in the queue.
***REMOVED***
goog.structs.Queue.prototype.contains = function(obj) {
  return goog.array.contains(this.elements_, obj);
***REMOVED***


***REMOVED***
***REMOVED*** Removes the first occurrence of a particular value from the queue.
***REMOVED*** @param {*} obj Object to remove.
***REMOVED*** @return {boolean} True if an element was removed.
***REMOVED***
goog.structs.Queue.prototype.remove = function(obj) {
  var index = goog.array.indexOf(this.elements_, obj);
  if (index < 0) {
    return false;
  }
  if (index == this.head_) {
    this.dequeue();
  } else {
    goog.array.removeAt(this.elements_, index);
    this.tail_--;
  }
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Returns all the values in the queue.
***REMOVED*** @return {Array} An array of the values in the queue.
***REMOVED***
goog.structs.Queue.prototype.getValues = function() {
  return this.elements_.slice(this.head_, this.tail_);
***REMOVED***
