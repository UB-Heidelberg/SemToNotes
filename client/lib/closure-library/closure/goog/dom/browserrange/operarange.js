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
***REMOVED*** @fileoverview Definition of the Opera specific range wrapper.  Inherits most
***REMOVED*** functionality from W3CRange, but adds exceptions as necessary.
***REMOVED***
***REMOVED*** DO NOT USE THIS FILE DIRECTLY.  Use goog.dom.Range instead.
***REMOVED***
***REMOVED***


goog.provide('goog.dom.browserrange.OperaRange');

goog.require('goog.dom.browserrange.W3cRange');



***REMOVED***
***REMOVED*** The constructor for Opera specific browser ranges.
***REMOVED*** @param {Range} range The range object.
***REMOVED***
***REMOVED*** @extends {goog.dom.browserrange.W3cRange}
***REMOVED*** @final
***REMOVED***
goog.dom.browserrange.OperaRange = function(range) {
  goog.dom.browserrange.W3cRange.call(this, range);
***REMOVED***
goog.inherits(goog.dom.browserrange.OperaRange, goog.dom.browserrange.W3cRange);


***REMOVED***
***REMOVED*** Creates a range object that selects the given node's text.
***REMOVED*** @param {Node} node The node to select.
***REMOVED*** @return {!goog.dom.browserrange.OperaRange} A Opera range wrapper object.
***REMOVED***
goog.dom.browserrange.OperaRange.createFromNodeContents = function(node) {
  return new goog.dom.browserrange.OperaRange(
      goog.dom.browserrange.W3cRange.getBrowserRangeForNode(node));
***REMOVED***


***REMOVED***
***REMOVED*** Creates a range object that selects between the given nodes.
***REMOVED*** @param {Node} startNode The node to start with.
***REMOVED*** @param {number} startOffset The offset within the node to start.
***REMOVED*** @param {Node} endNode The node to end with.
***REMOVED*** @param {number} endOffset The offset within the node to end.
***REMOVED*** @return {!goog.dom.browserrange.OperaRange} A wrapper object.
***REMOVED***
goog.dom.browserrange.OperaRange.createFromNodes = function(startNode,
    startOffset, endNode, endOffset) {
  return new goog.dom.browserrange.OperaRange(
      goog.dom.browserrange.W3cRange.getBrowserRangeForNodes(startNode,
          startOffset, endNode, endOffset));
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.browserrange.OperaRange.prototype.selectInternal = function(
    selection, reversed) {
  // Avoid using addRange as we have to removeAllRanges first, which
  // blurs editable fields in Opera.
  selection.collapse(this.getStartNode(), this.getStartOffset());
  if (this.getEndNode() != this.getStartNode() ||
      this.getEndOffset() != this.getStartOffset()) {
    selection.extend(this.getEndNode(), this.getEndOffset());
  }
  // This can happen if the range isn't in an editable field.
  if (selection.rangeCount == 0) {
    selection.addRange(this.range_);
  }
***REMOVED***
