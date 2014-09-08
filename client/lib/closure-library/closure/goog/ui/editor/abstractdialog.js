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
***REMOVED*** @fileoverview Wrapper around {@link goog.ui.Dialog}, to provide
***REMOVED*** dialogs that are smarter about interacting with a rich text editor.
***REMOVED***
***REMOVED***

goog.provide('goog.ui.editor.AbstractDialog');
goog.provide('goog.ui.editor.AbstractDialog.Builder');
goog.provide('goog.ui.editor.AbstractDialog.EventType');

goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.events.EventTarget');
goog.require('goog.string');
goog.require('goog.ui.Dialog');


***REMOVED****REMOVED****REMOVED***** Public interface***REMOVED******************************************************* //



***REMOVED***
***REMOVED*** Creates an object that represents a dialog box.
***REMOVED*** @param {goog.dom.DomHelper} domHelper DomHelper to be used to create the
***REMOVED*** dialog's dom structure.
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
goog.ui.editor.AbstractDialog = function(domHelper) {
  goog.events.EventTarget.call(this);
  this.dom = domHelper;
***REMOVED***
goog.inherits(goog.ui.editor.AbstractDialog, goog.events.EventTarget);


***REMOVED***
***REMOVED*** Causes the dialog box to appear, centered on the screen. Lazily creates the
***REMOVED*** dialog if needed.
***REMOVED***
goog.ui.editor.AbstractDialog.prototype.show = function() {
  // Lazily create the wrapped dialog to be shown.
  if (!this.dialogInternal_) {
    this.dialogInternal_ = this.createDialogControl();
    this.dialogInternal_.listen(goog.ui.Dialog.EventType.AFTER_HIDE,
        this.handleAfterHide_, false, this);
  }

  this.dialogInternal_.setVisible(true);
***REMOVED***


***REMOVED***
***REMOVED*** Hides the dialog, causing AFTER_HIDE to fire.
***REMOVED***
goog.ui.editor.AbstractDialog.prototype.hide = function() {
  if (this.dialogInternal_) {
    // This eventually fires the wrapped dialog's AFTER_HIDE event, calling our
    // handleAfterHide_().
    this.dialogInternal_.setVisible(false);
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the dialog is open.
***REMOVED***
goog.ui.editor.AbstractDialog.prototype.isOpen = function() {
  return !!this.dialogInternal_ && this.dialogInternal_.isVisible();
***REMOVED***


***REMOVED***
***REMOVED*** Runs the handler registered on the OK button event and closes the dialog if
***REMOVED*** that handler succeeds.
***REMOVED*** This is useful in cases such as double-clicking an item in the dialog is
***REMOVED*** equivalent to selecting it and clicking the default button.
***REMOVED*** @protected
***REMOVED***
goog.ui.editor.AbstractDialog.prototype.processOkAndClose = function() {
  // Fake an OK event from the wrapped dialog control.
  var evt = new goog.ui.Dialog.Event(goog.ui.Dialog.DefaultButtonKeys.OK, null);
  if (this.handleOk(evt)) {
    // handleOk calls dispatchEvent, so if any listener calls preventDefault it
    // will return false and we won't hide the dialog.
    this.hide();
  }
***REMOVED***


***REMOVED****REMOVED****REMOVED***** Dialog events***REMOVED********************************************************** //


***REMOVED***
***REMOVED*** Event type constants for events the dialog fires.
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.editor.AbstractDialog.EventType = {
  // This event is fired after the dialog is hidden, no matter if it was closed
  // via OK or Cancel or is being disposed without being hidden first.
  AFTER_HIDE: 'afterhide',
  // Either the cancel or OK events can be canceled via preventDefault or by
  // returning false from their handlers to stop the dialog from closing.
  CANCEL: 'cancel',
  OK: 'ok'
***REMOVED***


***REMOVED****REMOVED****REMOVED***** Inner helper class***REMOVED***************************************************** //



***REMOVED***
***REMOVED*** A builder class for the dialog control. All methods except build return this.
***REMOVED*** @param {goog.ui.editor.AbstractDialog} editorDialog Editor dialog object
***REMOVED***     that will wrap the wrapped dialog object this builder will create.
***REMOVED***
***REMOVED***
goog.ui.editor.AbstractDialog.Builder = function(editorDialog) {
  // We require the editor dialog to be passed in so that the builder can set up
  // ok/cancel listeners by default, making it easier for most dialogs.
  this.editorDialog_ = editorDialog;
  this.wrappedDialog_ = new goog.ui.Dialog('', true, this.editorDialog_.dom);
  this.buttonSet_ = new goog.ui.Dialog.ButtonSet(this.editorDialog_.dom);
  this.buttonHandlers_ = {***REMOVED***
  this.addClassName(goog.getCssName('tr-dialog'));
***REMOVED***


***REMOVED***
***REMOVED*** Sets the title of the dialog.
***REMOVED*** @param {string} title Title HTML (escaped).
***REMOVED*** @return {!goog.ui.editor.AbstractDialog.Builder} This.
***REMOVED***
goog.ui.editor.AbstractDialog.Builder.prototype.setTitle = function(title) {
  this.wrappedDialog_.setTitle(title);
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Adds an OK button to the dialog. Clicking this button will cause {@link
***REMOVED*** handleOk} to run, subsequently dispatching an OK event.
***REMOVED*** @param {string=} opt_label The caption for the button, if not "OK".
***REMOVED*** @return {!goog.ui.editor.AbstractDialog.Builder} This.
***REMOVED***
goog.ui.editor.AbstractDialog.Builder.prototype.addOkButton =
    function(opt_label) {
  var key = goog.ui.Dialog.DefaultButtonKeys.OK;
 ***REMOVED*****REMOVED*** @desc Label for an OK button in an editor dialog.***REMOVED***
  var MSG_TR_DIALOG_OK = goog.getMsg('OK');
  // True means this is the default/OK button.
  this.buttonSet_.set(key, opt_label || MSG_TR_DIALOG_OK, true);
  this.buttonHandlers_[key] = goog.bind(this.editorDialog_.handleOk,
                                        this.editorDialog_);
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Adds a Cancel button to the dialog. Clicking this button will cause {@link
***REMOVED*** handleCancel} to run, subsequently dispatching a CANCEL event.
***REMOVED*** @param {string=} opt_label The caption for the button, if not "Cancel".
***REMOVED*** @return {!goog.ui.editor.AbstractDialog.Builder} This.
***REMOVED***
goog.ui.editor.AbstractDialog.Builder.prototype.addCancelButton =
    function(opt_label) {
  var key = goog.ui.Dialog.DefaultButtonKeys.CANCEL;
 ***REMOVED*****REMOVED*** @desc Label for a cancel button in an editor dialog.***REMOVED***
  var MSG_TR_DIALOG_CANCEL = goog.getMsg('Cancel');
  // False means it's not the OK button, true means it's the Cancel button.
  this.buttonSet_.set(key, opt_label || MSG_TR_DIALOG_CANCEL, false, true);
  this.buttonHandlers_[key] = goog.bind(this.editorDialog_.handleCancel,
                                        this.editorDialog_);
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Adds a custom button to the dialog.
***REMOVED*** @param {string} label The caption for the button.
***REMOVED*** @param {function(goog.ui.Dialog.EventType):*} handler Function called when
***REMOVED***     the button is clicked. It is recommended that this function be a method
***REMOVED***     in the concrete subclass of AbstractDialog using this Builder, and that
***REMOVED***     it dispatch an event (see {@link handleOk}).
***REMOVED*** @param {string=} opt_buttonId Identifier to be used to access the button when
***REMOVED***     calling AbstractDialog.getButtonElement().
***REMOVED*** @return {!goog.ui.editor.AbstractDialog.Builder} This.
***REMOVED***
goog.ui.editor.AbstractDialog.Builder.prototype.addButton =
    function(label, handler, opt_buttonId) {
  // We don't care what the key is, just that we can match the button with the
  // handler function later.
  var key = opt_buttonId || goog.string.createUniqueString();
  this.buttonSet_.set(key, label);
  this.buttonHandlers_[key] = handler;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Puts a CSS class on the dialog's main element.
***REMOVED*** @param {string} className The class to add.
***REMOVED*** @return {!goog.ui.editor.AbstractDialog.Builder} This.
***REMOVED***
goog.ui.editor.AbstractDialog.Builder.prototype.addClassName =
    function(className) {
  goog.dom.classlist.add(
      goog.asserts.assert(this.wrappedDialog_.getDialogElement()), className);
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the content element of the dialog.
***REMOVED*** @param {Element} contentElem An element for the main body.
***REMOVED*** @return {!goog.ui.editor.AbstractDialog.Builder} This.
***REMOVED***
goog.ui.editor.AbstractDialog.Builder.prototype.setContent =
    function(contentElem) {
  goog.dom.appendChild(this.wrappedDialog_.getContentElement(), contentElem);
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Builds the wrapped dialog control. May only be called once, after which
***REMOVED*** no more methods may be called on this builder.
***REMOVED*** @return {!goog.ui.Dialog} The wrapped dialog control.
***REMOVED***
goog.ui.editor.AbstractDialog.Builder.prototype.build = function() {
  if (this.buttonSet_.isEmpty()) {
    // If caller didn't set any buttons, add an OK and Cancel button by default.
    this.addOkButton();
    this.addCancelButton();
  }
  this.wrappedDialog_.setButtonSet(this.buttonSet_);

  var handlers = this.buttonHandlers_;
  this.buttonHandlers_ = null;
  this.wrappedDialog_.listen(goog.ui.Dialog.EventType.SELECT,
      // Listen for the SELECT event, which means a button was clicked, and
      // call the handler associated with that button via the key property.
      function(e) {
        if (handlers[e.key]) {
          return handlers[e.key](e);
        }
      });

  // All editor dialogs are modal.
  this.wrappedDialog_.setModal(true);

  var dialog = this.wrappedDialog_;
  this.wrappedDialog_ = null;
  return dialog;
***REMOVED***


***REMOVED***
***REMOVED*** Editor dialog that will wrap the wrapped dialog this builder will create.
***REMOVED*** @type {goog.ui.editor.AbstractDialog}
***REMOVED*** @private
***REMOVED***
goog.ui.editor.AbstractDialog.Builder.prototype.editorDialog_;


***REMOVED***
***REMOVED*** wrapped dialog control being built by this builder.
***REMOVED*** @type {goog.ui.Dialog}
***REMOVED*** @private
***REMOVED***
goog.ui.editor.AbstractDialog.Builder.prototype.wrappedDialog_;


***REMOVED***
***REMOVED*** Set of buttons to be added to the wrapped dialog control.
***REMOVED*** @type {goog.ui.Dialog.ButtonSet}
***REMOVED*** @private
***REMOVED***
goog.ui.editor.AbstractDialog.Builder.prototype.buttonSet_;


***REMOVED***
***REMOVED*** Map from keys that will be returned in the wrapped dialog SELECT events to
***REMOVED*** handler functions to be called to handle those events.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.ui.editor.AbstractDialog.Builder.prototype.buttonHandlers_;


***REMOVED****REMOVED****REMOVED***** Protected interface***REMOVED**************************************************** //


***REMOVED***
***REMOVED*** The DOM helper for the parent document.
***REMOVED*** @type {goog.dom.DomHelper}
***REMOVED*** @protected
***REMOVED***
goog.ui.editor.AbstractDialog.prototype.dom;


***REMOVED***
***REMOVED*** Creates and returns the goog.ui.Dialog control that is being wrapped
***REMOVED*** by this object.
***REMOVED*** @return {!goog.ui.Dialog} Created Dialog control.
***REMOVED*** @protected
***REMOVED***
goog.ui.editor.AbstractDialog.prototype.createDialogControl =
    goog.abstractMethod;


***REMOVED***
***REMOVED*** Returns the HTML Button element for the OK button in this dialog.
***REMOVED*** @return {Element} The button element if found, else null.
***REMOVED*** @protected
***REMOVED***
goog.ui.editor.AbstractDialog.prototype.getOkButtonElement = function() {
  return this.getButtonElement(goog.ui.Dialog.DefaultButtonKeys.OK);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the HTML Button element for the Cancel button in this dialog.
***REMOVED*** @return {Element} The button element if found, else null.
***REMOVED*** @protected
***REMOVED***
goog.ui.editor.AbstractDialog.prototype.getCancelButtonElement = function() {
  return this.getButtonElement(goog.ui.Dialog.DefaultButtonKeys.CANCEL);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the HTML Button element for the button added to this dialog with
***REMOVED*** the given button id.
***REMOVED*** @param {string} buttonId The id of the button to get.
***REMOVED*** @return {Element} The button element if found, else null.
***REMOVED*** @protected
***REMOVED***
goog.ui.editor.AbstractDialog.prototype.getButtonElement = function(buttonId) {
  return this.dialogInternal_.getButtonSet().getButton(buttonId);
***REMOVED***


***REMOVED***
***REMOVED*** Creates and returns the event object to be used when dispatching the OK
***REMOVED*** event to listeners, or returns null to prevent the dialog from closing.
***REMOVED*** Subclasses should override this to return their own subclass of
***REMOVED*** goog.events.Event that includes all data a plugin would need from the dialog.
***REMOVED*** @param {goog.events.Event} e The event object dispatched by the wrapped
***REMOVED***     dialog.
***REMOVED*** @return {goog.events.Event} The event object to be used when dispatching the
***REMOVED***     OK event to listeners.
***REMOVED*** @protected
***REMOVED***
goog.ui.editor.AbstractDialog.prototype.createOkEvent = goog.abstractMethod;


***REMOVED***
***REMOVED*** Handles the event dispatched by the wrapped dialog control when the user
***REMOVED*** clicks the OK button. Attempts to create the OK event object and dispatches
***REMOVED*** it if successful.
***REMOVED*** @param {goog.ui.Dialog.Event} e wrapped dialog OK event object.
***REMOVED*** @return {boolean} Whether the default action (closing the dialog) should
***REMOVED***     still be executed. This will be false if the OK event could not be
***REMOVED***     created to be dispatched, or if any listener to that event returs false
***REMOVED***     or calls preventDefault.
***REMOVED*** @protected
***REMOVED***
goog.ui.editor.AbstractDialog.prototype.handleOk = function(e) {
  var eventObj = this.createOkEvent(e);
  if (eventObj) {
    return this.dispatchEvent(eventObj);
  } else {
    return false;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles the event dispatched by the wrapped dialog control when the user
***REMOVED*** clicks the Cancel button. Simply dispatches a CANCEL event.
***REMOVED*** @return {boolean} Returns false if any of the handlers called prefentDefault
***REMOVED***     on the event or returned false themselves.
***REMOVED*** @protected
***REMOVED***
goog.ui.editor.AbstractDialog.prototype.handleCancel = function() {
  return this.dispatchEvent(goog.ui.editor.AbstractDialog.EventType.CANCEL);
***REMOVED***


***REMOVED***
***REMOVED*** Disposes of the dialog. If the dialog is open, it will be hidden and
***REMOVED*** AFTER_HIDE will be dispatched.
***REMOVED*** @override
***REMOVED*** @protected
***REMOVED***
goog.ui.editor.AbstractDialog.prototype.disposeInternal = function() {
  if (this.dialogInternal_) {
    this.hide();

    this.dialogInternal_.dispose();
    this.dialogInternal_ = null;
  }

  goog.ui.editor.AbstractDialog.superClass_.disposeInternal.call(this);
***REMOVED***


***REMOVED****REMOVED****REMOVED***** Private implementation***REMOVED************************************************* //


***REMOVED***
***REMOVED*** The wrapped dialog widget.
***REMOVED*** @type {goog.ui.Dialog}
***REMOVED*** @private
***REMOVED***
goog.ui.editor.AbstractDialog.prototype.dialogInternal_;


***REMOVED***
***REMOVED*** Cleans up after the dialog is hidden and fires the AFTER_HIDE event. Should
***REMOVED*** be a listener for the wrapped dialog's AFTER_HIDE event.
***REMOVED*** @private
***REMOVED***
goog.ui.editor.AbstractDialog.prototype.handleAfterHide_ = function() {
  this.dispatchEvent(goog.ui.editor.AbstractDialog.EventType.AFTER_HIDE);
***REMOVED***
