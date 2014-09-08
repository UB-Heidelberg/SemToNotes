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
***REMOVED*** @fileoverview An API for saving and restoring ranges as HTML carets.
***REMOVED***
***REMOVED*** @author nicksantos@google.com (Nick Santos)
***REMOVED***


goog.provide('goog.dom.SavedCaretRange');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.SavedRange');
goog.require('goog.dom.TagName');
goog.require('goog.string');



***REMOVED***
***REMOVED*** A struct for holding context about saved selections.
***REMOVED*** This can be used to preserve the selection and restore while the DOM is
***REMOVED*** manipulated, or through an asynchronous call. Use goog.dom.Range factory
***REMOVED*** methods to obtain an {@see goog.dom.AbstractRange} instance, and use
***REMOVED*** {@see goog.dom.AbstractRange#saveUsingCarets} to obtain a SavedCaretRange.
***REMOVED*** For editor ranges under content-editable elements or design-mode iframes,
***REMOVED*** prefer using {@see goog.editor.range.saveUsingNormalizedCarets}.
***REMOVED*** @param {goog.dom.AbstractRange} range The range being saved.
***REMOVED***
***REMOVED*** @extends {goog.dom.SavedRange}
***REMOVED***
goog.dom.SavedCaretRange = function(range) {
  goog.dom.SavedRange.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The DOM id of the caret at the start of the range.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.startCaretId_ = goog.string.createUniqueString();

 ***REMOVED*****REMOVED***
  ***REMOVED*** The DOM id of the caret at the end of the range.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.endCaretId_ = goog.string.createUniqueString();

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether the range is reversed (anchor at the end).
  ***REMOVED*** @private {boolean}
 ***REMOVED*****REMOVED***
  this.reversed_ = range.isReversed();

 ***REMOVED*****REMOVED***
  ***REMOVED*** A DOM helper for storing the current document context.
  ***REMOVED*** @type {goog.dom.DomHelper}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.dom_ = goog.dom.getDomHelper(range.getDocument());

  range.surroundWithNodes(this.createCaret_(true), this.createCaret_(false));
***REMOVED***
goog.inherits(goog.dom.SavedCaretRange, goog.dom.SavedRange);


***REMOVED***
***REMOVED*** Gets the range that this SavedCaretRage represents, without selecting it
***REMOVED*** or removing the carets from the DOM.
***REMOVED*** @return {goog.dom.AbstractRange?} An abstract range.
***REMOVED***
goog.dom.SavedCaretRange.prototype.toAbstractRange = function() {
  var range = null;
  var startCaret = this.getCaret(true);
  var endCaret = this.getCaret(false);
  if (startCaret && endCaret) {
   ***REMOVED*****REMOVED*** @suppress {missingRequire} circular dependency***REMOVED***
    range = goog.dom.Range.createFromNodes(startCaret, 0, endCaret, 0);
  }
  return range;
***REMOVED***


***REMOVED***
***REMOVED*** Gets carets.
***REMOVED*** @param {boolean} start If true, returns the start caret. Otherwise, get the
***REMOVED***     end caret.
***REMOVED*** @return {Element} The start or end caret in the given document.
***REMOVED***
goog.dom.SavedCaretRange.prototype.getCaret = function(start) {
  return this.dom_.getElement(start ? this.startCaretId_ : this.endCaretId_);
***REMOVED***


***REMOVED***
***REMOVED*** Removes the carets from the current restoration document.
***REMOVED*** @param {goog.dom.AbstractRange=} opt_range A range whose offsets have already
***REMOVED***     been adjusted for caret removal; it will be adjusted if it is also
***REMOVED***     affected by post-removal operations, such as text node normalization.
***REMOVED*** @return {goog.dom.AbstractRange|undefined} The adjusted range, if opt_range
***REMOVED***     was provided.
***REMOVED***
goog.dom.SavedCaretRange.prototype.removeCarets = function(opt_range) {
  goog.dom.removeNode(this.getCaret(true));
  goog.dom.removeNode(this.getCaret(false));
  return opt_range;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the document where the range will be restored.
***REMOVED*** @param {!Document} doc An HTML document.
***REMOVED***
goog.dom.SavedCaretRange.prototype.setRestorationDocument = function(doc) {
  this.dom_.setDocument(doc);
***REMOVED***


***REMOVED***
***REMOVED*** Reconstruct the selection from the given saved range. Removes carets after
***REMOVED*** restoring the selection. If restore does not dispose this saved range, it may
***REMOVED*** only be restored a second time if innerHTML or some other mechanism is used
***REMOVED*** to restore the carets to the dom.
***REMOVED*** @return {goog.dom.AbstractRange?} Restored selection.
***REMOVED*** @override
***REMOVED*** @protected
***REMOVED***
goog.dom.SavedCaretRange.prototype.restoreInternal = function() {
  var range = null;
  var anchorCaret = this.getCaret(!this.reversed_);
  var focusCaret = this.getCaret(this.reversed_);
  if (anchorCaret && focusCaret) {
    var anchorNode = anchorCaret.parentNode;
    var anchorOffset = goog.array.indexOf(anchorNode.childNodes, anchorCaret);
    var focusNode = focusCaret.parentNode;
    var focusOffset = goog.array.indexOf(focusNode.childNodes, focusCaret);
    if (focusNode == anchorNode) {
      // Compensate for the start caret being removed.
      if (this.reversed_) {
        anchorOffset--;
      } else {
        focusOffset--;
      }
    }
   ***REMOVED*****REMOVED*** @suppress {missingRequire} circular dependency***REMOVED***
    range = goog.dom.Range.createFromNodes(anchorNode, anchorOffset,
                                           focusNode, focusOffset);
    range = this.removeCarets(range);
    range.select();
  } else {
    // If only one caret was found, remove it.
    this.removeCarets();
  }
  return range;
***REMOVED***


***REMOVED***
***REMOVED*** Dispose the saved range and remove the carets from the DOM.
***REMOVED*** @override
***REMOVED*** @protected
***REMOVED***
goog.dom.SavedCaretRange.prototype.disposeInternal = function() {
  this.removeCarets();
  this.dom_ = null;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a caret element.
***REMOVED*** @param {boolean} start If true, creates the start caret. Otherwise,
***REMOVED***     creates the end caret.
***REMOVED*** @return {!Element} The new caret element.
***REMOVED*** @private
***REMOVED***
goog.dom.SavedCaretRange.prototype.createCaret_ = function(start) {
  return this.dom_.createDom(goog.dom.TagName.SPAN,
      {'id': start ? this.startCaretId_ : this.endCaretId_});
***REMOVED***


***REMOVED***
***REMOVED*** A regex that will match all saved range carets in a string.
***REMOVED*** @type {RegExp}
***REMOVED***
goog.dom.SavedCaretRange.CARET_REGEX = /<span\s+id="?goog_\d+"?><\/span>/ig;


***REMOVED***
***REMOVED*** Returns whether two strings of html are equal, ignoring any saved carets.
***REMOVED*** Thus two strings of html whose only difference is the id of their saved
***REMOVED*** carets will be considered equal, since they represent html with the
***REMOVED*** same selection.
***REMOVED*** @param {string} str1 The first string.
***REMOVED*** @param {string} str2 The second string.
***REMOVED*** @return {boolean} Whether two strings of html are equal, ignoring any
***REMOVED***     saved carets.
***REMOVED***
goog.dom.SavedCaretRange.htmlEqual = function(str1, str2) {
  return str1 == str2 ||
      str1.replace(goog.dom.SavedCaretRange.CARET_REGEX, '') ==
          str2.replace(goog.dom.SavedCaretRange.CARET_REGEX, '');
***REMOVED***
