// Copyright 2007 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview A LinkedMap data structure that is accessed using key/value
***REMOVED*** pairs like an ordinary Map, but which guarantees a consistent iteration
***REMOVED*** order over its entries. The iteration order is either insertion order (the
***REMOVED*** default) or ordered from most recent to least recent use. By setting a fixed
***REMOVED*** size, the LRU version of the LinkedMap makes an effective object cache. This
***REMOVED*** data structure is similar to Java's LinkedHashMap.
***REMOVED***
***REMOVED*** @author brenneman@google.com (Shawn Brenneman)
***REMOVED***


goog.provide('goog.structs.LinkedMap');

goog.require('goog.structs.Map');



***REMOVED***
***REMOVED*** Class for a LinkedMap datastructure, which combines O(1) map access for
***REMOVED*** key/value pairs with a linked list for a consistent iteration order. Sample
***REMOVED*** usage:
***REMOVED***
***REMOVED*** <pre>
***REMOVED*** var m = new LinkedMap();
***REMOVED*** m.set('param1', 'A');
***REMOVED*** m.set('param2', 'B');
***REMOVED*** m.set('param3', 'C');
***REMOVED*** alert(m.getKeys()); // param1, param2, param3
***REMOVED***
***REMOVED*** var c = new LinkedMap(5, true);
***REMOVED*** for (var i = 0; i < 10; i++) {
***REMOVED***   c.set('entry' + i, false);
***REMOVED*** }
***REMOVED*** alert(c.getKeys()); // entry9, entry8, entry7, entry6, entry5
***REMOVED***
***REMOVED*** c.set('entry5', true);
***REMOVED*** c.set('entry1', false);
***REMOVED*** alert(c.getKeys()); // entry1, entry5, entry9, entry8, entry7
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** @param {number=} opt_maxCount The maximum number of objects to store in the
***REMOVED***     LinkedMap. If unspecified or 0, there is no maximum.
***REMOVED*** @param {boolean=} opt_cache When set, the LinkedMap stores items in order
***REMOVED***     from most recently used to least recently used, instead of insertion
***REMOVED***     order.
***REMOVED***
***REMOVED***
goog.structs.LinkedMap = function(opt_maxCount, opt_cache) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The maximum number of entries to allow, or null if there is no limit.
  ***REMOVED*** @type {?number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.maxCount_ = opt_maxCount || null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.cache_ = !!opt_cache;

  this.map_ = new goog.structs.Map();

  this.head_ = new goog.structs.LinkedMap.Node_('', undefined);
  this.head_.next = this.head_.prev = this.head_;
***REMOVED***


***REMOVED***
***REMOVED*** Finds a node and updates it to be the most recently used.
***REMOVED*** @param {string} key The key of the node.
***REMOVED*** @return {goog.structs.LinkedMap.Node_} The node or null if not found.
***REMOVED*** @private
***REMOVED***
goog.structs.LinkedMap.prototype.findAndMoveToTop_ = function(key) {
  var node =***REMOVED*****REMOVED*** @type {goog.structs.LinkedMap.Node_}***REMOVED*** (this.map_.get(key));
  if (node) {
    if (this.cache_) {
      node.remove();
      this.insert_(node);
    }
  }
  return node;
***REMOVED***


***REMOVED***
***REMOVED*** Retrieves the value for a given key. If this is a caching LinkedMap, the
***REMOVED*** entry will become the most recently used.
***REMOVED*** @param {string} key The key to retrieve the value for.
***REMOVED*** @param {*=} opt_val A default value that will be returned if the key is
***REMOVED***     not found, defaults to undefined.
***REMOVED*** @return {*} The retrieved value.
***REMOVED***
goog.structs.LinkedMap.prototype.get = function(key, opt_val) {
  var node = this.findAndMoveToTop_(key);
  return node ? node.value : opt_val;
***REMOVED***


***REMOVED***
***REMOVED*** Retrieves the value for a given key without updating the entry to be the
***REMOVED*** most recently used.
***REMOVED*** @param {string} key The key to retrieve the value for.
***REMOVED*** @param {*=} opt_val A default value that will be returned if the key is
***REMOVED***     not found.
***REMOVED*** @return {*} The retrieved value.
***REMOVED***
goog.structs.LinkedMap.prototype.peekValue = function(key, opt_val) {
  var node = this.map_.get(key);
  return node ? node.value : opt_val;
***REMOVED***


***REMOVED***
***REMOVED*** Sets a value for a given key. If this is a caching LinkedMap, this entry
***REMOVED*** will become the most recently used.
***REMOVED*** @param {string} key The key to retrieve the value for.
***REMOVED*** @param {*} value A default value that will be returned if the key is
***REMOVED***     not found.
***REMOVED***
goog.structs.LinkedMap.prototype.set = function(key, value) {
  var node = this.findAndMoveToTop_(key);
  if (node) {
    node.value = value;
  } else {
    node = new goog.structs.LinkedMap.Node_(key, value);
    this.map_.set(key, node);
    this.insert_(node);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the value of the first node without making any modifications.
***REMOVED*** @return {*} The value of the first node or undefined if the map is empty.
***REMOVED***
goog.structs.LinkedMap.prototype.peek = function() {
  return this.head_.next.value;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the value of the last node without making any modifications.
***REMOVED*** @return {*} The value of the last node or undefined if the map is empty.
***REMOVED***
goog.structs.LinkedMap.prototype.peekLast = function() {
  return this.head_.prev.value;
***REMOVED***


***REMOVED***
***REMOVED*** Removes the first node from the list and returns its value.
***REMOVED*** @return {*} The value of the popped node, or undefined if the map was empty.
***REMOVED***
goog.structs.LinkedMap.prototype.shift = function() {
  return this.popNode_(this.head_.next);
***REMOVED***


***REMOVED***
***REMOVED*** Removes the last node from the list and returns its value.
***REMOVED*** @return {*} The value of the popped node, or undefined if the map was empty.
***REMOVED***
goog.structs.LinkedMap.prototype.pop = function() {
  return this.popNode_(this.head_.prev);
***REMOVED***


***REMOVED***
***REMOVED*** Removes a value from the LinkedMap based on its key.
***REMOVED*** @param {string} key The key to remove.
***REMOVED*** @return {boolean} True if the entry was removed, false if the key was not
***REMOVED***     found.
***REMOVED***
goog.structs.LinkedMap.prototype.remove = function(key) {
  var node =***REMOVED*****REMOVED*** @type {goog.structs.LinkedMap.Node_}***REMOVED*** (this.map_.get(key));
  if (node) {
    this.removeNode(node);
    return true;
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Removes a node from the {@code LinkedMap}. It can be overridden to do
***REMOVED*** further cleanup such as disposing of the node value.
***REMOVED*** @param {!goog.structs.LinkedMap.Node_} node The node to remove.
***REMOVED*** @protected
***REMOVED***
goog.structs.LinkedMap.prototype.removeNode = function(node) {
  node.remove();
  this.map_.remove(node.key);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of items currently in the LinkedMap.
***REMOVED***
goog.structs.LinkedMap.prototype.getCount = function() {
  return this.map_.getCount();
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} True if the cache is empty, false if it contains any items.
***REMOVED***
goog.structs.LinkedMap.prototype.isEmpty = function() {
  return this.map_.isEmpty();
***REMOVED***


***REMOVED***
***REMOVED*** Sets the maximum number of entries allowed in this object, truncating any
***REMOVED*** excess objects if necessary.
***REMOVED*** @param {number} maxCount The new maximum number of entries to allow.
***REMOVED***
goog.structs.LinkedMap.prototype.setMaxCount = function(maxCount) {
  this.maxCount_ = maxCount || null;
  if (this.maxCount_ != null) {
    this.truncate_(this.maxCount_);
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {!Array.<string>} The list of the keys in the appropriate order for
***REMOVED***     this LinkedMap.
***REMOVED***
goog.structs.LinkedMap.prototype.getKeys = function() {
  return this.map(function(val, key) {
    return key;
  });
***REMOVED***


***REMOVED***
***REMOVED*** @return {!Array} The list of the values in the appropriate order for
***REMOVED***     this LinkedMap.
***REMOVED***
goog.structs.LinkedMap.prototype.getValues = function() {
  return this.map(function(val, key) {
    return val;
  });
***REMOVED***


***REMOVED***
***REMOVED*** Tests whether a provided value is currently in the LinkedMap. This does not
***REMOVED*** affect item ordering in cache-style LinkedMaps.
***REMOVED*** @param {Object} value The value to check for.
***REMOVED*** @return {boolean} Whether the value is in the LinkedMap.
***REMOVED***
goog.structs.LinkedMap.prototype.contains = function(value) {
  return this.some(function(el) {
    return el == value;
  });
***REMOVED***


***REMOVED***
***REMOVED*** Tests whether a provided key is currently in the LinkedMap. This does not
***REMOVED*** affect item ordering in cache-style LinkedMaps.
***REMOVED*** @param {string} key The key to check for.
***REMOVED*** @return {boolean} Whether the key is in the LinkedMap.
***REMOVED***
goog.structs.LinkedMap.prototype.containsKey = function(key) {
  return this.map_.containsKey(key);
***REMOVED***


***REMOVED***
***REMOVED*** Removes all entries in this object.
***REMOVED***
goog.structs.LinkedMap.prototype.clear = function() {
  this.truncate_(0);
***REMOVED***


***REMOVED***
***REMOVED*** Calls a function on each item in the LinkedMap.
***REMOVED***
***REMOVED*** @see goog.structs.forEach
***REMOVED*** @param {Function} f The function to call for each item. The function takes
***REMOVED***     three arguments: the value, the key, and the LinkedMap.
***REMOVED*** @param {Object=} opt_obj The object context to use as "this" for the
***REMOVED***     function.
***REMOVED***
goog.structs.LinkedMap.prototype.forEach = function(f, opt_obj) {
  for (var n = this.head_.next; n != this.head_; n = n.next) {
    f.call(opt_obj, n.value, n.key, this);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Calls a function on each item in the LinkedMap and returns the results of
***REMOVED*** those calls in an array.
***REMOVED***
***REMOVED*** @see goog.structs.map
***REMOVED*** @param {!Function} f The function to call for each item. The function takes
***REMOVED***     three arguments: the value, the key, and the LinkedMap.
***REMOVED*** @param {Object=} opt_obj The object context to use as "this" for the
***REMOVED***     function.
***REMOVED*** @return {!Array} The results of the function calls for each item in the
***REMOVED***     LinkedMap.
***REMOVED***
goog.structs.LinkedMap.prototype.map = function(f, opt_obj) {
  var rv = [];
  for (var n = this.head_.next; n != this.head_; n = n.next) {
    rv.push(f.call(opt_obj, n.value, n.key, this));
  }
  return rv;
***REMOVED***


***REMOVED***
***REMOVED*** Calls a function on each item in the LinkedMap and returns true if any of
***REMOVED*** those function calls returns a true-like value.
***REMOVED***
***REMOVED*** @see goog.structs.some
***REMOVED*** @param {Function} f The function to call for each item. The function takes
***REMOVED***     three arguments: the value, the key, and the LinkedMap, and returns a
***REMOVED***     boolean.
***REMOVED*** @param {Object=} opt_obj The object context to use as "this" for the
***REMOVED***     function.
***REMOVED*** @return {boolean} Whether f evaluates to true for at least one item in the
***REMOVED***     LinkedMap.
***REMOVED***
goog.structs.LinkedMap.prototype.some = function(f, opt_obj) {
  for (var n = this.head_.next; n != this.head_; n = n.next) {
    if (f.call(opt_obj, n.value, n.key, this)) {
      return true;
    }
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Calls a function on each item in the LinkedMap and returns true only if every
***REMOVED*** function call returns a true-like value.
***REMOVED***
***REMOVED*** @see goog.structs.some
***REMOVED*** @param {Function} f The function to call for each item. The function takes
***REMOVED***     three arguments: the value, the key, and the Cache, and returns a
***REMOVED***     boolean.
***REMOVED*** @param {Object=} opt_obj The object context to use as "this" for the
***REMOVED***     function.
***REMOVED*** @return {boolean} Whether f evaluates to true for every item in the Cache.
***REMOVED***
goog.structs.LinkedMap.prototype.every = function(f, opt_obj) {
  for (var n = this.head_.next; n != this.head_; n = n.next) {
    if (!f.call(opt_obj, n.value, n.key, this)) {
      return false;
    }
  }
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Appends a node to the list. LinkedMap in cache mode adds new nodes to
***REMOVED*** the head of the list, otherwise they are appended to the tail. If there is a
***REMOVED*** maximum size, the list will be truncated if necessary.
***REMOVED***
***REMOVED*** @param {goog.structs.LinkedMap.Node_} node The item to insert.
***REMOVED*** @private
***REMOVED***
goog.structs.LinkedMap.prototype.insert_ = function(node) {
  if (this.cache_) {
    node.next = this.head_.next;
    node.prev = this.head_;

    this.head_.next = node;
    node.next.prev = node;
  } else {
    node.prev = this.head_.prev;
    node.next = this.head_;

    this.head_.prev = node;
    node.prev.next = node;
  }

  if (this.maxCount_ != null) {
    this.truncate_(this.maxCount_);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Removes elements from the LinkedMap if the given count has been exceeded.
***REMOVED*** In cache mode removes nodes from the tail of the list. Otherwise removes
***REMOVED*** nodes from the head.
***REMOVED*** @param {number} count Number of elements to keep.
***REMOVED*** @private
***REMOVED***
goog.structs.LinkedMap.prototype.truncate_ = function(count) {
  for (var i = this.map_.getCount(); i > count; i--) {
    this.removeNode(this.cache_ ? this.head_.prev : this.head_.next);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Removes the node from the LinkedMap if it is not the head, and returns
***REMOVED*** the node's value.
***REMOVED*** @param {!goog.structs.LinkedMap.Node_} node The item to remove.
***REMOVED*** @return {*} The value of the popped node.
***REMOVED*** @private
***REMOVED***
goog.structs.LinkedMap.prototype.popNode_ = function(node) {
  if (this.head_ != node) {
    this.removeNode(node);
  }
  return node.value;
***REMOVED***



***REMOVED***
***REMOVED*** Internal class for a doubly-linked list node containing a key/value pair.
***REMOVED*** @param {string} key The key.
***REMOVED*** @param {*} value The value.
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.structs.LinkedMap.Node_ = function(key, value) {
  this.key = key;
  this.value = value;
***REMOVED***


***REMOVED***
***REMOVED*** The next node in the list.
***REMOVED*** @type {!goog.structs.LinkedMap.Node_}
***REMOVED***
goog.structs.LinkedMap.Node_.prototype.next;


***REMOVED***
***REMOVED*** The previous node in the list.
***REMOVED*** @type {!goog.structs.LinkedMap.Node_}
***REMOVED***
goog.structs.LinkedMap.Node_.prototype.prev;


***REMOVED***
***REMOVED*** Causes this node to remove itself from the list.
***REMOVED***
goog.structs.LinkedMap.Node_.prototype.remove = function() {
  this.prev.next = this.next;
  this.next.prev = this.prev;

  delete this.prev;
  delete this.next;
***REMOVED***
