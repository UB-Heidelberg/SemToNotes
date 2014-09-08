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
***REMOVED*** @fileoverview A plugin that fills the field with lorem ipsum text when it's
***REMOVED*** empty and does not have the focus. Applies to both editable and uneditable
***REMOVED*** fields.
***REMOVED***
***REMOVED***

goog.provide('goog.editor.plugins.LoremIpsum');

goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.editor.Command');
goog.require('goog.editor.Plugin');
goog.require('goog.editor.node');
goog.require('goog.functions');



***REMOVED***
***REMOVED*** A plugin that manages lorem ipsum state of editable fields.
***REMOVED*** @param {string} message The lorem ipsum message.
***REMOVED***
***REMOVED*** @extends {goog.editor.Plugin}
***REMOVED*** @final
***REMOVED***
goog.editor.plugins.LoremIpsum = function(message) {
  goog.editor.Plugin.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The lorem ipsum message.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.message_ = message;
***REMOVED***
goog.inherits(goog.editor.plugins.LoremIpsum, goog.editor.Plugin);


***REMOVED*** @override***REMOVED***
goog.editor.plugins.LoremIpsum.prototype.getTrogClassId =
    goog.functions.constant('LoremIpsum');


***REMOVED*** @override***REMOVED***
goog.editor.plugins.LoremIpsum.prototype.activeOnUneditableFields =
    goog.functions.TRUE;


***REMOVED***
***REMOVED*** Whether the field is currently filled with lorem ipsum text.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.LoremIpsum.prototype.usingLorem_ = false;


***REMOVED***
***REMOVED*** Handles queryCommandValue.
***REMOVED*** @param {string} command The command to query.
***REMOVED*** @return {boolean} The result.
***REMOVED*** @override
***REMOVED***
goog.editor.plugins.LoremIpsum.prototype.queryCommandValue = function(command) {
  return command == goog.editor.Command.USING_LOREM && this.usingLorem_;
***REMOVED***


***REMOVED***
***REMOVED*** Handles execCommand.
***REMOVED*** @param {string} command The command to execute.
***REMOVED***     Should be CLEAR_LOREM or UPDATE_LOREM.
***REMOVED*** @param {*=} opt_placeCursor Whether to place the cursor in the field
***REMOVED***     after clearing lorem. Should be a boolean.
***REMOVED*** @override
***REMOVED***
goog.editor.plugins.LoremIpsum.prototype.execCommand = function(command,
    opt_placeCursor) {
  if (command == goog.editor.Command.CLEAR_LOREM) {
    this.clearLorem_(!!opt_placeCursor);
  } else if (command == goog.editor.Command.UPDATE_LOREM) {
    this.updateLorem_();
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.editor.plugins.LoremIpsum.prototype.isSupportedCommand =
    function(command) {
  return command == goog.editor.Command.CLEAR_LOREM ||
      command == goog.editor.Command.UPDATE_LOREM ||
      command == goog.editor.Command.USING_LOREM;
***REMOVED***


***REMOVED***
***REMOVED*** Set the lorem ipsum text in a goog.editor.Field if needed.
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.LoremIpsum.prototype.updateLorem_ = function() {
  // Try to apply lorem ipsum if:
  // 1) We have lorem ipsum text
  // 2) There's not a dialog open, as that screws
  //    with the dialog's ability to properly restore the selection
  //    on dialog close (since the DOM nodes would get clobbered in FF)
  // 3) We're not using lorem already
  // 4) The field is not currently active (doesn't have focus).
  var fieldObj = this.getFieldObject();
  if (!this.usingLorem_ &&
      !fieldObj.inModalMode() &&
      goog.editor.Field.getActiveFieldId() != fieldObj.id) {
    var field = fieldObj.getElement();
    if (!field) {
      // Fallback on the original element. This is needed by
      // fields managed by click-to-edit.
      field = fieldObj.getOriginalElement();
    }

    goog.asserts.assert(field);
    if (goog.editor.node.isEmpty(field)) {
      this.usingLorem_ = true;

      // Save the old font style so it can be restored when we
      // clear the lorem ipsum style.
      this.oldFontStyle_ = field.style.fontStyle;
      field.style.fontStyle = 'italic';
      fieldObj.setHtml(true, this.message_, true);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Clear an EditableField's lorem ipsum and put in initial text if needed.
***REMOVED***
***REMOVED*** If using click-to-edit mode (where Trogedit manages whether the field
***REMOVED*** is editable), this works for both editable and uneditable fields.
***REMOVED***
***REMOVED*** TODO(user): Is this really necessary? See TODO below.
***REMOVED*** @param {boolean=} opt_placeCursor Whether to place the cursor in the field
***REMOVED***     after clearing lorem.
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.LoremIpsum.prototype.clearLorem_ = function(
    opt_placeCursor) {
  // Don't mess with lorem state when a dialog is open as that screws
  // with the dialog's ability to properly restore the selection
  // on dialog close (since the DOM nodes would get clobbered)
  var fieldObj = this.getFieldObject();
  if (this.usingLorem_ && !fieldObj.inModalMode()) {
    var field = fieldObj.getElement();
    if (!field) {
      // Fallback on the original element. This is needed by
      // fields managed by click-to-edit.
      field = fieldObj.getOriginalElement();
    }

    goog.asserts.assert(field);
    this.usingLorem_ = false;
    field.style.fontStyle = this.oldFontStyle_;
    fieldObj.setHtml(true, null, true);

    // TODO(nicksantos): I'm pretty sure that this is a hack, but talk to
    // Julie about why this is necessary and what to do with it. Really,
    // we need to figure out where it's necessary and remove it where it's
    // not. Safari never places the cursor on its own willpower.
    if (opt_placeCursor && fieldObj.isLoaded()) {
      if (goog.userAgent.WEBKIT) {
        goog.dom.getOwnerDocument(fieldObj.getElement()).body.focus();
        fieldObj.focusAndPlaceCursorAtStart();
      } else if (goog.userAgent.OPERA) {
        fieldObj.placeCursorAtStart();
      }
    }
  }
***REMOVED***
