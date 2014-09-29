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
***REMOVED*** @fileoverview An abstract superclass for TrogEdit dialog plugins. Each
***REMOVED*** Trogedit dialog has its own plugin.
***REMOVED***
***REMOVED*** @author nicksantos@google.com (Nick Santos)
***REMOVED*** @author marcosalmeida@google.com (Marcos Almeida)
***REMOVED***

goog.provide('goog.editor.plugins.AbstractDialogPlugin');
goog.provide('goog.editor.plugins.AbstractDialogPlugin.EventType');

goog.require('goog.dom');
goog.require('goog.dom.Range');
goog.require('goog.editor.Field.EventType');
goog.require('goog.editor.Plugin');
goog.require('goog.editor.range');
***REMOVED***
goog.require('goog.ui.editor.AbstractDialog.EventType');


***REMOVED****REMOVED****REMOVED***** Public interface***REMOVED******************************************************* //



***REMOVED***
***REMOVED*** An abstract superclass for a Trogedit plugin that creates exactly one
***REMOVED*** dialog. By default dialogs are not reused -- each time execCommand is called,
***REMOVED*** a new instance of the dialog object is created (and the old one disposed of).
***REMOVED*** To enable reusing of the dialog object, subclasses should call
***REMOVED*** setReuseDialog() after calling the superclass constructor.
***REMOVED*** @param {string} command The command that this plugin handles.
***REMOVED***
***REMOVED*** @extends {goog.editor.Plugin}
***REMOVED***
goog.editor.plugins.AbstractDialogPlugin = function(command) {
  goog.editor.Plugin.call(this);
  this.command_ = command;
***REMOVED***
goog.inherits(goog.editor.plugins.AbstractDialogPlugin, goog.editor.Plugin);


***REMOVED*** @override***REMOVED***
goog.editor.plugins.AbstractDialogPlugin.prototype.isSupportedCommand =
    function(command) {
  return command == this.command_;
***REMOVED***


***REMOVED***
***REMOVED*** Handles execCommand. Dialog plugins don't make any changes when they open a
***REMOVED*** dialog, just when the dialog closes (because only modal dialogs are
***REMOVED*** supported). Hence this method does not dispatch the change events that the
***REMOVED*** superclass method does.
***REMOVED*** @param {string} command The command to execute.
***REMOVED*** @param {...*} var_args Any additional parameters needed to
***REMOVED***     execute the command.
***REMOVED*** @return {*} The result of the execCommand, if any.
***REMOVED*** @override
***REMOVED***
goog.editor.plugins.AbstractDialogPlugin.prototype.execCommand = function(
    command, var_args) {
  return this.execCommandInternal.apply(this, arguments);
***REMOVED***


***REMOVED****REMOVED****REMOVED***** Events***REMOVED***************************************************************** //


***REMOVED***
***REMOVED*** Event type constants for events the dialog plugins fire.
***REMOVED*** @enum {string}
***REMOVED***
goog.editor.plugins.AbstractDialogPlugin.EventType = {
  // This event is fired when a dialog has been opened.
  OPENED: 'dialogOpened',
  // This event is fired when a dialog has been closed.
  CLOSED: 'dialogClosed'
***REMOVED***


***REMOVED****REMOVED****REMOVED***** Protected interface***REMOVED**************************************************** //


***REMOVED***
***REMOVED*** Creates a new instance of this plugin's dialog. Must be overridden by
***REMOVED*** subclasses.
***REMOVED*** @param {!goog.dom.DomHelper} dialogDomHelper The dom helper to be used to
***REMOVED***     create the dialog.
***REMOVED*** @param {*=} opt_arg The dialog specific argument. Concrete subclasses should
***REMOVED***     declare a specific type.
***REMOVED*** @return {goog.ui.editor.AbstractDialog} The newly created dialog.
***REMOVED*** @protected
***REMOVED***
goog.editor.plugins.AbstractDialogPlugin.prototype.createDialog =
    goog.abstractMethod;


***REMOVED***
***REMOVED*** Returns the current dialog that was created and opened by this plugin.
***REMOVED*** @return {goog.ui.editor.AbstractDialog} The current dialog that was created
***REMOVED***     and opened by this plugin.
***REMOVED*** @protected
***REMOVED***
goog.editor.plugins.AbstractDialogPlugin.prototype.getDialog = function() {
  return this.dialog_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether this plugin should reuse the same instance of the dialog each
***REMOVED*** time execCommand is called or create a new one. This is intended for use by
***REMOVED*** subclasses only, hence protected.
***REMOVED*** @param {boolean} reuse Whether to reuse the dialog.
***REMOVED*** @protected
***REMOVED***
goog.editor.plugins.AbstractDialogPlugin.prototype.setReuseDialog =
    function(reuse) {
  this.reuseDialog_ = reuse;
***REMOVED***


***REMOVED***
***REMOVED*** Handles execCommand by opening the dialog. Dispatches
***REMOVED*** {@link goog.editor.plugins.AbstractDialogPlugin.EventType.OPENED} after the
***REMOVED*** dialog is shown.
***REMOVED*** @param {string} command The command to execute.
***REMOVED*** @param {*=} opt_arg The dialog specific argument. Should be the same as
***REMOVED***     {@link createDialog}.
***REMOVED*** @return {*} Always returns true, indicating the dialog was shown.
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.editor.plugins.AbstractDialogPlugin.prototype.execCommandInternal =
    function(command, opt_arg) {
  // If this plugin should not reuse dialog instances, first dispose of the
  // previous dialog.
  if (!this.reuseDialog_) {
    this.disposeDialog_();
  }
  // If there is no dialog yet (or we aren't reusing the previous one), create
  // one.
  if (!this.dialog_) {
    this.dialog_ = this.createDialog(
        // TODO(user): Add Field.getAppDomHelper. (Note dom helper will
        // need to be updated if setAppWindow is called by clients.)
        goog.dom.getDomHelper(this.getFieldObject().getAppWindow()),
        opt_arg);
  }

  // Since we're opening a dialog, we need to clear the selection because the
  // focus will be going to the dialog, and if we leave an selection in the
  // editor while another selection is active in the dialog as the user is
  // typing, some browsers will screw up the original selection. But first we
  // save it so we can restore it when the dialog closes.
  // getRange may return null if there is no selection in the field.
  var tempRange = this.getFieldObject().getRange();
  // saveUsingDom() did not work as well as saveUsingNormalizedCarets(),
  // not sure why.
  this.savedRange_ = tempRange && goog.editor.range.saveUsingNormalizedCarets(
      tempRange);
  goog.dom.Range.clearSelection(
      this.getFieldObject().getEditableDomHelper().getWindow());

  // Listen for the dialog closing so we can clean up.
  goog.events.listenOnce(this.dialog_,
      goog.ui.editor.AbstractDialog.EventType.AFTER_HIDE,
      this.handleAfterHide,
      false,
      this);

  this.getFieldObject().setModalMode(true);
  this.dialog_.show();
  this.dispatchEvent(goog.editor.plugins.AbstractDialogPlugin.EventType.OPENED);

  // Since the selection has left the document, dispatch a selection
  // change event.
  this.getFieldObject().dispatchSelectionChangeEvent();

  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Cleans up after the dialog has closed, including restoring the selection to
***REMOVED*** what it was before the dialog was opened. If a subclass modifies the editable
***REMOVED*** field's content such that the original selection is no longer valid (usually
***REMOVED*** the case when the user clicks OK, and sometimes also on Cancel), it is that
***REMOVED*** subclass' responsibility to place the selection in the desired place during
***REMOVED*** the OK or Cancel (or other) handler. In that case, this method will leave the
***REMOVED*** selection in place.
***REMOVED*** @param {goog.events.Event} e The AFTER_HIDE event object.
***REMOVED*** @protected
***REMOVED***
goog.editor.plugins.AbstractDialogPlugin.prototype.handleAfterHide = function(
    e) {
  this.getFieldObject().setModalMode(false);
  this.restoreOriginalSelection();

  if (!this.reuseDialog_) {
    this.disposeDialog_();
  }

  this.dispatchEvent(goog.editor.plugins.AbstractDialogPlugin.EventType.CLOSED);

  // Since the selection has returned to the document, dispatch a selection
  // change event.
  this.getFieldObject().dispatchSelectionChangeEvent();

  // When the dialog closes due to pressing enter or escape, that happens on the
  // keydown event. But the browser will still fire a keyup event after that,
  // which is caught by the editable field and causes it to try to fire a
  // selection change event. To avoid that, we "debounce" the selection change
  // event, meaning the editable field will not fire that event if the keyup
  // that caused it immediately after this dialog was hidden ("immediately"
  // means a small number of milliseconds defined by the editable field).
  this.getFieldObject().debounceEvent(
      goog.editor.Field.EventType.SELECTIONCHANGE);
***REMOVED***


***REMOVED***
***REMOVED*** Restores the selection in the editable field to what it was before the dialog
***REMOVED*** was opened. This is not guaranteed to work if the contents of the field
***REMOVED*** have changed.
***REMOVED*** @protected
***REMOVED***
goog.editor.plugins.AbstractDialogPlugin.prototype.restoreOriginalSelection =
    function() {
  this.getFieldObject().restoreSavedRange(this.savedRange_);
  this.savedRange_ = null;
***REMOVED***


***REMOVED***
***REMOVED*** Cleans up the structure used to save the original selection before the dialog
***REMOVED*** was opened. Should be used by subclasses that don't restore the original
***REMOVED*** selection via restoreOriginalSelection.
***REMOVED*** @protected
***REMOVED***
goog.editor.plugins.AbstractDialogPlugin.prototype.disposeOriginalSelection =
    function() {
  if (this.savedRange_) {
    this.savedRange_.dispose();
    this.savedRange_ = null;
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.editor.plugins.AbstractDialogPlugin.prototype.disposeInternal =
    function() {
  this.disposeDialog_();
  goog.base(this, 'disposeInternal');
***REMOVED***


***REMOVED****REMOVED****REMOVED***** Private implementation***REMOVED************************************************* //


***REMOVED***
***REMOVED*** The command that this plugin handles.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.AbstractDialogPlugin.prototype.command_;


***REMOVED***
***REMOVED*** The current dialog that was created and opened by this plugin.
***REMOVED*** @type {goog.ui.editor.AbstractDialog}
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.AbstractDialogPlugin.prototype.dialog_;


***REMOVED***
***REMOVED*** Whether this plugin should reuse the same instance of the dialog each time
***REMOVED*** execCommand is called or create a new one.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.AbstractDialogPlugin.prototype.reuseDialog_ = false;


***REMOVED***
***REMOVED*** Mutex to prevent recursive calls to disposeDialog_.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.AbstractDialogPlugin.prototype.isDisposingDialog_ = false;


***REMOVED***
***REMOVED*** SavedRange representing the selection before the dialog was opened.
***REMOVED*** @type {goog.dom.SavedRange}
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.AbstractDialogPlugin.prototype.savedRange_;


***REMOVED***
***REMOVED*** Disposes of the dialog if needed. It is this abstract class' responsibility
***REMOVED*** to dispose of the dialog. The "if needed" refers to the fact this method
***REMOVED*** might be called twice (nested calls, not sequential) in the dispose flow, so
***REMOVED*** if the dialog was already disposed once it should not be disposed again.
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.AbstractDialogPlugin.prototype.disposeDialog_ = function() {
  // Wrap disposing the dialog in a mutex. Otherwise disposing it would cause it
  // to get hidden (if it is still open) and fire AFTER_HIDE, which in
  // turn would cause the dialog to be disposed again (closure only flags an
  // object as disposed after the dispose call chain completes, so it doesn't
  // prevent recursive dispose calls).
  if (this.dialog_ && !this.isDisposingDialog_) {
    this.isDisposingDialog_ = true;
    this.dialog_.dispose();
    this.dialog_ = null;
    this.isDisposingDialog_ = false;
  }
***REMOVED***
