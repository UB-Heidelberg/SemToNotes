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
***REMOVED*** @fileoverview Utilities for working with text ranges in HTML documents.
***REMOVED***
***REMOVED*** @author robbyw@google.com (Robby Walker)
***REMOVED*** @author ojan@google.com (Ojan Vafai)
***REMOVED*** @author jparent@google.com (Julie Parent)
***REMOVED***


goog.provide('goog.dom.TextRange');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.AbstractRange');
goog.require('goog.dom.RangeType');
goog.require('goog.dom.SavedRange');
goog.require('goog.dom.TagName');
goog.require('goog.dom.TextRangeIterator');
goog.require('goog.dom.browserrange');
goog.require('goog.string');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** Create a new text selection with no properties.  Do not use this constructor:
***REMOVED*** use one of the goog.dom.Range.createFrom* methods instead.
***REMOVED***
***REMOVED*** @extends {goog.dom.AbstractRange}
***REMOVED*** @final
***REMOVED***
goog.dom.TextRange = function() {
***REMOVED***
goog.inherits(goog.dom.TextRange, goog.dom.AbstractRange);


***REMOVED***
***REMOVED*** Create a new range wrapper from the given browser range object.  Do not use
***REMOVED*** this method directly - please use goog.dom.Range.createFrom* instead.
***REMOVED*** @param {Range|TextRange} range The browser range object.
***REMOVED*** @param {boolean=} opt_isReversed Whether the focus node is before the anchor
***REMOVED***     node.
***REMOVED*** @return {!goog.dom.TextRange} A range wrapper object.
***REMOVED***
goog.dom.TextRange.createFromBrowserRange = function(range, opt_isReversed) {
  return goog.dom.TextRange.createFromBrowserRangeWrapper_(
      goog.dom.browserrange.createRange(range), opt_isReversed);
***REMOVED***


***REMOVED***
***REMOVED*** Create a new range wrapper from the given browser range wrapper.
***REMOVED*** @param {goog.dom.browserrange.AbstractRange} browserRange The browser range
***REMOVED***     wrapper.
***REMOVED*** @param {boolean=} opt_isReversed Whether the focus node is before the anchor
***REMOVED***     node.
***REMOVED*** @return {!goog.dom.TextRange} A range wrapper object.
***REMOVED*** @private
***REMOVED***
goog.dom.TextRange.createFromBrowserRangeWrapper_ = function(browserRange,
    opt_isReversed) {
  var range = new goog.dom.TextRange();

  // Initialize the range as a browser range wrapper type range.
  range.browserRangeWrapper_ = browserRange;
  range.isReversed_ = !!opt_isReversed;

  return range;
***REMOVED***


***REMOVED***
***REMOVED*** Create a new range wrapper that selects the given node's text.  Do not use
***REMOVED*** this method directly - please use goog.dom.Range.createFrom* instead.
***REMOVED*** @param {Node} node The node to select.
***REMOVED*** @param {boolean=} opt_isReversed Whether the focus node is before the anchor
***REMOVED***     node.
***REMOVED*** @return {!goog.dom.TextRange} A range wrapper object.
***REMOVED***
goog.dom.TextRange.createFromNodeContents = function(node, opt_isReversed) {
  return goog.dom.TextRange.createFromBrowserRangeWrapper_(
      goog.dom.browserrange.createRangeFromNodeContents(node),
      opt_isReversed);
***REMOVED***


***REMOVED***
***REMOVED*** Create a new range wrapper that selects the area between the given nodes,
***REMOVED*** accounting for the given offsets.  Do not use this method directly - please
***REMOVED*** use goog.dom.Range.createFrom* instead.
***REMOVED*** @param {Node} anchorNode The node to start with.
***REMOVED*** @param {number} anchorOffset The offset within the node to start.
***REMOVED*** @param {Node} focusNode The node to end with.
***REMOVED*** @param {number} focusOffset The offset within the node to end.
***REMOVED*** @return {!goog.dom.TextRange} A range wrapper object.
***REMOVED***
goog.dom.TextRange.createFromNodes = function(anchorNode, anchorOffset,
    focusNode, focusOffset) {
  var range = new goog.dom.TextRange();
  range.isReversed_ =***REMOVED*****REMOVED*** @suppress {missingRequire}***REMOVED*** (
      goog.dom.Range.isReversed(anchorNode, anchorOffset,
                                focusNode, focusOffset));

  // Avoid selecting terminal elements directly
  if (goog.dom.isElement(anchorNode) && !goog.dom.canHaveChildren(anchorNode)) {
    var parent = anchorNode.parentNode;
    anchorOffset = goog.array.indexOf(parent.childNodes, anchorNode);
    anchorNode = parent;
  }

  if (goog.dom.isElement(focusNode) && !goog.dom.canHaveChildren(focusNode)) {
    var parent = focusNode.parentNode;
    focusOffset = goog.array.indexOf(parent.childNodes, focusNode);
    focusNode = parent;
  }

  // Initialize the range as a W3C style range.
  if (range.isReversed_) {
    range.startNode_ = focusNode;
    range.startOffset_ = focusOffset;
    range.endNode_ = anchorNode;
    range.endOffset_ = anchorOffset;
  } else {
    range.startNode_ = anchorNode;
    range.startOffset_ = anchorOffset;
    range.endNode_ = focusNode;
    range.endOffset_ = focusOffset;
  }

  return range;
***REMOVED***


// Representation 1: a browser range wrapper.


***REMOVED***
***REMOVED*** The browser specific range wrapper.  This can be null if one of the other
***REMOVED*** representations of the range is specified.
***REMOVED*** @type {goog.dom.browserrange.AbstractRange?}
***REMOVED*** @private
***REMOVED***
goog.dom.TextRange.prototype.browserRangeWrapper_ = null;


// Representation 2: two endpoints specified as nodes + offsets


***REMOVED***
***REMOVED*** The start node of the range.  This can be null if one of the other
***REMOVED*** representations of the range is specified.
***REMOVED*** @type {Node}
***REMOVED*** @private
***REMOVED***
goog.dom.TextRange.prototype.startNode_ = null;


***REMOVED***
***REMOVED*** The start offset of the range.  This can be null if one of the other
***REMOVED*** representations of the range is specified.
***REMOVED*** @type {?number}
***REMOVED*** @private
***REMOVED***
goog.dom.TextRange.prototype.startOffset_ = null;


***REMOVED***
***REMOVED*** The end node of the range.  This can be null if one of the other
***REMOVED*** representations of the range is specified.
***REMOVED*** @type {Node}
***REMOVED*** @private
***REMOVED***
goog.dom.TextRange.prototype.endNode_ = null;


***REMOVED***
***REMOVED*** The end offset of the range.  This can be null if one of the other
***REMOVED*** representations of the range is specified.
***REMOVED*** @type {?number}
***REMOVED*** @private
***REMOVED***
goog.dom.TextRange.prototype.endOffset_ = null;


***REMOVED***
***REMOVED*** Whether the focus node is before the anchor node.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.dom.TextRange.prototype.isReversed_ = false;


// Method implementations


***REMOVED***
***REMOVED*** @return {!goog.dom.TextRange} A clone of this range.
***REMOVED*** @override
***REMOVED***
goog.dom.TextRange.prototype.clone = function() {
  var range = new goog.dom.TextRange();
  range.browserRangeWrapper_ =
      this.browserRangeWrapper_ && this.browserRangeWrapper_.clone();
  range.startNode_ = this.startNode_;
  range.startOffset_ = this.startOffset_;
  range.endNode_ = this.endNode_;
  range.endOffset_ = this.endOffset_;
  range.isReversed_ = this.isReversed_;

  return range;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.TextRange.prototype.getType = function() {
  return goog.dom.RangeType.TEXT;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.TextRange.prototype.getBrowserRangeObject = function() {
  return this.getBrowserRangeWrapper_().getBrowserRange();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.TextRange.prototype.setBrowserRangeObject = function(nativeRange) {
  // Test if it's a control range by seeing if a control range only method
  // exists.
  if (goog.dom.AbstractRange.isNativeControlRange(nativeRange)) {
    return false;
  }
  this.browserRangeWrapper_ = goog.dom.browserrange.createRange(
      nativeRange);
  this.clearCachedValues_();
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Clear all cached values.
***REMOVED*** @private
***REMOVED***
goog.dom.TextRange.prototype.clearCachedValues_ = function() {
  this.startNode_ = this.startOffset_ = this.endNode_ = this.endOffset_ = null;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.TextRange.prototype.getTextRangeCount = function() {
  return 1;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.TextRange.prototype.getTextRange = function(i) {
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** @return {!goog.dom.browserrange.AbstractRange} The range wrapper object.
***REMOVED*** @private
***REMOVED***
goog.dom.TextRange.prototype.getBrowserRangeWrapper_ = function() {
  return this.browserRangeWrapper_ ||
      (this.browserRangeWrapper_ = goog.dom.browserrange.createRangeFromNodes(
          this.getStartNode(), this.getStartOffset(),
          this.getEndNode(), this.getEndOffset()));
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.TextRange.prototype.getContainer = function() {
  return this.getBrowserRangeWrapper_().getContainer();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.TextRange.prototype.getStartNode = function() {
  return this.startNode_ ||
      (this.startNode_ = this.getBrowserRangeWrapper_().getStartNode());
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.TextRange.prototype.getStartOffset = function() {
  return this.startOffset_ != null ? this.startOffset_ :
      (this.startOffset_ = this.getBrowserRangeWrapper_().getStartOffset());
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.TextRange.prototype.getStartPosition = function() {
  return this.isReversed() ?
      this.getBrowserRangeWrapper_().getEndPosition() :
      this.getBrowserRangeWrapper_().getStartPosition();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.TextRange.prototype.getEndNode = function() {
  return this.endNode_ ||
      (this.endNode_ = this.getBrowserRangeWrapper_().getEndNode());
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.TextRange.prototype.getEndOffset = function() {
  return this.endOffset_ != null ? this.endOffset_ :
      (this.endOffset_ = this.getBrowserRangeWrapper_().getEndOffset());
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.TextRange.prototype.getEndPosition = function() {
  return this.isReversed() ?
      this.getBrowserRangeWrapper_().getStartPosition() :
      this.getBrowserRangeWrapper_().getEndPosition();
***REMOVED***


***REMOVED***
***REMOVED*** Moves a TextRange to the provided nodes and offsets.
***REMOVED*** @param {Node} startNode The node to start with.
***REMOVED*** @param {number} startOffset The offset within the node to start.
***REMOVED*** @param {Node} endNode The node to end with.
***REMOVED*** @param {number} endOffset The offset within the node to end.
***REMOVED*** @param {boolean} isReversed Whether the range is reversed.
***REMOVED***
goog.dom.TextRange.prototype.moveToNodes = function(startNode, startOffset,
                                                    endNode, endOffset,
                                                    isReversed) {
  this.startNode_ = startNode;
  this.startOffset_ = startOffset;
  this.endNode_ = endNode;
  this.endOffset_ = endOffset;
  this.isReversed_ = isReversed;
  this.browserRangeWrapper_ = null;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.TextRange.prototype.isReversed = function() {
  return this.isReversed_;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.TextRange.prototype.containsRange = function(otherRange,
                                                      opt_allowPartial) {
  var otherRangeType = otherRange.getType();
  if (otherRangeType == goog.dom.RangeType.TEXT) {
    return this.getBrowserRangeWrapper_().containsRange(
        otherRange.getBrowserRangeWrapper_(), opt_allowPartial);
  } else if (otherRangeType == goog.dom.RangeType.CONTROL) {
    var elements = otherRange.getElements();
    var fn = opt_allowPartial ? goog.array.some : goog.array.every;
    return fn(elements, function(el) {
      return this.containsNode(el, opt_allowPartial);
    }, this);
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Tests if the given node is in a document.
***REMOVED*** @param {Node} node The node to check.
***REMOVED*** @return {boolean} Whether the given node is in the given document.
***REMOVED***
goog.dom.TextRange.isAttachedNode = function(node) {
  if (goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(9)) {
    var returnValue = false;
   ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
    try {
      returnValue = node.parentNode;
    } catch (e) {
      // IE sometimes throws Invalid Argument errors when a node is detached.
      // Note: trying to return a value from the above try block can cause IE
      // to crash.  It is necessary to use the local returnValue
    }
    return !!returnValue;
  } else {
    return goog.dom.contains(node.ownerDocument.body, node);
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.TextRange.prototype.isRangeInDocument = function() {
  // Ensure any cached nodes are in the document.  IE also allows ranges to
  // become detached, so we check if the range is still in the document as
  // well for IE.
  return (!this.startNode_ ||
          goog.dom.TextRange.isAttachedNode(this.startNode_)) &&
         (!this.endNode_ ||
          goog.dom.TextRange.isAttachedNode(this.endNode_)) &&
         (!(goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(9)) ||
          this.getBrowserRangeWrapper_().isRangeInDocument());
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.TextRange.prototype.isCollapsed = function() {
  return this.getBrowserRangeWrapper_().isCollapsed();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.TextRange.prototype.getText = function() {
  return this.getBrowserRangeWrapper_().getText();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.TextRange.prototype.getHtmlFragment = function() {
  // TODO(robbyw): Generalize the code in browserrange so it is static and
  // just takes an iterator.  This would mean we don't always have to create a
  // browser range.
  return this.getBrowserRangeWrapper_().getHtmlFragment();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.TextRange.prototype.getValidHtml = function() {
  return this.getBrowserRangeWrapper_().getValidHtml();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.TextRange.prototype.getPastableHtml = function() {
  // TODO(robbyw): Get any attributes the table or tr has.

  var html = this.getValidHtml();

  if (html.match(/^\s*<td\b/i)) {
    // Match html starting with a TD.
    html = '<table><tbody><tr>' + html + '</tr></tbody></table>';
  } else if (html.match(/^\s*<tr\b/i)) {
    // Match html starting with a TR.
    html = '<table><tbody>' + html + '</tbody></table>';
  } else if (html.match(/^\s*<tbody\b/i)) {
    // Match html starting with a TBODY.
    html = '<table>' + html + '</table>';
  } else if (html.match(/^\s*<li\b/i)) {
    // Match html starting with an LI.
    var container = this.getContainer();
    var tagType = goog.dom.TagName.UL;
    while (container) {
      if (container.tagName == goog.dom.TagName.OL) {
        tagType = goog.dom.TagName.OL;
        break;
      } else if (container.tagName == goog.dom.TagName.UL) {
        break;
      }
      container = container.parentNode;
    }
    html = goog.string.buildString('<', tagType, '>', html, '</', tagType, '>');
  }

  return html;
***REMOVED***


***REMOVED***
***REMOVED*** Returns a TextRangeIterator over the contents of the range.  Regardless of
***REMOVED*** the direction of the range, the iterator will move in document order.
***REMOVED*** @param {boolean=} opt_keys Unused for this iterator.
***REMOVED*** @return {!goog.dom.TextRangeIterator} An iterator over tags in the range.
***REMOVED*** @override
***REMOVED***
goog.dom.TextRange.prototype.__iterator__ = function(opt_keys) {
  return new goog.dom.TextRangeIterator(this.getStartNode(),
      this.getStartOffset(), this.getEndNode(), this.getEndOffset());
***REMOVED***


// RANGE ACTIONS


***REMOVED*** @override***REMOVED***
goog.dom.TextRange.prototype.select = function() {
  this.getBrowserRangeWrapper_().select(this.isReversed_);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.TextRange.prototype.removeContents = function() {
  this.getBrowserRangeWrapper_().removeContents();
  this.clearCachedValues_();
***REMOVED***


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
goog.dom.TextRange.prototype.surroundContents = function(element) {
  var output = this.getBrowserRangeWrapper_().surroundContents(element);
  this.clearCachedValues_();
  return output;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.TextRange.prototype.insertNode = function(node, before) {
  var output = this.getBrowserRangeWrapper_().insertNode(node, before);
  this.clearCachedValues_();
  return output;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.TextRange.prototype.surroundWithNodes = function(startNode, endNode) {
  this.getBrowserRangeWrapper_().surroundWithNodes(startNode, endNode);
  this.clearCachedValues_();
***REMOVED***


// SAVE/RESTORE


***REMOVED*** @override***REMOVED***
goog.dom.TextRange.prototype.saveUsingDom = function() {
  return new goog.dom.DomSavedTextRange_(this);
***REMOVED***


// RANGE MODIFICATION


***REMOVED*** @override***REMOVED***
goog.dom.TextRange.prototype.collapse = function(toAnchor) {
  var toStart = this.isReversed() ? !toAnchor : toAnchor;

  if (this.browserRangeWrapper_) {
    this.browserRangeWrapper_.collapse(toStart);
  }

  if (toStart) {
    this.endNode_ = this.startNode_;
    this.endOffset_ = this.startOffset_;
  } else {
    this.startNode_ = this.endNode_;
    this.startOffset_ = this.endOffset_;
  }

  // Collapsed ranges can't be reversed
  this.isReversed_ = false;
***REMOVED***


// SAVED RANGE OBJECTS



***REMOVED***
***REMOVED*** A SavedRange implementation using DOM endpoints.
***REMOVED*** @param {goog.dom.AbstractRange} range The range to save.
***REMOVED***
***REMOVED*** @extends {goog.dom.SavedRange}
***REMOVED*** @private
***REMOVED***
goog.dom.DomSavedTextRange_ = function(range) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The anchor node.
  ***REMOVED*** @type {Node}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.anchorNode_ = range.getAnchorNode();

 ***REMOVED*****REMOVED***
  ***REMOVED*** The anchor node offset.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.anchorOffset_ = range.getAnchorOffset();

 ***REMOVED*****REMOVED***
  ***REMOVED*** The focus node.
  ***REMOVED*** @type {Node}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.focusNode_ = range.getFocusNode();

 ***REMOVED*****REMOVED***
  ***REMOVED*** The focus node offset.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.focusOffset_ = range.getFocusOffset();
***REMOVED***
goog.inherits(goog.dom.DomSavedTextRange_, goog.dom.SavedRange);


***REMOVED***
***REMOVED*** @return {!goog.dom.AbstractRange} The restored range.
***REMOVED*** @override
***REMOVED***
goog.dom.DomSavedTextRange_.prototype.restoreInternal = function() {
  return***REMOVED*****REMOVED*** @suppress {missingRequire}***REMOVED*** (
      goog.dom.Range.createFromNodes(this.anchorNode_, this.anchorOffset_,
                                     this.focusNode_, this.focusOffset_));
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.DomSavedTextRange_.prototype.disposeInternal = function() {
  goog.dom.DomSavedTextRange_.superClass_.disposeInternal.call(this);

  this.anchorNode_ = null;
  this.focusNode_ = null;
***REMOVED***
