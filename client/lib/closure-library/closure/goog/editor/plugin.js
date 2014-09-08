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
// All Rights Reserved.

***REMOVED***
***REMOVED*** @fileoverview Abstract API for TrogEdit plugins.
***REMOVED***
***REMOVED*** @see ../demos/editor/editor.html
***REMOVED***

goog.provide('goog.editor.Plugin');

// TODO(user): Remove the dependency on goog.editor.Command asap. Currently only
// needed for execCommand issues with links.
goog.require('goog.editor.Command');
goog.require('goog.events.EventTarget');
goog.require('goog.functions');
goog.require('goog.log');
goog.require('goog.object');
goog.require('goog.reflect');



***REMOVED***
***REMOVED*** Abstract API for trogedit plugins.
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
goog.editor.Plugin = function() {
  goog.events.EventTarget.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether this plugin is enabled for the registered field object.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.enabled_ = this.activeOnUneditableFields();
***REMOVED***
goog.inherits(goog.editor.Plugin, goog.events.EventTarget);


***REMOVED***
***REMOVED*** The field object this plugin is attached to.
***REMOVED*** @type {goog.editor.Field}
***REMOVED*** @protected
***REMOVED*** @deprecated Use goog.editor.Plugin.getFieldObject and
***REMOVED***     goog.editor.Plugin.setFieldObject.
***REMOVED***
goog.editor.Plugin.prototype.fieldObject = null;


***REMOVED***
***REMOVED*** @return {goog.dom.DomHelper?} The dom helper object associated with the
***REMOVED***     currently active field.
***REMOVED***
goog.editor.Plugin.prototype.getFieldDomHelper = function() {
  return this.getFieldObject() && this.getFieldObject().getEditableDomHelper();
***REMOVED***


***REMOVED***
***REMOVED*** Indicates if this plugin should be automatically disposed when the
***REMOVED*** registered field is disposed. This should be changed to false for
***REMOVED*** plugins used as multi-field plugins.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.editor.Plugin.prototype.autoDispose_ = true;


***REMOVED***
***REMOVED*** The logger for this plugin.
***REMOVED*** @type {goog.log.Logger}
***REMOVED*** @protected
***REMOVED***
goog.editor.Plugin.prototype.logger =
    goog.log.getLogger('goog.editor.Plugin');


***REMOVED***
***REMOVED*** Sets the field object for use with this plugin.
***REMOVED*** @return {goog.editor.Field} The editable field object.
***REMOVED*** @protected
***REMOVED*** @suppress {deprecated} Until fieldObject can be made private.
***REMOVED***
goog.editor.Plugin.prototype.getFieldObject = function() {
  return this.fieldObject;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the field object for use with this plugin.
***REMOVED*** @param {goog.editor.Field} fieldObject The editable field object.
***REMOVED*** @protected
***REMOVED*** @suppress {deprecated} Until fieldObject can be made private.
***REMOVED***
goog.editor.Plugin.prototype.setFieldObject = function(fieldObject) {
  this.fieldObject = fieldObject;
***REMOVED***


***REMOVED***
***REMOVED*** Registers the field object for use with this plugin.
***REMOVED*** @param {goog.editor.Field} fieldObject The editable field object.
***REMOVED***
goog.editor.Plugin.prototype.registerFieldObject = function(fieldObject) {
  this.setFieldObject(fieldObject);
***REMOVED***


***REMOVED***
***REMOVED*** Unregisters and disables this plugin for the current field object.
***REMOVED*** @param {goog.editor.Field} fieldObj The field object. For single-field
***REMOVED***     plugins, this parameter is ignored.
***REMOVED***
goog.editor.Plugin.prototype.unregisterFieldObject = function(fieldObj) {
  if (this.getFieldObject()) {
    this.disable(this.getFieldObject());
    this.setFieldObject(null);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Enables this plugin for the specified, registered field object. A field
***REMOVED*** object should only be enabled when it is loaded.
***REMOVED*** @param {goog.editor.Field} fieldObject The field object.
***REMOVED***
goog.editor.Plugin.prototype.enable = function(fieldObject) {
  if (this.getFieldObject() == fieldObject) {
    this.enabled_ = true;
  } else {
    goog.log.error(this.logger, 'Trying to enable an unregistered field with ' +
        'this plugin.');
  }
***REMOVED***


***REMOVED***
***REMOVED*** Disables this plugin for the specified, registered field object.
***REMOVED*** @param {goog.editor.Field} fieldObject The field object.
***REMOVED***
goog.editor.Plugin.prototype.disable = function(fieldObject) {
  if (this.getFieldObject() == fieldObject) {
    this.enabled_ = false;
  } else {
    goog.log.error(this.logger, 'Trying to disable an unregistered field ' +
        'with this plugin.');
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether this plugin is enabled for the field object.
***REMOVED***
***REMOVED*** @param {goog.editor.Field} fieldObject The field object.
***REMOVED*** @return {boolean} Whether this plugin is enabled for the field object.
***REMOVED***
goog.editor.Plugin.prototype.isEnabled = function(fieldObject) {
  return this.getFieldObject() == fieldObject ? this.enabled_ : false;
***REMOVED***


***REMOVED***
***REMOVED*** Set if this plugin should automatically be disposed when the registered
***REMOVED*** field is disposed.
***REMOVED*** @param {boolean} autoDispose Whether to autoDispose.
***REMOVED***
goog.editor.Plugin.prototype.setAutoDispose = function(autoDispose) {
  this.autoDispose_ = autoDispose;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether or not this plugin should automatically be disposed
***REMOVED***     when it's registered field is disposed.
***REMOVED***
goog.editor.Plugin.prototype.isAutoDispose = function() {
  return this.autoDispose_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} If true, field will not disable the command
***REMOVED***     when the field becomes uneditable.
***REMOVED***
goog.editor.Plugin.prototype.activeOnUneditableFields = goog.functions.FALSE;


***REMOVED***
***REMOVED*** @param {string} command The command to check.
***REMOVED*** @return {boolean} If true, field will not dispatch change events
***REMOVED***     for commands of this type. This is useful for "seamless" plugins like
***REMOVED***     dialogs and lorem ipsum.
***REMOVED***
goog.editor.Plugin.prototype.isSilentCommand = goog.functions.FALSE;


***REMOVED*** @override***REMOVED***
goog.editor.Plugin.prototype.disposeInternal = function() {
  if (this.getFieldObject()) {
    this.unregisterFieldObject(this.getFieldObject());
  }

  goog.editor.Plugin.superClass_.disposeInternal.call(this);
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The ID unique to this plugin class. Note that different
***REMOVED***     instances off the plugin share the same classId.
***REMOVED***
goog.editor.Plugin.prototype.getTrogClassId;


***REMOVED***
***REMOVED*** An enum of operations that plugins may support.
***REMOVED*** @enum {number}
***REMOVED***
goog.editor.Plugin.Op = {
  KEYDOWN: 1,
  KEYPRESS: 2,
  KEYUP: 3,
  SELECTION: 4,
  SHORTCUT: 5,
  EXEC_COMMAND: 6,
  QUERY_COMMAND: 7,
  PREPARE_CONTENTS_HTML: 8,
  CLEAN_CONTENTS_HTML: 10,
  CLEAN_CONTENTS_DOM: 11
***REMOVED***


***REMOVED***
***REMOVED*** A map from plugin operations to the names of the methods that
***REMOVED*** invoke those operations.
***REMOVED***
goog.editor.Plugin.OPCODE = goog.object.transpose(
    goog.reflect.object(goog.editor.Plugin, {
      handleKeyDown: goog.editor.Plugin.Op.KEYDOWN,
      handleKeyPress: goog.editor.Plugin.Op.KEYPRESS,
      handleKeyUp: goog.editor.Plugin.Op.KEYUP,
      handleSelectionChange: goog.editor.Plugin.Op.SELECTION,
      handleKeyboardShortcut: goog.editor.Plugin.Op.SHORTCUT,
      execCommand: goog.editor.Plugin.Op.EXEC_COMMAND,
      queryCommandValue: goog.editor.Plugin.Op.QUERY_COMMAND,
      prepareContentsHtml: goog.editor.Plugin.Op.PREPARE_CONTENTS_HTML,
      cleanContentsHtml: goog.editor.Plugin.Op.CLEAN_CONTENTS_HTML,
      cleanContentsDom: goog.editor.Plugin.Op.CLEAN_CONTENTS_DOM
    }));


***REMOVED***
***REMOVED*** A set of op codes that run even on disabled plugins.
***REMOVED***
goog.editor.Plugin.IRREPRESSIBLE_OPS = goog.object.createSet(
    goog.editor.Plugin.Op.PREPARE_CONTENTS_HTML,
    goog.editor.Plugin.Op.CLEAN_CONTENTS_HTML,
    goog.editor.Plugin.Op.CLEAN_CONTENTS_DOM);


***REMOVED***
***REMOVED*** Handles keydown. It is run before handleKeyboardShortcut and if it returns
***REMOVED*** true handleKeyboardShortcut will not be called.
***REMOVED*** @param {!goog.events.BrowserEvent} e The browser event.
***REMOVED*** @return {boolean} Whether the event was handled and thus should***REMOVED***not* be
***REMOVED***     propagated to other plugins or handleKeyboardShortcut.
***REMOVED***
goog.editor.Plugin.prototype.handleKeyDown;


***REMOVED***
***REMOVED*** Handles keypress. It is run before handleKeyboardShortcut and if it returns
***REMOVED*** true handleKeyboardShortcut will not be called.
***REMOVED*** @param {!goog.events.BrowserEvent} e The browser event.
***REMOVED*** @return {boolean} Whether the event was handled and thus should***REMOVED***not* be
***REMOVED***     propagated to other plugins or handleKeyboardShortcut.
***REMOVED***
goog.editor.Plugin.prototype.handleKeyPress;


***REMOVED***
***REMOVED*** Handles keyup.
***REMOVED*** @param {!goog.events.BrowserEvent} e The browser event.
***REMOVED*** @return {boolean} Whether the event was handled and thus should***REMOVED***not* be
***REMOVED***     propagated to other plugins.
***REMOVED***
goog.editor.Plugin.prototype.handleKeyUp;


***REMOVED***
***REMOVED*** Handles selection change.
***REMOVED*** @param {!goog.events.BrowserEvent=} opt_e The browser event.
***REMOVED*** @param {!Node=} opt_target The node the selection changed to.
***REMOVED*** @return {boolean} Whether the event was handled and thus should***REMOVED***not* be
***REMOVED***     propagated to other plugins.
***REMOVED***
goog.editor.Plugin.prototype.handleSelectionChange;


***REMOVED***
***REMOVED*** Handles keyboard shortcuts.  Preferred to using handleKey* as it will use
***REMOVED*** the proper event based on browser and will be more performant. If
***REMOVED*** handleKeyPress/handleKeyDown returns true, this will not be called. If the
***REMOVED*** plugin handles the shortcut, it is responsible for dispatching appropriate
***REMOVED*** events (change, selection change at the time of this comment). If the plugin
***REMOVED*** calls execCommand on the editable field, then execCommand already takes care
***REMOVED*** of dispatching events.
***REMOVED*** NOTE: For performance reasons this is only called when any key is pressed
***REMOVED*** in conjunction with ctrl/meta keys OR when a small subset of keys (defined
***REMOVED*** in goog.editor.Field.POTENTIAL_SHORTCUT_KEYCODES_) are pressed without
***REMOVED*** ctrl/meta keys. We specifically don't invoke it when altKey is pressed since
***REMOVED*** alt key is used in many i8n UIs to enter certain characters.
***REMOVED*** @param {!goog.events.BrowserEvent} e The browser event.
***REMOVED*** @param {string} key The key pressed.
***REMOVED*** @param {boolean} isModifierPressed Whether the ctrl/meta key was pressed or
***REMOVED***     not.
***REMOVED*** @return {boolean} Whether the event was handled and thus should***REMOVED***not* be
***REMOVED***     propagated to other plugins. We also call preventDefault on the event if
***REMOVED***     the return value is true.
***REMOVED***
goog.editor.Plugin.prototype.handleKeyboardShortcut;


***REMOVED***
***REMOVED*** Handles execCommand. This default implementation handles dispatching
***REMOVED*** BEFORECHANGE, CHANGE, and SELECTIONCHANGE events, and calls
***REMOVED*** execCommandInternal to perform the actual command. Plugins that want to
***REMOVED*** do their own event dispatching should override execCommand, otherwise
***REMOVED*** it is preferred to only override execCommandInternal.
***REMOVED***
***REMOVED*** This version of execCommand will only work for single field plugins.
***REMOVED*** Multi-field plugins must override execCommand.
***REMOVED***
***REMOVED*** @param {string} command The command to execute.
***REMOVED*** @param {...*} var_args Any additional parameters needed to
***REMOVED***     execute the command.
***REMOVED*** @return {*} The result of the execCommand, if any.
***REMOVED***
goog.editor.Plugin.prototype.execCommand = function(command, var_args) {
  // TODO(user): Replace all uses of isSilentCommand with plugins that just
  // override this base execCommand method.
  var silent = this.isSilentCommand(command);
  if (!silent) {
    // Stop listening to mutation events in Firefox while text formatting
    // is happening.  This prevents us from trying to size the field in the
    // middle of an execCommand, catching the field in a strange intermediary
    // state where both replacement nodes and original nodes are appended to
    // the dom.  Note that change events get turned back on by
    // fieldObj.dispatchChange.
    if (goog.userAgent.GECKO) {
      this.getFieldObject().stopChangeEvents(true, true);
    }

    this.getFieldObject().dispatchBeforeChange();
  }

  try {
    var result = this.execCommandInternal.apply(this, arguments);
  } finally {
    // If the above execCommandInternal call throws an exception, we still need
    // to turn change events back on (see http://b/issue?id=1471355).
    // NOTE: If if you add to or change the methods called in this finally
    // block, please add them as expected calls to the unit test function
    // testExecCommandException().
    if (!silent) {
      // dispatchChange includes a call to startChangeEvents, which unwinds the
      // call to stopChangeEvents made before the try block.
      this.getFieldObject().dispatchChange();
      this.getFieldObject().dispatchSelectionChangeEvent();
    }
  }

  return result;
***REMOVED***


***REMOVED***
***REMOVED*** Handles execCommand. This default implementation does nothing, and is
***REMOVED*** called by execCommand, which handles event dispatching. This method should
***REMOVED*** be overriden by plugins that don't need to do their own event dispatching.
***REMOVED*** If custom event dispatching is needed, execCommand shoul be overriden
***REMOVED*** instead.
***REMOVED***
***REMOVED*** @param {string} command The command to execute.
***REMOVED*** @param {...*} var_args Any additional parameters needed to
***REMOVED***     execute the command.
***REMOVED*** @return {*} The result of the execCommand, if any.
***REMOVED*** @protected
***REMOVED***
goog.editor.Plugin.prototype.execCommandInternal;


***REMOVED***
***REMOVED*** Gets the state of this command if this plugin serves that command.
***REMOVED*** @param {string} command The command to check.
***REMOVED*** @return {*} The value of the command.
***REMOVED***
goog.editor.Plugin.prototype.queryCommandValue;


***REMOVED***
***REMOVED*** Prepares the given HTML for editing. Strips out content that should not
***REMOVED*** appear in an editor, and normalizes content as appropriate. The inverse
***REMOVED*** of cleanContentsHtml.
***REMOVED***
***REMOVED*** This op is invoked even on disabled plugins.
***REMOVED***
***REMOVED*** @param {string} originalHtml The original HTML.
***REMOVED*** @param {Object} styles A map of strings. If the plugin wants to add
***REMOVED***     any styles to the field element, it should add them as key-value
***REMOVED***     pairs to this object.
***REMOVED*** @return {string} New HTML that's ok for editing.
***REMOVED***
goog.editor.Plugin.prototype.prepareContentsHtml;


***REMOVED***
***REMOVED*** Cleans the contents of the node passed to it. The node contents are modified
***REMOVED*** directly, and the modifications will subsequently be used, for operations
***REMOVED*** such as saving the innerHTML of the editor etc. Since the plugins act on
***REMOVED*** the DOM directly, this method can be very expensive.
***REMOVED***
***REMOVED*** This op is invoked even on disabled plugins.
***REMOVED***
***REMOVED*** @param {!Element} fieldCopy The copy of the editable field which
***REMOVED***     needs to be cleaned up.
***REMOVED***
goog.editor.Plugin.prototype.cleanContentsDom;


***REMOVED***
***REMOVED*** Cleans the html contents of Trogedit. Both cleanContentsDom and
***REMOVED*** and cleanContentsHtml will be called on contents extracted from Trogedit.
***REMOVED*** The inverse of prepareContentsHtml.
***REMOVED***
***REMOVED*** This op is invoked even on disabled plugins.
***REMOVED***
***REMOVED*** @param {string} originalHtml The trogedit HTML.
***REMOVED*** @return {string} Cleaned-up HTML.
***REMOVED***
goog.editor.Plugin.prototype.cleanContentsHtml;


***REMOVED***
***REMOVED*** Whether the string corresponds to a command this plugin handles.
***REMOVED*** @param {string} command Command string to check.
***REMOVED*** @return {boolean} Whether the plugin handles this type of command.
***REMOVED***
goog.editor.Plugin.prototype.isSupportedCommand = function(command) {
  return false;
***REMOVED***
