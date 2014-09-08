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
***REMOVED*** @fileoverview Datastructure: Circular Buffer.
***REMOVED***
***REMOVED*** Implements a buffer with a maximum size. New entries override the oldest
***REMOVED*** entries when the maximum size has been reached.
***REMOVED***
***REMOVED***


goog.provide('goog.structs.CircularBuffer');



***REMOVED***
***REMOVED*** Class for CircularBuffer.
***REMOVED*** @param {number=} opt_maxSize The maximum size of the buffer.
***REMOVED***
***REMOVED*** @template T
***REMOVED***
goog.structs.CircularBuffer = function(opt_maxSize) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Index of the next element in the circular array structure.
  ***REMOVED*** @private {number}
 ***REMOVED*****REMOVED***
  this.nextPtr_ = 0;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Maximum size of the the circular array structure.
  ***REMOVED*** @private {number}
 ***REMOVED*****REMOVED***
  this.maxSize_ = opt_maxSize || 100;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Underlying array for the CircularBuffer.
  ***REMOVED*** @private {!Array.<T>}
 ***REMOVED*****REMOVED***
  this.buff_ = [];
***REMOVED***


***REMOVED***
***REMOVED*** Adds an item to the buffer. May remove the oldest item if the buffer is at
***REMOVED*** max size.
***REMOVED*** @param {T} item The item to add.
***REMOVED*** @return {T|undefined} The removed old item, if the buffer is at max size.
***REMOVED***     Return undefined, otherwise.
***REMOVED***
goog.structs.CircularBuffer.prototype.add = function(item) {
  var previousItem = this.buff_[this.nextPtr_];
  this.buff_[this.nextPtr_] = item;
  this.nextPtr_ = (this.nextPtr_ + 1) % this.maxSize_;
  return previousItem;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the item at the specified index.
***REMOVED*** @param {number} index The index of the item. The index of an item can change
***REMOVED***     after calls to {@code add()} if the buffer is at maximum size.
***REMOVED*** @return {T} The item at the specified index.
***REMOVED***
goog.structs.CircularBuffer.prototype.get = function(index) {
  index = this.normalizeIndex_(index);
  return this.buff_[index];
***REMOVED***


***REMOVED***
***REMOVED*** Sets the item at the specified index.
***REMOVED*** @param {number} index The index of the item. The index of an item can change
***REMOVED***     after calls to {@code add()} if the buffer is at maximum size.
***REMOVED*** @param {T} item The item to add.
***REMOVED***
goog.structs.CircularBuffer.prototype.set = function(index, item) {
  index = this.normalizeIndex_(index);
  this.buff_[index] = item;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the current number of items in the buffer.
***REMOVED*** @return {number} The current number of items in the buffer.
***REMOVED***
goog.structs.CircularBuffer.prototype.getCount = function() {
  return this.buff_.length;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the buffer is empty.
***REMOVED***
goog.structs.CircularBuffer.prototype.isEmpty = function() {
  return this.buff_.length == 0;
***REMOVED***


***REMOVED***
***REMOVED*** Empties the current buffer.
***REMOVED***
goog.structs.CircularBuffer.prototype.clear = function() {
  this.buff_.length = 0;
  this.nextPtr_ = 0;
***REMOVED***


***REMOVED*** @return {!Array.<T>} The values in the buffer.***REMOVED***
goog.structs.CircularBuffer.prototype.getValues = function() {
  // getNewestValues returns all the values if the maxCount parameter is the
  // count
  return this.getNewestValues(this.getCount());
***REMOVED***


***REMOVED***
***REMOVED*** Returns the newest values in the buffer up to {@code count}.
***REMOVED*** @param {number} maxCount The maximum number of values to get. Should be a
***REMOVED***     positive number.
***REMOVED*** @return {!Array.<T>} The newest values in the buffer up to {@code count}.
***REMOVED***
goog.structs.CircularBuffer.prototype.getNewestValues = function(maxCount) {
  var l = this.getCount();
  var start = this.getCount() - maxCount;
  var rv = [];
  for (var i = start; i < l; i++) {
    rv.push(this.get(i));
  }
  return rv;
***REMOVED***


***REMOVED*** @return {!Array.<number>} The indexes in the buffer.***REMOVED***
goog.structs.CircularBuffer.prototype.getKeys = function() {
  var rv = [];
  var l = this.getCount();
  for (var i = 0; i < l; i++) {
    rv[i] = i;
  }
  return rv;
***REMOVED***


***REMOVED***
***REMOVED*** Whether the buffer contains the key/index.
***REMOVED*** @param {number} key The key/index to check for.
***REMOVED*** @return {boolean} Whether the buffer contains the key/index.
***REMOVED***
goog.structs.CircularBuffer.prototype.containsKey = function(key) {
  return key < this.getCount();
***REMOVED***


***REMOVED***
***REMOVED*** Whether the buffer contains the given value.
***REMOVED*** @param {T} value The value to check for.
***REMOVED*** @return {boolean} Whether the buffer contains the given value.
***REMOVED***
goog.structs.CircularBuffer.prototype.containsValue = function(value) {
  var l = this.getCount();
  for (var i = 0; i < l; i++) {
    if (this.get(i) == value) {
      return true;
    }
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the last item inserted into the buffer.
***REMOVED*** @return {T|null} The last item inserted into the buffer,
***REMOVED***     or null if the buffer is empty.
***REMOVED***
goog.structs.CircularBuffer.prototype.getLast = function() {
  if (this.getCount() == 0) {
    return null;
  }
  return this.get(this.getCount() - 1);
***REMOVED***


***REMOVED***
***REMOVED*** Helper function to convert an index in the number space of oldest to
***REMOVED*** newest items in the array to the position that the element will be at in the
***REMOVED*** underlying array.
***REMOVED*** @param {number} index The index of the item in a list ordered from oldest to
***REMOVED***     newest.
***REMOVED*** @return {number} The index of the item in the CircularBuffer's underlying
***REMOVED***     array.
***REMOVED*** @private
***REMOVED***
goog.structs.CircularBuffer.prototype.normalizeIndex_ = function(index) {
  if (index >= this.buff_.length) {
    throw Error('Out of bounds exception');
  }

  if (this.buff_.length < this.maxSize_) {
    return index;
  }

  return (this.nextPtr_ + Number(index)) % this.maxSize_;
***REMOVED***
