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
***REMOVED*** @fileoverview Definition of the browser range interface.
***REMOVED***
***REMOVED*** DO NOT USE THIS FILE DIRECTLY.  Use goog.dom.Range instead.
***REMOVED***
***REMOVED*** @author robbyw@google.com (Robby Walker)
***REMOVED*** @author ojan@google.com (Ojan Vafai)
***REMOVED*** @author jparent@google.com (Julie Parent)
***REMOVED***


goog.provide('goog.dom.browserrange.AbstractRange');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.NodeType');
goog.require('goog.dom.RangeEndpoint');
goog.require('goog.dom.TagName');
goog.require('goog.dom.TextRangeIterator');
goog.require('goog.iter');
goog.require('goog.math.Coordinate');
goog.require('goog.string');
goog.require('goog.string.StringBuffer');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** The constructor for abstract ranges.  Don't call this from subclasses.
***REMOVED***
***REMOVED***
goog.dom.browserrange.AbstractRange = function() {
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.dom.browserrange.AbstractRange} A clone of this range.
***REMOVED***
goog.dom.browserrange.AbstractRange.prototype.clone = goog.abstractMethod;


***REMOVED***
***REMOVED*** Returns the browser native implementation of the range.  Please refrain from
***REMOVED*** using this function - if you find you need the range please add wrappers for
***REMOVED*** the functionality you need rather than just using the native range.
***REMOVED*** @return {Range|TextRange} The browser native range object.
***REMOVED***
goog.dom.browserrange.AbstractRange.prototype.getBrowserRange =
    goog.abstractMethod;


***REMOVED***
***REMOVED*** Returns the deepest node in the tree that contains the entire range.
***REMOVED*** @return {Node} The deepest node that contains the entire range.
***REMOVED***
goog.dom.browserrange.AbstractRange.prototype.getContainer =
    goog.abstractMethod;


***REMOVED***
***REMOVED*** Returns the node the range starts in.
***REMOVED*** @return {Node} The element or text node the range starts in.
***REMOVED***
goog.dom.browserrange.AbstractRange.prototype.getStartNode =
    goog.abstractMethod;


***REMOVED***
***REMOVED*** Returns the offset into the node the range starts in.
***REMOVED*** @return {number} The offset into the node the range starts in.  For text
***REMOVED***     nodes, this is an offset into the node value.  For elements, this is
***REMOVED***     an offset into the childNodes array.
***REMOVED***
goog.dom.browserrange.AbstractRange.prototype.getStartOffset =
    goog.abstractMethod;


