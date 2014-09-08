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
***REMOVED*** @fileoverview This behavior is applied to a text input and it shows a text
***REMOVED*** message inside the element if the user hasn't entered any text.
***REMOVED***
***REMOVED*** This uses the HTML5 placeholder attribute where it is supported.
***REMOVED***
***REMOVED*** This is ported from http://go/labelinput.js
***REMOVED***
***REMOVED*** Known issue: Safari does not allow you get to the window object from a
***REMOVED*** document. We need that to listen to the onload event. For now we hard code
***REMOVED*** the window to the current window.
***REMOVED***
***REMOVED*** Known issue: We need to listen to the form submit event but we attach the
***REMOVED*** event only once (when created or when it is changed) so if you move the DOM
***REMOVED*** node to another form it will not be cleared correctly before submitting.
***REMOVED***
***REMOVED*** @author arv@google.com (Erik Arvidsson)
***REMOVED*** @see ../demos/labelinput.html
***REMOVED***

goog.provide('goog.ui.LabelInput');

goog.require('goog.Timer');
goog.require('goog.a11y.aria');
goog.require('goog.a11y.aria.State');
goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.events.EventHandler');
***REMOVED***
goog.require('goog.ui.Component');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** This creates the label input object.
***REMOVED*** @param {string=} opt_label The text to show as the label.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
***REMOVED*** @extends {goog.ui.Component}
***REMOVED***
***REMOVED***
goog.ui.LabelInput = function(opt_label, opt_domHelper) {
  goog.ui.Component.call(this, opt_domHelper);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The text to show as the label.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.label_ = opt_label || '';
***REMOVED***
goog.inherits(goog.ui.LabelInput, goog.ui.Component);


***REMOVED***
***REMOVED*** Variable used to store the element value on keydown and restore it on
***REMOVED*** keypress.  See {@link #handleEscapeKeys_}
***REMOVED*** @type {?string}
***REMOVED*** @private
***REMOVED***
goog.ui.LabelInput.prototype.ffKeyRestoreValue_ = null;


***REMOVED***
***REMOVED*** The label restore delay after leaving the input.
***REMOVED*** @type {number} Delay for restoring the label.
***REMOVED*** @protected
***REMOVED***
goog.ui.LabelInput.prototype.labelRestoreDelayMs = 10;


***REMOVED***
***REMOVED*** Indicates whether the browser supports the placeholder attribute, new in
***REMOVED*** HTML5.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.LabelInput.SUPPORTS_PLACEHOLDER_ = (
    'placeholder' in document.createElement('input'));


***REMOVED***
***REMOVED*** @type {goog.events.EventHandler}
***REMOVED*** @private
***REMOVED***
goog.ui.LabelInput.prototype.eventHandler_;


***REMOVED***
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.LabelInput.prototype.hasFocus_ = false;


***REMOVED***
***REMOVED*** Creates the DOM nodes needed for the label input.
***REMOVED*** @override
***REMOVED***
goog.ui.LabelInput.prototype.createDom = function() {
  this.setElementInternal(
      this.getDomHelper().createDom('input', {'type': 'text'}));
***REMOVED***


***REMOVED***
***REMOVED*** Decorates an existing HTML input element as a label input. If the element
***REMOVED*** has a "label" attribute then that will be used as the label property for the
***REMOVED*** label input object.
***REMOVED*** @param {Element} element The HTML input element to decorate.
***REMOVED*** @override
***REMOVED***
goog.ui.LabelInput.prototype.decorateInternal = function(element) {
  goog.ui.LabelInput.superClass_.decorateInternal.call(this, element);
  if (!this.label_) {
    this.label_ = element.getAttribute('label') || '';
  }

  // Check if we're attaching to an element that already has focus.
  if (goog.dom.getActiveElement(goog.dom.getOwnerDocument(element)) ==
      element) {
    this.hasFocus_ = true;
    var el = this.getElement();
    goog.asserts.assert(el);
    goog.dom.classlist.remove(el, this.LABEL_CLASS_NAME);
  }

  if (goog.ui.LabelInput.SUPPORTS_PLACEHOLDER_) {
    this.getElement().placeholder = this.label_;
  }
  var labelInputElement = this.getElement();
  goog.asserts.assert(labelInputElement,
      'The label input element cannot be null.');
  goog.a11y.aria.setState(labelInputElement,
      goog.a11y.aria.State.LABEL,
      this.label_);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.LabelInput.prototype.enterDocument = function() {
  goog.ui.LabelInput.superClass_.enterDocument.call(this);
  this.attachEvents_();
  this.check_();

  // Make it easy for other closure widgets to play nicely with inputs using
  // LabelInput:
  this.getElement().labelInput_ = this;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.LabelInput.prototype.exitDocument = function() {
  goog.ui.LabelInput.superClass_.exitDocument.call(this);
  this.detachEvents_();

  this.getElement().labelInput_ = null;
***REMOVED***


***REMOVED***
***REMOVED*** Attaches the events we need to listen to.
***REMOVED*** @private
***REMOVED***
goog.ui.LabelInput.prototype.attachEvents_ = function() {
  var eh = new goog.events.EventHandler(this);
  eh.listen(this.getElement(), goog.events.EventType.FOCUS, this.handleFocus_);
  eh.listen(this.getElement(), goog.events.EventType.BLUR, this.handleBlur_);

  if (goog.ui.LabelInput.SUPPORTS_PLACEHOLDER_) {
    this.eventHandler_ = eh;
    return;
  }

  if (goog.userAgent.GECKO) {
    eh.listen(this.getElement(), [
      goog.events.EventType.KEYPRESS,
      goog.events.EventType.KEYDOWN,
      goog.events.EventType.KEYUP
    ], this.handleEscapeKeys_);
  }

  // IE sets defaultValue upon load so we need to test that as well.
  var d = goog.dom.getOwnerDocument(this.getElement());
  var w = goog.dom.getWindow(d);
  eh.listen(w, goog.events.EventType.LOAD, this.handleWindowLoad_);

  this.eventHandler_ = eh;
  this.attachEventsToForm_();
***REMOVED***


***REMOVED***
***REMOVED*** Adds a listener to the form so that we can clear the input before it is
***REMOVED*** submitted.
***REMOVED*** @private
***REMOVED***
goog.ui.LabelInput.prototype.attachEventsToForm_ = function() {
  // in case we have are in a form we need to make sure the label is not
  // submitted
  if (!this.formAttached_ && this.eventHandler_ && this.getElement().form) {
    this.eventHandler_.listen(this.getElement().form,
                              goog.events.EventType.SUBMIT,
                              this.handleFormSubmit_);
    this.formAttached_ = true;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Stops listening to the events.
***REMOVED*** @private
***REMOVED***
goog.ui.LabelInput.prototype.detachEvents_ = function() {
  if (this.eventHandler_) {
    this.eventHandler_.dispose();
    this.eventHandler_ = null;
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.LabelInput.prototype.disposeInternal = function() {
  goog.ui.LabelInput.superClass_.disposeInternal.call(this);
  this.detachEvents_();
***REMOVED***


***REMOVED***
***REMOVED*** The CSS class name to add to the input when the user has not entered a
***REMOVED*** value.
***REMOVED***
goog.ui.LabelInput.prototype.LABEL_CLASS_NAME =
    goog.getCssName('label-input-label');


***REMOVED***
***REMOVED*** Handler for the focus event.
***REMOVED*** @param {goog.events.Event} e The event object passed in to the event handler.
***REMOVED*** @private
***REMOVED***
goog.ui.LabelInput.prototype.handleFocus_ = function(e) {
  this.hasFocus_ = true;
  var el = this.getElement();
  goog.asserts.assert(el);
  goog.dom.classlist.remove(el, this.LABEL_CLASS_NAME);
  if (goog.ui.LabelInput.SUPPORTS_PLACEHOLDER_) {
    return;
  }
  if (!this.hasChanged() && !this.inFocusAndSelect_) {
    var me = this;
    var clearValue = function() {
      // Component could be disposed by the time this is called.
      if (me.getElement()) {
        me.getElement().value = '';
      }
   ***REMOVED*****REMOVED***
    if (goog.userAgent.IE) {
      goog.Timer.callOnce(clearValue, 10);
    } else {
      clearValue();
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handler for the blur event.
***REMOVED*** @param {goog.events.Event} e The event object passed in to the event handler.
***REMOVED*** @private
***REMOVED***
goog.ui.LabelInput.prototype.handleBlur_ = function(e) {
  // We listen to the click event when we enter focusAndSelect mode so we can
  // fake an artificial focus when the user clicks on the input box. However,
  // if the user clicks on something else (and we lose focus), there is no
  // need for an artificial focus event.
  if (!goog.ui.LabelInput.SUPPORTS_PLACEHOLDER_) {
    this.eventHandler_.unlisten(
        this.getElement(), goog.events.EventType.CLICK, this.handleFocus_);
    this.ffKeyRestoreValue_ = null;
  }
  this.hasFocus_ = false;
  this.check_();
***REMOVED***


***REMOVED***
***REMOVED*** Handler for key events in Firefox.
***REMOVED***
***REMOVED*** If the escape key is pressed when a text input has not been changed manually
***REMOVED*** since being focused, the text input will revert to its previous value.
***REMOVED*** Firefox does not honor preventDefault for the escape key. The revert happens
***REMOVED*** after the keydown event and before every keypress. We therefore store the
***REMOVED*** element's value on keydown and restore it on keypress. The restore value is
***REMOVED*** nullified on keyup so that {@link #getValue} returns the correct value.
***REMOVED***
***REMOVED*** IE and Chrome don't have this problem, Opera blurs in the input box
***REMOVED*** completely in a way that preventDefault on the escape key has no effect.
***REMOVED***
***REMOVED*** @param {goog.events.BrowserEvent} e The event object passed in to
***REMOVED***     the event handler.
***REMOVED*** @private
***REMOVED***
goog.ui.LabelInput.prototype.handleEscapeKeys_ = function(e) {
  if (e.keyCode == 27) {
    if (e.type == goog.events.EventType.KEYDOWN) {
      this.ffKeyRestoreValue_ = this.getElement().value;
    } else if (e.type == goog.events.EventType.KEYPRESS) {
      this.getElement().value =***REMOVED*****REMOVED*** @type {string}***REMOVED*** (this.ffKeyRestoreValue_);
    } else if (e.type == goog.events.EventType.KEYUP) {
      this.ffKeyRestoreValue_ = null;
    }
    e.preventDefault();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handler for the submit event of the form element.
***REMOVED*** @param {goog.events.Event} e The event object passed in to the event handler.
***REMOVED*** @private
***REMOVED***
goog.ui.LabelInput.prototype.handleFormSubmit_ = function(e) {
  if (!this.hasChanged()) {
    this.getElement().value = '';
    // allow form to be sent before restoring value
    goog.Timer.callOnce(this.handleAfterSubmit_, 10, this);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Restore value after submit
***REMOVED*** @private
***REMOVED***
goog.ui.LabelInput.prototype.handleAfterSubmit_ = function() {
  if (!this.hasChanged()) {
    this.getElement().value = this.label_;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handler for the load event the window. This is needed because
***REMOVED*** IE sets defaultValue upon load.
***REMOVED*** @param {Event} e The event object passed in to the event handler.
***REMOVED*** @private
***REMOVED***
goog.ui.LabelInput.prototype.handleWindowLoad_ = function(e) {
  this.check_();
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the control is currently focused on.
***REMOVED***
goog.ui.LabelInput.prototype.hasFocus = function() {
  return this.hasFocus_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the value has been changed by the user.
***REMOVED***
goog.ui.LabelInput.prototype.hasChanged = function() {
  return !!this.getElement() && this.getElement().value != '' &&
      this.getElement().value != this.label_;
***REMOVED***


***REMOVED***
***REMOVED*** Clears the value of the input element without resetting the default text.
***REMOVED***
goog.ui.LabelInput.prototype.clear = function() {
  this.getElement().value = '';

  // Reset ffKeyRestoreValue_ when non-null
  if (this.ffKeyRestoreValue_ != null) {
    this.ffKeyRestoreValue_ = '';
  }
***REMOVED***


***REMOVED***
***REMOVED*** Clears the value of the input element and resets the default text.
***REMOVED***
goog.ui.LabelInput.prototype.reset = function() {
  if (this.hasChanged()) {
    this.clear();
    this.check_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Use this to set the value through script to ensure that the label state is
***REMOVED*** up to date
***REMOVED*** @param {string} s The new value for the input.
***REMOVED***
goog.ui.LabelInput.prototype.setValue = function(s) {
  if (this.ffKeyRestoreValue_ != null) {
    this.ffKeyRestoreValue_ = s;
  }
  this.getElement().value = s;
  this.check_();
***REMOVED***


***REMOVED***
***REMOVED*** Returns the current value of the text box, returning an empty string if the
***REMOVED*** search box is the default value
***REMOVED*** @return {string} The value of the input box.
***REMOVED***
goog.ui.LabelInput.prototype.getValue = function() {
  if (this.ffKeyRestoreValue_ != null) {
    // Fix the Firefox from incorrectly reporting the value to calling code
    // that attached the listener to keypress before the labelinput
    return this.ffKeyRestoreValue_;
  }
  return this.hasChanged() ?***REMOVED*****REMOVED*** @type {string}***REMOVED*** (this.getElement().value) :
      '';
***REMOVED***


***REMOVED***
***REMOVED*** Sets the label text as aria-label, and placeholder when supported.
***REMOVED*** @param {string} label The text to show as the label.
***REMOVED***
goog.ui.LabelInput.prototype.setLabel = function(label) {
  var labelInputElement = this.getElement();

  if (goog.ui.LabelInput.SUPPORTS_PLACEHOLDER_) {
    if (labelInputElement) {
      labelInputElement.placeholder = label;
    }
    this.label_ = label;
  } else if (!this.hasChanged()) {
    // The this.hasChanged() call relies on non-placeholder behavior checking
    // prior to setting this.label_ - it also needs to happen prior to the
    // this.restoreLabel_() call.
    if (labelInputElement) {
      labelInputElement.value = '';
    }
    this.label_ = label;
    this.restoreLabel_();
  }
  // Check if this has been called before DOM structure building
  if (labelInputElement) {
    goog.a11y.aria.setState(labelInputElement,
        goog.a11y.aria.State.LABEL,
        this.label_);
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The text to show as the label.
***REMOVED***
goog.ui.LabelInput.prototype.getLabel = function() {
  return this.label_;
***REMOVED***


***REMOVED***
***REMOVED*** Checks the state of the input element
***REMOVED*** @private
***REMOVED***
goog.ui.LabelInput.prototype.check_ = function() {
  var labelInputElement = this.getElement();
  goog.asserts.assert(labelInputElement,
      'The label input element cannot be null.');
  if (!goog.ui.LabelInput.SUPPORTS_PLACEHOLDER_) {
    // if we haven't got a form yet try now
    this.attachEventsToForm_();
  } else if (this.getElement().placeholder != this.label_) {
    this.getElement().placeholder = this.label_;
  }
  goog.a11y.aria.setState(labelInputElement,
      goog.a11y.aria.State.LABEL,
      this.label_);

  if (!this.hasChanged()) {
    if (!this.inFocusAndSelect_ && !this.hasFocus_) {
      var el = this.getElement();
      goog.asserts.assert(el);
      goog.dom.classlist.add(el, this.LABEL_CLASS_NAME);
    }

    // Allow browser to catchup with CSS changes before restoring the label.
    if (!goog.ui.LabelInput.SUPPORTS_PLACEHOLDER_) {
      goog.Timer.callOnce(this.restoreLabel_, this.labelRestoreDelayMs,
          this);
    }
  } else {
    var el = this.getElement();
    goog.asserts.assert(el);
    goog.dom.classlist.remove(el, this.LABEL_CLASS_NAME);
  }
***REMOVED***


***REMOVED***
***REMOVED*** This method focuses the input and selects all the text. If the value hasn't
***REMOVED*** changed it will set the value to the label so that the label text is
***REMOVED*** selected.
***REMOVED***
goog.ui.LabelInput.prototype.focusAndSelect = function() {
  // We need to check whether the input has changed before focusing
  var hc = this.hasChanged();
  this.inFocusAndSelect_ = true;
  this.getElement().focus();
  if (!hc && !goog.ui.LabelInput.SUPPORTS_PLACEHOLDER_) {
    this.getElement().value = this.label_;
  }
  this.getElement().select();

  // Since the object now has focus, we won't get a focus event when they
  // click in the input element. The expected behavior when you click on
  // the default text is that it goes away and allows you to type...so we
  // have to fire an artificial focus event when we're in focusAndSelect mode.
  if (goog.ui.LabelInput.SUPPORTS_PLACEHOLDER_) {
    return;
  }
  if (this.eventHandler_) {
    this.eventHandler_.listenOnce(
        this.getElement(), goog.events.EventType.CLICK, this.handleFocus_);
  }

  // set to false in timer to let IE trigger the focus event
  goog.Timer.callOnce(this.focusAndSelect_, 10, this);
***REMOVED***


***REMOVED***
***REMOVED*** Enables/Disables the label input.
***REMOVED*** @param {boolean} enabled Whether to enable (true) or disable (false) the
***REMOVED***     label input.
***REMOVED***
goog.ui.LabelInput.prototype.setEnabled = function(enabled) {
  this.getElement().disabled = !enabled;
  var el = this.getElement();
  goog.asserts.assert(el);
  goog.dom.classlist.enable(el,
      goog.getCssName(this.LABEL_CLASS_NAME, 'disabled'), !enabled);
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} True if the label input is enabled, false otherwise.
***REMOVED***
goog.ui.LabelInput.prototype.isEnabled = function() {
  return !this.getElement().disabled;
***REMOVED***


***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.ui.LabelInput.prototype.focusAndSelect_ = function() {
  this.inFocusAndSelect_ = false;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the value of the input element to label.
***REMOVED*** @private
***REMOVED***
goog.ui.LabelInput.prototype.restoreLabel_ = function() {
  // Check again in case something changed since this was scheduled.
  // We check that the element is still there since this is called by a timer
  // and the dispose method may have been called prior to this.
  if (this.getElement() && !this.hasChanged() && !this.hasFocus_) {
    this.getElement().value = this.label_;
  }
***REMOVED***
