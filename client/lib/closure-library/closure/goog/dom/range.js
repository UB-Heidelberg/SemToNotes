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
***REMOVED*** @fileoverview Utilities for working with ranges in HTML documents.
***REMOVED***
***REMOVED*** @author robbyw@google.com (Robby Walker)
***REMOVED*** @author ojan@google.com (Ojan Vafai)
***REMOVED*** @author jparent@google.com (Julie Parent)
***REMOVED***

goog.provide('goog.dom.Range');

goog.require('goog.dom');
goog.require('goog.dom.AbstractRange');
goog.require('goog.dom.ControlRange');
goog.require('goog.dom.MultiRange');
goog.require('goog.dom.NodeType');
goog.require('goog.dom.TextRange');
goog.require('goog.userAgent');


***REMOVED***
***REMOVED*** Create a new selection from the given browser window's current selection.
***REMOVED*** Note that this object does not auto-update if the user changes their
***REMOVED*** selection and should be used as a snapshot.
***REMOVED*** @param {Window=} opt_win The window to get the selection of.  Defaults to the
***REMOVED***     window this class was defined in.
***REMOVED*** @return {goog.dom.AbstractRange?} A range wrapper object, or null if there
***REMOVED***     was an error.
***REMOVED***
goog.dom.Range.createFromWindow = function(opt_win) {
  var sel = goog.dom.AbstractRange.getBrowserSelectionForWindow(
      opt_win || window);
  return sel && goog.dom.Range.createFromBrowserSelection(sel);
***REMOVED***


***REMOVED***
***REMOVED*** Create a new range wrapper from the given browser selection object.  Note
***REMOVED*** that this object does not auto-update if the user changes their selection and
***REMOVED*** should be used as a snapshot.
***REMOVED*** @param {!Object} selection The browser selection object.
***REMOVED*** @return {goog.dom.AbstractRange?} A range wrapper object or null if there
***REMOVED***    was an error.
***REMOVED***
goog.dom.Range.createFromBrowserSelection = function(selection) {
  var range;
  var isReversed = false;
  if (selection.createRange) {
   ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
    try {
      range = selection.createRange();
    } catch (e) {
      // Access denied errors can be thrown here in IE if the selection was
      // a flash obj or if there are cross domain issues
      return null;
    }
  } else if (selection.rangeCount) {
    if (selection.rangeCount > 1) {
      return goog.dom.MultiRange.createFromBrowserSelection(
         ***REMOVED*****REMOVED*** @type {Selection}***REMOVED*** (selection));
    } else {
      range = selection.getRangeAt(0);
      isReversed = goog.dom.Range.isReversed(selection.anchorNode,
          selection.anchorOffset, selection.focusNode, selection.focusOffset);
    }
  } else {
    return null;
  }

  return goog.dom.Range.createFromBrowserRange(range, isReversed);
***REMOVED***


***REMOVED***
***REMOVED*** Create a new range wrapper from the given browser range object.
***REMOVED*** @param {Range|TextRange} range The browser range object.
***REMOVED*** @param {boolean=} opt_isReversed Whether the focus node is before the anchor
***REMOVED***     node.
***REMOVED*** @return {!goog.dom.AbstractRange} A range wrapper object.
***REMOVED***
goog.dom.Range.createFromBrowserRange = function(range, opt_isReversed) {
  // Create an IE control range when appropriate.
  return goog.dom.AbstractRange.isNativeControlRange(range) ?
      goog.dom.ControlRange.createFromBrowserRange(range) :
      goog.dom.TextRange.createFromBrowserRange(range, opt_isReversed);
***REMOVED***


***REMOVED***
***REMOVED*** Create a new range wrapper that selects the given node's text.
***REMOVED*** @param {Node} node The node to select.
***REMOVED*** @param {boolean=} opt_isReversed Whether the focus node is before the anchor
***REMOVED***     node.
***REMOVED*** @return {!goog.dom.AbstractRange} A range wrapper object.
***REMOVED***
goog.dom.Range.createFromNodeContents = function(node, opt_isReversed) {
  return goog.dom.TextRange.createFromNodeContents(node, opt_isReversed);
***REMOVED***


***REMOVED***
***REMOVED*** Create a new range wrapper that represents a caret at the given node,
***REMOVED*** accounting for the given offset.  This always creates a TextRange, regardless
***REMOVED*** of whether node is an image node or other control range type node.
***REMOVED*** @param {Node} node The node to place a caret at.
***REMOVED*** @param {number} offset The offset within the node to place the caret at.
***REMOVED*** @return {!goog.dom.AbstractRange} A range wrapper object.
***REMOVED***
goog.dom.Range.createCaret = function(node, offset) {
  return goog.dom.TextRange.createFromNodes(node, offset, node, offset);
***REMOVED***


***REMOVED***
***REMOVED*** Create a new range wrapper that selects the area between the given nodes,
***REMOVED*** accounting for the given offsets.
***REMOVED*** @param {Node} anchorNode The node to anchor on.
***REMOVED*** @param {number} anchorOffset The offset within the node to anchor on.
***REMOVED*** @param {Node} focusNode The node to focus on.
***REMOVED*** @param {number} focusOffset The offset within the node to focus on.
***REMOVED*** @return {!goog.dom.AbstractRange} A range wrapper object.
***REMOVED***
goog.dom.Range.createFromNodes = function(anchorNode, anchorOffset, focusNode,
    focusOffset) {
  return goog.dom.TextRange.createFromNodes(anchorNode, anchorOffset, focusNode,
      focusOffset);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the window's selection.
***REMOVED*** @param {Window=} opt_win The window to get the selection of.  Defaults to the
***REMOVED***     window this class was defined in.
***REMOVED***
goog.dom.Range.clearSelection = function(opt_win) {
  var sel = goog.dom.AbstractRange.getBrowserSelectionForWindow(
      opt_win || window);
  if (!sel) {
    return;
  }
  if (sel.empty) {
    // We can't just check that the selection is empty, becuase IE
    // sometimes gets confused.
    try {
      sel.empty();
    } catch (e) {
      // Emptying an already empty selection throws an exception in IE
    }
  } else {
    try {
      sel.removeAllRanges();
    } catch (e) {
      // This throws in IE9 if the range has been invalidated; for example, if
      // the user clicked on an element which disappeared during the event
      // handler.
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Tests if the window has a selection.
***REMOVED*** @param {Window=} opt_win The window to check the selection of.  Defaults to
***REMOVED***     the window this class was defined in.
***REMOVED*** @return {boolean} Whether the window has a selection.
***REMOVED***
goog.dom.Range.hasSelection = function(opt_win) {
  var sel = goog.dom.AbstractRange.getBrowserSelectionForWindow(
      opt_win || window);
  return !!sel && (goog.userAgent.IE ? sel.type != 'None' : !!sel.rangeCount);
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the focus position occurs before the anchor position.
***REMOVED*** @param {Node} anchorNode The node to anchor on.
***REMOVED*** @param {number} anchorOffset The offset within the node to anchor on.
***REMOVED*** @param {Node} focusNode The node to focus on.
***REMOVED*** @param {number} focusOffset The offset within the node to focus on.
***REMOVED*** @return {boolean} Whether the focus position occurs before the anchor
***REMOVED***     position.
***REMOVED***
goog.dom.Range.isReversed = function(anchorNode, anchorOffset, focusNode,
    focusOffset) {
  if (anchorNode == focusNode) {
    return focusOffset < anchorOffset;
  }
  var child;
  if (anchorNode.nodeType == goog.dom.NodeType.ELEMENT && anchorOffset) {
    child = anchorNode.childNodes[anchorOffset];
    if (child) {
      anchorNode = child;
      anchorOffset = 0;
    } else if (goog.dom.contains(anchorNode, focusNode)) {
      // If focus node is contained in anchorNode, it must be before the
      // end of the node.  Hence we are reversed.
      return true;
    }
  }
  if (focusNode.nodeType == goog.dom.NodeType.ELEMENT && focusOffset) {
    child = focusNode.childNodes[focusOffset];
    if (child) {
      focusNode = child;
      focusOffset = 0;
    } else if (goog.dom.contains(focusNode, anchorNode)) {
      // If anchor node is contained in focusNode, it must be before the
      // end of the node.  Hence we are not reversed.
      return false;
    }
  }
  return (goog.dom.compareNodeOrder(anchorNode, focusNode) ||
      anchorOffset - focusOffset) > 0;
***REMOVED***
