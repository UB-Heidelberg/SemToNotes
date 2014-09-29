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
***REMOVED*** @fileoverview Utilities for working with W3C multi-part ranges.
***REMOVED***
***REMOVED*** @author robbyw@google.com (Robby Walker)
***REMOVED***


goog.provide('goog.dom.MultiRange');
goog.provide('goog.dom.MultiRangeIterator');

goog.require('goog.array');
goog.require('goog.debug.Logger');
goog.require('goog.dom.AbstractMultiRange');
goog.require('goog.dom.AbstractRange');
goog.require('goog.dom.RangeIterator');
goog.require('goog.dom.RangeType');
goog.require('goog.dom.SavedRange');
goog.require('goog.dom.TextRange');
goog.require('goog.iter.StopIteration');



***REMOVED***
***REMOVED*** Creates a new multi part range with no properties.  Do not use this
***REMOVED*** constructor: use one of the goog.dom.Range.createFrom* methods instead.
***REMOVED***
***REMOVED*** @extends {goog.dom.AbstractMultiRange}
***REMOVED***
goog.dom.MultiRange = function() {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Array of browser sub-ranges comprising this multi-range.
  ***REMOVED*** @type {Array.<Range>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.browserRanges_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** Lazily initialized array of range objects comprising this multi-range.
  ***REMOVED*** @type {Array.<goog.dom.TextRange>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.ranges_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** Lazily computed sorted version of ranges_, sorted by start point.
  ***REMOVED*** @type {Array.<goog.dom.TextRange>?}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.sortedRanges_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Lazily computed container node.
  ***REMOVED*** @type {Node}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.container_ = null;
***REMOVED***
goog.inherits(goog.dom.MultiRange, goog.dom.AbstractMultiRange);


***REMOVED***
***REMOVED*** Creates a new range wrapper from the given browser selection object.  Do not
***REMOVED*** use this method directly - please use goog.dom.Range.createFrom* instead.
***REMOVED*** @param {Selection} selection The browser selection object.
***REMOVED*** @return {goog.dom.MultiRange} A range wrapper object.
***REMOVED***
goog.dom.MultiRange.createFromBrowserSelection = function(selection) {
  var range = new goog.dom.MultiRange();
  for (var i = 0, len = selection.rangeCount; i < len; i++) {
    range.browserRanges_.push(selection.getRangeAt(i));
  }
  return range;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a new range wrapper from the given browser ranges.  Do not
***REMOVED*** use this method directly - please use goog.dom.Range.createFrom* instead.
***REMOVED*** @param {Array.<Range>} browserRanges The browser ranges.
***REMOVED*** @return {goog.dom.MultiRange} A range wrapper object.
***REMOVED***
goog.dom.MultiRange.createFromBrowserRanges = function(browserRanges) {
  var range = new goog.dom.MultiRange();
  range.browserRanges_ = goog.array.clone(browserRanges);
  return range;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a new range wrapper from the given goog.dom.TextRange objects.  Do
***REMOVED*** not use this method directly - please use goog.dom.Range.createFrom* instead.
***REMOVED*** @param {Array.<goog.dom.TextRange>} textRanges The text range objects.
***REMOVED*** @return {goog.dom.MultiRange} A range wrapper object.
***REMOVED***
goog.dom.MultiRange.createFromTextRanges = function(textRanges) {
  var range = new goog.dom.MultiRange();
  range.ranges_ = textRanges;
  range.browserRanges_ = goog.array.map(textRanges, function(range) {
    return range.getBrowserRangeObject();
  });
  return range;
***REMOVED***


***REMOVED***
***REMOVED*** Logging object.
***REMOVED*** @type {goog.debug.Logger}
***REMOVED*** @private
***REMOVED***
goog.dom.MultiRange.prototype.logger_ =
    goog.debug.Logger.getLogger('goog.dom.MultiRange');


// Method implementations


***REMOVED***
***REMOVED*** Clears cached values.  Should be called whenever this.browserRanges_ is
***REMOVED*** modified.
***REMOVED*** @private
***REMOVED***
goog.dom.MultiRange.prototype.clearCachedValues_ = function() {
  this.ranges_ = [];
  this.sortedRanges_ = null;
  this.container_ = null;
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.dom.MultiRange} A clone of this range.
***REMOVED*** @override
***REMOVED***
goog.dom.MultiRange.prototype.clone = function() {
  return goog.dom.MultiRange.createFromBrowserRanges(this.browserRanges_);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.MultiRange.prototype.getType = function() {
  return goog.dom.RangeType.MULTI;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.MultiRange.prototype.getBrowserRangeObject = function() {
  // NOTE(robbyw): This method does not make sense for multi-ranges.
  if (this.browserRanges_.length > 1) {
    this.logger_.warning(
        'getBrowserRangeObject called on MultiRange with more than 1 range');
  }
  return this.browserRanges_[0];
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.MultiRange.prototype.setBrowserRangeObject = function(nativeRange) {
  // TODO(robbyw): Look in to adding setBrowserSelectionObject.
  return false;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.MultiRange.prototype.getTextRangeCount = function() {
  return this.browserRanges_.length;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.MultiRange.prototype.getTextRange = function(i) {
  if (!this.ranges_[i]) {
    this.ranges_[i] = goog.dom.TextRange.createFromBrowserRange(
        this.browserRanges_[i]);
  }
  return this.ranges_[i];
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.MultiRange.prototype.getContainer = function() {
  if (!this.container_) {
    var nodes = [];
    for (var i = 0, len = this.getTextRangeCount(); i < len; i++) {
      nodes.push(this.getTextRange(i).getContainer());
    }
    this.container_ = goog.dom.findCommonAncestor.apply(null, nodes);
  }
  return this.container_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {Array.<goog.dom.TextRange>} An array of sub-ranges, sorted by start
***REMOVED***     point.
***REMOVED***
goog.dom.MultiRange.prototype.getSortedRanges = function() {
  if (!this.sortedRanges_) {
    this.sortedRanges_ = this.getTextRanges();
    this.sortedRanges_.sort(function(a, b) {
      var aStartNode = a.getStartNode();
      var aStartOffset = a.getStartOffset();
      var bStartNode = b.getStartNode();
      var bStartOffset = b.getStartOffset();

      if (aStartNode == bStartNode && aStartOffset == bStartOffset) {
        return 0;
      }

      return goog.dom.Range.isReversed(aStartNode, aStartOffset, bStartNode,
          bStartOffset) ? 1 : -1;
    });
  }
  return this.sortedRanges_;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.MultiRange.prototype.getStartNode = function() {
  return this.getSortedRanges()[0].getStartNode();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.MultiRange.prototype.getStartOffset = function() {
  return this.getSortedRanges()[0].getStartOffset();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.MultiRange.prototype.getEndNode = function() {
  // NOTE(robbyw): This may return the wrong node if any subranges overlap.
  return goog.array.peek(this.getSortedRanges()).getEndNode();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.MultiRange.prototype.getEndOffset = function() {
  // NOTE(robbyw): This may return the wrong value if any subranges overlap.
  return goog.array.peek(this.getSortedRanges()).getEndOffset();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.MultiRange.prototype.isRangeInDocument = function() {
  return goog.array.every(this.getTextRanges(), function(range) {
    return range.isRangeInDocument();
  });
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.MultiRange.prototype.isCollapsed = function() {
  return this.browserRanges_.length == 0 ||
      this.browserRanges_.length == 1 && this.getTextRange(0).isCollapsed();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.MultiRange.prototype.getText = function() {
  return goog.array.map(this.getTextRanges(), function(range) {
    return range.getText();
  }).join('');
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.MultiRange.prototype.getHtmlFragment = function() {
  return this.getValidHtml();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.MultiRange.prototype.getValidHtml = function() {
  // NOTE(robbyw): This does not behave well if the sub-ranges overlap.
  return goog.array.map(this.getTextRanges(), function(range) {
    return range.getValidHtml();
  }).join('');
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.MultiRange.prototype.getPastableHtml = function() {
  // TODO(robbyw): This should probably do something smart like group TR and TD
  // selections in to the same table.
  return this.getValidHtml();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.MultiRange.prototype.__iterator__ = function(opt_keys) {
  return new goog.dom.MultiRangeIterator(this);
***REMOVED***


// RANGE ACTIONS


***REMOVED*** @override***REMOVED***
goog.dom.MultiRange.prototype.select = function() {
  var selection = goog.dom.AbstractRange.getBrowserSelectionForWindow(
      this.getWindow());
  selection.removeAllRanges();
  for (var i = 0, len = this.getTextRangeCount(); i < len; i++) {
    selection.addRange(this.getTextRange(i).getBrowserRangeObject());
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.MultiRange.prototype.removeContents = function() {
  goog.array.forEach(this.getTextRanges(), function(range) {
    range.removeContents();
  });
***REMOVED***


// SAVE/RESTORE


***REMOVED*** @override***REMOVED***
goog.dom.MultiRange.prototype.saveUsingDom = function() {
  return new goog.dom.DomSavedMultiRange_(this);
***REMOVED***


// RANGE MODIFICATION


***REMOVED***
***REMOVED*** Collapses this range to a single point, either the first or last point
***REMOVED*** depending on the parameter.  This will result in the number of ranges in this
***REMOVED*** multi range becoming 1.
***REMOVED*** @param {boolean} toAnchor Whether to collapse to the anchor.
***REMOVED*** @override
***REMOVED***
goog.dom.MultiRange.prototype.collapse = function(toAnchor) {
  if (!this.isCollapsed()) {
    var range = toAnchor ? this.getTextRange(0) : this.getTextRange(
        this.getTextRangeCount() - 1);

    this.clearCachedValues_();
    range.collapse(toAnchor);
    this.ranges_ = [range];
    this.sortedRanges_ = [range];
    this.browserRanges_ = [range.getBrowserRangeObject()];
  }
***REMOVED***


// SAVED RANGE OBJECTS



***REMOVED***
***REMOVED*** A SavedRange implementation using DOM endpoints.
***REMOVED*** @param {goog.dom.MultiRange} range The range to save.
***REMOVED***
***REMOVED*** @extends {goog.dom.SavedRange}
***REMOVED*** @private
***REMOVED***
goog.dom.DomSavedMultiRange_ = function(range) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Array of saved ranges.
  ***REMOVED*** @type {Array.<goog.dom.SavedRange>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.savedRanges_ = goog.array.map(range.getTextRanges(), function(range) {
    return range.saveUsingDom();
  });
***REMOVED***
goog.inherits(goog.dom.DomSavedMultiRange_, goog.dom.SavedRange);


***REMOVED***
***REMOVED*** @return {goog.dom.MultiRange} The restored range.
***REMOVED*** @override
***REMOVED***
goog.dom.DomSavedMultiRange_.prototype.restoreInternal = function() {
  var ranges = goog.array.map(this.savedRanges_, function(savedRange) {
    return savedRange.restore();
  });
  return goog.dom.MultiRange.createFromTextRanges(ranges);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.DomSavedMultiRange_.prototype.disposeInternal = function() {
  goog.dom.DomSavedMultiRange_.superClass_.disposeInternal.call(this);

  goog.array.forEach(this.savedRanges_, function(savedRange) {
    savedRange.dispose();
  });
  delete this.savedRanges_;
***REMOVED***


// RANGE ITERATION



***REMOVED***
***REMOVED*** Subclass of goog.dom.TagIterator that iterates over a DOM range.  It
***REMOVED*** adds functions to determine the portion of each text node that is selected.
***REMOVED***
***REMOVED*** @param {goog.dom.MultiRange} range The range to traverse.
***REMOVED***
***REMOVED*** @extends {goog.dom.RangeIterator}
***REMOVED***
goog.dom.MultiRangeIterator = function(range) {
  if (range) {
    this.iterators_ = goog.array.map(
        range.getSortedRanges(),
        function(r) {
          return goog.iter.toIterator(r);
        });
  }

  goog.dom.RangeIterator.call(
      this, range ? this.getStartNode() : null, false);
***REMOVED***
goog.inherits(goog.dom.MultiRangeIterator, goog.dom.RangeIterator);


***REMOVED***
***REMOVED*** The list of range iterators left to traverse.
***REMOVED*** @type {Array.<goog.dom.RangeIterator>?}
***REMOVED*** @private
***REMOVED***
goog.dom.MultiRangeIterator.prototype.iterators_ = null;


***REMOVED***
***REMOVED*** The index of the current sub-iterator being traversed.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.dom.MultiRangeIterator.prototype.currentIdx_ = 0;


***REMOVED*** @override***REMOVED***
goog.dom.MultiRangeIterator.prototype.getStartTextOffset = function() {
  return this.iterators_[this.currentIdx_].getStartTextOffset();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.MultiRangeIterator.prototype.getEndTextOffset = function() {
  return this.iterators_[this.currentIdx_].getEndTextOffset();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.MultiRangeIterator.prototype.getStartNode = function() {
  return this.iterators_[0].getStartNode();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.MultiRangeIterator.prototype.getEndNode = function() {
  return goog.array.peek(this.iterators_).getEndNode();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.MultiRangeIterator.prototype.isLast = function() {
  return this.iterators_[this.currentIdx_].isLast();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.MultiRangeIterator.prototype.next = function() {
 ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
  try {
    var it = this.iterators_[this.currentIdx_];
    var next = it.next();
    this.setPosition(it.node, it.tagType, it.depth);
    return next;
  } catch (ex) {
    if (ex !== goog.iter.StopIteration ||
        this.iterators_.length - 1 == this.currentIdx_) {
      throw ex;
    } else {
      // In case we got a StopIteration, increment counter and try again.
      this.currentIdx_++;
      return this.next();
    }
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.MultiRangeIterator.prototype.copyFrom = function(other) {
  this.iterators_ = goog.array.clone(other.iterators_);
  goog.dom.MultiRangeIterator.superClass_.copyFrom.call(this, other);
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.dom.MultiRangeIterator} An identical iterator.
***REMOVED*** @override
***REMOVED***
goog.dom.MultiRangeIterator.prototype.clone = function() {
  var copy = new goog.dom.MultiRangeIterator(null);
  copy.copyFrom(this);
  return copy;
***REMOVED***
