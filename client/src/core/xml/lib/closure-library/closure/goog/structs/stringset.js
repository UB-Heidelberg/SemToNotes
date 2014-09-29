// Copyright 2009 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Data structure for set of strings.
***REMOVED***
***REMOVED***
***REMOVED*** This class implements a set data structure for strings. Adding and removing
***REMOVED*** is O(1). It doesn't contain any bloat from {@link goog.structs.Set}, i.e.
***REMOVED*** it isn't optimized for IE6 garbage collector (see the description of
***REMOVED*** {@link goog.structs.Map#keys_} for details), and it distinguishes its
***REMOVED*** elements by their string value not by hash code.
***REMOVED***

goog.provide('goog.structs.StringSet');

goog.require('goog.iter');



***REMOVED***
***REMOVED*** Creates a set of strings.
***REMOVED*** @param {!Array=} opt_elements Elements to add to the set. The non-string
***REMOVED***     items will be converted to strings, so 15 and '15' will mean the same.
***REMOVED***
***REMOVED***
goog.structs.StringSet = function(opt_elements) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** An object storing the escaped elements of the set in its keys.
  ***REMOVED*** @type {!Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.elements_ = {***REMOVED***

  if (opt_elements) {
    for (var i = 0; i < opt_elements.length; i++) {
      this.elements_[this.encode(opt_elements[i])] = null;
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Empty object. Referring to it is faster than creating a new empty object in
***REMOVED*** {@link #encode}.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.structs.StringSet.EMPTY_OBJECT_ = {***REMOVED***


***REMOVED***
***REMOVED*** The '__proto__' and the '__count__' keys aren't enumerable in Firefox, and
***REMOVED*** 'toString', 'valueOf', 'constructor', etc. aren't enumerable in IE so they
***REMOVED*** have to be escaped before they are added to the internal object.
***REMOVED*** NOTE: When a new set is created, 50-80% of the CPU time is spent in encode.
***REMOVED*** @param {*} element The element to escape.
***REMOVED*** @return {*} The escaped element or the element itself if it doesn't have to
***REMOVED***     be escaped.
***REMOVED*** @protected
***REMOVED***
goog.structs.StringSet.prototype.encode = function(element) {
  return element in goog.structs.StringSet.EMPTY_OBJECT_ ||
      String(element).charCodeAt(0) == 32 ? ' ' + element : element;
***REMOVED***


***REMOVED***
***REMOVED*** Inverse function of {@link #encode}.
***REMOVED*** NOTE: forEach would be 30% faster in FF if the compiler inlined decode.
***REMOVED*** @param {string} key The escaped element used as the key of the internal
***REMOVED***     object.
***REMOVED*** @return {string} The unescaped element.
***REMOVED*** @protected
***REMOVED***
goog.structs.StringSet.prototype.decode = function(key) {
  return key.charCodeAt(0) == 32 ? key.substr(1) : key;
***REMOVED***


***REMOVED***
***REMOVED*** Adds a single element to the set.
***REMOVED*** @param {*} element The element to add. It will be converted to string.
***REMOVED***
goog.structs.StringSet.prototype.add = function(element) {
  this.elements_[this.encode(element)] = null;
***REMOVED***


***REMOVED***
***REMOVED*** Adds a the elements of an array to this set.
***REMOVED*** @param {!Array} arr The array to add the elements of.
***REMOVED***
goog.structs.StringSet.prototype.addArray = function(arr) {
  for (var i = 0; i < arr.length; i++) {
    this.elements_[this.encode(arr[i])] = null;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Adds the elements which are in {@code set1} but not in {@code set2} to this
***REMOVED*** set.
***REMOVED*** @param {!goog.structs.StringSet} set1 First set.
***REMOVED*** @param {!goog.structs.StringSet} set2 Second set.
***REMOVED*** @private
***REMOVED***
goog.structs.StringSet.prototype.addDifference_ = function(set1, set2) {
  for (var key in set1.elements_) {
    if (set1.elements_.hasOwnProperty(key) &&
        !set2.elements_.hasOwnProperty(key)) {
      this.elements_[key] = null;
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Adds a the elements of a set to this set.
***REMOVED*** @param {!goog.structs.StringSet} stringSet The set to add the elements of.
***REMOVED***
goog.structs.StringSet.prototype.addSet = function(stringSet) {
  for (var key in stringSet.elements_) {
    if (stringSet.elements_.hasOwnProperty(key)) {
      this.elements_[key] = null;
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Removes all elements of the set.
***REMOVED***
goog.structs.StringSet.prototype.clear = function() {
  this.elements_ = {***REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** @return {!goog.structs.StringSet} Clone of the set.
***REMOVED***
goog.structs.StringSet.prototype.clone = function() {
  var ret = new goog.structs.StringSet;
  ret.addSet(this);
  return ret;
***REMOVED***


***REMOVED***
***REMOVED*** Tells if the set contains the given element.
***REMOVED*** @param {*} element The element to check.
***REMOVED*** @return {boolean} Whether it is in the set.
***REMOVED***
goog.structs.StringSet.prototype.contains = function(element) {
  return this.elements_.hasOwnProperty(this.encode(element));
***REMOVED***


***REMOVED***
***REMOVED*** Tells if the set contains all elements of the array.
***REMOVED*** @param {!Array} arr The elements to check.
***REMOVED*** @return {boolean} Whether they are in the set.
***REMOVED***
goog.structs.StringSet.prototype.containsArray = function(arr) {
  for (var i = 0; i < arr.length; i++) {
    if (!this.elements_.hasOwnProperty(this.encode(arr[i]))) {
      return false;
    }
  }
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Tells if this set has the same elements as the given set.
***REMOVED*** @param {!goog.structs.StringSet} stringSet The other set.
***REMOVED*** @return {boolean} Whether they have the same elements.
***REMOVED***
goog.structs.StringSet.prototype.equals = function(stringSet) {
  return this.isSubsetOf(stringSet) && stringSet.isSubsetOf(this);
***REMOVED***


***REMOVED***
***REMOVED*** Calls a function for each element in the set.
***REMOVED*** @param {function(string, undefined, !goog.structs.StringSet)} f The function
***REMOVED***     to call for every element. It takes the element, undefined (because sets
***REMOVED***     have no notion of keys), and the set.
***REMOVED*** @param {Object=} opt_obj The object to be used as the value of 'this'
***REMOVED***     within {@code f}.
***REMOVED***
goog.structs.StringSet.prototype.forEach = function(f, opt_obj) {
  for (var key in this.elements_) {
    if (this.elements_.hasOwnProperty(key)) {
      f.call(opt_obj, this.decode(key), undefined, this);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Counts the number of elements in the set in linear time.
***REMOVED*** NOTE: getCount is always called at most once per set instance in google3.
***REMOVED*** If this usage pattern won't change, the linear getCount implementation is
***REMOVED*** better, because
***REMOVED*** <li>populating a set and getting the number of elements in it takes the same
***REMOVED*** amount of time as keeping a count_ member up to date and getting its value;
***REMOVED*** <li>if getCount is not called, adding and removing elements have no overhead.
***REMOVED*** @return {number} The number of elements in the set.
***REMOVED***
goog.structs.StringSet.prototype.getCount = function() {
  var count = 0;
  for (var key in this.elements_) {
    if (this.elements_.hasOwnProperty(key)) {
      count++;
    }
  }
  return count;
***REMOVED***


***REMOVED***
***REMOVED*** Calculates the difference of two sets.
***REMOVED*** @param {!goog.structs.StringSet} stringSet The set to subtract from this set.
***REMOVED*** @return {!goog.structs.StringSet} {@code this} minus {@code stringSet}.
***REMOVED***
goog.structs.StringSet.prototype.getDifference = function(stringSet) {
  var ret = new goog.structs.StringSet;
  ret.addDifference_(this, stringSet);
  return ret;
***REMOVED***


***REMOVED***
***REMOVED*** Calculates the intersection of this set with another set.
***REMOVED*** @param {!goog.structs.StringSet} stringSet The set to take the intersection
***REMOVED***     with.
***REMOVED*** @return {!goog.structs.StringSet} A new set with the common elements.
***REMOVED***
goog.structs.StringSet.prototype.getIntersection = function(stringSet) {
  var ret = new goog.structs.StringSet;
  for (var key in this.elements_) {
    if (stringSet.elements_.hasOwnProperty(key) &&
        this.elements_.hasOwnProperty(key)) {
      ret.elements_[key] = null;
    }
  }
  return ret;
***REMOVED***


***REMOVED***
***REMOVED*** Calculates the symmetric difference of two sets.
***REMOVED*** @param {!goog.structs.StringSet} stringSet The other set.
***REMOVED*** @return {!goog.structs.StringSet} A new set with the elements in exactly one
***REMOVED***     of {@code this} and {@code stringSet}.
***REMOVED***
goog.structs.StringSet.prototype.getSymmetricDifference = function(stringSet) {
  var ret = new goog.structs.StringSet;
  ret.addDifference_(this, stringSet);
  ret.addDifference_(stringSet, this);
  return ret;
***REMOVED***


***REMOVED***
***REMOVED*** Calculates the union of this set and another set.
***REMOVED*** @param {!goog.structs.StringSet} stringSet The set to take the union with.
***REMOVED*** @return {!goog.structs.StringSet} A new set with the union of elements.
***REMOVED***
goog.structs.StringSet.prototype.getUnion = function(stringSet) {
  var ret = this.clone();
  ret.addSet(stringSet);
  return ret;
***REMOVED***


***REMOVED***
***REMOVED*** @return {!Array.<string>} The elements of the set.
***REMOVED***
goog.structs.StringSet.prototype.getValues = function() {
  var ret = [];
  for (var key in this.elements_) {
    if (this.elements_.hasOwnProperty(key)) {
      ret.push(this.decode(key));
    }
  }
  return ret;
***REMOVED***


***REMOVED***
***REMOVED*** Tells if this set and the given set are disjoint.
***REMOVED*** @param {!goog.structs.StringSet} stringSet The other set.
***REMOVED*** @return {boolean} True iff they don't have common elements.
***REMOVED***
goog.structs.StringSet.prototype.isDisjoint = function(stringSet) {
  for (var key in this.elements_) {
    if (stringSet.elements_.hasOwnProperty(key) &&
        this.elements_.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the set is empty.
***REMOVED***
goog.structs.StringSet.prototype.isEmpty = function() {
  for (var key in this.elements_) {
    if (this.elements_.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Tells if this set is the subset of the given set.
***REMOVED*** @param {!goog.structs.StringSet} stringSet The other set.
***REMOVED*** @return {boolean} Whether this set if the subset of that.
***REMOVED***
goog.structs.StringSet.prototype.isSubsetOf = function(stringSet) {
  for (var key in this.elements_) {
    if (!stringSet.elements_.hasOwnProperty(key) &&
        this.elements_.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Tells if this set is the superset of the given set.
***REMOVED*** @param {!goog.structs.StringSet} stringSet The other set.
***REMOVED*** @return {boolean} Whether this set if the superset of that.
***REMOVED***
goog.structs.StringSet.prototype.isSupersetOf = function(stringSet) {
  return this.isSubsetOf.call(stringSet, this);
***REMOVED***


***REMOVED***
***REMOVED*** Removes a single element from the set.
***REMOVED*** @param {*} element The element to remove.
***REMOVED*** @return {boolean} Whether the element was in the set.
***REMOVED***
goog.structs.StringSet.prototype.remove = function(element) {
  var key = this.encode(element);
  if (this.elements_.hasOwnProperty(key)) {
    delete this.elements_[key];
    return true;
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Removes all elements of the given array from this set.
***REMOVED*** @param {!Array} arr The elements to remove.
***REMOVED***
goog.structs.StringSet.prototype.removeArray = function(arr) {
  for (var i = 0; i < arr.length; i++) {
    delete this.elements_[this.encode(arr[i])];
  }
***REMOVED***


***REMOVED***
***REMOVED*** Removes all elements of the given set from this set.
***REMOVED*** @param {!goog.structs.StringSet} stringSet The set of elements to remove.
***REMOVED***
goog.structs.StringSet.prototype.removeSet = function(stringSet) {
  for (var key in stringSet.elements_) {
    delete this.elements_[key];
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns an iterator that iterates over the elements in the set.
***REMOVED*** NOTE: creating the iterator copies the whole set so use {@link #forEach} when
***REMOVED*** possible.
***REMOVED*** @param {boolean=} opt_keys Ignored for sets.
***REMOVED*** @return {!goog.iter.Iterator} An iterator over the elements in the set.
***REMOVED***
goog.structs.StringSet.prototype.__iterator__ = function(opt_keys) {
  return goog.iter.toIterator(this.getValues());
***REMOVED***