***REMOVED***
***REMOVED*** @return {goog.math.Coordinate} The coordinate of the selection start node
***REMOVED***     and offset.
***REMOVED***
goog.dom.browserrange.AbstractRange.prototype.getStartPosition = function() {
  goog.asserts.assert(this.range_.getClientRects,
      'Getting selection coordinates is not supported.');

  var rects = this.range_.getClientRects();
  if (rects.length) {
    return new goog.math.Coordinate(rects[0]['left'], rects[0]['top']);
  }
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the node the range ends in.
***REMOVED*** @return {Node} The element or text node the range ends in.
***REMOVED***
goog.dom.browserrange.AbstractRange.prototype.getEndNode =
    goog.abstractMethod;


***REMOVED***
***REMOVED*** Returns the offset into the node the range ends in.
***REMOVED*** @return {number} The offset into the node the range ends in.  For text
***REMOVED***     nodes, this is an offset into the node value.  For elements, this is
***REMOVED***     an offset into the childNodes array.
***REMOVED***
goog.dom.browserrange.AbstractRange.prototype.getEndOffset =
    goog.abstractMethod;


***REMOVED***
***REMOVED*** @return {goog.math.Coordinate} The coordinate of the selection end node
***REMOVED***     and offset.
***REMOVED***
goog.dom.browserrange.AbstractRange.prototype.getEndPosition = function() {
  goog.asserts.assert(this.range_.getClientRects,
      'Getting selection coordinates is not supported.');

  var rects = this.range_.getClientRects();
  if (rects.length) {
    var lastRect = goog.array.peek(rects);
    return new goog.math.Coordinate(lastRect['right'], lastRect['bottom']);
  }
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Compares one endpoint of this range with the endpoint of another browser
***REMOVED*** native range object.
***REMOVED*** @param {Range|TextRange} range The browser native range to compare against.
***REMOVED*** @param {goog.dom.RangeEndpoint} thisEndpoint The endpoint of this range
***REMOVED***     to compare with.
***REMOVED*** @param {goog.dom.RangeEndpoint} otherEndpoint The endpoint of the other
***REMOVED***     range to compare with.
***REMOVED*** @return {number} 0 if the endpoints are equal, negative if this range
***REMOVED***     endpoint comes before the other range endpoint, and positive otherwise.
***REMOVED***
goog.dom.browserrange.AbstractRange.prototype.compareBrowserRangeEndpoints =
    goog.abstractMethod;


***REMOVED***
***REMOVED*** Tests if this range contains the given range.
***REMOVED*** @param {goog.dom.browserrange.AbstractRange} abstractRange The range to test.
***REMOVED*** @param {boolean=} opt_allowPartial If not set or false, the range must be
***REMOVED***     entirely contained in the selection for this function to return true.
***REMOVED*** @return {boolean} Whether this range contains the given range.
***REMOVED***
goog.dom.browserrange.AbstractRange.prototype.containsRange =
    function(abstractRange, opt_allowPartial) {
  // IE sometimes misreports the boundaries for collapsed ranges. So if the
  // other range is collapsed, make sure the whole range is contained. This is
  // logically equivalent, and works around IE's bug.
  var checkPartial = opt_allowPartial && !abstractRange.isCollapsed();

  var range = abstractRange.getBrowserRange();
  var start = goog.dom.RangeEndpoint.START, end = goog.dom.RangeEndpoint.END;
 ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
  try {
    if (checkPartial) {
      // There are two ways to not overlap.  Being before, and being after.
      // Before is represented by this.end before range.start: comparison < 0.
      // After is represented by this.start after range.end: comparison > 0.
      // The below is the negation of not overlapping.
      return this.compareBrowserRangeEndpoints(range, end, start) >= 0 &&
             this.compareBrowserRangeEndpoints(range, start, end) <= 0;

    } else {
      // Return true if this range bounds the parameter range from both sides.
      return this.compareBrowserRangeEndpoints(range, end, end) >= 0 &&
          this.compareBrowserRangeEndpoints(range, start, start) <= 0;
    }
  } catch (e) {
    if (!goog.userAgent.IE) {
      throw e;
    }
    // IE sometimes throws exceptions when one range is invalid, i.e. points
    // to a node that has been removed from the document.  Return false in this
    // case.
    return false;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Tests if this range contains the given node.
***REMOVED*** @param {Node} node The node to test.
***REMOVED*** @param {boolean=} opt_allowPartial If not set or false, the node must be
***REMOVED***     entirely contained in the selection for this function to return true.
***REMOVED*** @return {boolean} Whether this range contains the given node.
***REMOVED***
goog.dom.browserrange.AbstractRange.prototype.containsNode = function(node,
    opt_allowPartial) {
  return this.containsRange(
      goog.dom.browserrange.createRangeFromNodeContents(node),
      opt_allowPartial);
***REMOVED***


***REMOVED***
***REMOVED*** Tests if the selection is collapsed - i.e. is just a caret.
***REMOVED*** @return {boolean} Whether the range is collapsed.
***REMOVED***
goog.dom.browserrange.AbstractRange.prototype.isCollapsed =
    goog.abstractMethod;


***REMOVED***
***REMOVED*** @return {string} The text content of the range.
***REMOVED***
goog.dom.browserrange.AbstractRange.prototype.getText =
    goog.abstractMethod;


***REMOVED***
***REMOVED*** Returns the HTML fragment this range selects.  This is slow on all browsers.
***REMOVED*** @return {string} HTML fragment of the range, does not include context
***REMOVED***     containing elements.
***REMOVED***
goog.dom.browserrange.AbstractRange.prototype.getHtmlFragment = function() {
  var output = new goog.string.StringBuffer();
  goog.iter.forEach(this, function(node, ignore, it) {
    if (node.nodeType == goog.dom.NodeType.TEXT) {
      output.append(goog.string.htmlEscape(node.nodeValue.substring(
          it.getStartTextOffset(), it.getEndTextOffset())));
    } else if (node.nodeType == goog.dom.NodeType.ELEMENT) {
      if (it.isEndTag()) {
        if (goog.dom.canHaveChildren(node)) {
          output.append('</' + node.tagName + '>');
        }
      } else {
        var shallow = node.cloneNode(false);
        var html = goog.dom.getOuterHtml(shallow);
        if (goog.userAgent.IE && node.tagName == goog.dom.TagName.LI) {
          // For an LI, IE just returns "<li>" with no closing tag
          output.append(html);
        } else {
          var index = html.lastIndexOf('<');
          output.append(index ? html.substr(0, index) : html);
        }
      }
    }
  }, this);

  return output.toString();
***REMOVED***


***REMOVED***
***REMOVED*** Returns valid HTML for this range.  This is fast on IE, and semi-fast on
***REMOVED*** other browsers.
***REMOVED*** @return {string} Valid HTML of the range, including context containing
***REMOVED***     elements.
***REMOVED***
goog.dom.browserrange.AbstractRange.prototype.getValidHtml =
    goog.abstractMethod;


***REMOVED***
***REMOVED*** Returns a RangeIterator over the contents of the range.  Regardless of the
***REMOVED*** direction of the range, the iterator will move in document order.
***REMOVED*** @param {boolean=} opt_keys Unused for this iterator.
***REMOVED*** @return {!goog.dom.RangeIterator} An iterator over tags in the range.
***REMOVED***
goog.dom.browserrange.AbstractRange.prototype.__iterator__ = function(
    opt_keys) {
  return new goog.dom.TextRangeIterator(this.getStartNode(),
      this.getStartOffset(), this.getEndNode(), this.getEndOffset());
***REMOVED***


// SELECTION MODIFICATION


***REMOVED***
***REMOVED*** Set this range as the selection in its window.
***REMOVED*** @param {boolean=} opt_reverse Whether to select the range in reverse,
***REMOVED***     if possible.
***REMOVED***
goog.dom.browserrange.AbstractRange.prototype.select =
    goog.abstractMethod;


***REMOVED***
***REMOVED*** Removes the contents of the range from the document.  As a side effect, the
***REMOVED*** selection will be collapsed.  The behavior of content removal is normalized
***REMOVED*** across browsers.  For instance, IE sometimes creates extra text nodes that
***REMOVED*** a W3C browser does not.  That behavior is corrected for.
***REMOVED***
goog.dom.browserrange.AbstractRange.prototype.removeContents =
    goog.abstractMethod;


***REMOVED***
***REMOVED*** Surrounds the text range with the specified element (on Mozilla) or with a
***REMOVED*** clone of the specified element (on IE).  Returns a reference to the
***REMOVED*** surrounding element if the operation was successful; returns null if the
***REMOVED*** operation failed.
***REMOVED*** @param {Element} element The element with which the selection is to be
***REMOVED***    surrounded.
***REMOVED*** @return {Element} The surrounding element (same as the argument on Mozilla,
***REMOVED***    but not on IE), or null if unsuccessful.
***REMOVED***
goog.dom.browserrange.AbstractRange.prototype.surroundContents =
    goog.abstractMethod;


***REMOVED***
***REMOVED*** Inserts a node before (or after) the range.  The range may be disrupted
***REMOVED*** beyond recovery because of the way this splits nodes.
***REMOVED*** @param {Node} node The node to insert.
***REMOVED*** @param {boolean} before True to insert before, false to insert after.
***REMOVED*** @return {Node} The node added to the document.  This may be different
***REMOVED***     than the node parameter because on IE we have to clone it.
***REMOVED***
goog.dom.browserrange.AbstractRange.prototype.insertNode =
    goog.abstractMethod;


***REMOVED***
***REMOVED*** Surrounds this range with the two given nodes.  The range may be disrupted
***REMOVED*** beyond recovery because of the way this splits nodes.
***REMOVED*** @param {Element} startNode The node to insert at the start.
***REMOVED*** @param {Element} endNode The node to insert at the end.
***REMOVED***
goog.dom.browserrange.AbstractRange.prototype.surroundWithNodes =
    goog.abstractMethod;


***REMOVED***
***REMOVED*** Collapses the range to one of its boundary points.
***REMOVED*** @param {boolean} toStart Whether to collapse to the start of the range.
***REMOVED***
goog.dom.browserrange.AbstractRange.prototype.collapse =
    goog.abstractMethod;
