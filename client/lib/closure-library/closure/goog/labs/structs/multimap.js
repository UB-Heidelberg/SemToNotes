// Copyright 2012 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview A collection similar to
***REMOVED*** {@code goog.labs.structs.Map}, but also allows associating multiple
***REMOVED*** values with a single key.
***REMOVED***
***REMOVED*** This implementation ensures that you can use any string keys.
***REMOVED***
***REMOVED***

goog.provide('goog.labs.structs.Multimap');

goog.require('goog.array');
goog.require('goog.labs.object');
goog.require('goog.labs.structs.Map');



***REMOVED***
***REMOVED*** Creates a new multimap.
***REMOVED***
***REMOVED*** @struct
***REMOVED*** @final
***REMOVED***
goog.labs.structs.Multimap = function() {
  this.clear();
***REMOVED***


***REMOVED***
***REMOVED*** The backing map.
***REMOVED*** @type {!goog.labs.structs.Map}
***REMOVED*** @private
***REMOVED***
goog.labs.structs.Multimap.prototype.map_;


***REMOVED***
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.labs.structs.Multimap.prototype.count_ = 0;


***REMOVED***
***REMOVED*** Clears the multimap.
***REMOVED***
goog.labs.structs.Multimap.prototype.clear = function() {
  this.count_ = 0;
  this.map_ = new goog.labs.structs.Map();
***REMOVED***


***REMOVED***
***REMOVED*** Clones this multimap.
***REMOVED*** @return {!goog.labs.structs.Multimap} A multimap that contains all
***REMOVED***     the mapping this multimap has.
***REMOVED***
goog.labs.structs.Multimap.prototype.clone = function() {
  var map = new goog.labs.structs.Multimap();
  map.addAllFromMultimap(this);
  return map;
***REMOVED***


***REMOVED***
***REMOVED*** Adds the given (key, value) pair to the map. The (key, value) pair
***REMOVED*** is guaranteed to be added.
***REMOVED*** @param {string} key The key to add.
***REMOVED*** @param {*} value The value to add.
***REMOVED***
goog.labs.structs.Multimap.prototype.add = function(key, value) {
  var values = this.map_.get(key);
  if (!values) {
    this.map_.set(key, (values = []));
  }

  values.push(value);
  this.count_++;
***REMOVED***


***REMOVED***
***REMOVED*** Stores a collection of values to the given key. Does not replace
***REMOVED*** existing (key, value) pairs.
***REMOVED*** @param {string} key The key to add.
***REMOVED*** @param {!Array.<*>} values The values to add.
***REMOVED***
goog.labs.structs.Multimap.prototype.addAllValues = function(key, values) {
  goog.array.forEach(values, function(v) {
    this.add(key, v);
  }, this);
***REMOVED***


***REMOVED***
***REMOVED*** Adds the contents of the given map/multimap to this multimap.
***REMOVED*** @param {!(goog.labs.structs.Map|goog.labs.structs.Multimap)} map The
***REMOVED***     map to add.
***REMOVED***
goog.labs.structs.Multimap.prototype.addAllFromMultimap = function(map) {
  goog.array.forEach(map.getEntries(), function(entry) {
    this.add(entry[0], entry[1]);
  }, this);
***REMOVED***


***REMOVED***
***REMOVED*** Replaces all the values for the given key with the given values.
***REMOVED*** @param {string} key The key whose values are to be replaced.
***REMOVED*** @param {!Array.<*>} values The new values. If empty, this is
***REMOVED***     equivalent to {@code removaAll(key)}.
***REMOVED***
goog.labs.structs.Multimap.prototype.replaceValues = function(key, values) {
  this.removeAll(key);
  this.addAllValues(key, values);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the values correspond to the given key.
***REMOVED*** @param {string} key The key to retrieve.
***REMOVED*** @return {!Array.<*>} An array of values corresponding to the given
***REMOVED***     key. May be empty. Note that the ordering of values are not
***REMOVED***     guaranteed to be consistent.
***REMOVED***
goog.labs.structs.Multimap.prototype.get = function(key) {
  var values =***REMOVED*****REMOVED*** @type {Array.<*>}***REMOVED*** (this.map_.get(key));
  return values ? goog.array.clone(values) : [];
***REMOVED***


***REMOVED***
***REMOVED*** Removes a single occurrence of (key, value) pair.
***REMOVED*** @param {string} key The key to remove.
***REMOVED*** @param {*} value The value to remove.
***REMOVED*** @return {boolean} Whether any matching (key, value) pair is removed.
***REMOVED***
goog.labs.structs.Multimap.prototype.remove = function(key, value) {
  var values =***REMOVED*****REMOVED*** @type {Array.<*>}***REMOVED*** (this.map_.get(key));
  if (!values) {
    return false;
  }

  var removed = goog.array.removeIf(values, function(v) {
    return goog.labs.object.is(value, v);
  });

  if (removed) {
    this.count_--;
    if (values.length == 0) {
      this.map_.remove(key);
    }
  }
  return removed;
***REMOVED***


***REMOVED***
***REMOVED*** Removes all values corresponding to the given key.
***REMOVED*** @param {string} key The key whose values are to be removed.
***REMOVED*** @return {boolean} Whether any value is removed.
***REMOVED***
goog.labs.structs.Multimap.prototype.removeAll = function(key) {
  // We have to first retrieve the values from the backing map because
  // we need to keep track of count (and correctly calculates the
  // return value). values may be undefined.
  var values = this.map_.get(key);
  if (this.map_.remove(key)) {
    this.count_ -= values.length;
    return true;
  }

  return false;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the multimap is empty.
***REMOVED***
goog.labs.structs.Multimap.prototype.isEmpty = function() {
  return !this.count_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The count of (key, value) pairs in the map.
***REMOVED***
goog.labs.structs.Multimap.prototype.getCount = function() {
  return this.count_;
***REMOVED***


***REMOVED***
***REMOVED*** @param {string} key The key to check.
***REMOVED*** @param {*} value The value to check.
***REMOVED*** @return {boolean} Whether the (key, value) pair exists in the multimap.
***REMOVED***
goog.labs.structs.Multimap.prototype.containsEntry = function(key, value) {
  var values =***REMOVED*****REMOVED*** @type {Array.<*>}***REMOVED*** (this.map_.get(key));
  if (!values) {
    return false;
  }

  var index = goog.array.findIndex(values, function(v) {
    return goog.labs.object.is(v, value);
  });
  return index >= 0;
***REMOVED***


***REMOVED***
***REMOVED*** @param {string} key The key to check.
***REMOVED*** @return {boolean} Whether the multimap contains at least one (key,
***REMOVED***     value) pair with the given key.
***REMOVED***
goog.labs.structs.Multimap.prototype.containsKey = function(key) {
  return this.map_.containsKey(key);
***REMOVED***


***REMOVED***
***REMOVED*** @param {*} value The value to check.
***REMOVED*** @return {boolean} Whether the multimap contains at least one (key,
***REMOVED***     value) pair with the given value.
***REMOVED***
goog.labs.structs.Multimap.prototype.containsValue = function(value) {
  return goog.array.some(this.map_.getValues(),
      function(values) {
        return goog.array.some(***REMOVED*** @type {Array}***REMOVED*** (values), function(v) {
          return goog.labs.object.is(v, value);
        });
      });
***REMOVED***


***REMOVED***
***REMOVED*** @return {!Array.<string>} An array of unique keys.
***REMOVED***
goog.labs.structs.Multimap.prototype.getKeys = function() {
  return this.map_.getKeys();
***REMOVED***


***REMOVED***
***REMOVED*** @return {!Array.<*>} An array of values. There may be duplicates.
***REMOVED***
goog.labs.structs.Multimap.prototype.getValues = function() {
  return goog.array.flatten(this.map_.getValues());
***REMOVED***


***REMOVED***
***REMOVED*** @return {!Array.<!Array>} An array of entries. Each entry is of the
***REMOVED***     form [key, value].
***REMOVED***
goog.labs.structs.Multimap.prototype.getEntries = function() {
  var keys = this.getKeys();
  var entries = [];
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var values = this.get(key);
    for (var j = 0; j < values.length; j++) {
      entries.push([key, values[j]]);
    }
  }
  return entries;
***REMOVED***
