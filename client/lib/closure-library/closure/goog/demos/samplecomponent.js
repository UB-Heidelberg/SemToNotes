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
***REMOVED*** @fileoverview A simple, sample component.
***REMOVED***
***REMOVED***
goog.provide('goog.demos.SampleComponent');

goog.require('goog.dom');
goog.require('goog.dom.classlist');
***REMOVED***
goog.require('goog.events.KeyCodes');
goog.require('goog.events.KeyHandler');
goog.require('goog.ui.Component');



***REMOVED***
***REMOVED*** A simple box that changes colour when clicked. This class demonstrates the
***REMOVED*** goog.ui.Component API, and is keyboard accessible, as per
***REMOVED*** http://wiki/Main/ClosureKeyboardAccessible
***REMOVED***
***REMOVED*** @param {string=} opt_label A label to display. Defaults to "Click Me" if none
***REMOVED***     provided.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper DOM helper to use.
***REMOVED***
***REMOVED*** @extends {goog.ui.Component}
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.demos.SampleComponent = function(opt_label, opt_domHelper) {
  goog.base(this, opt_domHelper);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The label to display.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.initialLabel_ = opt_label || 'Click Me';

 ***REMOVED*****REMOVED***
  ***REMOVED*** The current color.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.color_ = 'red';

 ***REMOVED*****REMOVED***
  ***REMOVED*** Keyboard handler for this object. This object is created once the
  ***REMOVED*** component's DOM element is known.
  ***REMOVED***
  ***REMOVED*** @type {goog.events.KeyHandler?}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.kh_ = null;
***REMOVED***
goog.inherits(goog.demos.SampleComponent, goog.ui.Component);


***REMOVED***
***REMOVED*** Changes the color of the element.
***REMOVED*** @private
***REMOVED***
goog.demos.SampleComponent.prototype.changeColor_ = function() {
  if (this.color_ == 'red') {
    this.color_ = 'green';
  } else if (this.color_ == 'green') {
    this.color_ = 'blue';
  } else {
    this.color_ = 'red';
  }
  this.getElement().style.backgroundColor = this.color_;
***REMOVED***


***REMOVED***
***REMOVED*** Creates an initial DOM representation for the component.
***REMOVED*** @override
***REMOVED***
goog.demos.SampleComponent.prototype.createDom = function() {
  this.decorateInternal(this.dom_.createElement('div'));
***REMOVED***


***REMOVED***
***REMOVED*** Decorates an existing HTML DIV element as a SampleComponent.
***REMOVED***
***REMOVED*** @param {Element} element The DIV element to decorate. The element's
***REMOVED***    text, if any will be used as the component's label.
***REMOVED*** @override
***REMOVED***
goog.demos.SampleComponent.prototype.decorateInternal = function(element) {
  goog.base(this, 'decorateInternal', element);
  if (!this.getLabelText()) {
    this.setLabelText(this.initialLabel_);
  }

  var elem = this.getElement();
  goog.dom.classlist.add(elem, goog.getCssName('goog-sample-component'));
  elem.style.backgroundColor = this.color_;
  elem.tabIndex = 0;

  this.kh_ = new goog.events.KeyHandler(elem);
  this.getHandler().listen(this.kh_, goog.events.KeyHandler.EventType.KEY,
      this.onKey_);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.demos.SampleComponent.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  if (this.kh_) {
    this.kh_.dispose();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Called when component's element is known to be in the document.
***REMOVED*** @override
***REMOVED***
goog.demos.SampleComponent.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  this.getHandler().listen(this.getElement(), goog.events.EventType.CLICK,
      this.onDivClicked_);
***REMOVED***


***REMOVED***
***REMOVED*** Called when component's element is known to have been removed from the
***REMOVED*** document.
***REMOVED*** @override
***REMOVED***
goog.demos.SampleComponent.prototype.exitDocument = function() {
  goog.base(this, 'exitDocument');
***REMOVED***


***REMOVED***
***REMOVED*** Gets the current label text.
***REMOVED***
***REMOVED*** @return {string} The current text set into the label, or empty string if
***REMOVED***     none set.
***REMOVED***
goog.demos.SampleComponent.prototype.getLabelText = function() {
  if (!this.getElement()) {
    return '';
  }
  return goog.dom.getTextContent(this.getElement());
***REMOVED***


***REMOVED***
***REMOVED*** Handles DIV element clicks, causing the DIV's colour to change.
***REMOVED*** @param {goog.events.Event} event The click event.
***REMOVED*** @private
***REMOVED***
goog.demos.SampleComponent.prototype.onDivClicked_ = function(event) {
  this.changeColor_();
***REMOVED***


***REMOVED***
***REMOVED*** Fired when user presses a key while the DIV has focus. If the user presses
***REMOVED*** space or enter, the color will be changed.
***REMOVED*** @param {goog.events.Event} event The key event.
***REMOVED*** @private
***REMOVED***
goog.demos.SampleComponent.prototype.onKey_ = function(event) {
  var keyCodes = goog.events.KeyCodes;
  if (event.keyCode == keyCodes.SPACE || event.keyCode == keyCodes.ENTER) {
    this.changeColor_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the current label text. Has no effect if component is not rendered.
***REMOVED***
***REMOVED*** @param {string} text The text to set as the label.
***REMOVED***
goog.demos.SampleComponent.prototype.setLabelText = function(text) {
  if (this.getElement()) {
    goog.dom.setTextContent(this.getElement(), text);
  }
***REMOVED***
