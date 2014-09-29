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

goog.provide('goog.dom.NodeIterator');

goog.require('goog.dom.TagIterator');



***REMOVED***
***REMOVED*** A DOM tree traversal iterator.
***REMOVED***
***REMOVED*** Starting with the given node, the iterator walks the DOM in order, reporting
***REMOVED*** events for each node.  The iterator acts as a prefix iterator:
***REMOVED***
***REMOVED*** <pre>
***REMOVED*** &lt;div&gt;1&lt;span&gt;2&lt;/span&gt;3&lt;/div&gt;
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** Will return the following nodes:
***REMOVED***
***REMOVED*** <code>[div, 1, span, 2, 3]</code>
***REMOVED***
***REMOVED*** With the following depths
***REMOVED***
***REMOVED*** <code>[1, 1, 2, 2, 1]</code>
***REMOVED***
***REMOVED*** Imagining <code>|</code> represents iterator position, the traversal stops at
***REMOVED*** each of the following locations:
***REMOVED***
***REMOVED*** <pre>&lt;div&gt;|1|&lt;span&gt;|2|&lt;/span&gt;3|&lt;/div&gt;</pre>
***REMOVED***
***REMOVED*** The iterator can also be used in reverse mode, which will return the nodes
***REMOVED*** and states in the opposite order.  The depths will be slightly different
***REMOVED*** since, like in normal mode, the depth is computed***REMOVED***after* the last move.
***REMOVED***
***REMOVED*** Lastly, it is possible to create an iterator that is unconstrained, meaning
***REMOVED*** that it will continue iterating until the end of the document instead of
***REMOVED*** until exiting the start node.
***REMOVED***
***REMOVED*** @param {Node=} opt_node The start node.  Defaults to an empty iterator.
***REMOVED*** @param {boolean=} opt_reversed Whether to traverse the tree in reverse.
***REMOVED*** @param {boolean=} opt_unconstrained Whether the iterator is not constrained
***REMOVED***     to the starting node and its children.
***REMOVED*** @param {number=} opt_depth The starting tree depth.
***REMOVED***
***REMOVED*** @extends {goog.dom.TagIterator}
***REMOVED***
goog.dom.NodeIterator = function(opt_node, opt_reversed,
    opt_unconstrained, opt_depth) {
  goog.dom.TagIterator.call(this, opt_node, opt_reversed, opt_unconstrained,
      null, opt_depth);
***REMOVED***
goog.inherits(goog.dom.NodeIterator, goog.dom.TagIterator);


***REMOVED***
***REMOVED*** Moves to the next position in the DOM tree.
***REMOVED*** @return {Node} Returns the next node, or throws a goog.iter.StopIteration
***REMOVED***     exception if the end of the iterator's range has been reached.
***REMOVED*** @override
***REMOVED***
goog.dom.NodeIterator.prototype.next = function() {
  do {
    goog.dom.NodeIterator.superClass_.next.call(this);
  } while (this.isEndTag());

  return this.node;
***REMOVED***
