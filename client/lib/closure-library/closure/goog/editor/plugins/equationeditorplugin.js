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

goog.provide('goog.editor.plugins.EquationEditorPlugin');

goog.require('goog.dom');
goog.require('goog.editor.Command');
goog.require('goog.editor.plugins.AbstractDialogPlugin');
goog.require('goog.editor.range');
***REMOVED***
***REMOVED***
goog.require('goog.functions');
goog.require('goog.log');
goog.require('goog.ui.editor.AbstractDialog');
goog.require('goog.ui.editor.EquationEditorDialog');
goog.require('goog.ui.equation.ImageRenderer');
goog.require('goog.ui.equation.PaletteManager');



***REMOVED***
***REMOVED*** A plugin that opens the equation editor in a dialog window.
***REMOVED*** @param {string=} opt_helpUrl A URL pointing to help documentation.
***REMOVED***
***REMOVED*** @extends {goog.editor.plugins.AbstractDialogPlugin}
***REMOVED*** @final
***REMOVED***
goog.editor.plugins.EquationEditorPlugin = function(opt_helpUrl) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The IMG element for the equation being edited, null if creating a new
  ***REMOVED*** equation.
  ***REMOVED*** @type {Element}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.originalElement_;

 ***REMOVED*****REMOVED***
  ***REMOVED*** A URL pointing to help documentation.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.helpUrl_ = opt_helpUrl || '';

 ***REMOVED*****REMOVED***
  ***REMOVED*** The listener key for double click events.
  ***REMOVED*** @type {goog.events.Key}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.dblClickKey_;

  goog.editor.plugins.AbstractDialogPlugin.call(this,
      goog.editor.Command.EQUATION);
***REMOVED***
goog.inherits(goog.editor.plugins.EquationEditorPlugin,
    goog.editor.plugins.AbstractDialogPlugin);


***REMOVED***
***REMOVED*** The logger for the EquationEditorPlugin.
***REMOVED*** @type {goog.log.Logger}
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.EquationEditorPlugin.prototype.logger_ =
    goog.log.getLogger('goog.editor.plugins.EquationEditorPlugin');


***REMOVED*** @override***REMOVED***
goog.editor.plugins.EquationEditorPlugin.prototype.getTrogClassId =
    goog.functions.constant('EquationEditorPlugin');


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.editor.plugins.EquationEditorPlugin.prototype.createDialog =
    function(dom, opt_arg) {
  var equationImgEl =***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (opt_arg || null);

  var equationStr = equationImgEl ?
      goog.ui.equation.ImageRenderer.getEquationFromImage(equationImgEl) : '';

  this.originalElement_ = equationImgEl;
  var dialog = new goog.ui.editor.EquationEditorDialog(
      this.populateContext_(dom), dom, equationStr, this.helpUrl_);
  dialog.addEventListener(goog.ui.editor.AbstractDialog.EventType.OK,
      this.handleOk_,
      false,
      this);
  return dialog;
***REMOVED***


***REMOVED***
***REMOVED*** Populates the context that this plugin runs in.
***REMOVED*** @param {!goog.dom.DomHelper} domHelper The dom helper to be used for the
***REMOVED***     palette manager.
***REMOVED*** @return {!Object} The context that this plugin runs in.
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.EquationEditorPlugin.prototype.populateContext_ =
    function(domHelper) {
  var context = {***REMOVED***
  context.paletteManager = new goog.ui.equation.PaletteManager(domHelper);
  return context;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the selected text in the editable field for using as initial
***REMOVED*** equation string for the equation editor.
***REMOVED***
***REMOVED*** TODO(user): Sanity check the selected text and return it only if it
***REMOVED***     reassembles a TeX equation and is not too long.
***REMOVED***
***REMOVED*** @return {string} Selected text in the editable field for using it as
***REMOVED***     initial equation string for the equation editor.
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.EquationEditorPlugin.prototype.getEquationFromSelection_ =
    function() {
  var range = this.getFieldObject().getRange();
  if (range) {
    return range.getText();
  }

  return '';
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.editor.plugins.EquationEditorPlugin.prototype.enable =
    function(fieldObject) {
  goog.editor.plugins.EquationEditorPlugin.base(this, 'enable', fieldObject);
  if (this.isEnabled(fieldObject)) {
    this.dblClickKey_ = goog.events.listen(fieldObject.getElement(),
        goog.events.EventType.DBLCLICK,
        goog.bind(this.handleDoubleClick_, this), false, this);
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.editor.plugins.EquationEditorPlugin.prototype.disable =
    function(fieldObject) {
  goog.editor.plugins.EquationEditorPlugin.base(this, 'disable', fieldObject);
  if (!this.isEnabled(fieldObject)) {
    goog.events.unlistenByKey(this.dblClickKey_);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles double clicks in the field area.
***REMOVED*** @param {goog.events.Event} e The event.
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.EquationEditorPlugin.prototype.handleDoubleClick_ =
    function(e) {
  var node =***REMOVED*****REMOVED*** @type {Node}***REMOVED*** (e.target);
  this.execCommand(goog.editor.Command.EQUATION, node);
***REMOVED***


***REMOVED***
***REMOVED*** Called when user clicks OK. Inserts the equation at cursor position in the
***REMOVED*** active editable field.
***REMOVED*** @param {goog.ui.editor.EquationEditorOkEvent} e The OK event.
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.EquationEditorPlugin.prototype.handleOk_ =
    function(e) {
  // First restore the selection so we can manipulate the editable field's
  // content according to what was selected.
  this.restoreOriginalSelection();

  // Notify listeners that the editable field's contents are about to change.
  this.getFieldObject().dispatchBeforeChange();

  var dh = this.getFieldDomHelper();
  var node = dh.htmlToDocumentFragment(e.equationHtml);

  if (this.originalElement_) {
    // Editing existing equation: replace the old equation node with the new
    // one.
    goog.dom.replaceNode(node, this.originalElement_);
  } else {
    // Clear out what was previously selected, unless selection is already
    // empty (aka collapsed), and replace it with the new equation node.
    // TODO(user): there is a bug in FF where removeContents() may remove a
    // <br> right before and/or after the selection. Currently this is fixed
    // only for case of collapsed selection where we simply avoid calling
    // removeContants().
    var range = this.getFieldObject().getRange();
    if (!range.isCollapsed()) {
      range.removeContents();
    }
    node = range.insertNode(node, false);
  }

  // Place the cursor to the right of the
  // equation image.
  goog.editor.range.placeCursorNextTo(node, false);

  this.getFieldObject().dispatchChange();
***REMOVED***
