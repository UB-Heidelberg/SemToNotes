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
***REMOVED*** @fileoverview Datastructure: Set.
***REMOVED***
***REMOVED*** @author arv@google.com (Erik Arvidsson)
***REMOVED*** @author pallosp@google.com (Peter Pallos)
***REMOVED***
***REMOVED*** This class implements a set data structure. Adding and removing is O(1). It
***REMOVED*** supports both object and primitive values. Be careful because you can add
***REMOVED*** both 1 and new Number(1), because these are not the same. You can even add
***REMOVED*** multiple new Number(1) because these are not equal.
***REMOVED***


goog.provide('goog.structs.Set');

goog.require('goog.structs');
goog.require('goog.structs.Collection');
goog.require('goog.structs.Map');



***REMOVED***
***REMOVED*** A set that can contain both primitives and objects.  Adding and removing
***REMOVED*** elements is O(1).  Primitives are treated as identical if they have the same
***REMOVED*** type and convert to the same string.  Objects are treated as identical only
***REMOVED*** if they are references to the same object.  WARNING: A goog.structs.Set can
***REMOVED*** contain both 1 and (new Number(1)), because they are not the same.  WARNING:
***REMOVED*** Adding (new Number(1)) twice will yield two distinct elements, because they
***REMOVED*** are two different objects.  WARNING: Any object that is added to a
***REMOVED*** goog.structs.Set will be modified!  Because goog.getUid() is used to
***REMOVED*** identify objects, every object in the set will be mutated.
***REMOVED*** @param {Array.<T>|Object.<?,T>=} opt_values Initial values to start with.
***REMOVED***
***REMOVED*** @implements {goog.structs.Collection.<T>}
***REMOVED*** @final
***REMOVED*** @template T
***REMOVED***
goog.structs.Set = function(opt_values) {
  this.map_ = new goog.structs.Map;
  if (opt_values) {
    this.addAll(opt_values);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Obtains a unique key for an element of the set.  Primitives will yield the
***REMOVED*** same key if they have the same type and convert to the same string.  Object
***REMOVED*** references will yield the same key only if they refer to the same object.
***REMOVED*** @param {*} val Object or primitive value to get a key for.
***REMOVED*** @return {string} A unique key for this value/object.
***REMOVED*** @private
***REMOVED***
goog.structs.Set.getKey_ = function(val) {
  var type = typeof val;
  if (type == 'object' && val || type == 'function') {
    return 'o' + goog.getUid(***REMOVED*** @type {Object}***REMOVED*** (val));
  } else {
    return type.substr(0, 1) + val;
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of elements in the set.
***REMOVED*** @override
***REMOVED***
goog.structs.Set.prototype.getCount = function() {
  return this.map_.getCount();
***REMOVED***


***REMOVED***
***REMOVED*** Add a primitive or an object to the set.
***REMOVED*** @param {T} element The primitive or object to add.
***REMOVED*** @override
***REMOVED***
goog.structs.Set.prototype.add = function(element) {
  this.map_.set(goog.structs.Set.getKey_(element), element);
***REMOVED***


***REMOVED***
***REMOVED*** Adds all the values in the given collection to this set.
***REMOVED*** @param {Array.<T>|goog.structs.Collection.<T>|Object.<?,T>} col A collection
***REMOVED***     containing the elements to add.
***REMOVED***
goog.structs.Set.prototype.addAll = function(col) {
  var values = goog.structs.getValues(col);
  var l = values.length;
  for (var i = 0; i < l; i++) {
    this.add(values[i]);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Removes all values in the given collection from this set.
***REMOVED*** @param {Array.<T>|goog.structs.Collection.<T>|Object.<?,T>} col A collection
***REMOVED***     containing the elements to remove.
***REMOVED***
goog.structs.Set.prototype.removeAll = function(col) {
  var values = goog.structs.getValues(col);
  var l = values.length;
  for (var i = 0; i < l; i++) {
    this.remove(values[i]);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Removes the given element from this set.
***REMOVED*** @param {T} element The primitive or object to remove.
***REMOVED*** @return {boolean} Whether the element was found and removed.
***REMOVED*** @override
***REMOVED***
goog.structs.Set.prototype.remove = function(element) {
  return this.map_.remove(goog.structs.Set.getKey_(element));
***REMOVED***


***REMOVED***
***REMOVED*** Removes all elements from this set.
***REMOVED***
goog.structs.Set.prototype.clear = function() {
  this.map_.clear();
***REMOVED***


***REMOVED***
***REMOVED*** Tests whether this set is empty.
***REMOVED*** @return {boolean} True if there are no elements in this set.
***REMOVED***
goog.structs.Set.prototype.isEmpty = function() {
  return this.map_.isEmpty();
***REMOVED***


***REMOVED***
***REMOVED*** Tests whether this set contains the given element.
***REMOVED*** @param {T} element The primitive or object to test for.
***REMOVED*** @return {boolean} True if this set contains the given element.
***REMOVED*** @override
***REMOVED***
goog.structs.Set.prototype.contains = function(element) {
  return this.map_.containsKey(goog.structs.Set.getKey_(element));
***REMOVED***


***REMOVED***
***REMOVED*** Tests whether this set contains all the values in a given collection.
***REMOVED*** Repeated elements in the collection are ignored, e.g.  (new
***REMOVED*** goog.structs.Set([1, 2])).containsAll([1, 1]) is True.
***REMOVED*** @param {goog.structs.Collection.<T>|Object} col A collection-like object.
***REMOVED*** @return {boolean} True if the set contains all elements.
***REMOVED***
goog.structs.Set.prototype.containsAll = function(col) {
  return goog.structs.every(col, this.contains, this);
***REMOVED***


***REMOVED***
***REMOVED*** Finds all values that are present in both this set and the given collection.
***REMOVED*** @param {Array.<S>|Object.<?,S>} col A collection.
***REMOVED*** @return {!goog.structs.Set.<T|S>} A new set containing all the values
***REMOVED***     (primitives or objects) present in both this set and the given
***REMOVED***     collection.
***REMOVED*** @template S
***REMOVED***
goog.structs.Set.prototype.intersection = function(col) {
  var result = new goog.structs.Set();

  var values = goog.structs.getValues(col);
  for (var i = 0; i < values.length; i++) {
    var value = values[i];
    if (this.contains(value)) {
      result.add(value);
    }
  }

  return result;
***REMOVED***


***REMOVED***
***REMOVED*** Finds all values that are present in this set and not in the given
***REMOVED*** collection.
***REMOVED*** @param {Array.<T>|goog.structs.Collection.<T>|Object.<?,T>} col A collection.
***REMOVED*** @return {!goog.structs.Set} A new set containing all the values
***REMOVED***     (primitives or objects) present in this set but not in the given
***REMOVED***     collection.
***REMOVED***
goog.structs.Set.prototype.difference = function(col) {
  var result = this.clone();
  result.removeAll(col);
  return result;
***REMOVED***


***REMOVED***
***REMOVED*** Returns an array containing all the elements in this set.
***REMOVED*** @return {!Array.<T>} An array containing all the elements in this set.
***REMOVED***
goog.structs.Set.prototype.getValues = function() {
  return this.map_.getValues();
***REMOVED***


***REMOVED***
***REMOVED*** Creates a shallow clone of this set.
***REMOVED*** @return {!goog.structs.Set.<T>} A new set containing all the same elements as
***REMOVED***     this set.
***REMOVED***
goog.structs.Set.prototype.clone = function() {
  return new goog.structs.Set(this);
***REMOVED***


***REMOVED***
***REMOVED*** Tests whether the given collection consists of the same elements as this set,
***REMOVED*** regardless of order, without repetition.  Primitives are treated as equal if
***REMOVED*** they have the same type and convert to the same string; objects are treated
***REMOVED*** as equal if they are references to the same object.  This operation is O(n).
***REMOVED*** @param {goog.structs.Collection.<T>|Object} col A collection.
***REMOVED*** @return {boolean} True if the given collection consists of the same elements
***REMOVED***     as this set, regardless of order, without repetition.
***REMOVED***
goog.structs.Set.prototype.equals = function(col) {
  return this.getCount() == goog.structs.getCount(col) && this.isSubsetOf(col);
***REMOVED***


***REMOVED***
***REMOVED*** Tests whether the given collection contains all the elements in this set.
***REMOVED*** Primitives are treated as equal if they have the same type and convert to the
***REMOVED*** same string; objects are treated as equal if they are references to the same
***REMOVED*** object.  This operation is O(n).
***REMOVED*** @param {goog.structs.Collection.<T>|Object} col A collection.
***REMOVED*** @return {boolean} True if this set is a subset of the given collection.
***REMOVED***
goog.structs.Set.prototype.isSubsetOf = function(col) {
  var colCount = goog.structs.getCount(col);
  if (this.getCount() > colCount) {
    return false;
  }
  // TODO(user) Find the minimal collection size where the conversion makes
  // the contains() method faster.
  if (!(col instanceof goog.structs.Set) && colCount > 5) {
    // Convert to a goog.structs.Set so that goog.structs.contains runs in
    // O(1) time instead of O(n) time.
    col = new goog.structs.Set(col);
  }
  return goog.structs.every(this, function(value) {
    return goog.structs.contains(col, value);
  });
***REMOVED***


***REMOVED***
***REMOVED*** Returns an iterator that iterates over the elements in this set.
***REMOVED*** @param {boolean=} opt_keys This argument is ignored.
***REMOVED*** @return {!goog.iter.Iterator} An iterator over the elements in this set.
***REMOVED***
goog.structs.Set.prototype.__iterator__ = function(opt_keys) {
  return this.map_.__iterator__(false);
***REMOVED***
