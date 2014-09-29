// Copyright 2012 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview A plugin to enable the First Strong Bidi algorithm.  The First
***REMOVED*** Strong algorithm as a heuristic used to automatically set paragraph direction
***REMOVED*** depending on its content.
***REMOVED***
***REMOVED*** In the documentation below, a 'paragraph' is the local element which we
***REMOVED*** evaluate as a whole for purposes of determining directionality. It may be a
***REMOVED*** block-level element (e.g. &lt;div&gt;) or a whole list (e.g. &lt;ul&gt;).
***REMOVED***
***REMOVED*** This implementation is based on, but is not identical to, the original
***REMOVED*** First Strong algorithm defined in Unicode
***REMOVED*** @see http://www.unicode.org/reports/tr9/
***REMOVED*** The central difference from the original First Strong algorithm is that this
***REMOVED*** implementation decides the paragraph direction based on the first strong
***REMOVED*** character that is <em>typed</em> into the paragraph, regardless of its
***REMOVED*** location in the paragraph, as opposed to the original algorithm where it is
***REMOVED*** the first character in the paragraph <em>by location</em>, regardless of
***REMOVED*** whether other strong characters already appear in the paragraph, further its
***REMOVED*** start.
***REMOVED***
***REMOVED*** <em>Please note</em> that this plugin does not perform the direction change
***REMOVED*** itself. Rather, it fires editor commands upon the key up event when a
***REMOVED*** direction change needs to be performed; {@code goog.editor.Command.DIR_RTL}
***REMOVED*** or {@code goog.editor.Command.DIR_RTL}.
***REMOVED***
***REMOVED***

goog.provide('goog.editor.plugins.FirstStrong');

