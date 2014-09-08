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
***REMOVED*** @fileoverview DHTML prompt to replace javascript's prompt().
***REMOVED***
***REMOVED*** @see ../demos/prompt.html
***REMOVED***


goog.provide('goog.ui.Prompt');

goog.require('goog.Timer');
goog.require('goog.dom');
***REMOVED***
***REMOVED***
goog.require('goog.functions');
goog.require('goog.html.SafeHtml');
goog.require('goog.html.legacyconversions');
goog.require('goog.ui.Component');
goog.require('goog.ui.Dialog');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** Creates an object that represents a prompt (used in place of javascript's
***REMOVED*** prompt). The html structure of the prompt is the same as the layout for
***REMOVED*** dialog.js except for the addition of a text box which is placed inside the
***REMOVED*** "Content area" and has the default class-name 'modal-dialog-userInput'
***REMOVED***
***REMOVED*** @param {string} promptTitle The title of the prompt.
***REMOVED*** @param {string|!goog.html.SafeHtml} promptHtml The HTML body of the prompt.
***REMOVED***     The variable is trusted and it should be already properly escaped.
***REMOVED*** @param {Function} callback The function to call when the user selects Ok or
***REMOVED***     Cancel. The function should expect a single argument which represents
***REMOVED***     what the user entered into the prompt. If the user presses cancel, the
***REMOVED***     value of the argument will be null.
***REMOVED*** @param {string=} opt_defaultValue Optional default value that should be in
***REMOVED***     the text box when the prompt appears.
***REMOVED*** @param {string=} opt_class Optional prefix for the classes.
***REMOVED*** @param {boolean=} opt_useIframeForIE For IE, workaround windowed controls
***REMOVED***     z-index issue by using a an iframe instead of a div for bg element.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper; see {@link
***REMOVED***    goog.ui.Component} for semantics.
***REMOVED***
***REMOVED*** @extends {goog.ui.Dialog}
***REMOVED***
goog.ui.Prompt = function(promptTitle, promptHtml, callback, opt_defaultValue,
    opt_class, opt_useIframeForIE, opt_domHelper) {
  goog.ui.Prompt.base(this, 'constructor',
      opt_class, opt_useIframeForIE, opt_domHelper);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The id of the input element.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.inputElementId_ = this.makeId('ie');

  this.setTitle(promptTitle);

  var label = goog.html.SafeHtml.create('label', {'for': this.inputElementId_},
      promptHtml instanceof goog.html.SafeHtml ? promptHtml :
          goog.html.legacyconversions.safeHtmlFromString(promptHtml));
  var br = goog.html.SafeHtml.create('br');
  this.setSafeHtmlContent(goog.html.SafeHtml.concat(label, br, br));

  this.callback_ = callback;
  this.defaultValue_ = goog.isDef(opt_defaultValue) ? opt_defaultValue : '';

 ***REMOVED*****REMOVED*** @desc label for a dialog button.***REMOVED***
  var MSG_PROMPT_OK = goog.getMsg('OK');
 ***REMOVED*****REMOVED*** @desc label for a dialog button.***REMOVED***
  var MSG_PROMPT_CANCEL = goog.getMsg('Cancel');
  var buttonSet = new goog.ui.Dialog.ButtonSet(opt_domHelper);
  buttonSet.set(goog.ui.Dialog.DefaultButtonKeys.OK, MSG_PROMPT_OK, true);
  buttonSet.set(goog.ui.Dialog.DefaultButtonKeys.CANCEL,
      MSG_PROMPT_CANCEL, false, true);
  this.setButtonSet(buttonSet);
***REMOVED***
goog.inherits(goog.ui.Prompt, goog.ui.Dialog);


***REMOVED***
***REMOVED*** Callback function which is invoked with the response to the prompt
***REMOVED*** @type {Function}
***REMOVED*** @private
***REMOVED***
goog.ui.Prompt.prototype.callback_ = goog.nullFunction;


***REMOVED***
***REMOVED*** Default value to display in prompt window
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.Prompt.prototype.defaultValue_ = '';


***REMOVED***
***REMOVED*** Element in which user enters response (HTML <input> text box)
***REMOVED*** @type {HTMLInputElement}
***REMOVED*** @private
***REMOVED***
goog.ui.Prompt.prototype.userInputEl_ = null;


***REMOVED***
***REMOVED*** Tracks whether the prompt is in the process of closing to prevent multiple
***REMOVED*** calls to the callback when the user presses enter.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.Prompt.prototype.isClosing_ = false;


***REMOVED***
***REMOVED*** Number of rows in the user input element.
***REMOVED*** The default is 1 which means use an <input> element.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.Prompt.prototype.rows_ = 1;


***REMOVED***
***REMOVED*** Number of cols in the user input element.
***REMOVED*** The default is 0 which means use browser default.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.Prompt.prototype.cols_ = 0;


***REMOVED***
***REMOVED*** The input decorator function.
***REMOVED*** @type {function(Element)?}
***REMOVED*** @private
***REMOVED***
goog.ui.Prompt.prototype.inputDecoratorFn_ = null;


***REMOVED***
***REMOVED*** A validation function that takes a string and returns true if the string is
***REMOVED*** accepted, false otherwise.
***REMOVED*** @type {function(string):boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.Prompt.prototype.validationFn_ = goog.functions.TRUE;


***REMOVED***
***REMOVED*** Sets the validation function that takes a string and returns true if the
***REMOVED*** string is accepted, false otherwise.
***REMOVED*** @param {function(string): boolean} fn The validation function to use on user
***REMOVED***     input.
***REMOVED***
goog.ui.Prompt.prototype.setValidationFunction = function(fn) {
  this.validationFn_ = fn;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.Prompt.prototype.enterDocument = function() {
  if (this.inputDecoratorFn_) {
    this.inputDecoratorFn_(this.userInputEl_);
  }
  goog.ui.Prompt.superClass_.enterDocument.call(this);
  this.getHandler().listen(this,
      goog.ui.Dialog.EventType.SELECT, this.onPromptExit_);

  this.getHandler().listen(this.userInputEl_,
      [goog.events.EventType.KEYUP, goog.events.EventType.CHANGE],
      this.handleInputChanged_);
***REMOVED***


***REMOVED***
***REMOVED*** @return {HTMLInputElement} The user input element. May be null if the Prompt
***REMOVED***     has not been rendered.
***REMOVED***
goog.ui.Prompt.prototype.getInputElement = function() {
  return this.userInputEl_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets an input decorator function.  This function will be called in
***REMOVED*** #enterDocument and will be passed the input element.  This is useful for
***REMOVED*** attaching handlers to the input element for specific change events,
***REMOVED*** for example.
***REMOVED*** @param {function(Element)} inputDecoratorFn A function to call on the input
***REMOVED***     element on #enterDocument.
***REMOVED***
goog.ui.Prompt.prototype.setInputDecoratorFn = function(inputDecoratorFn) {
  this.inputDecoratorFn_ = inputDecoratorFn;
***REMOVED***


***REMOVED***
***REMOVED*** Set the number of rows in the user input element.
***REMOVED*** A values of 1 means use an <input> element.  If the prompt is already
***REMOVED*** rendered then you cannot change from <input> to <textarea> or vice versa.
***REMOVED*** @param {number} rows Number of rows for user input element.
***REMOVED*** @throws {goog.ui.Component.Error.ALREADY_RENDERED} If the component is
***REMOVED***    already rendered and an attempt to change between <input> and <textarea>
***REMOVED***    is made.
***REMOVED***
goog.ui.Prompt.prototype.setRows = function(rows) {
  if (this.isInDocument()) {
    if (this.userInputEl_.tagName.toLowerCase() == 'input') {
      if (rows > 1) {
        throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
      }
    } else {
      if (rows <= 1) {
        throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
      }
      this.userInputEl_.rows = rows;
    }
  }
  this.rows_ = rows;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of rows in the user input element.
***REMOVED***
goog.ui.Prompt.prototype.getRows = function() {
  return this.rows_;
***REMOVED***


***REMOVED***
***REMOVED*** Set the number of cols in the user input element.
***REMOVED*** @param {number} cols Number of cols for user input element.
***REMOVED***
goog.ui.Prompt.prototype.setCols = function(cols) {
  this.cols_ = cols;
  if (this.userInputEl_) {
    if (this.userInputEl_.tagName.toLowerCase() == 'input') {
      this.userInputEl_.size = cols;
    } else {
      this.userInputEl_.cols = cols;
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of cols in the user input element.
***REMOVED***
goog.ui.Prompt.prototype.getCols = function() {
  return this.cols_;
***REMOVED***


***REMOVED***
***REMOVED*** Create the initial DOM representation for the prompt.
***REMOVED*** @override
***REMOVED***
goog.ui.Prompt.prototype.createDom = function() {
  goog.ui.Prompt.superClass_.createDom.call(this);

  var cls = this.getClass();

  // add input box to the content
  var attrs = {
    'className': goog.getCssName(cls, 'userInput'),
    'value': this.defaultValue_***REMOVED***
  if (this.rows_ == 1) {
    // If rows == 1 then use an input element.
    this.userInputEl_ =***REMOVED*****REMOVED*** @type {HTMLInputElement}***REMOVED***
        (this.getDomHelper().createDom('input', attrs));
    this.userInputEl_.type = 'text';
    if (this.cols_) {
      this.userInputEl_.size = this.cols_;
    }
  } else {
    // If rows > 1 then use a textarea.
    this.userInputEl_ =***REMOVED*****REMOVED*** @type {HTMLInputElement}***REMOVED***
        (this.getDomHelper().createDom('textarea', attrs));
    this.userInputEl_.rows = this.rows_;
    if (this.cols_) {
      this.userInputEl_.cols = this.cols_;
    }
  }

  this.userInputEl_.id = this.inputElementId_;
  var contentEl = this.getContentElement();
  contentEl.appendChild(this.getDomHelper().createDom(
      'div', {'style': 'overflow: auto'}, this.userInputEl_));
***REMOVED***


***REMOVED***
***REMOVED*** Handles input change events on the input field.  Disables the OK button if
***REMOVED*** validation fails on the new input value.
***REMOVED*** @private
***REMOVED***
goog.ui.Prompt.prototype.handleInputChanged_ = function() {
  this.updateOkButtonState_();
***REMOVED***


***REMOVED***
***REMOVED*** Set OK button enabled/disabled state based on input.
***REMOVED*** @private
***REMOVED***
goog.ui.Prompt.prototype.updateOkButtonState_ = function() {
  var enableOkButton = this.validationFn_(this.userInputEl_.value);
  var buttonSet = this.getButtonSet();
  buttonSet.setButtonEnabled(goog.ui.Dialog.DefaultButtonKeys.OK,
      enableOkButton);
***REMOVED***


***REMOVED***
***REMOVED*** Causes the prompt to appear, centered on the screen, gives focus
***REMOVED*** to the text box, and selects the text
***REMOVED*** @param {boolean} visible Whether the dialog should be visible.
***REMOVED*** @override
***REMOVED***
goog.ui.Prompt.prototype.setVisible = function(visible) {
  goog.ui.Prompt.base(this, 'setVisible', visible);

  if (visible) {
    this.isClosing_ = false;
    this.userInputEl_.value = this.defaultValue_;
    this.focus();
    this.updateOkButtonState_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Overrides setFocus to put focus on the input element.
***REMOVED*** @override
***REMOVED***
goog.ui.Prompt.prototype.focus = function() {
  goog.ui.Prompt.base(this, 'focus');

  if (goog.userAgent.OPERA) {
    // select() doesn't focus <input> elements in Opera.
    this.userInputEl_.focus();
  }
  this.userInputEl_.select();
***REMOVED***


***REMOVED***
***REMOVED*** Sets the default value of the prompt when it is displayed.
***REMOVED*** @param {string} defaultValue The default value to display.
***REMOVED***
goog.ui.Prompt.prototype.setDefaultValue = function(defaultValue) {
  this.defaultValue_ = defaultValue;
***REMOVED***


***REMOVED***
***REMOVED*** Handles the closing of the prompt, invoking the callback function that was
***REMOVED*** registered to handle the value returned by the prompt.
***REMOVED*** @param {goog.ui.Dialog.Event} e The dialog's selection event.
***REMOVED*** @private
***REMOVED***
goog.ui.Prompt.prototype.onPromptExit_ = function(e) {
  /*
  ***REMOVED*** The timeouts below are required for one edge case. If after the dialog
  ***REMOVED*** hides, suppose validation of the input fails which displays an alert. If
  ***REMOVED*** the user pressed the Enter key to dismiss the alert that was displayed it
  ***REMOVED*** can trigger the event handler a second time. This timeout ensures that the
  ***REMOVED*** alert is displayed only after the prompt is able to clean itself up.
 ***REMOVED*****REMOVED***
  if (!this.isClosing_) {
    this.isClosing_ = true;
    if (e.key == 'ok') {
      goog.Timer.callOnce(
          goog.bind(this.callback_, this, this.userInputEl_.value), 1);
    } else {
      goog.Timer.callOnce(goog.bind(this.callback_, this, null), 1);
    }
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.Prompt.prototype.disposeInternal = function() {
  goog.dom.removeNode(this.userInputEl_);

  goog.events.unlisten(this, goog.ui.Dialog.EventType.SELECT,
      this.onPromptExit_, true, this);

  goog.ui.Prompt.superClass_.disposeInternal.call(this);

  this.defaulValue_ = null;
  this.userInputEl_ = null;
***REMOVED***
