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
***REMOVED*** @fileoverview Interface definitions for working with ranges
***REMOVED*** in HTML documents.
***REMOVED***
***REMOVED*** @author robbyw@google.com (Robby Walker)
***REMOVED***


goog.provide('goog.dom.AbstractRange');
goog.provide('goog.dom.RangeIterator');
goog.provide('goog.dom.RangeType');

goog.require('goog.dom');
goog.require('goog.dom.NodeType');
goog.require('goog.dom.SavedCaretRange');
goog.require('goog.dom.TagIterator');
goog.require('goog.userAgent');


***REMOVED***
***REMOVED*** Types of ranges.
***REMOVED*** @enum {string}
***REMOVED***
goog.dom.RangeType = {
  TEXT: 'text',
  CONTROL: 'control',
  MULTI: 'mutli'
***REMOVED***



***REMOVED***
***REMOVED*** Creates a new selection with no properties.  Do not use this constructor -
***REMOVED*** use one of the goog.dom.Range.from* methods instead.
***REMOVED***
***REMOVED***
goog.dom.AbstractRange = function() {
***REMOVED***


***REMOVED***
***REMOVED*** Gets the browser native selection object from the given window.
***REMOVED*** @param {Window} win The window to get the selection object from.
***REMOVED*** @return {Object} The browser native selection object, or null if it could
***REMOVED***     not be retrieved.
***REMOVED***
goog.dom.AbstractRange.getBrowserSelectionForWindow = function(win) {
  if (win.getSelection) {
    // W3C
    return win.getSelection();
  } else {
    // IE
    var doc = win.document;
    var sel = doc.selection;
    if (sel) {
      // IE has a bug where it sometimes returns a selection from the wrong
      // document. Catching these cases now helps us avoid problems later.
      try {
        var range = sel.createRange();
        // Only TextRanges have a parentElement method.
        if (range.parentElement) {
          if (range.parentElement().document != doc) {
            return null;
          }
        } else if (!range.length || range.item(0).document != doc) {
          // For ControlRanges, check that the range has items, and that
          // the first item in the range is in the correct document.
          return null;
        }
      } catch (e) {
        // If the selection is in the wrong document, and the wrong document is
        // in a different domain, IE will throw an exception.
        return null;
      }
      // TODO(user|robbyw) Sometimes IE 6 returns a selection instance
      // when there is no selection.  This object has a 'type' property equals
      // to 'None' and a typeDetail property bound to undefined. Ideally this
      // function should not return this instance.
      return sel;
    }
    return null;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Tests if the given Object is a controlRange.
***REMOVED*** @param {Object} range The range object to test.
***REMOVED*** @return {boolean} Whether the given Object is a controlRange.
***REMOVED***
goog.dom.AbstractRange.isNativeControlRange = function(range) {
  // For now, tests for presence of a control range function.
  return !!range && !!range.addElement;
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.dom.AbstractRange} A clone of this range.
***REMOVED***
goog.dom.AbstractRange.prototype.clone = goog.abstractMethod;


***REMOVED***
***REMOVED*** @return {goog.dom.RangeType} The type of range represented by this object.
***REMOVED***
goog.dom.AbstractRange.prototype.getType = goog.abstractMethod;


***REMOVED***
***REMOVED*** @return {Range|TextRange} The native browser range object.
***REMOVED***
goog.dom.AbstractRange.prototype.getBrowserRangeObject = goog.abstractMethod;


***REMOVED***
***REMOVED*** Sets the native browser range object, overwriting any state this range was
***REMOVED*** storing.
***REMOVED*** @param {Range|TextRange} nativeRange The native browser range object.
***REMOVED*** @return {boolean} Whether the given range was accepted.  If not, the caller
***REMOVED***     will need to call goog.dom.Range.createFromBrowserRange to create a new
***REMOVED***     range object.
***REMOVED***
goog.dom.AbstractRange.prototype.setBrowserRangeObject = function(nativeRange) {
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of text ranges in this range.
***REMOVED***
goog.dom.AbstractRange.prototype.getTextRangeCount = goog.abstractMethod;


***REMOVED***
***REMOVED*** Get the i-th text range in this range.  The behavior is undefined if
***REMOVED*** i >= getTextRangeCount or i < 0.
***REMOVED*** @param {number} i The range number to retrieve.
***REMOVED*** @return {goog.dom.TextRange} The i-th text range.
***REMOVED***
goog.dom.AbstractRange.prototype.getTextRange = goog.abstractMethod;


***REMOVED***
***REMOVED*** Gets an array of all text ranges this range is comprised of.  For non-multi
***REMOVED*** ranges, returns a single element array containing this.
***REMOVED*** @return {Array.<goog.dom.TextRange>} Array of text ranges.
***REMOVED***
goog.dom.AbstractRange.prototype.getTextRanges = function() {
  var output = [];
  for (var i = 0, len = this.getTextRangeCount(); i < len; i++) {
    output.push(this.getTextRange(i));
  }
  return output;
***REMOVED***


***REMOVED***
***REMOVED*** @return {Node} The deepest node that contains the entire range.
***REMOVED***
goog.dom.AbstractRange.prototype.getContainer = goog.abstractMethod;


***REMOVED***
***REMOVED*** Returns the deepest element in the tree that contains the entire range.
***REMOVED*** @return {Element} The deepest element that contains the entire range.
***REMOVED***
goog.dom.AbstractRange.prototype.getContainerElement = function() {
  var node = this.getContainer();
  return***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (
      node.nodeType == goog.dom.NodeType.ELEMENT ? node : node.parentNode);
***REMOVED***


***REMOVED***
***REMOVED*** @return {Node} The element or text node the range starts in.  For text
***REMOVED***     ranges, the range comprises all text between the start and end position.
***REMOVED***     For other types of range, start and end give bounds of the range but
***REMOVED***     do not imply all nodes in those bounds are selected.
***REMOVED***
goog.dom.AbstractRange.prototype.getStartNode = goog.abstractMethod;


***REMOVED***
***REMOVED*** @return {number} The offset into the node the range starts in.  For text
***REMOVED***     nodes, this is an offset into the node value.  For elements, this is
***REMOVED***     an offset into the childNodes array.
***REMOVED***
goog.dom.AbstractRange.prototype.getStartOffset = goog.abstractMethod;


***REMOVED***
***REMOVED*** @return {goog.math.Coordinate} The coordinate of the selection start node
***REMOVED***     and offset.
***REMOVED***
goog.dom.AbstractRange.prototype.getStartPosition = goog.abstractMethod;


***REMOVED***
***REMOVED*** @return {Node} The element or text node the range ends in.
***REMOVED***
goog.dom.AbstractRange.prototype.getEndNode = goog.abstractMethod;


***REMOVED***
***REMOVED*** @return {number} The offset into the node the range ends in.  For text
***REMOVED***     nodes, this is an offset into the node value.  For elements, this is
***REMOVED***     an offset into the childNodes array.
***REMOVED***
goog.dom.AbstractRange.prototype.getEndOffset = goog.abstractMethod;


***REMOVED***
***REMOVED*** @return {goog.math.Coordinate} The coordinate of the selection end
***REMOVED***     node and offset.
***REMOVED***
goog.dom.AbstractRange.prototype.getEndPosition = goog.abstractMethod;


***REMOVED***
***REMOVED*** @return {Node} The element or text node the range is anchored at.
***REMOVED***
goog.dom.AbstractRange.prototype.getAnchorNode = function() {
  return this.isReversed() ? this.getEndNode() : this.getStartNode();
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The offset into the node the range is anchored at.  For
***REMOVED***     text nodes, this is an offset into the node value.  For elements, this
***REMOVED***     is an offset into the childNodes array.
***REMOVED***
goog.dom.AbstractRange.prototype.getAnchorOffset = function() {
  return this.isReversed() ? this.getEndOffset() : this.getStartOffset();
***REMOVED***


***REMOVED***
***REMOVED*** @return {Node} The element or text node the range is focused at - i.e. where
***REMOVED***     the cursor is.
***REMOVED***
goog.dom.AbstractRange.prototype.getFocusNode = function() {
  return this.isReversed() ? this.getStartNode() : this.getEndNode();
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The offset into the node the range is focused at - i.e.
***REMOVED***     where the cursor is.  For text nodes, this is an offset into the node
***REMOVED***     value.  For elements, this is an offset into the childNodes array.
***REMOVED***
goog.dom.AbstractRange.prototype.getFocusOffset = function() {
  return this.isReversed() ? this.getStartOffset() : this.getEndOffset();
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the selection is reversed.
***REMOVED***
goog.dom.AbstractRange.prototype.isReversed = function() {
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** @return {Document} The document this selection is a part of.
***REMOVED***
goog.dom.AbstractRange.prototype.getDocument = function() {
  // Using start node in IE was crashing the browser in some cases so use
  // getContainer for that browser. It's also faster for IE, but still slower
  // than start node for other browsers so we continue to use getStartNode when
  // it is not problematic. See bug 1687309.
  return goog.dom.getOwnerDocument(goog.userAgent.IE ?
      this.getContainer() : this.getStartNode());
***REMOVED***


***REMOVED***
***REMOVED*** @return {Window} The window this selection is a part of.
***REMOVED***
goog.dom.AbstractRange.prototype.getWindow = function() {
  return goog.dom.getWindow(this.getDocument());
***REMOVED***


***REMOVED***
***REMOVED*** Tests if this range contains the given range.
***REMOVED*** @param {goog.dom.AbstractRange} range The range to test.
***REMOVED*** @param {boolean=} opt_allowPartial If true, the range can be partially
***REMOVED***     contained in the selection, otherwise the range must be entirely
***REMOVED***     contained.
***REMOVED*** @return {boolean} Whether this range contains the given range.
***REMOVED***
goog.dom.AbstractRange.prototype.containsRange = goog.abstractMethod;


***REMOVED***
***REMOVED*** Tests if this range contains the given node.
***REMOVED*** @param {Node} node The node to test for.
***REMOVED*** @param {boolean=} opt_allowPartial If not set or false, the node must be
***REMOVED***     entirely contained in the selection for this function to return true.
***REMOVED*** @return {boolean} Whether this range contains the given node.
***REMOVED***
goog.dom.AbstractRange.prototype.containsNode = function(node,
    opt_allowPartial) {
  return this.containsRange(goog.dom.Range.createFromNodeContents(node),
      opt_allowPartial);
***REMOVED***


***REMOVED***
***REMOVED*** Tests whether this range is valid (i.e. whether its endpoints are still in
***REMOVED*** the document).  A range becomes invalid when, after this object was created,
***REMOVED*** either one or both of its endpoints are removed from the document.  Use of
***REMOVED*** an invalid range can lead to runtime errors, particularly in IE.
***REMOVED*** @return {boolean} Whether the range is valid.
***REMOVED***
goog.dom.AbstractRange.prototype.isRangeInDocument = goog.abstractMethod;


***REMOVED***
***REMOVED*** @return {boolean} Whether the range is collapsed.
***REMOVED***
goog.dom.AbstractRange.prototype.isCollapsed = goog.abstractMethod;


***REMOVED***
***REMOVED*** @return {string} The text content of the range.
***REMOVED***
goog.dom.AbstractRange.prototype.getText = goog.abstractMethod;


***REMOVED***
***REMOVED*** Returns the HTML fragment this range selects.  This is slow on all browsers.
***REMOVED*** The HTML fragment may not be valid HTML, for instance if the user selects
***REMOVED*** from a to b inclusively in the following html:
***REMOVED***
***REMOVED*** &gt;div&lt;a&gt;/div&lt;b
***REMOVED***
***REMOVED*** This method will return
***REMOVED***
***REMOVED*** a&lt;/div&gt;b
***REMOVED***
***REMOVED*** If you need valid HTML, use {@link #getValidHtml} instead.
***REMOVED***
***REMOVED*** @return {string} HTML fragment of the range, does not include context
***REMOVED***     containing elements.
***REMOVED***
goog.dom.AbstractRange.prototype.getHtmlFragment = goog.abstractMethod;


***REMOVED***
***REMOVED*** Returns valid HTML for this range.  This is fast on IE, and semi-fast on
***REMOVED*** other browsers.
***REMOVED*** @return {string} Valid HTML of the range, including context containing
***REMOVED***     elements.
***REMOVED***
goog.dom.AbstractRange.prototype.getValidHtml = goog.abstractMethod;


***REMOVED***
***REMOVED*** Returns pastable HTML for this range.  This guarantees that any child items
***REMOVED*** that must have specific ancestors will have them, for instance all TDs will
***REMOVED*** be contained in a TR in a TBODY in a TABLE and all LIs will be contained in
***REMOVED*** a UL or OL as appropriate.  This is semi-fast on all browsers.
***REMOVED*** @return {string} Pastable HTML of the range, including context containing
***REMOVED***     elements.
***REMOVED***
goog.dom.AbstractRange.prototype.getPastableHtml = goog.abstractMethod;


***REMOVED***
***REMOVED*** Returns a RangeIterator over the contents of the range.  Regardless of the
***REMOVED*** direction of the range, the iterator will move in document order.
***REMOVED*** @param {boolean=} opt_keys Unused for this iterator.
***REMOVED*** @return {goog.dom.RangeIterator} An iterator over tags in the range.
***REMOVED***
goog.dom.AbstractRange.prototype.__iterator__ = goog.abstractMethod;


// RANGE ACTIONS


***REMOVED***
***REMOVED*** Sets this range as the selection in its window.
***REMOVED***
goog.dom.AbstractRange.prototype.select = goog.abstractMethod;


***REMOVED***
***REMOVED*** Removes the contents of the range from the document.
***REMOVED***
goog.dom.AbstractRange.prototype.removeContents = goog.abstractMethod;


***REMOVED***
***REMOVED*** Inserts a node before (or after) the range.  The range may be disrupted
***REMOVED*** beyond recovery because of the way this splits nodes.
***REMOVED*** @param {Node} node The node to insert.
***REMOVED*** @param {boolean} before True to insert before, false to insert after.
***REMOVED*** @return {Node} The node added to the document.  This may be different
***REMOVED***     than the node parameter because on IE we have to clone it.
***REMOVED***
goog.dom.AbstractRange.prototype.insertNode = goog.abstractMethod;


***REMOVED***
***REMOVED*** Replaces the range contents with (possibly a copy of) the given node.  The
***REMOVED*** range may be disrupted beyond recovery because of the way this splits nodes.
***REMOVED*** @param {Node} node The node to insert.
***REMOVED*** @return {Node} The node added to the document.  This may be different
***REMOVED***     than the node parameter because on IE we have to clone it.
***REMOVED***
goog.dom.AbstractRange.prototype.replaceContentsWithNode = function(node) {
  if (!this.isCollapsed()) {
    this.removeContents();
  }

  return this.insertNode(node, true);
***REMOVED***


***REMOVED***
***REMOVED*** Surrounds this range with the two given nodes.  The range may be disrupted
***REMOVED*** beyond recovery because of the way this splits nodes.
***REMOVED*** @param {Element} startNode The node to insert at the start.
***REMOVED*** @param {Element} endNode The node to insert at the end.
***REMOVED***
goog.dom.AbstractRange.prototype.surroundWithNodes = goog.abstractMethod;


// SAVE/RESTORE


***REMOVED***
***REMOVED*** Saves the range so that if the start and end nodes are left alone, it can
***REMOVED*** be restored.
***REMOVED*** @return {goog.dom.SavedRange} A range representation that can be restored
***REMOVED***     as long as the endpoint nodes of the selection are not modified.
***REMOVED***
goog.dom.AbstractRange.prototype.saveUsingDom = goog.abstractMethod;


***REMOVED***
***REMOVED*** Saves the range using HTML carets. As long as the carets remained in the
***REMOVED*** HTML, the range can be restored...even when the HTML is copied across
***REMOVED*** documents.
***REMOVED*** @return {goog.dom.SavedCaretRange?} A range representation that can be
***REMOVED***     restored as long as carets are not removed. Returns null if carets
***REMOVED***     could not be created.
***REMOVED***
goog.dom.AbstractRange.prototype.saveUsingCarets = function() {
  return (this.getStartNode() && this.getEndNode()) ?
      new goog.dom.SavedCaretRange(this) : null;
***REMOVED***


// RANGE MODIFICATION


***REMOVED***
***REMOVED*** Collapses the range to one of its boundary points.
***REMOVED*** @param {boolean} toAnchor Whether to collapse to the anchor of the range.
***REMOVED***
goog.dom.AbstractRange.prototype.collapse = goog.abstractMethod;

// RANGE ITERATION



***REMOVED***
***REMOVED*** Subclass of goog.dom.TagIterator that iterates over a DOM range.  It
***REMOVED*** adds functions to determine the portion of each text node that is selected.
***REMOVED*** @param {Node} node The node to start traversal at.  When null, creates an
***REMOVED***     empty iterator.
***REMOVED*** @param {boolean=} opt_reverse Whether to traverse nodes in reverse.
***REMOVED***
***REMOVED*** @extends {goog.dom.TagIterator}
***REMOVED***
goog.dom.RangeIterator = function(node, opt_reverse) {
  goog.dom.TagIterator.call(this, node, opt_reverse, true);
***REMOVED***
goog.inherits(goog.dom.RangeIterator, goog.dom.TagIterator);


***REMOVED***
***REMOVED*** @return {number} The offset into the current node, or -1 if the current node
***REMOVED***     is not a text node.
***REMOVED***
goog.dom.RangeIterator.prototype.getStartTextOffset = goog.abstractMethod;


***REMOVED***
***REMOVED*** @return {number} The end offset into the current node, or -1 if the current
***REMOVED***     node is not a text node.
***REMOVED***
goog.dom.RangeIterator.prototype.getEndTextOffset = goog.abstractMethod;


***REMOVED***
***REMOVED*** @return {Node} node The iterator's start node.
***REMOVED***
goog.dom.RangeIterator.prototype.getStartNode = goog.abstractMethod;


***REMOVED***
***REMOVED*** @return {Node} The iterator's end node.
***REMOVED***
goog.dom.RangeIterator.prototype.getEndNode = goog.abstractMethod;


***REMOVED***
***REMOVED*** @return {boolean} Whether a call to next will fail.
***REMOVED***
goog.dom.RangeIterator.prototype.isLast = goog.abstractMethod;
