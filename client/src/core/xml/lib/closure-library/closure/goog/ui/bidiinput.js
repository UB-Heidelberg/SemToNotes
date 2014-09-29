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
***REMOVED*** @fileoverview Component for an input field with bidi direction automatic
***REMOVED*** detection. The input element directionality is automatically set according
***REMOVED*** to the contents (value) of the element.
***REMOVED***
***REMOVED*** @see ../demos/bidiinput.html
***REMOVED***


goog.provide('goog.ui.BidiInput');


***REMOVED***
goog.require('goog.events.InputHandler');
goog.require('goog.i18n.bidi');
goog.require('goog.ui.Component');



***REMOVED***
***REMOVED*** Default implementation of BidiInput.
***REMOVED***
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper  Optional DOM helper.
***REMOVED***
***REMOVED*** @extends {goog.ui.Component}
***REMOVED***
goog.ui.BidiInput = function(opt_domHelper) {
  goog.ui.Component.call(this, opt_domHelper);
***REMOVED***
goog.inherits(goog.ui.BidiInput, goog.ui.Component);


***REMOVED***
***REMOVED*** The input handler that provides the input event.
***REMOVED*** @type {goog.events.InputHandler?}
***REMOVED*** @private
***REMOVED***
goog.ui.BidiInput.prototype.inputHandler_ = null;


***REMOVED***
***REMOVED*** Decorates the given HTML element as a BidiInput. The HTML element
***REMOVED*** must be an input element with type='text' or a textarea element.
***REMOVED*** Overrides {@link goog.ui.Component#decorateInternal}.  Considered protected.
***REMOVED*** @param {Element} element  Element (HTML Input element) to decorate.
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.ui.BidiInput.prototype.decorateInternal = function(element) {
  goog.ui.BidiInput.superClass_.decorateInternal.call(this, element);
  this.init_();
***REMOVED***


***REMOVED***
***REMOVED*** Creates the element for the text input.
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.ui.BidiInput.prototype.createDom = function() {
  this.setElementInternal(
      this.getDomHelper().createDom('input', {'type': 'text'}));
  this.init_();
***REMOVED***


***REMOVED***
***REMOVED*** Initializes the events and initial text direction.
***REMOVED*** Called from either decorate or createDom, after the input field has
***REMOVED*** been created.
***REMOVED*** @private
***REMOVED***
goog.ui.BidiInput.prototype.init_ = function() {
  // Set initial direction by current text
  this.setDirection_();

  // Listen to value change events
  this.inputHandler_ = new goog.events.InputHandler(this.getElement());
***REMOVED***this.inputHandler_,
      goog.events.InputHandler.EventType.INPUT,
      this.setDirection_, false, this);
***REMOVED***


***REMOVED***
***REMOVED*** Set the direction of the input element based on the current value. If the
***REMOVED*** value does not have any strongly directional characters, remove the dir
***REMOVED*** attribute so that the direction is inherited instead.
***REMOVED*** This method is called when the user changes the input element value, or
***REMOVED*** when a program changes the value using
***REMOVED*** {@link goog.ui.BidiInput#setValue}
***REMOVED*** @private
***REMOVED***
goog.ui.BidiInput.prototype.setDirection_ = function() {
  var element = this.getElement();
  var text = element.value;
  switch (goog.i18n.bidi.estimateDirection(text)) {
    case (goog.i18n.bidi.Dir.LTR):
      element.dir = 'ltr';
      break;
    case (goog.i18n.bidi.Dir.RTL):
      element.dir = 'rtl';
      break;
    default:
      // Default for no direction, inherit from document.
      element.removeAttribute('dir');
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the direction of the input element.
***REMOVED*** @return {?string} Return 'rtl' for right-to-left text,
***REMOVED***     'ltr' for left-to-right text, or null if the value itself is not
***REMOVED***     enough to determine directionality (e.g. an empty value), and the
***REMOVED***     direction is inherited from a parent element (typically the body
***REMOVED***     element).
***REMOVED***
goog.ui.BidiInput.prototype.getDirection = function() {
  var dir = this.getElement().dir;
  if (dir == '') {
    dir = null;
  }
  return dir;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the value of the underlying input field, and sets the direction
***REMOVED*** according to the given value.
***REMOVED*** @param {string} value  The Value to set in the underlying input field.
***REMOVED***
goog.ui.BidiInput.prototype.setValue = function(value) {
  this.getElement().value = value;
  this.setDirection_();
***REMOVED***


***REMOVED***
***REMOVED*** Returns the value of the underlying input field.
***REMOVED*** @return {string} Value of the underlying input field.
***REMOVED***
goog.ui.BidiInput.prototype.getValue = function() {
  return this.getElement().value;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.BidiInput.prototype.disposeInternal = function() {
  if (this.inputHandler_) {
    goog.events.removeAll(this.inputHandler_);
    this.inputHandler_.dispose();
    this.inputHandler_ = null;
    goog.ui.BidiInput.superClass_.disposeInternal.call(this);
  }
***REMOVED***
