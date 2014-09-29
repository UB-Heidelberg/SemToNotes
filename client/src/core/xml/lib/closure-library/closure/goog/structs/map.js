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
***REMOVED*** @fileoverview Datastructure: Hash Map.
***REMOVED***
***REMOVED*** @author arv@google.com (Erik Arvidsson)
***REMOVED*** @author jonp@google.com (Jon Perlow) Optimized for IE6
***REMOVED***
***REMOVED*** This file contains an implementation of a Map structure. It implements a lot
***REMOVED*** of the methods used in goog.structs so those functions work on hashes.  For
***REMOVED*** convenience with common usage the methods accept any type for the key, though
***REMOVED*** internally they will be cast to strings.
***REMOVED***


goog.provide('goog.structs.Map');

goog.require('goog.iter.Iterator');
goog.require('goog.iter.StopIteration');
goog.require('goog.object');
goog.require('goog.structs');



***REMOVED***
***REMOVED*** Class for Hash Map datastructure.
***REMOVED*** @param {*=} opt_map Map or Object to initialize the map with.
***REMOVED*** @param {...*} var_args If 2 or more arguments are present then they
***REMOVED***     will be used as key-value pairs.
***REMOVED***
***REMOVED***
goog.structs.Map = function(opt_map, var_args) {

 ***REMOVED*****REMOVED***
  ***REMOVED*** Underlying JS object used to implement the map.
  ***REMOVED*** @type {!Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.map_ = {***REMOVED***

 ***REMOVED*****REMOVED***
  ***REMOVED*** An array of keys. This is necessary for two reasons:
  ***REMOVED***   1. Iterating the keys using for (var key in this.map_) allocates an
  ***REMOVED***      object for every key in IE which is really bad for IE6 GC perf.
  ***REMOVED***   2. Without a side data structure, we would need to escape all the keys
  ***REMOVED***      as that would be the only way we could tell during iteration if the
  ***REMOVED***      key was an internal key or a property of the object.
  ***REMOVED***
  ***REMOVED*** This array can contain deleted keys so it's necessary to check the map
  ***REMOVED*** as well to see if the key is still in the map (this doesn't require a
  ***REMOVED*** memory allocation in IE).
  ***REMOVED*** @type {!Array.<string>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.keys_ = [];

  var argLength = arguments.length;

  if (argLength > 1) {
    if (argLength % 2) {
      throw Error('Uneven number of arguments');
    }
    for (var i = 0; i < argLength; i += 2) {
      this.set(arguments[i], arguments[i + 1]);
    }
  } else if (opt_map) {
    this.addAll(***REMOVED*** @type {Object}***REMOVED*** (opt_map));
  }
***REMOVED***


***REMOVED***
***REMOVED*** The number of key value pairs in the map.
***REMOVED*** @private
***REMOVED*** @type {number}
***REMOVED***
goog.structs.Map.prototype.count_ = 0;


***REMOVED***
***REMOVED*** Version used to detect changes while iterating.
***REMOVED*** @private
***REMOVED*** @type {number}
***REMOVED***
goog.structs.Map.prototype.version_ = 0;


***REMOVED***
***REMOVED*** @return {number} The number of key-value pairs in the map.
***REMOVED***
goog.structs.Map.prototype.getCount = function() {
  return this.count_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the values of the map.
***REMOVED*** @return {!Array} The values in the map.
***REMOVED***
goog.structs.Map.prototype.getValues = function() {
  this.cleanupKeysArray_();

  var rv = [];
  for (var i = 0; i < this.keys_.length; i++) {
    var key = this.keys_[i];
    rv.push(this.map_[key]);
  }
  return rv;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the keys of the map.
***REMOVED*** @return {!Array.<string>} Array of string values.
***REMOVED***
goog.structs.Map.prototype.getKeys = function() {
  this.cleanupKeysArray_();
  return***REMOVED*****REMOVED*** @type {!Array.<string>}***REMOVED*** (this.keys_.concat());
***REMOVED***


***REMOVED***
***REMOVED*** Whether the map contains the given key.
***REMOVED*** @param {*} key The key to check for.
***REMOVED*** @return {boolean} Whether the map contains the key.
***REMOVED***
goog.structs.Map.prototype.containsKey = function(key) {
  return goog.structs.Map.hasKey_(this.map_, key);
***REMOVED***


***REMOVED***
***REMOVED*** Whether the map contains the given value. This is O(n).
***REMOVED*** @param {*} val The value to check for.
***REMOVED*** @return {boolean} Whether the map contains the value.
***REMOVED***
goog.structs.Map.prototype.containsValue = function(val) {
  for (var i = 0; i < this.keys_.length; i++) {
    var key = this.keys_[i];
    if (goog.structs.Map.hasKey_(this.map_, key) && this.map_[key] == val) {
      return true;
    }
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Whether this map is equal to the argument map.
***REMOVED*** @param {goog.structs.Map} otherMap The map against which to test equality.
***REMOVED*** @param {function(?, ?) : boolean=} opt_equalityFn Optional equality function
***REMOVED***     to test equality of values. If not specified, this will test whether
***REMOVED***     the values contained in each map are identical objects.
***REMOVED*** @return {boolean} Whether the maps are equal.
***REMOVED***
goog.structs.Map.prototype.equals = function(otherMap, opt_equalityFn) {
  if (this === otherMap) {
    return true;
  }

  if (this.count_ != otherMap.getCount()) {
    return false;
  }

  var equalityFn = opt_equalityFn || goog.structs.Map.defaultEquals;

  this.cleanupKeysArray_();
  for (var key, i = 0; key = this.keys_[i]; i++) {
    if (!equalityFn(this.get(key), otherMap.get(key))) {
      return false;
    }
  }

  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Default equality test for values.
***REMOVED*** @param {*} a The first value.
***REMOVED*** @param {*} b The second value.
***REMOVED*** @return {boolean} Whether a and b reference the same object.
***REMOVED***
goog.structs.Map.defaultEquals = function(a, b) {
  return a === b;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the map is empty.
***REMOVED***
goog.structs.Map.prototype.isEmpty = function() {
  return this.count_ == 0;
***REMOVED***


***REMOVED***
***REMOVED*** Removes all key-value pairs from the map.
***REMOVED***
goog.structs.Map.prototype.clear = function() {
  this.map_ = {***REMOVED***
  this.keys_.length = 0;
  this.count_ = 0;
  this.version_ = 0;
***REMOVED***


***REMOVED***
***REMOVED*** Removes a key-value pair based on the key. This is O(logN) amortized due to
***REMOVED*** updating the keys array whenever the count becomes half the size of the keys
***REMOVED*** in the keys array.
***REMOVED*** @param {*} key  The key to remove.
***REMOVED*** @return {boolean} Whether object was removed.
***REMOVED***
goog.structs.Map.prototype.remove = function(key) {
  if (goog.structs.Map.hasKey_(this.map_, key)) {
    delete this.map_[key];
    this.count_--;
    this.version_++;

    // clean up the keys array if the threshhold is hit
    if (this.keys_.length > 2***REMOVED*** this.count_) {
      this.cleanupKeysArray_();
    }

    return true;
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Cleans up the temp keys array by removing entries that are no longer in the
***REMOVED*** map.
***REMOVED*** @private
***REMOVED***
goog.structs.Map.prototype.cleanupKeysArray_ = function() {
  if (this.count_ != this.keys_.length) {
    // First remove keys that are no longer in the map.
    var srcIndex = 0;
    var destIndex = 0;
    while (srcIndex < this.keys_.length) {
      var key = this.keys_[srcIndex];
      if (goog.structs.Map.hasKey_(this.map_, key)) {
        this.keys_[destIndex++] = key;
      }
      srcIndex++;
    }
    this.keys_.length = destIndex;
  }

  if (this.count_ != this.keys_.length) {
    // If the count still isn't correct, that means we have duplicates. This can
    // happen when the same key is added and removed multiple times. Now we have
    // to allocate one extra Object to remove the duplicates. This could have
    // been done in the first pass, but in the common case, we can avoid
    // allocating an extra object by only doing this when necessary.
    var seen = {***REMOVED***
    var srcIndex = 0;
    var destIndex = 0;
    while (srcIndex < this.keys_.length) {
      var key = this.keys_[srcIndex];
      if (!(goog.structs.Map.hasKey_(seen, key))) {
        this.keys_[destIndex++] = key;
        seen[key] = 1;
      }
      srcIndex++;
    }
    this.keys_.length = destIndex;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the value for the given key.  If the key is not found and the default
***REMOVED*** value is not given this will return {@code undefined}.
***REMOVED*** @param {*} key The key to get the value for.
***REMOVED*** @param {*=} opt_val The value to return if no item is found for the given
***REMOVED***     key, defaults to undefined.
***REMOVED*** @return {*} The value for the given key.
***REMOVED***
goog.structs.Map.prototype.get = function(key, opt_val) {
  if (goog.structs.Map.hasKey_(this.map_, key)) {
    return this.map_[key];
  }
  return opt_val;
***REMOVED***


***REMOVED***
***REMOVED*** Adds a key-value pair to the map.
***REMOVED*** @param {*} key The key.
***REMOVED*** @param {*} value The value to add.
***REMOVED*** @return {*} Some subclasses return a value.
***REMOVED***
goog.structs.Map.prototype.set = function(key, value) {
  if (!(goog.structs.Map.hasKey_(this.map_, key))) {
    this.count_++;
    this.keys_.push(key);
    // Only change the version if we add a new key.
    this.version_++;
  }
  this.map_[key] = value;
***REMOVED***


***REMOVED***
***REMOVED*** Adds multiple key-value pairs from another goog.structs.Map or Object.
***REMOVED*** @param {Object} map  Object containing the data to add.
***REMOVED***
goog.structs.Map.prototype.addAll = function(map) {
  var keys, values;
  if (map instanceof goog.structs.Map) {
    keys = map.getKeys();
    values = map.getValues();
  } else {
    keys = goog.object.getKeys(map);
    values = goog.object.getValues(map);
  }
  // we could use goog.array.forEach here but I don't want to introduce that
  // dependency just for this.
  for (var i = 0; i < keys.length; i++) {
    this.set(keys[i], values[i]);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Clones a map and returns a new map.
***REMOVED*** @return {!goog.structs.Map} A new map with the same key-value pairs.
***REMOVED***
goog.structs.Map.prototype.clone = function() {
  return new goog.structs.Map(this);
***REMOVED***


***REMOVED***
***REMOVED*** Returns a new map in which all the keys and values are interchanged
***REMOVED*** (keys become values and values become keys). If multiple keys map to the
***REMOVED*** same value, the chosen transposed value is implementation-dependent.
***REMOVED***
***REMOVED*** It acts very similarly to {goog.object.transpose(Object)}.
***REMOVED***
***REMOVED*** @return {!goog.structs.Map} The transposed map.
***REMOVED***
goog.structs.Map.prototype.transpose = function() {
  var transposed = new goog.structs.Map();
  for (var i = 0; i < this.keys_.length; i++) {
    var key = this.keys_[i];
    var value = this.map_[key];
    transposed.set(value, key);
  }

  return transposed;
***REMOVED***


***REMOVED***
***REMOVED*** @return {!Object} Object representation of the map.
***REMOVED***
goog.structs.Map.prototype.toObject = function() {
  this.cleanupKeysArray_();
  var obj = {***REMOVED***
  for (var i = 0; i < this.keys_.length; i++) {
    var key = this.keys_[i];
    obj[key] = this.map_[key];
  }
  return obj;
***REMOVED***


***REMOVED***
***REMOVED*** Returns an iterator that iterates over the keys in the map.  Removal of keys
***REMOVED*** while iterating might have undesired side effects.
***REMOVED*** @return {!goog.iter.Iterator} An iterator over the keys in the map.
***REMOVED***
goog.structs.Map.prototype.getKeyIterator = function() {
  return this.__iterator__(true);
***REMOVED***


***REMOVED***
***REMOVED*** Returns an iterator that iterates over the values in the map.  Removal of
***REMOVED*** keys while iterating might have undesired side effects.
***REMOVED*** @return {!goog.iter.Iterator} An iterator over the values in the map.
***REMOVED***
goog.structs.Map.prototype.getValueIterator = function() {
  return this.__iterator__(false);
***REMOVED***


***REMOVED***
***REMOVED*** Returns an iterator that iterates over the values or the keys in the map.
***REMOVED*** This throws an exception if the map was mutated since the iterator was
***REMOVED*** created.
***REMOVED*** @param {boolean=} opt_keys True to iterate over the keys. False to iterate
***REMOVED***     over the values.  The default value is false.
***REMOVED*** @return {!goog.iter.Iterator} An iterator over the values or keys in the map.
***REMOVED***
goog.structs.Map.prototype.__iterator__ = function(opt_keys) {
  // Clean up keys to minimize the risk of iterating over dead keys.
  this.cleanupKeysArray_();

  var i = 0;
  var keys = this.keys_;
  var map = this.map_;
  var version = this.version_;
  var selfObj = this;

  var newIter = new goog.iter.Iterator;
  newIter.next = function() {
    while (true) {
      if (version != selfObj.version_) {
        throw Error('The map has changed since the iterator was created');
      }
      if (i >= keys.length) {
        throw goog.iter.StopIteration;
      }
      var key = keys[i++];
      return opt_keys ? key : map[key];
    }
 ***REMOVED*****REMOVED***
  return newIter;
***REMOVED***


***REMOVED***
***REMOVED*** Safe way to test for hasOwnProperty.  It even allows testing for
***REMOVED*** 'hasOwnProperty'.
***REMOVED*** @param {Object} obj The object to test for presence of the given key.
***REMOVED*** @param {*} key The key to check for.
***REMOVED*** @return {boolean} Whether the object has the key.
***REMOVED*** @private
***REMOVED***
goog.structs.Map.hasKey_ = function(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
***REMOVED***
