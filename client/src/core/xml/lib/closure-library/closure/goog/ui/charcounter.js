// Copyright 2006 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Character counter widget implementation.
***REMOVED***
***REMOVED*** @author eae@google.com (Emil A Eklund)
***REMOVED*** @see ../demos/charcounter.html
***REMOVED***

goog.provide('goog.ui.CharCounter');
goog.provide('goog.ui.CharCounter.Display');

goog.require('goog.dom');
***REMOVED***
goog.require('goog.events.EventTarget');
goog.require('goog.events.InputHandler');



***REMOVED***
***REMOVED*** CharCounter widget. Counts the number of characters in a input field or a
***REMOVED*** text box and displays the number of additional characters that may be
***REMOVED*** entered before the maximum length is reached.
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED*** @param {HTMLInputElement|HTMLTextAreaElement} elInput Input or text area
***REMOVED***     element to count the number of characters in.  You can pass in null
***REMOVED***     for this if you don't want to expose the number of chars remaining.
***REMOVED*** @param {Element} elCount HTML element to display the remaining number of
***REMOVED***     characters in.
***REMOVED*** @param {number} maxLength The maximum length.
***REMOVED*** @param {goog.ui.CharCounter.Display=} opt_displayMode Display mode for this
***REMOVED***     char counter. Defaults to {@link goog.ui.CharCounter.Display.REMAINING}.
***REMOVED***
***REMOVED***
goog.ui.CharCounter = function(elInput, elCount, maxLength, opt_displayMode) {
  goog.events.EventTarget.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Input or text area element to count the number of characters in.
  ***REMOVED*** @type {HTMLInputElement|HTMLTextAreaElement}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.elInput_ = elInput;

 ***REMOVED*****REMOVED***
  ***REMOVED*** HTML element to display the remaining number of characters in.
  ***REMOVED*** @type {Element}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.elCount_ = elCount;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The maximum length.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.maxLength_ = maxLength;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The display mode for this char counter.
  ***REMOVED*** @type {!goog.ui.CharCounter.Display}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.display_ = opt_displayMode || goog.ui.CharCounter.Display.REMAINING;

  elInput.maxLength = maxLength;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The input handler that provides the input event.
  ***REMOVED*** @type {goog.events.InputHandler}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.inputHandler_ = new goog.events.InputHandler(elInput);

***REMOVED***this.inputHandler_,
      goog.events.InputHandler.EventType.INPUT, this.onChange_, false, this);

  this.checkLength_();
***REMOVED***
goog.inherits(goog.ui.CharCounter, goog.events.EventTarget);


***REMOVED***
***REMOVED*** Display mode for the char counter.
***REMOVED*** @enum {number}
***REMOVED***
goog.ui.CharCounter.Display = {
 ***REMOVED*****REMOVED*** Widget displays the number of characters remaining (the default).***REMOVED***
  REMAINING: 0,
 ***REMOVED*****REMOVED*** Widget displays the number of characters entered.***REMOVED***
  INCREMENTAL: 1
***REMOVED***


***REMOVED***
***REMOVED*** Sets the maximum length.
***REMOVED***
***REMOVED*** @param {number} maxLength The maximum length.
***REMOVED***
goog.ui.CharCounter.prototype.setMaxLength = function(maxLength) {
  this.maxLength_ = maxLength;
  this.elInput_.maxLength = maxLength;
  this.checkLength_();
***REMOVED***


***REMOVED***
***REMOVED*** Returns the maximum length.
***REMOVED***
***REMOVED*** @return {number} The maximum length.
***REMOVED***
goog.ui.CharCounter.prototype.getMaxLength = function() {
  return this.maxLength_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the display mode.
***REMOVED***
***REMOVED*** @param {!goog.ui.CharCounter.Display} displayMode The display mode.
***REMOVED***
goog.ui.CharCounter.prototype.setDisplayMode = function(displayMode) {
  this.display_ = displayMode;
  this.checkLength_();
***REMOVED***


***REMOVED***
***REMOVED*** Returns the display mode.
***REMOVED***
***REMOVED*** @return {!goog.ui.CharCounter.Display} The display mode.
***REMOVED***
goog.ui.CharCounter.prototype.getDisplayMode = function() {
  return this.display_;
***REMOVED***


***REMOVED***
***REMOVED*** Change event handler for input field.
***REMOVED***
***REMOVED*** @param {goog.events.BrowserEvent} event Change event.
***REMOVED*** @private
***REMOVED***
goog.ui.CharCounter.prototype.onChange_ = function(event) {
  this.checkLength_();
***REMOVED***


***REMOVED***
***REMOVED*** Checks length of text in input field and updates the counter. Truncates text
***REMOVED*** if the maximum lengths is exceeded.
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.ui.CharCounter.prototype.checkLength_ = function() {
  var count = this.elInput_.value.length;

  // There's no maxlength property for textareas so instead we truncate the
  // text if it gets too long. It's also used to truncate the text in a input
  // field if the maximum length is changed.
  if (count > this.maxLength_) {

    var scrollTop = this.elInput_.scrollTop;
    var scrollLeft = this.elInput_.scrollLeft;

    this.elInput_.value = this.elInput_.value.substring(0, this.maxLength_);
    count = this.maxLength_;

    this.elInput_.scrollTop = scrollTop;
    this.elInput_.scrollLeft = scrollLeft;
  }

  if (this.elCount_) {
    var incremental = this.display_ == goog.ui.CharCounter.Display.INCREMENTAL;
    goog.dom.setTextContent(
        this.elCount_,
        String(incremental ? count : this.maxLength_ - count));
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.CharCounter.prototype.disposeInternal = function() {
  goog.ui.CharCounter.superClass_.disposeInternal.call(this);
  delete this.elInput_;
  this.inputHandler_.dispose();
  this.inputHandler_ = null;
***REMOVED***
