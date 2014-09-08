// Copyright 2008 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Iterator subclass for DOM tree traversal.
***REMOVED***
***REMOVED*** @author robbyw@google.com (Robby Walker)
***REMOVED***

goog.provide('goog.dom.TagIterator');
goog.provide('goog.dom.TagWalkType');

goog.require('goog.dom');
goog.require('goog.dom.NodeType');
goog.require('goog.iter.Iterator');
goog.require('goog.iter.StopIteration');


***REMOVED***
***REMOVED*** There are three types of token:
***REMOVED***  <ol>
***REMOVED***    <li>{@code START_TAG} - The beginning of a tag.
***REMOVED***    <li>{@code OTHER} - Any non-element node position.
***REMOVED***    <li>{@code END_TAG} - The end of a tag.
***REMOVED***  </ol>
***REMOVED*** Users of this enumeration can rely on {@code START_TAG + END_TAG = 0} and
***REMOVED*** that {@code OTHER = 0}.
***REMOVED***
***REMOVED*** @enum {number}
***REMOVED***
goog.dom.TagWalkType = {
  START_TAG: 1,
  OTHER: 0,
  END_TAG: -1
***REMOVED***



***REMOVED***
***REMOVED*** A DOM tree traversal iterator.
***REMOVED***
***REMOVED*** Starting with the given node, the iterator walks the DOM in order, reporting
***REMOVED*** events for the start and end of Elements, and the presence of text nodes. For
***REMOVED*** example:
***REMOVED***
***REMOVED*** <pre>
***REMOVED*** &lt;div&gt;1&lt;span&gt;2&lt;/span&gt;3&lt;/div&gt;
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** Will return the following nodes:
***REMOVED***
***REMOVED*** <code>[div, 1, span, 2, span, 3, div]</code>
***REMOVED***
***REMOVED*** With the following states:
***REMOVED***
***REMOVED*** <code>[START, OTHER, START, OTHER, END, OTHER, END]</code>
***REMOVED***
***REMOVED*** And the following depths
***REMOVED***
***REMOVED*** <code>[1, 1, 2, 2, 1, 1, 0]</code>
***REMOVED***
***REMOVED*** Imagining <code>|</code> represents iterator position, the traversal stops at
***REMOVED*** each of the following locations:
***REMOVED***
***REMOVED*** <pre>
***REMOVED*** &lt;div&gt;|1|&lt;span&gt;|2|&lt;/span&gt;|3|&lt;/div&gt;|
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** The iterator can also be used in reverse mode, which will return the nodes
***REMOVED*** and states in the opposite order.  The depths will be slightly different
***REMOVED*** since, like in normal mode, the depth is computed***REMOVED***after* the given node.
***REMOVED***
***REMOVED*** Lastly, it is possible to create an iterator that is unconstrained, meaning
***REMOVED*** that it will continue iterating until the end of the document instead of
***REMOVED*** until exiting the start node.
***REMOVED***
***REMOVED*** @param {Node=} opt_node The start node.  If unspecified or null, defaults to
***REMOVED***     an empty iterator.
***REMOVED*** @param {boolean=} opt_reversed Whether to traverse the tree in reverse.
***REMOVED*** @param {boolean=} opt_unconstrained Whether the iterator is not constrained
***REMOVED***     to the starting node and its children.
***REMOVED*** @param {goog.dom.TagWalkType?=} opt_tagType The type of the position.
***REMOVED***     Defaults to the start of the given node for forward iterators, and
***REMOVED***     the end of the node for reverse iterators.
***REMOVED*** @param {number=} opt_depth The starting tree depth.
***REMOVED***
***REMOVED*** @extends {goog.iter.Iterator.<Node>}
***REMOVED***
goog.dom.TagIterator = function(opt_node, opt_reversed,
    opt_unconstrained, opt_tagType, opt_depth) {
  this.reversed = !!opt_reversed;
  if (opt_node) {
    this.setPosition(opt_node, opt_tagType);
  }
  this.depth = opt_depth != undefined ? opt_depth : this.tagType || 0;
  if (this.reversed) {
    this.depth***REMOVED***= -1;
  }
  this.constrained = !opt_unconstrained;
***REMOVED***
goog.inherits(goog.dom.TagIterator, goog.iter.Iterator);


***REMOVED***
***REMOVED*** The node this position is located on.
***REMOVED*** @type {Node}
***REMOVED***
goog.dom.TagIterator.prototype.node = null;


***REMOVED***
***REMOVED*** The type of this position.
***REMOVED*** @type {goog.dom.TagWalkType}
***REMOVED***
goog.dom.TagIterator.prototype.tagType = goog.dom.TagWalkType.OTHER;


***REMOVED***
***REMOVED*** The tree depth of this position relative to where the iterator started.  The
***REMOVED*** depth is considered to be the tree depth just past the current node, so if an
***REMOVED*** iterator is at position <pre>
***REMOVED***     <div>|</div>
***REMOVED*** </pre>
***REMOVED*** (i.e. the node is the div and the type is START_TAG) its depth will be 1.
***REMOVED*** @type {number}
***REMOVED***
goog.dom.TagIterator.prototype.depth;


***REMOVED***
***REMOVED*** Whether the node iterator is moving in reverse.
***REMOVED*** @type {boolean}
***REMOVED***
goog.dom.TagIterator.prototype.reversed;


***REMOVED***
***REMOVED*** Whether the iterator is constrained to the starting node and its children.
***REMOVED*** @type {boolean}
***REMOVED***
goog.dom.TagIterator.prototype.constrained;


***REMOVED***
***REMOVED*** Whether iteration has started.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.dom.TagIterator.prototype.started_ = false;


***REMOVED***
***REMOVED*** Set the position of the iterator.  Overwrite the tree node and the position
***REMOVED*** type which can be one of the {@link goog.dom.TagWalkType} token types.
***REMOVED*** Only overwrites the tree depth when the parameter is specified.
***REMOVED*** @param {Node} node The node to set the position to.
***REMOVED*** @param {goog.dom.TagWalkType?=} opt_tagType The type of the position
***REMOVED***     Defaults to the start of the given node.
***REMOVED*** @param {number=} opt_depth The tree depth.
***REMOVED***
goog.dom.TagIterator.prototype.setPosition = function(node,
    opt_tagType, opt_depth) {
  this.node = node;

  if (node) {
    if (goog.isNumber(opt_tagType)) {
      this.tagType = opt_tagType;
    } else {
      // Auto-determine the proper type
      this.tagType = this.node.nodeType != goog.dom.NodeType.ELEMENT ?
          goog.dom.TagWalkType.OTHER :
          this.reversed ? goog.dom.TagWalkType.END_TAG :
          goog.dom.TagWalkType.START_TAG;
    }
  }

  if (goog.isNumber(opt_depth)) {
    this.depth = opt_depth;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Replace this iterator's values with values from another. The two iterators
***REMOVED*** must be of the same type.
***REMOVED*** @param {goog.dom.TagIterator} other The iterator to copy.
***REMOVED*** @protected
***REMOVED***
goog.dom.TagIterator.prototype.copyFrom = function(other) {
  this.node = other.node;
  this.tagType = other.tagType;
  this.depth = other.depth;
  this.reversed = other.reversed;
  this.constrained = other.constrained;
***REMOVED***


***REMOVED***
***REMOVED*** @return {!goog.dom.TagIterator} A copy of this iterator.
***REMOVED***
goog.dom.TagIterator.prototype.clone = function() {
  return new goog.dom.TagIterator(this.node, this.reversed,
      !this.constrained, this.tagType, this.depth);
***REMOVED***


***REMOVED***
***REMOVED*** Skip the current tag.
***REMOVED***
goog.dom.TagIterator.prototype.skipTag = function() {
  var check = this.reversed ? goog.dom.TagWalkType.END_TAG :
              goog.dom.TagWalkType.START_TAG;
  if (this.tagType == check) {
    this.tagType =***REMOVED*****REMOVED*** @type {goog.dom.TagWalkType}***REMOVED*** (check***REMOVED*** -1);
    this.depth += this.tagType***REMOVED*** (this.reversed ? -1 : 1);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Restart the current tag.
***REMOVED***
goog.dom.TagIterator.prototype.restartTag = function() {
  var check = this.reversed ? goog.dom.TagWalkType.START_TAG :
              goog.dom.TagWalkType.END_TAG;
  if (this.tagType == check) {
    this.tagType =***REMOVED*****REMOVED*** @type {goog.dom.TagWalkType}***REMOVED*** (check***REMOVED*** -1);
    this.depth += this.tagType***REMOVED*** (this.reversed ? -1 : 1);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Move to the next position in the DOM tree.
***REMOVED*** @return {Node} Returns the next node, or throws a goog.iter.StopIteration
***REMOVED***     exception if the end of the iterator's range has been reached.
***REMOVED*** @override
***REMOVED***
goog.dom.TagIterator.prototype.next = function() {
  var node;

  if (this.started_) {
    if (!this.node || this.constrained && this.depth == 0) {
      throw goog.iter.StopIteration;
    }
    node = this.node;

    var startType = this.reversed ? goog.dom.TagWalkType.END_TAG :
        goog.dom.TagWalkType.START_TAG;

    if (this.tagType == startType) {
      // If we have entered the tag, test if there are any children to move to.
      var child = this.reversed ? node.lastChild : node.firstChild;
      if (child) {
        this.setPosition(child);
      } else {
        // If not, move on to exiting this tag.
        this.setPosition(node,
           ***REMOVED*****REMOVED*** @type {goog.dom.TagWalkType}***REMOVED*** (startType***REMOVED*** -1));
      }
    } else {
      var sibling = this.reversed ? node.previousSibling : node.nextSibling;
      if (sibling) {
        // Try to move to the next node.
        this.setPosition(sibling);
      } else {
        // If no such node exists, exit our parent.
        this.setPosition(node.parentNode,
           ***REMOVED*****REMOVED*** @type {goog.dom.TagWalkType}***REMOVED*** (startType***REMOVED*** -1));
      }
    }

    this.depth += this.tagType***REMOVED*** (this.reversed ? -1 : 1);
  } else {
    this.started_ = true;
  }

  // Check the new position for being last, and return it if it's not.
  node = this.node;
  if (!this.node) {
    throw goog.iter.StopIteration;
  }
  return node;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether next has ever been called on this iterator.
***REMOVED*** @protected
***REMOVED***
goog.dom.TagIterator.prototype.isStarted = function() {
  return this.started_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether this iterator's position is a start tag position.
***REMOVED***
goog.dom.TagIterator.prototype.isStartTag = function() {
  return this.tagType == goog.dom.TagWalkType.START_TAG;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether this iterator's position is an end tag position.
***REMOVED***
goog.dom.TagIterator.prototype.isEndTag = function() {
  return this.tagType == goog.dom.TagWalkType.END_TAG;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether this iterator's position is not at an element node.
***REMOVED***
goog.dom.TagIterator.prototype.isNonElement = function() {
  return this.tagType == goog.dom.TagWalkType.OTHER;
***REMOVED***


***REMOVED***
***REMOVED*** Test if two iterators are at the same position - i.e. if the node and tagType
***REMOVED*** is the same.  This will still return true if the two iterators are moving in
***REMOVED*** opposite directions or have different constraints.
***REMOVED*** @param {goog.dom.TagIterator} other The iterator to compare to.
***REMOVED*** @return {boolean} Whether the two iterators are at the same position.
***REMOVED***
goog.dom.TagIterator.prototype.equals = function(other) {
  // Nodes must be equal, and we must either have reached the end of our tree
  // or be at the same position.
  return other.node == this.node && (!this.node ||
      other.tagType == this.tagType);
***REMOVED***


***REMOVED***
***REMOVED*** Replace the current node with the list of nodes. Reset the iterator so that
***REMOVED*** it visits the first of the nodes next.
***REMOVED*** @param {...Object} var_args A list of nodes to replace the current node with.
***REMOVED***     If the first argument is array-like, it will be used, otherwise all the
***REMOVED***     arguments are assumed to be nodes.
***REMOVED***
goog.dom.TagIterator.prototype.splice = function(var_args) {
  // Reset the iterator so that it iterates over the first replacement node in
  // the arguments on the next iteration.
  var node = this.node;
  this.restartTag();
  this.reversed = !this.reversed;
  goog.dom.TagIterator.prototype.next.call(this);
  this.reversed = !this.reversed;

  // Replace the node with the arguments.
  var arr = goog.isArrayLike(arguments[0]) ? arguments[0] : arguments;
  for (var i = arr.length - 1; i >= 0; i--) {
    goog.dom.insertSiblingAfter(arr[i], node);
  }
  goog.dom.removeNode(node);
***REMOVED***
