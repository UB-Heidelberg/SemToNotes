***REMOVED***
***REMOVED*** @fileoverview Context information about nodes in their node-set.
***REMOVED***

goog.provide('xrx.xpath.NodeSet');

goog.require('goog.dom');
goog.require('xrx.node');



***REMOVED***
***REMOVED*** A set of nodes sorted by their prefix order in the document.
***REMOVED***
***REMOVED***
***REMOVED***
xrx.xpath.NodeSet = function() {
  // In violation of standard Closure practice, we initialize properties to
  // immutable constants in the constructor instead of on the prototype,
  // because we have empirically measured better performance by doing so.

 ***REMOVED*****REMOVED***
  ***REMOVED*** A pointer to the first node in the linked list.
  ***REMOVED***
  ***REMOVED*** @private
  ***REMOVED*** @type {xrx.xpath.NodeSet.Entry_}
 ***REMOVED*****REMOVED***
  this.first_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** A pointer to the last node in the linked list.
  ***REMOVED***
  ***REMOVED*** @private
  ***REMOVED*** @type {xrx.xpath.NodeSet.Entry_}
 ***REMOVED*****REMOVED***
  this.last_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Length of the linked list.
  ***REMOVED***
  ***REMOVED*** @private
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.length_ = 0;
***REMOVED***



***REMOVED***
***REMOVED*** A entry for a node in a linked list
***REMOVED***
***REMOVED*** @param {!xrx.node} node The node to be added.
***REMOVED***
***REMOVED*** @private
***REMOVED***
xrx.xpath.NodeSet.Entry_ = function(node) {
  // In violation of standard Closure practice, we initialize properties to
  // immutable constants in the constructor instead of on the prototype,
  // because we have empirically measured better performance by doing so.

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {!xrx.node}
 ***REMOVED*****REMOVED***
  this.node = node;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {xrx.xpath.NodeSet.Entry_}
 ***REMOVED*****REMOVED***
  this.prev = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {xrx.xpath.NodeSet.Entry_}
 ***REMOVED*****REMOVED***
  this.next = null;
***REMOVED***


***REMOVED***
***REMOVED*** Merges two node-sets, removing duplicates. This function may modify both
***REMOVED*** node-sets, and will return a reference to one of the two.
***REMOVED***
***REMOVED*** <p> Note: We assume that the two node-sets are already sorted in DOM order.
***REMOVED***
***REMOVED*** @param {!xrx.xpath.NodeSet} a The first node-set.
***REMOVED*** @param {!xrx.xpath.NodeSet} b The second node-set.
***REMOVED*** @return {!xrx.xpath.NodeSet} The merged node-set.
***REMOVED***
xrx.xpath.NodeSet.merge = function(a, b) {
  if (!a.first_) {
    return b;
  } else if (!b.first_) {
    return a;
  }
  var aCurr = a.first_;
  var bCurr = b.first_;
  var merged = a, tail = null, next = null, length = 0;
  while (aCurr && bCurr) {
    if (aCurr.node.isSameAs(bCurr.node)) {
      next = aCurr;
      aCurr = aCurr.next;
      bCurr = bCurr.next;
    } else {
      if (aCurr.node.isAfter(bCurr.node)) {
        next = bCurr;
        bCurr = bCurr.next;
      } else {
        next = aCurr;
        aCurr = aCurr.next;
      }
    }
    next.prev = tail;
    if (tail) {
      tail.next = next;
    } else {
      merged.first_ = next;
    }
    tail = next;
    length++;
  }
  next = aCurr || bCurr;
  while (next) {
    next.prev = tail;
    tail.next = next;
    tail = next;
    length++;
    next = next.next;
  }
  merged.last_ = tail;
  merged.length_ = length;
  return merged;
***REMOVED***


***REMOVED***
***REMOVED*** Prepends a node to this node-set.
***REMOVED***
***REMOVED*** @param {!xrx.node} node The node to be added.
***REMOVED***
xrx.xpath.NodeSet.prototype.unshift = function(node) {
  var entry = new xrx.xpath.NodeSet.Entry_(node);
  entry.next = this.first_;
  if (!this.last_) {
    this.first_ = this.last_ = entry;
  } else {
    this.first_.prev = entry;
  }
  this.first_ = entry;
  this.length_++;
***REMOVED***


***REMOVED***
***REMOVED*** Adds a node to this node-set.
***REMOVED***
***REMOVED*** @param {!xrx.node} node The node to be added.
***REMOVED***
xrx.xpath.NodeSet.prototype.add = function(node) {
  var entry = new xrx.xpath.NodeSet.Entry_(node);
  entry.prev = this.last_;
  if (!this.first_) {
    this.first_ = this.last_ = entry;
  } else {
    this.last_.next = entry;
  }
  this.last_ = entry;
  this.length_++;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the first node of the node-set.
***REMOVED***
***REMOVED*** @return {?xrx.node} The first node of the nodeset
                                     if the nodeset is non-empty;
***REMOVED***     otherwise null.
***REMOVED***
xrx.xpath.NodeSet.prototype.getFirst = function() {
  var first = this.first_;
  if (first) {
    return first.node;
  } else {
    return null;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Return the length of this node-set.
***REMOVED***
***REMOVED*** @return {number} The length of the node-set.
***REMOVED***
xrx.xpath.NodeSet.prototype.getLength = function() {
  return this.length_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the string representation of this node-set.
***REMOVED***
***REMOVED*** @return {string} The string representation of this node-set.
***REMOVED***
xrx.xpath.NodeSet.prototype.string = function() {
  var node = this.getFirst();
  return node ? node.getValueAsString() : '';
***REMOVED***


***REMOVED***
***REMOVED*** Returns the number representation of this node-set.
***REMOVED***
***REMOVED*** @return {number} The number representation of this node-set.
***REMOVED***
xrx.xpath.NodeSet.prototype.number = function() {
  return +this.string();
***REMOVED***


***REMOVED***
***REMOVED*** Returns an iterator over this nodeset. Once this iterator is made, DO NOT
***REMOVED***     add to this nodeset until the iterator is done.
***REMOVED***
***REMOVED*** @param {boolean=} opt_reverse Whether to iterate right to left or vice versa.
***REMOVED*** @return {!xrx.xpath.NodeSet.Iterator} An iterator over the nodes.
***REMOVED***
xrx.xpath.NodeSet.prototype.iterator = function(opt_reverse) {
  return new xrx.xpath.NodeSet.Iterator(this, !!opt_reverse);
***REMOVED***



***REMOVED***
***REMOVED*** An iterator over the nodes of this nodeset.
***REMOVED***
***REMOVED*** @param {!xrx.xpath.NodeSet} nodeset The nodeset to be iterated over.
***REMOVED*** @param {boolean} reverse Whether to iterate in ascending or descending
***REMOVED***     order.
***REMOVED***
***REMOVED***
xrx.xpath.NodeSet.Iterator = function(nodeset, reverse) {
  // In violation of standard Closure practice, we initialize properties to
  // immutable constants in the constructor instead of on the prototype,
  // because we have empirically measured better performance by doing so.

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {!xrx.xpath.NodeSet}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.nodeset_ = nodeset;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.reverse_ = reverse;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {xrx.xpath.NodeSet.Entry_}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.current_ = reverse ? nodeset.last_ : nodeset.first_;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {xrx.xpath.NodeSet.Entry_}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.lastReturned_ = null;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the next value of the iteration or null if passes the end.
***REMOVED***
***REMOVED*** @return {?xrx.node} The next node from this iterator.
***REMOVED***
xrx.xpath.NodeSet.Iterator.prototype.next = function() {
  var current = this.current_;
  if (current == null) {
    return null;
  } else {
    var lastReturned = this.lastReturned_ = current;
    if (this.reverse_) {
      this.current_ = current.prev;
    } else {
      this.current_ = current.next;
    }
    return lastReturned.node;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Deletes the last node that was returned from this iterator.
***REMOVED***
xrx.xpath.NodeSet.Iterator.prototype.remove = function() {
  var nodeset = this.nodeset_;
  var entry = this.lastReturned_;
  if (!entry) {
    throw Error('Next must be called at least once before remove.');
  }
  var prev = entry.prev;
  var next = entry.next;

  // Modify the pointers of prev and next
  if (prev) {
    prev.next = next;
  } else {
    // If there was no prev node entry must've been first_, so update first_.
    nodeset.first_ = next;
  }
  if (next) {
    next.prev = prev;
  } else {
    // If there was no prev node entry must've been last_, so update last_.
    nodeset.last_ = prev;
  }
  nodeset.length_--;
  this.lastReturned_ = null;
***REMOVED***