goog.require('goog.dom');
goog.require('goog.dom.NodeType');
goog.require('goog.dom.TagIterator');
goog.require('goog.dom.TagName');
goog.require('goog.editor.Command');
goog.require('goog.editor.Plugin');
goog.require('goog.editor.node');
goog.require('goog.editor.range');
goog.require('goog.i18n.bidi');
goog.require('goog.i18n.uChar');
goog.require('goog.iter');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** First Strong plugin.
***REMOVED***
***REMOVED*** @extends {goog.editor.Plugin}
***REMOVED***
goog.editor.plugins.FirstStrong = function() {
  goog.base(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Indicates whether or not the cursor is in a paragraph we have not yet
  ***REMOVED*** finished evaluating for directionality. This is set to true whenever the
  ***REMOVED*** cursor is moved, and set to false after seeing a strong character in the
  ***REMOVED*** paragraph the cursor is currently in.
  ***REMOVED***
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.isNewBlock_ = true;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Indicates whether or not the current paragraph the cursor is in should be
  ***REMOVED*** set to Right-To-Left directionality.
  ***REMOVED***
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.switchToRtl_ = false;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Indicates whether or not the current paragraph the cursor is in should be
  ***REMOVED*** set to Left-To-Right directionality.
  ***REMOVED***
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.switchToLtr_ = false;
***REMOVED***
goog.inherits(goog.editor.plugins.FirstStrong, goog.editor.Plugin);


***REMOVED*** @override***REMOVED***
goog.editor.plugins.FirstStrong.prototype.getTrogClassId = function() {
  return 'FirstStrong';
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.editor.plugins.FirstStrong.prototype.queryCommandValue =
    function(command) {
  return false;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.editor.plugins.FirstStrong.prototype.handleSelectionChange =
    function(e, node) {
  this.isNewBlock_ = true;
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** The name of the attribute which records the input text.
***REMOVED***
***REMOVED*** @type {string}
***REMOVED*** @const
***REMOVED***
goog.editor.plugins.FirstStrong.INPUT_ATTRIBUTE = 'fs-input';


***REMOVED*** @override***REMOVED***
goog.editor.plugins.FirstStrong.prototype.handleKeyPress = function(e) {
  if (!this.isNewBlock_) {
    return false;  // We've already determined this paragraph's direction.
  }
  // Ignore non-character key press events.
  if (e.ctrlKey || e.metaKey) {
    return false;
  }
  var newInput = goog.i18n.uChar.fromCharCode(e.charCode);

  if (!newInput) {
    var browserEvent = e.getBrowserEvent();
    if (browserEvent) {
      if (goog.userAgent.IE && browserEvent['getAttribute']) {
        newInput = browserEvent['getAttribute'](
            goog.editor.plugins.FirstStrong.INPUT_ATTRIBUTE);
      } else {
        newInput = browserEvent[
            goog.editor.plugins.FirstStrong.INPUT_ATTRIBUTE];
      }
    }
  }

  if (!newInput) {
    return false; // Unrecognized key.
  }

  var isLtr = goog.i18n.bidi.isLtrChar(newInput);
  var isRtl = !isLtr && goog.i18n.bidi.isRtlChar(newInput);
  if (!isLtr && !isRtl) {
    return false;  // This character cannot change anything (it is not Strong).
  }
  // This character is Strongly LTR or Strongly RTL. We might switch direction
  // on it now, but in any case we do not need to check any more characters in
  // this paragraph after it.
  this.isNewBlock_ = false;

  // Are there no Strong characters already in the paragraph?
  if (this.isNeutralBlock_()) {
    this.switchToRtl_ = isRtl;
    this.switchToLtr_ = isLtr;
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Calls the flip directionality commands.  This is done here so things go into
***REMOVED*** the redo-undo stack at the expected order; fist enter the input, then flip
***REMOVED*** directionality.
***REMOVED*** @override
***REMOVED***
goog.editor.plugins.FirstStrong.prototype.handleKeyUp = function(e) {
  if (this.switchToRtl_) {
    var field = this.getFieldObject();
    field.dispatchChange(true);
    field.execCommand(goog.editor.Command.DIR_RTL);
    this.switchToRtl_ = false;
  } else if (this.switchToLtr_) {
    var field = this.getFieldObject();
    field.dispatchChange(true);
    field.execCommand(goog.editor.Command.DIR_LTR);
    this.switchToLtr_ = false;
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** @return {Element} The lowest Block element ancestor of the node where the
***REMOVED***     next character will be placed.
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.FirstStrong.prototype.getBlockAncestor_ = function() {
  var start = this.getFieldObject().getRange().getStartNode();
  // Go up in the DOM until we reach a Block element.
  while (!goog.editor.plugins.FirstStrong.isBlock_(start)) {
    start = start.parentNode;
  }
  return***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (start);
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the paragraph where the next character will be
***REMOVED***     entered contains only non-Strong characters.
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.FirstStrong.prototype.isNeutralBlock_ = function() {
  var root = this.getBlockAncestor_();
  // The exact node with the cursor location. Simply calling getStartNode() on
  // the range only returns the containing block node.
  var cursor = goog.editor.range.getDeepEndPoint(
      this.getFieldObject().getRange(), false).node;

  // In FireFox the BR tag also represents a change in paragraph if not inside a
  // list. So we need special handling to only look at the sub-block between
  // BR elements.
  var blockFunction = (goog.userAgent.GECKO &&
      !this.isList_(root)) ?
          goog.editor.plugins.FirstStrong.isGeckoBlock_ :
          goog.editor.plugins.FirstStrong.isBlock_;
  var paragraph = this.getTextAround_(root, cursor,
      blockFunction);
  // Not using {@code goog.i18n.bidi.isNeutralText} as it contains additional,
  // unwanted checks to the content.
  return !goog.i18n.bidi.hasAnyLtr(paragraph) &&
      !goog.i18n.bidi.hasAnyRtl(paragraph);
***REMOVED***


***REMOVED***
***REMOVED*** Checks if an element is a list element ('UL' or 'OL').
***REMOVED***
***REMOVED*** @param {Element} element The element to test.
***REMOVED*** @return {boolean} Whether the element is a list element ('UL' or 'OL').
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.FirstStrong.prototype.isList_ = function(element) {
  if (!element) {
    return false;
  }
  var tagName = element.tagName;
  return tagName == goog.dom.TagName.UL || tagName == goog.dom.TagName.OL;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the text within the local paragraph around the cursor.
***REMOVED*** Notice that for GECKO a BR represents a pargraph change despite not being a
***REMOVED*** block element.
***REMOVED***
***REMOVED*** @param {Element} root The first block element ancestor of the node the cursor
***REMOVED***     is in.
***REMOVED*** @param {Node} cursorLocation Node where the cursor currently is, marking the
***REMOVED***     paragraph whose text we will return.
***REMOVED*** @param {function(Node): boolean} isParagraphBoundary The function to
***REMOVED***     determine if a node represents the start or end of the paragraph.
***REMOVED*** @return {string} the text in the paragraph around the cursor location.
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.FirstStrong.prototype.getTextAround_ = function(root,
    cursorLocation, isParagraphBoundary) {
  // The buffer where we're collecting the text.
  var buffer = [];
  // Have we reached the cursor yet, or are we still before it?
  var pastCursorLocation = false;

  if (root && cursorLocation) {
    goog.iter.some(new goog.dom.TagIterator(root), function(node) {
      if (node == cursorLocation) {
        pastCursorLocation = true;
      } else if (isParagraphBoundary(node)) {
        if (pastCursorLocation) {
          // This is the end of the paragraph containing the cursor. We're done.
          return true;
        } else {
          // All we collected so far does not count; it was in a previous
          // paragraph that did not contain the cursor.
          buffer = [];
        }
      }
      if (node.nodeType == goog.dom.NodeType.TEXT) {
        buffer.push(node.nodeValue);
      }
      return false;  // Keep going.
    });
  }
  return buffer.join('');
***REMOVED***


***REMOVED***
***REMOVED*** @param {Node} node Node to check.
***REMOVED*** @return {boolean} Does the given node represent a Block element? Notice we do
***REMOVED***     not consider list items as Block elements in the algorithm.
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.FirstStrong.isBlock_ = function(node) {
  return !!node && goog.editor.node.isBlockTag(node) &&
      node.tagName != goog.dom.TagName.LI;
***REMOVED***


***REMOVED***
***REMOVED*** @param {Node} node Node to check.
***REMOVED*** @return {boolean} Does the given node represent a Block element from the
***REMOVED***     point of view of FireFox? Notice we do not consider list items as Block
***REMOVED***     elements in the algorithm.
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.FirstStrong.isGeckoBlock_ = function(node) {
  return !!node && (node.tagName == goog.dom.TagName.BR ||
      goog.editor.plugins.FirstStrong.isBlock_(node));
***REMOVED***
