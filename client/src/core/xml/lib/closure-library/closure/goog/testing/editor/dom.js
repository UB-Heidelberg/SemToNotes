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
***REMOVED*** @fileoverview Testing utilities for editor specific DOM related tests.
***REMOVED***
***REMOVED***

goog.provide('goog.testing.editor.dom');

goog.require('goog.dom.NodeType');
goog.require('goog.dom.TagIterator');
goog.require('goog.dom.TagWalkType');
goog.require('goog.iter');
goog.require('goog.string');
goog.require('goog.testing.asserts');


***REMOVED***
***REMOVED*** Returns the previous (in document order) node from the given node that is a
***REMOVED*** non-empty text node, or null if none is found or opt_stopAt is not an
***REMOVED*** ancestor of node. Note that if the given node has children, the search will
***REMOVED*** start from the end tag of the node, meaning all its descendants will be
***REMOVED*** included in the search, unless opt_skipDescendants is true.
***REMOVED*** @param {Node} node Node to start searching from.
***REMOVED*** @param {Node=} opt_stopAt Node to stop searching at (search will be
***REMOVED***     restricted to this node's subtree), defaults to the body of the document
***REMOVED***     containing node.
***REMOVED*** @param {boolean=} opt_skipDescendants Whether to skip searching the given
***REMOVED***     node's descentants.
***REMOVED*** @return {Text} The previous (in document order) node from the given node
***REMOVED***     that is a non-empty text node, or null if none is found.
***REMOVED***
goog.testing.editor.dom.getPreviousNonEmptyTextNode = function(
    node, opt_stopAt, opt_skipDescendants) {
  return goog.testing.editor.dom.getPreviousNextNonEmptyTextNodeHelper_(
      node, opt_stopAt, opt_skipDescendants, true);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the next (in document order) node from the given node that is a
***REMOVED*** non-empty text node, or null if none is found or opt_stopAt is not an
***REMOVED*** ancestor of node. Note that if the given node has children, the search will
***REMOVED*** start from the start tag of the node, meaning all its descendants will be
***REMOVED*** included in the search, unless opt_skipDescendants is true.
***REMOVED*** @param {Node} node Node to start searching from.
***REMOVED*** @param {Node=} opt_stopAt Node to stop searching at (search will be
***REMOVED***     restricted to this node's subtree), defaults to the body of the document
***REMOVED***     containing node.
***REMOVED*** @param {boolean=} opt_skipDescendants Whether to skip searching the given
***REMOVED***     node's descentants.
***REMOVED*** @return {Text} The next (in document order) node from the given node that
***REMOVED***     is a non-empty text node, or null if none is found or opt_stopAt is not
***REMOVED***     an ancestor of node.
***REMOVED***
goog.testing.editor.dom.getNextNonEmptyTextNode = function(
    node, opt_stopAt, opt_skipDescendants) {
  return goog.testing.editor.dom.getPreviousNextNonEmptyTextNodeHelper_(
      node, opt_stopAt, opt_skipDescendants, false);
***REMOVED***


***REMOVED***
***REMOVED*** Helper that returns the previous or next (in document order) node from the
***REMOVED*** given node that is a non-empty text node, or null if none is found or
***REMOVED*** opt_stopAt is not an ancestor of node. Note that if the given node has
***REMOVED*** children, the search will start from the end or start tag of the node
***REMOVED*** (depending on whether it's searching for the previous or next node), meaning
***REMOVED*** all its descendants will be included in the search, unless
***REMOVED*** opt_skipDescendants is true.
***REMOVED*** @param {Node} node Node to start searching from.
***REMOVED*** @param {Node=} opt_stopAt Node to stop searching at (search will be
***REMOVED***     restricted to this node's subtree), defaults to the body of the document
***REMOVED***     containing node.
***REMOVED*** @param {boolean=} opt_skipDescendants Whether to skip searching the given
***REMOVED***   node's descentants.
***REMOVED*** @param {boolean=} opt_isPrevious Whether to search for the previous non-empty
***REMOVED***     text node instead of the next one.
***REMOVED*** @return {Text} The next (in document order) node from the given node that
***REMOVED***     is a non-empty text node, or null if none is found or opt_stopAt is not
***REMOVED***     an ancestor of node.
***REMOVED*** @private
***REMOVED***
goog.testing.editor.dom.getPreviousNextNonEmptyTextNodeHelper_ = function(
    node, opt_stopAt, opt_skipDescendants, opt_isPrevious) {
  opt_stopAt = opt_stopAt || node.ownerDocument.body;
  // Initializing the iterator to iterate over the children of opt_stopAt
  // makes it stop only when it finishes iterating through all of that
  // node's children, even though we will start at a different node and exit
  // that starting node's subtree in the process.
  var iter = new goog.dom.TagIterator(opt_stopAt, opt_isPrevious);

  // TODO(user): Move this logic to a new method in TagIterator such as
  // skipToNode().
  // Then we set the iterator to start at the given start node, not opt_stopAt.
  var walkType; // Let TagIterator set the initial walk type by default.
  var depth = goog.testing.editor.dom.getRelativeDepth_(node, opt_stopAt);
  if (depth == -1) {
    return null; // Fail because opt_stopAt is not an ancestor of node.
  }
  if (node.nodeType == goog.dom.NodeType.ELEMENT) {
    if (opt_skipDescendants) {
      // Specifically set the initial walk type so that we skip the descendant
      // subtree by starting at the start if going backwards or at the end if
      // going forwards.
      walkType = opt_isPrevious ? goog.dom.TagWalkType.START_TAG :
                                  goog.dom.TagWalkType.END_TAG;
    } else {
      // We're starting "inside" an element node so the depth needs to be one
      // deeper than the node's actual depth. That's how TagIterator works!
      depth++;
    }
  }
  iter.setPosition(node, walkType, depth);

  // Advance the iterator so it skips the start node.
  try {
    iter.next();
  } catch (e) {
    return null; // It could have been a leaf node.
  }
  // Now just get the first non-empty text node the iterator finds.
  var filter = goog.iter.filter(iter,
                                goog.testing.editor.dom.isNonEmptyTextNode_);
  try {
    return***REMOVED*****REMOVED*** @type {Text}***REMOVED*** (filter.next());
  } catch (e) { // No next item is available so return null.
    return null;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the given node is a non-empty text node.
***REMOVED*** @param {Node} node Node to be checked.
***REMOVED*** @return {boolean} Whether the given node is a non-empty text node.
***REMOVED*** @private
***REMOVED***
goog.testing.editor.dom.isNonEmptyTextNode_ = function(node) {
  return !!node && node.nodeType == goog.dom.NodeType.TEXT && node.length > 0;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the depth of the given node relative to the given parent node, or -1
***REMOVED*** if the given node is not a descendant of the given parent node. E.g. if
***REMOVED*** node == parentNode returns 0, if node.parentNode == parentNode returns 1,
***REMOVED*** etc.
***REMOVED*** @param {Node} node Node whose depth to get.
***REMOVED*** @param {Node} parentNode Node relative to which the depth should be
***REMOVED***     calculated.
***REMOVED*** @return {number} The depth of the given node relative to the given parent
***REMOVED***     node, or -1 if the given node is not a descendant of the given parent
***REMOVED***     node.
***REMOVED*** @private
***REMOVED***
goog.testing.editor.dom.getRelativeDepth_ = function(node, parentNode) {
  var depth = 0;
  while (node) {
    if (node == parentNode) {
      return depth;
    }
    node = node.parentNode;
    depth++;
  }
  return -1;
***REMOVED***


***REMOVED***
***REMOVED*** Assert that the range is surrounded by the given strings. This is useful
***REMOVED*** because different browsers can place the range endpoints inside different
***REMOVED*** nodes even when visually the range looks the same. Also, there may be empty
***REMOVED*** text nodes in the way (again depending on the browser) making it difficult to
***REMOVED*** use assertRangeEquals.
***REMOVED*** @param {string} before String that should occur immediately before the start
***REMOVED***     point of the range. If this is the empty string, assert will only succeed
***REMOVED***     if there is no text before the start point of the range.
***REMOVED*** @param {string} after String that should occur immediately after the end
***REMOVED***     point of the range. If this is the empty string, assert will only succeed
***REMOVED***     if there is no text after the end point of the range.
***REMOVED*** @param {goog.dom.AbstractRange} range The range to be tested.
***REMOVED*** @param {Node=} opt_stopAt Node to stop searching at (search will be
***REMOVED***     restricted to this node's subtree).
***REMOVED***
goog.testing.editor.dom.assertRangeBetweenText = function(before,
                                                          after,
                                                          range,
                                                          opt_stopAt) {
  var previousText =
      goog.testing.editor.dom.getTextFollowingRange_(range, true, opt_stopAt);
  if (before == '') {
    assertNull('Expected nothing before range but found <' + previousText + '>',
               previousText);
  } else {
    assertNotNull('Expected <' + before + '> before range but found nothing',
                  previousText);
    assertTrue('Expected <' + before + '> before range but found <' +
               previousText + '>',
               goog.string.endsWith(
                  ***REMOVED*****REMOVED*** @type {string}***REMOVED*** (previousText), before));
  }
  var nextText =
      goog.testing.editor.dom.getTextFollowingRange_(range, false, opt_stopAt);
  if (after == '') {
    assertNull('Expected nothing after range but found <' + nextText + '>',
               nextText);
  } else {
    assertNotNull('Expected <' + after + '> after range but found nothing',
                  nextText);
    assertTrue('Expected <' + after + '> after range but found <' +
               nextText + '>',
               goog.string.startsWith(
                  ***REMOVED*****REMOVED*** @type {string}***REMOVED*** (nextText), after));
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the text that follows the given range, where the term "follows" means
***REMOVED*** "comes immediately before the start of the range" if isBefore is true, and
***REMOVED*** "comes immediately after the end of the range" if isBefore is false, or null
***REMOVED*** if no non-empty text node is found.
***REMOVED*** @param {goog.dom.AbstractRange} range The range to search from.
***REMOVED*** @param {boolean} isBefore Whether to search before the range instead of
***REMOVED***     after it.
***REMOVED*** @param {Node=} opt_stopAt Node to stop searching at (search will be
***REMOVED***     restricted to this node's subtree).
***REMOVED*** @return {?string} The text that follows the given range, or null if no
***REMOVED***     non-empty text node is found.
***REMOVED*** @private
***REMOVED***
goog.testing.editor.dom.getTextFollowingRange_ = function(range,
                                                          isBefore,
                                                          opt_stopAt) {
  var followingTextNode;
  var endpointNode = isBefore ? range.getStartNode() : range.getEndNode();
  var endpointOffset = isBefore ? range.getStartOffset() : range.getEndOffset();
  var getFollowingTextNode =
      isBefore ? goog.testing.editor.dom.getPreviousNonEmptyTextNode :
                 goog.testing.editor.dom.getNextNonEmptyTextNode;

  if (endpointNode.nodeType == goog.dom.NodeType.TEXT) {
    // Range endpoint is in a text node.
    var endText = endpointNode.nodeValue;
    if (isBefore ? endpointOffset > 0 : endpointOffset < endText.length) {
      // There is text in this node following the endpoint so return the portion
      // that follows the endpoint.
      return isBefore ? endText.substr(0, endpointOffset) :
                        endText.substr(endpointOffset);
    } else {
      // There is no text following the endpoint so look for the follwing text
      // node.
      followingTextNode = getFollowingTextNode(endpointNode, opt_stopAt);
      return followingTextNode && followingTextNode.nodeValue;
    }
  } else {
    // Range endpoint is in an element node.
    var numChildren = endpointNode.childNodes.length;
    if (isBefore ? endpointOffset > 0 : endpointOffset < numChildren) {
      // There is at least one child following the endpoint.
      var followingChild =
          endpointNode.childNodes[isBefore ? endpointOffset - 1 :
                                             endpointOffset];
      if (goog.testing.editor.dom.isNonEmptyTextNode_(followingChild)) {
        // The following child has text so return that.
        return followingChild.nodeValue;
      } else {
        // The following child has no text so look for the following text node.
        followingTextNode = getFollowingTextNode(followingChild, opt_stopAt);
        return followingTextNode && followingTextNode.nodeValue;
      }
    } else {
      // There is no child following the endpoint, so search from the endpoint
      // node, but don't search its children because they are not following the
      // endpoint!
      followingTextNode = getFollowingTextNode(endpointNode, opt_stopAt, true);
      return followingTextNode && followingTextNode.nodeValue;
    }
  }
***REMOVED***
