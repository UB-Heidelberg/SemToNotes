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
***REMOVED*** @fileoverview Generics method for collection-like classes and objects.
***REMOVED***
***REMOVED*** @author arv@google.com (Erik Arvidsson)
***REMOVED***
***REMOVED*** This file contains functions to work with collections. It supports using
***REMOVED*** Map, Set, Array and Object and other classes that implement collection-like
***REMOVED*** methods.
***REMOVED***


goog.provide('goog.structs');

goog.require('goog.array');
goog.require('goog.object');


// We treat an object as a dictionary if it has getKeys or it is an object that
// isn't arrayLike.


***REMOVED***
***REMOVED*** Returns the number of values in the collection-like object.
***REMOVED*** @param {Object} col The collection-like object.
***REMOVED*** @return {number} The number of values in the collection-like object.
***REMOVED***
goog.structs.getCount = function(col) {
  if (typeof col.getCount == 'function') {
    return col.getCount();
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return col.length;
  }
  return goog.object.getCount(col);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the values of the collection-like object.
***REMOVED*** @param {Object} col The collection-like object.
***REMOVED*** @return {!Array} The values in the collection-like object.
***REMOVED***
goog.structs.getValues = function(col) {
  if (typeof col.getValues == 'function') {
    return col.getValues();
  }
  if (goog.isString(col)) {
    return col.split('');
  }
  if (goog.isArrayLike(col)) {
    var rv = [];
    var l = col.length;
    for (var i = 0; i < l; i++) {
      rv.push(col[i]);
    }
    return rv;
  }
  return goog.object.getValues(col);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the keys of the collection. Some collections have no notion of
***REMOVED*** keys/indexes and this function will return undefined in those cases.
***REMOVED*** @param {Object} col The collection-like object.
***REMOVED*** @return {!Array|undefined} The keys in the collection.
***REMOVED***
goog.structs.getKeys = function(col) {
  if (typeof col.getKeys == 'function') {
    return col.getKeys();
  }
  // if we have getValues but no getKeys we know this is a key-less collection
  if (typeof col.getValues == 'function') {
    return undefined;
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    var rv = [];
    var l = col.length;
    for (var i = 0; i < l; i++) {
      rv.push(i);
    }
    return rv;
  }

  return goog.object.getKeys(col);
***REMOVED***


***REMOVED***
***REMOVED*** Whether the collection contains the given value. This is O(n) and uses
***REMOVED*** equals (==) to test the existence.
***REMOVED*** @param {Object} col The collection-like object.
***REMOVED*** @param {*} val The value to check for.
***REMOVED*** @return {boolean} True if the map contains the value.
***REMOVED***
goog.structs.contains = function(col, val) {
  if (typeof col.contains == 'function') {
    return col.contains(val);
  }
  if (typeof col.containsValue == 'function') {
    return col.containsValue(val);
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.contains(***REMOVED*** @type {Array}***REMOVED*** (col), val);
  }
  return goog.object.containsValue(col, val);
***REMOVED***


***REMOVED***
***REMOVED*** Whether the collection is empty.
***REMOVED*** @param {Object} col The collection-like object.
***REMOVED*** @return {boolean} True if empty.
***REMOVED***
goog.structs.isEmpty = function(col) {
  if (typeof col.isEmpty == 'function') {
    return col.isEmpty();
  }

  // We do not use goog.string.isEmpty because here we treat the string as
  // collection and as such even whitespace matters

  if (goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.isEmpty(***REMOVED*** @type {Array}***REMOVED*** (col));
  }
  return goog.object.isEmpty(col);
***REMOVED***


***REMOVED***
***REMOVED*** Removes all the elements from the collection.
***REMOVED*** @param {Object} col The collection-like object.
***REMOVED***
goog.structs.clear = function(col) {
  // NOTE(arv): This should not contain strings because strings are immutable
  if (typeof col.clear == 'function') {
    col.clear();
  } else if (goog.isArrayLike(col)) {
    goog.array.clear(***REMOVED*** @type {goog.array.ArrayLike}***REMOVED*** (col));
  } else {
    goog.object.clear(col);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Calls a function for each value in a collection. The function takes
***REMOVED*** three arguments; the value, the key and the collection.
***REMOVED***
***REMOVED*** NOTE: This will be deprecated soon! Please use a more specific method if
***REMOVED*** possible, e.g. goog.array.forEach, goog.object.forEach, etc.
***REMOVED***
***REMOVED*** @param {S} col The collection-like object.
***REMOVED*** @param {function(this:T,?,?,S):?} f The function to call for every value.
***REMOVED***     This function takes
***REMOVED***     3 arguments (the value, the key or undefined if the collection has no
***REMOVED***     notion of keys, and the collection) and the return value is irrelevant.
***REMOVED*** @param {T=} opt_obj The object to be used as the value of 'this'
***REMOVED***     within {@code f}.
***REMOVED*** @template T,S
***REMOVED***
goog.structs.forEach = function(col, f, opt_obj) {
  if (typeof col.forEach == 'function') {
    col.forEach(f, opt_obj);
  } else if (goog.isArrayLike(col) || goog.isString(col)) {
    goog.array.forEach(***REMOVED*** @type {Array}***REMOVED*** (col), f, opt_obj);
  } else {
    var keys = goog.structs.getKeys(col);
    var values = goog.structs.getValues(col);
    var l = values.length;
    for (var i = 0; i < l; i++) {
      f.call(opt_obj, values[i], keys && keys[i], col);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Calls a function for every value in the collection. When a call returns true,
***REMOVED*** adds the value to a new collection (Array is returned by default).
***REMOVED***
***REMOVED*** @param {S} col The collection-like object.
***REMOVED*** @param {function(this:T,?,?,S):boolean} f The function to call for every
***REMOVED***     value. This function takes
***REMOVED***     3 arguments (the value, the key or undefined if the collection has no
***REMOVED***     notion of keys, and the collection) and should return a Boolean. If the
***REMOVED***     return value is true the value is added to the result collection. If it
***REMOVED***     is false the value is not included.
***REMOVED*** @param {T=} opt_obj The object to be used as the value of 'this'
***REMOVED***     within {@code f}.
***REMOVED*** @return {!Object|!Array} A new collection where the passed values are
***REMOVED***     present. If col is a key-less collection an array is returned.  If col
***REMOVED***     has keys and values a plain old JS object is returned.
***REMOVED*** @template T,S
***REMOVED***
goog.structs.filter = function(col, f, opt_obj) {
  if (typeof col.filter == 'function') {
    return col.filter(f, opt_obj);
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.filter(***REMOVED*** @type {!Array}***REMOVED*** (col), f, opt_obj);
  }

  var rv;
  var keys = goog.structs.getKeys(col);
  var values = goog.structs.getValues(col);
  var l = values.length;
  if (keys) {
    rv = {***REMOVED***
    for (var i = 0; i < l; i++) {
      if (f.call(opt_obj, values[i], keys[i], col)) {
        rv[keys[i]] = values[i];
      }
    }
  } else {
    // We should not use goog.array.filter here since we want to make sure that
    // the index is undefined as well as make sure that col is passed to the
    // function.
    rv = [];
    for (var i = 0; i < l; i++) {
      if (f.call(opt_obj, values[i], undefined, col)) {
        rv.push(values[i]);
      }
    }
  }
  return rv;
***REMOVED***


***REMOVED***
***REMOVED*** Calls a function for every value in the collection and adds the result into a
***REMOVED*** new collection (defaults to creating a new Array).
***REMOVED***
***REMOVED*** @param {S} col The collection-like object.
***REMOVED*** @param {function(this:T,?,?,S):V} f The function to call for every value.
***REMOVED***     This function takes 3 arguments (the value, the key or undefined if the
***REMOVED***     collection has no notion of keys, and the collection) and should return
***REMOVED***     something. The result will be used as the value in the new collection.
***REMOVED*** @param {T=} opt_obj  The object to be used as the value of 'this'
***REMOVED***     within {@code f}.
***REMOVED*** @return {!Object.<V>|!Array.<V>} A new collection with the new values.  If
***REMOVED***     col is a key-less collection an array is returned.  If col has keys and
***REMOVED***     values a plain old JS object is returned.
***REMOVED*** @template T,S,V
***REMOVED***
goog.structs.map = function(col, f, opt_obj) {
  if (typeof col.map == 'function') {
    return col.map(f, opt_obj);
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.map(***REMOVED*** @type {!Array}***REMOVED*** (col), f, opt_obj);
  }

  var rv;
  var keys = goog.structs.getKeys(col);
  var values = goog.structs.getValues(col);
  var l = values.length;
  if (keys) {
    rv = {***REMOVED***
    for (var i = 0; i < l; i++) {
      rv[keys[i]] = f.call(opt_obj, values[i], keys[i], col);
    }
  } else {
    // We should not use goog.array.map here since we want to make sure that
    // the index is undefined as well as make sure that col is passed to the
    // function.
    rv = [];
    for (var i = 0; i < l; i++) {
      rv[i] = f.call(opt_obj, values[i], undefined, col);
    }
  }
  return rv;
***REMOVED***


***REMOVED***
***REMOVED*** Calls f for each value in a collection. If any call returns true this returns
***REMOVED*** true (without checking the rest). If all returns false this returns false.
***REMOVED***
***REMOVED*** @param {S} col The collection-like object.
***REMOVED*** @param {function(this:T,?,?,S):boolean} f The function to call for every
***REMOVED***     value. This function takes 3 arguments (the value, the key or undefined
***REMOVED***     if the collection has no notion of keys, and the collection) and should
***REMOVED***     return a boolean.
***REMOVED*** @param {T=} opt_obj  The object to be used as the value of 'this'
***REMOVED***     within {@code f}.
***REMOVED*** @return {boolean} True if any value passes the test.
***REMOVED*** @template T,S
***REMOVED***
goog.structs.some = function(col, f, opt_obj) {
  if (typeof col.some == 'function') {
    return col.some(f, opt_obj);
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.some(***REMOVED*** @type {!Array}***REMOVED*** (col), f, opt_obj);
  }
  var keys = goog.structs.getKeys(col);
  var values = goog.structs.getValues(col);
  var l = values.length;
  for (var i = 0; i < l; i++) {
    if (f.call(opt_obj, values[i], keys && keys[i], col)) {
      return true;
    }
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Calls f for each value in a collection. If all calls return true this return
***REMOVED*** true this returns true. If any returns false this returns false at this point
***REMOVED***  and does not continue to check the remaining values.
***REMOVED***
***REMOVED*** @param {S} col The collection-like object.
***REMOVED*** @param {function(this:T,?,?,S):boolean} f The function to call for every
***REMOVED***     value. This function takes 3 arguments (the value, the key or
***REMOVED***     undefined if the collection has no notion of keys, and the collection)
***REMOVED***     and should return a boolean.
***REMOVED*** @param {T=} opt_obj  The object to be used as the value of 'this'
***REMOVED***     within {@code f}.
***REMOVED*** @return {boolean} True if all key-value pairs pass the test.
***REMOVED*** @template T,S
***REMOVED***
goog.structs.every = function(col, f, opt_obj) {
  if (typeof col.every == 'function') {
    return col.every(f, opt_obj);
  }
  if (goog.isArrayLike(col) || goog.isString(col)) {
    return goog.array.every(***REMOVED*** @type {!Array}***REMOVED*** (col), f, opt_obj);
  }
  var keys = goog.structs.getKeys(col);
  var values = goog.structs.getValues(col);
  var l = values.length;
  for (var i = 0; i < l; i++) {
    if (!f.call(opt_obj, values[i], keys && keys[i], col)) {
      return false;
    }
  }
  return true;
***REMOVED***
