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
***REMOVED*** @fileoverview Utilities for working with IE control ranges.
***REMOVED***
***REMOVED*** @author robbyw@google.com (Robby Walker)
***REMOVED*** @author jparent@google.com (Julie Parent)
***REMOVED***


goog.provide('goog.dom.ControlRange');
goog.provide('goog.dom.ControlRangeIterator');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.AbstractMultiRange');
goog.require('goog.dom.AbstractRange');
goog.require('goog.dom.RangeIterator');
goog.require('goog.dom.RangeType');
goog.require('goog.dom.SavedRange');
goog.require('goog.dom.TagWalkType');
goog.require('goog.dom.TextRange');
goog.require('goog.iter.StopIteration');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** Create a new control selection with no properties.  Do not use this
***REMOVED*** constructor: use one of the goog.dom.Range.createFrom* methods instead.
***REMOVED***
***REMOVED*** @extends {goog.dom.AbstractMultiRange}
***REMOVED***
goog.dom.ControlRange = function() {
***REMOVED***
goog.inherits(goog.dom.ControlRange, goog.dom.AbstractMultiRange);


***REMOVED***
***REMOVED*** Create a new range wrapper from the given browser range object.  Do not use
***REMOVED*** this method directly - please use goog.dom.Range.createFrom* instead.
***REMOVED*** @param {Object} controlRange The browser range object.
***REMOVED*** @return {goog.dom.ControlRange} A range wrapper object.
***REMOVED***
goog.dom.ControlRange.createFromBrowserRange = function(controlRange) {
  var range = new goog.dom.ControlRange();
  range.range_ = controlRange;
  return range;
***REMOVED***


***REMOVED***
***REMOVED*** Create a new range wrapper that selects the given element.  Do not use
***REMOVED*** this method directly - please use goog.dom.Range.createFrom* instead.
***REMOVED*** @param {...Element} var_args The element(s) to select.
***REMOVED*** @return {goog.dom.ControlRange} A range wrapper object.
***REMOVED***
goog.dom.ControlRange.createFromElements = function(var_args) {
  var range = goog.dom.getOwnerDocument(arguments[0]).body.createControlRange();
  for (var i = 0, len = arguments.length; i < len; i++) {
    range.addElement(arguments[i]);
  }
  return goog.dom.ControlRange.createFromBrowserRange(range);
***REMOVED***


***REMOVED***
***REMOVED*** The IE control range obejct.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.dom.ControlRange.prototype.range_ = null;


***REMOVED***
***REMOVED*** Cached list of elements.
***REMOVED*** @type {Array.<Element>?}
***REMOVED*** @private
***REMOVED***
goog.dom.ControlRange.prototype.elements_ = null;


***REMOVED***
***REMOVED*** Cached sorted list of elements.
***REMOVED*** @type {Array.<Element>?}
***REMOVED*** @private
***REMOVED***
goog.dom.ControlRange.prototype.sortedElements_ = null;


// Method implementations


***REMOVED***
***REMOVED*** Clear cached values.
***REMOVED*** @private
***REMOVED***
goog.dom.ControlRange.prototype.clearCachedValues_ = function() {
  this.elements_ = null;
  this.sortedElements_ = null;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.ControlRange.prototype.clone = function() {
  return goog.dom.ControlRange.createFromElements.apply(this,
                                                        this.getElements());
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.ControlRange.prototype.getType = function() {
  return goog.dom.RangeType.CONTROL;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.ControlRange.prototype.getBrowserRangeObject = function() {
  return this.range_ || document.body.createControlRange();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.ControlRange.prototype.setBrowserRangeObject = function(nativeRange) {
  if (!goog.dom.AbstractRange.isNativeControlRange(nativeRange)) {
    return false;
  }
  this.range_ = nativeRange;
  return true;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.ControlRange.prototype.getTextRangeCount = function() {
  return this.range_ ? this.range_.length : 0;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.ControlRange.prototype.getTextRange = function(i) {
  return goog.dom.TextRange.createFromNodeContents(this.range_.item(i));
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.ControlRange.prototype.getContainer = function() {
  return goog.dom.findCommonAncestor.apply(null, this.getElements());
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.ControlRange.prototype.getStartNode = function() {
  return this.getSortedElements()[0];
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.ControlRange.prototype.getStartOffset = function() {
  return 0;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.ControlRange.prototype.getEndNode = function() {
  var sorted = this.getSortedElements();
  var startsLast =***REMOVED*****REMOVED*** @type {Node}***REMOVED*** (goog.array.peek(sorted));
  return***REMOVED*****REMOVED*** @type {Node}***REMOVED*** (goog.array.find(sorted, function(el) {
    return goog.dom.contains(el, startsLast);
  }));
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.ControlRange.prototype.getEndOffset = function() {
  return this.getEndNode().childNodes.length;
***REMOVED***


// TODO(robbyw): Figure out how to unify getElements with TextRange API.
***REMOVED***
***REMOVED*** @return {Array.<Element>} Array of elements in the control range.
***REMOVED***
goog.dom.ControlRange.prototype.getElements = function() {
  if (!this.elements_) {
    this.elements_ = [];
    if (this.range_) {
      for (var i = 0; i < this.range_.length; i++) {
        this.elements_.push(this.range_.item(i));
      }
    }
  }

  return this.elements_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {Array.<Element>} Array of elements comprising the control range,
***REMOVED***     sorted by document order.
***REMOVED***
goog.dom.ControlRange.prototype.getSortedElements = function() {
  if (!this.sortedElements_) {
    this.sortedElements_ = this.getElements().concat();
    this.sortedElements_.sort(function(a, b) {
      return a.sourceIndex - b.sourceIndex;
    });
  }

  return this.sortedElements_;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.ControlRange.prototype.isRangeInDocument = function() {
  var returnValue = false;

  try {
    returnValue = goog.array.every(this.getElements(), function(element) {
      // On IE, this throws an exception when the range is detached.
      return goog.userAgent.IE ?
          !!element.parentNode :
          goog.dom.contains(element.ownerDocument.body, element);
    });
  } catch (e) {
    // IE sometimes throws Invalid Argument errors for detached elements.
    // Note: trying to return a value from the above try block can cause IE
    // to crash.  It is necessary to use the local returnValue.
  }

  return returnValue;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.ControlRange.prototype.isCollapsed = function() {
  return !this.range_ || !this.range_.length;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.ControlRange.prototype.getText = function() {
  // TODO(robbyw): What about for table selections?  Should those have text?
  return '';
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.ControlRange.prototype.getHtmlFragment = function() {
  return goog.array.map(this.getSortedElements(), goog.dom.getOuterHtml).
      join('');
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.ControlRange.prototype.getValidHtml = function() {
  return this.getHtmlFragment();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.ControlRange.prototype.getPastableHtml =
    goog.dom.ControlRange.prototype.getValidHtml;


***REMOVED*** @override***REMOVED***
goog.dom.ControlRange.prototype.__iterator__ = function(opt_keys) {
  return new goog.dom.ControlRangeIterator(this);
***REMOVED***


// RANGE ACTIONS


***REMOVED*** @override***REMOVED***
goog.dom.ControlRange.prototype.select = function() {
  if (this.range_) {
    this.range_.select();
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.ControlRange.prototype.removeContents = function() {
  // TODO(robbyw): Test implementing with execCommand('Delete')
  if (this.range_) {
    var nodes = [];
    for (var i = 0, len = this.range_.length; i < len; i++) {
      nodes.push(this.range_.item(i));
    }
    goog.array.forEach(nodes, goog.dom.removeNode);

    this.collapse(false);
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.ControlRange.prototype.replaceContentsWithNode = function(node) {
  // Control selections have to have the node inserted before removing the
  // selection contents because a collapsed control range doesn't have start or
  // end nodes.
  var result = this.insertNode(node, true);

  if (!this.isCollapsed()) {
    this.removeContents();
  }

  return result;
***REMOVED***


// SAVE/RESTORE


***REMOVED*** @override***REMOVED***
goog.dom.ControlRange.prototype.saveUsingDom = function() {
  return new goog.dom.DomSavedControlRange_(this);
***REMOVED***


// RANGE MODIFICATION


***REMOVED*** @override***REMOVED***
goog.dom.ControlRange.prototype.collapse = function(toAnchor) {
  // TODO(robbyw): Should this return a text range?  If so, API needs to change.
  this.range_ = null;
  this.clearCachedValues_();
***REMOVED***


// SAVED RANGE OBJECTS



***REMOVED***
***REMOVED*** A SavedRange implementation using DOM endpoints.
***REMOVED*** @param {goog.dom.ControlRange} range The range to save.
***REMOVED***
***REMOVED*** @extends {goog.dom.SavedRange}
***REMOVED*** @private
***REMOVED***
goog.dom.DomSavedControlRange_ = function(range) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The element list.
  ***REMOVED*** @type {Array.<Element>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.elements_ = range.getElements();
***REMOVED***
goog.inherits(goog.dom.DomSavedControlRange_, goog.dom.SavedRange);


***REMOVED*** @override***REMOVED***
goog.dom.DomSavedControlRange_.prototype.restoreInternal = function() {
  var doc = this.elements_.length ?
      goog.dom.getOwnerDocument(this.elements_[0]) : document;
  var controlRange = doc.body.createControlRange();
  for (var i = 0, len = this.elements_.length; i < len; i++) {
    controlRange.addElement(this.elements_[i]);
  }
  return goog.dom.ControlRange.createFromBrowserRange(controlRange);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.DomSavedControlRange_.prototype.disposeInternal = function() {
  goog.dom.DomSavedControlRange_.superClass_.disposeInternal.call(this);
  delete this.elements_;
***REMOVED***


// RANGE ITERATION



***REMOVED***
***REMOVED*** Subclass of goog.dom.TagIterator that iterates over a DOM range.  It
***REMOVED*** adds functions to determine the portion of each text node that is selected.
***REMOVED***
***REMOVED*** @param {goog.dom.ControlRange?} range The range to traverse.
***REMOVED***
***REMOVED*** @extends {goog.dom.RangeIterator}
***REMOVED***
goog.dom.ControlRangeIterator = function(range) {
  if (range) {
    this.elements_ = range.getSortedElements();
    this.startNode_ = this.elements_.shift();
    this.endNode_ =***REMOVED*****REMOVED*** @type {Node}***REMOVED*** (goog.array.peek(this.elements_)) ||
        this.startNode_;
  }

  goog.dom.RangeIterator.call(this, this.startNode_, false);
***REMOVED***
goog.inherits(goog.dom.ControlRangeIterator, goog.dom.RangeIterator);


***REMOVED***
***REMOVED*** The first node in the selection.
***REMOVED*** @type {Node}
***REMOVED*** @private
***REMOVED***
goog.dom.ControlRangeIterator.prototype.startNode_ = null;


***REMOVED***
***REMOVED*** The last node in the selection.
***REMOVED*** @type {Node}
***REMOVED*** @private
***REMOVED***
goog.dom.ControlRangeIterator.prototype.endNode_ = null;


***REMOVED***
***REMOVED*** The list of elements left to traverse.
***REMOVED*** @type {Array.<Element>?}
***REMOVED*** @private
***REMOVED***
goog.dom.ControlRangeIterator.prototype.elements_ = null;


***REMOVED*** @override***REMOVED***
goog.dom.ControlRangeIterator.prototype.getStartTextOffset = function() {
  return 0;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.ControlRangeIterator.prototype.getEndTextOffset = function() {
  return 0;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.ControlRangeIterator.prototype.getStartNode = function() {
  return this.startNode_;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.ControlRangeIterator.prototype.getEndNode = function() {
  return this.endNode_;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.ControlRangeIterator.prototype.isLast = function() {
  return !this.depth && !this.elements_.length;
***REMOVED***


***REMOVED***
***REMOVED*** Move to the next position in the selection.
***REMOVED*** Throws {@code goog.iter.StopIteration} when it passes the end of the range.
***REMOVED*** @return {Node} The node at the next position.
***REMOVED*** @override
***REMOVED***
goog.dom.ControlRangeIterator.prototype.next = function() {
  // Iterate over each element in the range, and all of its children.
  if (this.isLast()) {
    throw goog.iter.StopIteration;
  } else if (!this.depth) {
    var el = this.elements_.shift();
    this.setPosition(el,
                     goog.dom.TagWalkType.START_TAG,
                     goog.dom.TagWalkType.START_TAG);
    return el;
  }

  // Call the super function.
  return goog.dom.ControlRangeIterator.superClass_.next.call(this);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.dom.ControlRangeIterator.prototype.copyFrom = function(other) {
  this.elements_ = other.elements_;
  this.startNode_ = other.startNode_;
  this.endNode_ = other.endNode_;

  goog.dom.ControlRangeIterator.superClass_.copyFrom.call(this, other);
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.dom.ControlRangeIterator} An identical iterator.
***REMOVED*** @override
***REMOVED***
goog.dom.ControlRangeIterator.prototype.clone = function() {
  var copy = new goog.dom.ControlRangeIterator(null);
  copy.copyFrom(this);
  return copy;
***REMOVED***
