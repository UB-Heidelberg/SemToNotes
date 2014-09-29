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
***REMOVED*** @fileoverview Utilties for working with ranges.
***REMOVED***
***REMOVED*** @author nicksantos@google.com (Nick Santos)
***REMOVED***

goog.provide('goog.editor.range');
goog.provide('goog.editor.range.Point');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.NodeType');
goog.require('goog.dom.Range');
goog.require('goog.dom.RangeEndpoint');
goog.require('goog.dom.SavedCaretRange');
goog.require('goog.editor.BrowserFeature');
goog.require('goog.editor.node');
goog.require('goog.editor.style');
goog.require('goog.iter');


***REMOVED***
***REMOVED*** Given a range and an element, create a narrower range that is limited to the
***REMOVED*** boundaries of the element. If the range starts (or ends) outside the
***REMOVED*** element, the narrowed range's start point (or end point) will be the
***REMOVED*** leftmost (or rightmost) leaf of the element.
***REMOVED*** @param {goog.dom.AbstractRange} range The range.
***REMOVED*** @param {Element} el The element to limit the range to.
***REMOVED*** @return {goog.dom.AbstractRange} A new narrowed range, or null if the
***REMOVED***     element does not contain any part of the given range.
***REMOVED***
goog.editor.range.narrow = function(range, el) {
  var startContainer = range.getStartNode();
  var endContainer = range.getEndNode();

  if (startContainer && endContainer) {
    var isElement = function(node) {
      return node == el;
   ***REMOVED*****REMOVED***
    var hasStart = goog.dom.getAncestor(startContainer, isElement, true);
    var hasEnd = goog.dom.getAncestor(endContainer, isElement, true);

    if (hasStart && hasEnd) {
      // The range is contained entirely within this element.
      return range.clone();
    } else if (hasStart) {
      // The range starts inside the element, but ends outside it.
      var leaf = goog.editor.node.getRightMostLeaf(el);
      return goog.dom.Range.createFromNodes(
          range.getStartNode(), range.getStartOffset(),
          leaf, goog.editor.node.getLength(leaf));
    } else if (hasEnd) {
      // The range starts outside the element, but ends inside it.
      return goog.dom.Range.createFromNodes(
          goog.editor.node.getLeftMostLeaf(el), 0,
          range.getEndNode(), range.getEndOffset());
    }
  }

  // The selection starts and ends outside the element.
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Given a range, expand the range to include outer tags if the full contents of
***REMOVED*** those tags are entirely selected.  This essentially changes the dom position,
***REMOVED*** but not the visible position of the range.
***REMOVED*** Ex. <li>foo</li> if "foo" is selected, instead of returning start and end
***REMOVED*** nodes as the foo text node, return the li.
***REMOVED*** @param {goog.dom.AbstractRange} range The range.
***REMOVED*** @param {Node=} opt_stopNode Optional node to stop expanding past.
***REMOVED*** @return {goog.dom.AbstractRange} The expanded range.
***REMOVED***
goog.editor.range.expand = function(range, opt_stopNode) {
  // Expand the start out to the common container.
  var expandedRange = goog.editor.range.expandEndPointToContainer_(
      range, goog.dom.RangeEndpoint.START, opt_stopNode);
  // Expand the end out to the common container.
  expandedRange = goog.editor.range.expandEndPointToContainer_(
      expandedRange, goog.dom.RangeEndpoint.END, opt_stopNode);

  var startNode = expandedRange.getStartNode();
  var endNode = expandedRange.getEndNode();
  var startOffset = expandedRange.getStartOffset();
  var endOffset = expandedRange.getEndOffset();

  // If we have reached a common container, now expand out.
  if (startNode == endNode) {
    while (endNode != opt_stopNode &&
           startOffset == 0 &&
           endOffset == goog.editor.node.getLength(endNode)) {
      // Select the parent instead.
      var parentNode = endNode.parentNode;
      startOffset = goog.array.indexOf(parentNode.childNodes, endNode);
      endOffset = startOffset + 1;
      endNode = parentNode;
    }
    startNode = endNode;
  }

  return goog.dom.Range.createFromNodes(startNode, startOffset,
      endNode, endOffset);
***REMOVED***


***REMOVED***
***REMOVED*** Given a range, expands the start or end points as far out towards the
***REMOVED*** range's common container (or stopNode, if provided) as possible, while
***REMOVED*** perserving the same visible position.
***REMOVED***
***REMOVED*** @param {goog.dom.AbstractRange} range The range to expand.
***REMOVED*** @param {goog.dom.RangeEndpoint} endpoint The endpoint to expand.
***REMOVED*** @param {Node=} opt_stopNode Optional node to stop expanding past.
***REMOVED*** @return {goog.dom.AbstractRange} The expanded range.
***REMOVED*** @private
***REMOVED***
goog.editor.range.expandEndPointToContainer_ = function(range, endpoint,
                                                        opt_stopNode) {
  var expandStart = endpoint == goog.dom.RangeEndpoint.START;
  var node = expandStart ? range.getStartNode() : range.getEndNode();
  var offset = expandStart ? range.getStartOffset() : range.getEndOffset();
  var container = range.getContainerElement();

  // Expand the node out until we reach the container or the stop node.
  while (node != container && node != opt_stopNode) {
    // It is only valid to expand the start if we are at the start of a node
    // (offset 0) or expand the end if we are at the end of a node
    // (offset length).
    if (expandStart && offset != 0 ||
        !expandStart && offset != goog.editor.node.getLength(node)) {
      break;
    }

    var parentNode = node.parentNode;
    var index = goog.array.indexOf(parentNode.childNodes, node);
    offset = expandStart ? index : index + 1;
    node = parentNode;
  }

  return goog.dom.Range.createFromNodes(
      expandStart ? node : range.getStartNode(),
      expandStart ? offset : range.getStartOffset(),
      expandStart ? range.getEndNode() : node,
      expandStart ? range.getEndOffset() : offset);
***REMOVED***


***REMOVED***
***REMOVED*** Cause the window's selection to be the start of this node.
***REMOVED*** @param {Node} node The node to select the start of.
***REMOVED***
goog.editor.range.selectNodeStart = function(node) {
  goog.dom.Range.createCaret(goog.editor.node.getLeftMostLeaf(node), 0).
      select();
***REMOVED***


***REMOVED***
***REMOVED*** Position the cursor immediately to the left or right of "node".
***REMOVED*** In Firefox, the selection parent is outside of "node", so the cursor can
***REMOVED*** effectively be moved to the end of a link node, without being considered
***REMOVED*** inside of it.
***REMOVED*** Note: This does not always work in WebKit. In particular, if you try to
***REMOVED*** place a cursor to the right of a link, typing still puts you in the link.
***REMOVED*** Bug: http://bugs.webkit.org/show_bug.cgi?id=17697
***REMOVED*** @param {Node} node The node to position the cursor relative to.
***REMOVED*** @param {boolean} toLeft True to place it to the left, false to the right.
***REMOVED*** @return {goog.dom.AbstractRange} The newly selected range.
***REMOVED***
goog.editor.range.placeCursorNextTo = function(node, toLeft) {
  var parent = node.parentNode;
  var offset = goog.array.indexOf(parent.childNodes, node) +
      (toLeft ? 0 : 1);
  var point = goog.editor.range.Point.createDeepestPoint(
      parent, offset, toLeft, true);
  var range = goog.dom.Range.createCaret(point.node, point.offset);
  range.select();
  return range;
***REMOVED***


***REMOVED***
***REMOVED*** Normalizes the node, preserving the selection of the document.
***REMOVED***
***REMOVED*** May also normalize things outside the node, if it is more efficient to do so.
***REMOVED***
***REMOVED*** @param {Node} node The node to normalize.
***REMOVED***
goog.editor.range.selectionPreservingNormalize = function(node) {
  var doc = goog.dom.getOwnerDocument(node);
  var selection = goog.dom.Range.createFromWindow(goog.dom.getWindow(doc));
  var normalizedRange =
      goog.editor.range.rangePreservingNormalize(node, selection);
  if (normalizedRange) {
    normalizedRange.select();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Manually normalizes the node in IE, since native normalize in IE causes
***REMOVED*** transient problems.
***REMOVED*** @param {Node} node The node to normalize.
***REMOVED*** @private
***REMOVED***
goog.editor.range.normalizeNodeIe_ = function(node) {
  var lastText = null;
  var child = node.firstChild;
  while (child) {
    var next = child.nextSibling;
    if (child.nodeType == goog.dom.NodeType.TEXT) {
      if (child.nodeValue == '') {
        node.removeChild(child);
      } else if (lastText) {
        lastText.nodeValue += child.nodeValue;
        node.removeChild(child);
      } else {
        lastText = child;
      }
    } else {
      goog.editor.range.normalizeNodeIe_(child);
      lastText = null;
    }
    child = next;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Normalizes the given node.
***REMOVED*** @param {Node} node The node to normalize.
***REMOVED***
goog.editor.range.normalizeNode = function(node) {
  if (goog.userAgent.IE) {
    goog.editor.range.normalizeNodeIe_(node);
  } else {
    node.normalize();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Normalizes the node, preserving a range of the document.
***REMOVED***
***REMOVED*** May also normalize things outside the node, if it is more efficient to do so.
***REMOVED***
***REMOVED*** @param {Node} node The node to normalize.
***REMOVED*** @param {goog.dom.AbstractRange?} range The range to normalize.
***REMOVED*** @return {goog.dom.AbstractRange?} The range, adjusted for normalization.
***REMOVED***
goog.editor.range.rangePreservingNormalize = function(node, range) {
  if (range) {
    var rangeFactory = goog.editor.range.normalize(range);
    // WebKit has broken selection affinity, so carets tend to jump out of the
    // beginning of inline elements. This means that if we're doing the
    // normalize as the result of a range that will later become the selection,
    // we might not normalize something in the range after it is read back from
    // the selection. We can't just normalize the parentNode here because WebKit
    // can move the selection range out of multiple inline parents.
    var container = goog.editor.style.getContainer(range.getContainerElement());
  }

  if (container) {
    goog.editor.range.normalizeNode(
        goog.dom.findCommonAncestor(container, node));
  } else if (node) {
    goog.editor.range.normalizeNode(node);
  }

  if (rangeFactory) {
    return rangeFactory();
  } else {
    return null;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Get the deepest point in the DOM that's equivalent to the endpoint of the
***REMOVED*** given range.
***REMOVED***
***REMOVED*** @param {goog.dom.AbstractRange} range A range.
***REMOVED*** @param {boolean} atStart True for the start point, false for the end point.
***REMOVED*** @return {goog.editor.range.Point} The end point, expressed as a node
***REMOVED***    and an offset.
***REMOVED***
goog.editor.range.getDeepEndPoint = function(range, atStart) {
  return atStart ?
      goog.editor.range.Point.createDeepestPoint(
          range.getStartNode(), range.getStartOffset()) :
      goog.editor.range.Point.createDeepestPoint(
          range.getEndNode(), range.getEndOffset());
***REMOVED***


***REMOVED***
***REMOVED*** Given a range in the current DOM, create a factory for a range that
***REMOVED*** represents the same selection in a normalized DOM. The factory function
***REMOVED*** should be invoked after the DOM is normalized.
***REMOVED***
***REMOVED*** All browsers do a bad job preserving ranges across DOM normalization.
***REMOVED*** The issue is best described in this 5-year-old bug report:
***REMOVED*** https://bugzilla.mozilla.org/show_bug.cgi?id=191864
***REMOVED*** For most applications, this isn't a problem. The browsers do a good job
***REMOVED*** handling un-normalized text, so there's usually no reason to normalize.
***REMOVED***
***REMOVED*** The exception to this rule is the rich text editing commands
***REMOVED*** execCommand and queryCommandValue, which will fail often if there are
***REMOVED*** un-normalized text nodes.
***REMOVED***
***REMOVED*** The factory function creates new ranges so that we can normalize the DOM
***REMOVED*** without problems. It must be created before any normalization happens,
***REMOVED*** and invoked after normalization happens.
***REMOVED***
***REMOVED*** @param {goog.dom.AbstractRange} range The range to normalize. It may
***REMOVED***    become invalid after body.normalize() is called.
***REMOVED*** @return {function(): goog.dom.AbstractRange} A factory for a normalized
***REMOVED***    range. Should be called after body.normalize() is called.
***REMOVED***
goog.editor.range.normalize = function(range) {
  var startPoint = goog.editor.range.normalizePoint_(
      goog.editor.range.getDeepEndPoint(range, true));
  var startParent = startPoint.getParentPoint();
  var startPreviousSibling = startPoint.node.previousSibling;
  if (startPoint.node.nodeType == goog.dom.NodeType.TEXT) {
    startPoint.node = null;
  }

  var endPoint = goog.editor.range.normalizePoint_(
      goog.editor.range.getDeepEndPoint(range, false));
  var endParent = endPoint.getParentPoint();
  var endPreviousSibling = endPoint.node.previousSibling;
  if (endPoint.node.nodeType == goog.dom.NodeType.TEXT) {
    endPoint.node = null;
  }

 ***REMOVED*****REMOVED*** @return {goog.dom.AbstractRange} The normalized range.***REMOVED***
  return function() {
    if (!startPoint.node && startPreviousSibling) {
      // If startPoint.node was previously an empty text node with no siblings,
      // startPreviousSibling may not have a nextSibling since that node will no
      // longer exist.  Do our best and point to the end of the previous
      // element.
      startPoint.node = startPreviousSibling.nextSibling;
      if (!startPoint.node) {
        startPoint = goog.editor.range.Point.getPointAtEndOfNode(
            startPreviousSibling);
      }
    }

    if (!endPoint.node && endPreviousSibling) {
      // If endPoint.node was previously an empty text node with no siblings,
      // endPreviousSibling may not have a nextSibling since that node will no
      // longer exist.  Do our best and point to the end of the previous
      // element.
      endPoint.node = endPreviousSibling.nextSibling;
      if (!endPoint.node) {
        endPoint = goog.editor.range.Point.getPointAtEndOfNode(
            endPreviousSibling);
      }
    }

    return goog.dom.Range.createFromNodes(
        startPoint.node || startParent.node.firstChild || startParent.node,
        startPoint.offset,
        endPoint.node || endParent.node.firstChild || endParent.node,
        endPoint.offset);
 ***REMOVED*****REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** Given a point in the current DOM, adjust it to represent the same point in
***REMOVED*** a normalized DOM.
***REMOVED***
***REMOVED*** See the comments on goog.editor.range.normalize for more context.
***REMOVED***
***REMOVED*** @param {goog.editor.range.Point} point A point in the document.
***REMOVED*** @return {goog.editor.range.Point} The same point, for easy chaining.
***REMOVED*** @private
***REMOVED***
goog.editor.range.normalizePoint_ = function(point) {
  var previous;
  if (point.node.nodeType == goog.dom.NodeType.TEXT) {
    // If the cursor position is in a text node,
    // look at all the previous text siblings of the text node,
    // and set the offset relative to the earliest text sibling.
    for (var current = point.node.previousSibling;
         current && current.nodeType == goog.dom.NodeType.TEXT;
         current = current.previousSibling) {
      point.offset += goog.editor.node.getLength(current);
    }

    previous = current;
  } else {
    previous = point.node.previousSibling;
  }

  var parent = point.node.parentNode;
  point.node = previous ? previous.nextSibling : parent.firstChild;
  return point;
***REMOVED***


***REMOVED***
***REMOVED*** Checks if a range is completely inside an editable region.
***REMOVED*** @param {goog.dom.AbstractRange} range The range to test.
***REMOVED*** @return {boolean} Whether the range is completely inside an editable region.
***REMOVED***
goog.editor.range.isEditable = function(range) {
  var rangeContainer = range.getContainerElement();

  // Closure's implementation of getContainerElement() is a little too
  // smart in IE when exactly one element is contained in the range.
  // It assumes that there's a user whose intent was actually to select
  // all that element's children, so it returns the element itself as its
  // own containing element.
  // This little sanity check detects this condition so we can account for it.
  var rangeContainerIsOutsideRange =
      range.getStartNode() != rangeContainer.parentElement;

  return (rangeContainerIsOutsideRange &&
          goog.editor.node.isEditableContainer(rangeContainer)) ||
      goog.editor.node.isEditable(rangeContainer);
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the given range intersects with any instance of the given
***REMOVED*** tag.
***REMOVED*** @param {goog.dom.AbstractRange} range The range to check.
***REMOVED*** @param {goog.dom.TagName} tagName The name of the tag.
***REMOVED*** @return {boolean} Whether the given range intersects with any instance of
***REMOVED***     the given tag.
***REMOVED***
goog.editor.range.intersectsTag = function(range, tagName) {
  if (goog.dom.getAncestorByTagNameAndClass(range.getContainerElement(),
                                            tagName)) {
    return true;
  }

  return goog.iter.some(range, function(node) {
    return node.tagName == tagName;
  });
***REMOVED***



***REMOVED***
***REMOVED*** One endpoint of a range, represented as a Node and and offset.
***REMOVED*** @param {Node} node The node containing the point.
***REMOVED*** @param {number} offset The offset of the point into the node.
***REMOVED***
***REMOVED***
goog.editor.range.Point = function(node, offset) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The node containing the point.
  ***REMOVED*** @type {Node}
 ***REMOVED*****REMOVED***
  this.node = node;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The offset of the point into the node.
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.offset = offset;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the point of this point's node in the DOM.
***REMOVED*** @return {goog.editor.range.Point} The node's point.
***REMOVED***
goog.editor.range.Point.prototype.getParentPoint = function() {
  var parent = this.node.parentNode;
  return new goog.editor.range.Point(
      parent, goog.array.indexOf(parent.childNodes, this.node));
***REMOVED***


***REMOVED***
***REMOVED*** Construct the deepest possible point in the DOM that's equivalent
***REMOVED*** to the given point, expressed as a node and an offset.
***REMOVED*** @param {Node} node The node containing the point.
***REMOVED*** @param {number} offset The offset of the point from the node.
***REMOVED*** @param {boolean=} opt_trendLeft Notice that a (node, offset) pair may be
***REMOVED***     equivalent to more than one descendent (node, offset) pair in the DOM.
***REMOVED***     By default, we trend rightward. If this parameter is true, then we
***REMOVED***     trend leftward. The tendency to fall rightward by default is for
***REMOVED***     consistency with other range APIs (like placeCursorNextTo).
***REMOVED*** @param {boolean=} opt_stopOnChildlessElement If true, and we encounter
***REMOVED***     a Node which is an Element that cannot have children, we return a Point
***REMOVED***     based on its parent rather than that Node itself.
***REMOVED*** @return {goog.editor.range.Point} A new point.
***REMOVED***
goog.editor.range.Point.createDeepestPoint =
    function(node, offset, opt_trendLeft, opt_stopOnChildlessElement) {
  while (node.nodeType == goog.dom.NodeType.ELEMENT) {
    var child = node.childNodes[offset];
    if (!child && !node.lastChild) {
      break;
    } else if (child) {
      var prevSibling = child.previousSibling;
      if (opt_trendLeft && prevSibling) {
        if (opt_stopOnChildlessElement &&
            goog.editor.range.Point.isTerminalElement_(prevSibling)) {
          break;
        }
        node = prevSibling;
        offset = goog.editor.node.getLength(node);
      } else {
        if (opt_stopOnChildlessElement &&
            goog.editor.range.Point.isTerminalElement_(child)) {
          break;
        }
        node = child;
        offset = 0;
      }
    } else {
      if (opt_stopOnChildlessElement &&
          goog.editor.range.Point.isTerminalElement_(node.lastChild)) {
        break;
      }
      node = node.lastChild;
      offset = goog.editor.node.getLength(node);
    }
  }

  return new goog.editor.range.Point(node, offset);
***REMOVED***


***REMOVED***
***REMOVED*** Return true if the specified node is an Element that is not expected to have
***REMOVED*** children. The createDeepestPoint() method should not traverse into
***REMOVED*** such elements.
***REMOVED*** @param {Node} node .
***REMOVED*** @return {boolean} True if the node is an Element that does not contain
***REMOVED***     child nodes (e.g. BR, IMG).
***REMOVED*** @private
***REMOVED***
goog.editor.range.Point.isTerminalElement_ = function(node) {
  return (node.nodeType == goog.dom.NodeType.ELEMENT &&
          !goog.dom.canHaveChildren(node));
***REMOVED***


***REMOVED***
***REMOVED*** Construct a point at the very end of the given node.
***REMOVED*** @param {Node} node The node to create a point for.
***REMOVED*** @return {goog.editor.range.Point} A new point.
***REMOVED***
goog.editor.range.Point.getPointAtEndOfNode = function(node) {
  return new goog.editor.range.Point(node, goog.editor.node.getLength(node));
***REMOVED***


***REMOVED***
***REMOVED*** Saves the range by inserting carets into the HTML.
***REMOVED***
***REMOVED*** Unlike the regular saveUsingCarets, this SavedRange normalizes text nodes.
***REMOVED*** Browsers have other bugs where they don't handle split text nodes in
***REMOVED*** contentEditable regions right.
***REMOVED***
***REMOVED*** @param {goog.dom.AbstractRange} range The abstract range object.
***REMOVED*** @return {goog.dom.SavedCaretRange} A saved caret range that normalizes
***REMOVED***     text nodes.
***REMOVED***
goog.editor.range.saveUsingNormalizedCarets = function(range) {
  return new goog.editor.range.NormalizedCaretRange_(range);
***REMOVED***



***REMOVED***
***REMOVED*** Saves the range using carets, but normalizes text nodes when carets
***REMOVED*** are removed.
***REMOVED*** @see goog.editor.range.saveUsingNormalizedCarets
***REMOVED*** @param {goog.dom.AbstractRange} range The range being saved.
***REMOVED***
***REMOVED*** @extends {goog.dom.SavedCaretRange}
***REMOVED*** @private
***REMOVED***
goog.editor.range.NormalizedCaretRange_ = function(range) {
  goog.dom.SavedCaretRange.call(this, range);
***REMOVED***
goog.inherits(goog.editor.range.NormalizedCaretRange_,
    goog.dom.SavedCaretRange);


***REMOVED***
***REMOVED*** Normalizes text nodes whenever carets are removed from the document.
***REMOVED*** @param {goog.dom.AbstractRange=} opt_range A range whose offsets have already
***REMOVED***     been adjusted for caret removal; it will be adjusted and returned if it
***REMOVED***     is also affected by post-removal operations, such as text node
***REMOVED***     normalization.
***REMOVED*** @return {goog.dom.AbstractRange|undefined} The adjusted range, if opt_range
***REMOVED***     was provided.
***REMOVED*** @override
***REMOVED***
goog.editor.range.NormalizedCaretRange_.prototype.removeCarets =
    function(opt_range) {
  var startCaret = this.getCaret(true);
  var endCaret = this.getCaret(false);
  var node = startCaret && endCaret ?
      goog.dom.findCommonAncestor(startCaret, endCaret) :
      startCaret || endCaret;

  goog.editor.range.NormalizedCaretRange_.superClass_.removeCarets.call(this);

  if (opt_range) {
    return goog.editor.range.rangePreservingNormalize(node, opt_range);
  } else if (node) {
    goog.editor.range.selectionPreservingNormalize(node);
  }
***REMOVED***
