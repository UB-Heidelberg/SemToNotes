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

goog.provide('goog.ui.equation.EquationEditorDialog');

goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.ui.Dialog');
goog.require('goog.ui.equation.EquationEditor');
goog.require('goog.ui.equation.PaletteManager');
goog.require('goog.ui.equation.TexEditor');



***REMOVED***
***REMOVED*** User interface for equation editor plugin standalone tests.
***REMOVED***
***REMOVED*** @param {string=} opt_equation Encoded equation. If not specified, starts with
***REMOVED***     an empty equation.
***REMOVED*** @extends {goog.ui.Dialog}
***REMOVED*** @final
***REMOVED***
goog.ui.equation.EquationEditorDialog = function(opt_equation) {
  goog.ui.Dialog.call(this);
  this.setTitle('Equation Editor');

  var buttonSet = new goog.ui.Dialog.ButtonSet();
  buttonSet.set(goog.ui.Dialog.DefaultButtonKeys.OK,
      opt_equation ? 'Save changes' : 'Insert equation',
      true);
  buttonSet.set(goog.ui.Dialog.DefaultButtonKeys.CANCEL,
      'Cancel', false, true);
  this.setButtonSet(buttonSet);

  // Create the main editor contents.
  var contentElement = this.getContentElement();
  var domHelper = goog.dom.getDomHelper(contentElement);
  var context = this.populateContext_();

 ***REMOVED*****REMOVED***
  ***REMOVED*** The equation editor main API.
  ***REMOVED*** @type {goog.ui.equation.TexEditor}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.equationEditor_ =
      new goog.ui.equation.TexEditor(context, '', domHelper);

  this.equationEditor_.addEventListener(
      goog.ui.equation.EquationEditor.EventType.CHANGE,
      this.onChange_, false, this);

  this.equationEditor_.render(this.getContentElement());
  this.setEquation(opt_equation || '');

  goog.dom.classlist.add(
      goog.asserts.assert(this.getDialogElement()), 'ee-modal-dialog');
***REMOVED***
goog.inherits(goog.ui.equation.EquationEditorDialog, goog.ui.Dialog);


***REMOVED***
***REMOVED*** The dialog's OK button element.
***REMOVED*** @type {Element?}
***REMOVED*** @private
***REMOVED***
goog.ui.equation.EquationEditorDialog.prototype.okButton_;


***REMOVED*** @override***REMOVED***
goog.ui.equation.EquationEditorDialog.prototype.setVisible = function(visible) {
  goog.ui.equation.EquationEditorDialog.base(this, 'setVisible', visible);
  this.equationEditor_.setVisible(visible);
***REMOVED***


***REMOVED***
***REMOVED*** Populates the context of this dialog.
***REMOVED*** @return {!Object} The context that this dialog runs in.
***REMOVED*** @private
***REMOVED***
goog.ui.equation.EquationEditorDialog.prototype.populateContext_ = function() {
  var context = {***REMOVED***
  context.paletteManager = new goog.ui.equation.PaletteManager(
      this.getDomHelper());
  return context;
***REMOVED***


***REMOVED***
***REMOVED*** Handles CHANGE event fired when user changes equation.
***REMOVED*** @param {goog.ui.equation.ChangeEvent} e The event object.
***REMOVED*** @private
***REMOVED***
goog.ui.equation.EquationEditorDialog.prototype.onChange_ = function(e) {
  if (!this.okButton_) {
    this.okButton_ = this.getButtonSet().getButton(
        goog.ui.Dialog.DefaultButtonKeys.OK);
  }
  this.okButton_.disabled = !e.isValid;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the encoded equation.
***REMOVED*** @return {string} The encoded equation.
***REMOVED***
goog.ui.equation.EquationEditorDialog.prototype.getEquation = function() {
  return this.equationEditor_.getEquation();
***REMOVED***


***REMOVED***
***REMOVED*** Sets the encoded equation.
***REMOVED*** @param {string} equation The encoded equation.
***REMOVED***
goog.ui.equation.EquationEditorDialog.prototype.setEquation =
    function(equation) {
  this.equationEditor_.setEquation(equation);
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The html code to embed in the document.
***REMOVED***
goog.ui.equation.EquationEditorDialog.prototype.getHtml = function() {
  return this.equationEditor_.getHtml();
***REMOVED***

