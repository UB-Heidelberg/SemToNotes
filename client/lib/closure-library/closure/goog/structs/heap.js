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
***REMOVED*** @fileoverview Datastructure: Heap.
***REMOVED***
***REMOVED***
***REMOVED*** This file provides the implementation of a Heap datastructure. Smaller keys
***REMOVED*** rise to the top.
***REMOVED***
***REMOVED*** The big-O notation for all operations are below:
***REMOVED*** <pre>
***REMOVED***  Method          big-O
***REMOVED*** ----------------------------------------------------------------------------
***REMOVED*** - insert         O(logn)
***REMOVED*** - remove         O(logn)
***REMOVED*** - peek           O(1)
***REMOVED*** - contains       O(n)
***REMOVED*** </pre>
***REMOVED***
// TODO(user): Should this rely on natural ordering via some Comparable
//     interface?


goog.provide('goog.structs.Heap');

goog.require('goog.array');
goog.require('goog.object');
goog.require('goog.structs.Node');



***REMOVED***
***REMOVED*** Class for a Heap datastructure.
***REMOVED***
***REMOVED*** @param {goog.structs.Heap|Object=} opt_heap Optional goog.structs.Heap or
***REMOVED***     Object to initialize heap with.
***REMOVED***
***REMOVED*** @template K, V
***REMOVED***
goog.structs.Heap = function(opt_heap) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The nodes of the heap.
  ***REMOVED*** @private
  ***REMOVED*** @type {Array.<goog.structs.Node>}
 ***REMOVED*****REMOVED***
  this.nodes_ = [];

  if (opt_heap) {
    this.insertAll(opt_heap);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Insert the given value into the heap with the given key.
***REMOVED*** @param {K} key The key.
***REMOVED*** @param {V} value The value.
***REMOVED***
goog.structs.Heap.prototype.insert = function(key, value) {
  var node = new goog.structs.Node(key, value);
  var nodes = this.nodes_;
  nodes.push(node);
  this.moveUp_(nodes.length - 1);
***REMOVED***


***REMOVED***
***REMOVED*** Adds multiple key-value pairs from another goog.structs.Heap or Object
***REMOVED*** @param {goog.structs.Heap|Object} heap Object containing the data to add.
***REMOVED***
goog.structs.Heap.prototype.insertAll = function(heap) {
  var keys, values;
  if (heap instanceof goog.structs.Heap) {
    keys = heap.getKeys();
    values = heap.getValues();

    // If it is a heap and the current heap is empty, I can rely on the fact
    // that the keys/values are in the correct order to put in the underlying
    // structure.
    if (heap.getCount() <= 0) {
      var nodes = this.nodes_;
      for (var i = 0; i < keys.length; i++) {
        nodes.push(new goog.structs.Node(keys[i], values[i]));
      }
      return;
    }
  } else {
    keys = goog.object.getKeys(heap);
    values = goog.object.getValues(heap);
  }

  for (var i = 0; i < keys.length; i++) {
    this.insert(keys[i], values[i]);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Retrieves and removes the root value of this heap.
***REMOVED*** @return {V} The value removed from the root of the heap.  Returns
***REMOVED***     undefined if the heap is empty.
***REMOVED***
goog.structs.Heap.prototype.remove = function() {
  var nodes = this.nodes_;
  var count = nodes.length;
  var rootNode = nodes[0];
  if (count <= 0) {
    return undefined;
  } else if (count == 1) {
    goog.array.clear(nodes);
  } else {
    nodes[0] = nodes.pop();
    this.moveDown_(0);
  }
  return rootNode.getValue();
***REMOVED***


***REMOVED***
***REMOVED*** Retrieves but does not remove the root value of this heap.
***REMOVED*** @return {V} The value at the root of the heap. Returns
***REMOVED***     undefined if the heap is empty.
***REMOVED***
goog.structs.Heap.prototype.peek = function() {
  var nodes = this.nodes_;
  if (nodes.length == 0) {
    return undefined;
  }
  return nodes[0].getValue();
***REMOVED***


***REMOVED***
***REMOVED*** Retrieves but does not remove the key of the root node of this heap.
***REMOVED*** @return {V} The key at the root of the heap. Returns undefined if the
***REMOVED***     heap is empty.
***REMOVED***
goog.structs.Heap.prototype.peekKey = function() {
  return this.nodes_[0] && this.nodes_[0].getKey();
***REMOVED***


***REMOVED***
***REMOVED*** Moves the node at the given index down to its proper place in the heap.
***REMOVED*** @param {number} index The index of the node to move down.
***REMOVED*** @private
***REMOVED***
goog.structs.Heap.prototype.moveDown_ = function(index) {
  var nodes = this.nodes_;
  var count = nodes.length;

  // Save the node being moved down.
  var node = nodes[index];
  // While the current node has a child.
  while (index < (count >> 1)) {
    var leftChildIndex = this.getLeftChildIndex_(index);
    var rightChildIndex = this.getRightChildIndex_(index);

    // Determine the index of the smaller child.
    var smallerChildIndex = rightChildIndex < count &&
        nodes[rightChildIndex].getKey() < nodes[leftChildIndex].getKey() ?
        rightChildIndex : leftChildIndex;

    // If the node being moved down is smaller than its children, the node
    // has found the correct index it should be at.
    if (nodes[smallerChildIndex].getKey() > node.getKey()) {
      break;
    }

    // If not, then take the smaller child as the current node.
    nodes[index] = nodes[smallerChildIndex];
    index = smallerChildIndex;
  }
  nodes[index] = node;
***REMOVED***


***REMOVED***
***REMOVED*** Moves the node at the given index up to its proper place in the heap.
***REMOVED*** @param {number} index The index of the node to move up.
***REMOVED*** @private
***REMOVED***
goog.structs.Heap.prototype.moveUp_ = function(index) {
  var nodes = this.nodes_;
  var node = nodes[index];

  // While the node being moved up is not at the root.
  while (index > 0) {
    // If the parent is less than the node being moved up, move the parent down.
    var parentIndex = this.getParentIndex_(index);
    if (nodes[parentIndex].getKey() > node.getKey()) {
      nodes[index] = nodes[parentIndex];
      index = parentIndex;
    } else {
      break;
    }
  }
  nodes[index] = node;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the index of the left child of the node at the given index.
***REMOVED*** @param {number} index The index of the node to get the left child for.
***REMOVED*** @return {number} The index of the left child.
***REMOVED*** @private
***REMOVED***
goog.structs.Heap.prototype.getLeftChildIndex_ = function(index) {
  return index***REMOVED*** 2 + 1;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the index of the right child of the node at the given index.
***REMOVED*** @param {number} index The index of the node to get the right child for.
***REMOVED*** @return {number} The index of the right child.
***REMOVED*** @private
***REMOVED***
goog.structs.Heap.prototype.getRightChildIndex_ = function(index) {
  return index***REMOVED*** 2 + 2;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the index of the parent of the node at the given index.
***REMOVED*** @param {number} index The index of the node to get the parent for.
***REMOVED*** @return {number} The index of the parent.
***REMOVED*** @private
***REMOVED***
goog.structs.Heap.prototype.getParentIndex_ = function(index) {
  return (index - 1) >> 1;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the values of the heap.
***REMOVED*** @return {!Array.<V>} The values in the heap.
***REMOVED***
goog.structs.Heap.prototype.getValues = function() {
  var nodes = this.nodes_;
  var rv = [];
  var l = nodes.length;
  for (var i = 0; i < l; i++) {
    rv.push(nodes[i].getValue());
  }
  return rv;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the keys of the heap.
***REMOVED*** @return {!Array.<K>} The keys in the heap.
***REMOVED***
goog.structs.Heap.prototype.getKeys = function() {
  var nodes = this.nodes_;
  var rv = [];
  var l = nodes.length;
  for (var i = 0; i < l; i++) {
    rv.push(nodes[i].getKey());
  }
  return rv;
***REMOVED***


***REMOVED***
***REMOVED*** Whether the heap contains the given value.
***REMOVED*** @param {V} val The value to check for.
***REMOVED*** @return {boolean} Whether the heap contains the value.
***REMOVED***
goog.structs.Heap.prototype.containsValue = function(val) {
  return goog.array.some(this.nodes_, function(node) {
    return node.getValue() == val;
  });
***REMOVED***


***REMOVED***
***REMOVED*** Whether the heap contains the given key.
***REMOVED*** @param {K} key The key to check for.
***REMOVED*** @return {boolean} Whether the heap contains the key.
***REMOVED***
goog.structs.Heap.prototype.containsKey = function(key) {
  return goog.array.some(this.nodes_, function(node) {
    return node.getKey() == key;
  });
***REMOVED***


***REMOVED***
***REMOVED*** Clones a heap and returns a new heap
***REMOVED*** @return {!goog.structs.Heap} A new goog.structs.Heap with the same key-value
***REMOVED***     pairs.
***REMOVED***
goog.structs.Heap.prototype.clone = function() {
  return new goog.structs.Heap(this);
***REMOVED***


***REMOVED***
***REMOVED*** The number of key-value pairs in the map
***REMOVED*** @return {number} The number of pairs.
***REMOVED***
goog.structs.Heap.prototype.getCount = function() {
  return this.nodes_.length;
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if this heap contains no elements.
***REMOVED*** @return {boolean} Whether this heap contains no elements.
***REMOVED***
goog.structs.Heap.prototype.isEmpty = function() {
  return goog.array.isEmpty(this.nodes_);
***REMOVED***


***REMOVED***
***REMOVED*** Removes all elements from the heap.
***REMOVED***
goog.structs.Heap.prototype.clear = function() {
  goog.array.clear(this.nodes_);
***REMOVED***
