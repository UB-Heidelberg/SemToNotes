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
***REMOVED*** @fileoverview A class for managing the editor toolbar.
***REMOVED***
***REMOVED*** @author attila@google.com (Attila Bodis)
***REMOVED*** @author jparent@google.com (Julie Parent)
***REMOVED*** @see ../../demos/editor/editor.html
***REMOVED***

goog.provide('goog.ui.editor.ToolbarController');

goog.require('goog.editor.Field.EventType');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('goog.ui.Component.EventType');



***REMOVED***
***REMOVED*** A class for managing the editor toolbar.  Acts as a bridge between
***REMOVED*** a {@link goog.editor.Field} and a {@link goog.ui.Toolbar}.
***REMOVED***
***REMOVED*** The {@code toolbar} argument must be an instance of {@link goog.ui.Toolbar}
***REMOVED*** or a subclass.  This class doesn't care how the toolbar was created.  As
***REMOVED*** long as one or more controls hosted  in the toolbar have IDs that match
***REMOVED*** built-in {@link goog.editor.Command}s, they will function as expected.  It is
***REMOVED*** the caller's responsibility to ensure that the toolbar is already rendered
***REMOVED*** or that it decorates an existing element.
***REMOVED***
***REMOVED***
***REMOVED*** @param {!goog.editor.Field} field Editable field to be controlled by the
***REMOVED***     toolbar.
***REMOVED*** @param {!goog.ui.Toolbar} toolbar Toolbar to control the editable field.
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
goog.ui.editor.ToolbarController = function(field, toolbar) {
  goog.events.EventTarget.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Event handler to listen for field events and user actions.
  ***REMOVED*** @type {!goog.events.EventHandler}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.handler_ = new goog.events.EventHandler(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The field instance controlled by the toolbar.
  ***REMOVED*** @type {!goog.editor.Field}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.field_ = field;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The toolbar that controls the field.
  ***REMOVED*** @type {!goog.ui.Toolbar}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.toolbar_ = toolbar;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Editing commands whose state is to be queried when updating the toolbar.
  ***REMOVED*** @type {!Array.<string>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.queryCommands_ = [];

  // Iterate over all buttons, and find those which correspond to
  // queryable commands. Add them to the list of commands to query on
  // each COMMAND_VALUE_CHANGE event.
  this.toolbar_.forEachChild(function(button) {
    if (button.queryable) {
      this.queryCommands_.push(this.getComponentId(button.getId()));
    }
  }, this);

  // Make sure the toolbar doesn't steal keyboard focus.
  this.toolbar_.setFocusable(false);

  // Hook up handlers that update the toolbar in response to field events,
  // and to execute editor commands in response to toolbar events.
  this.handler_.
      listen(this.field_, goog.editor.Field.EventType.COMMAND_VALUE_CHANGE,
          this.updateToolbar).
      listen(this.toolbar_, goog.ui.Component.EventType.ACTION,
          this.handleAction);
***REMOVED***
goog.inherits(goog.ui.editor.ToolbarController, goog.events.EventTarget);


***REMOVED***
***REMOVED*** Returns the Closure component ID of the control that corresponds to the
***REMOVED*** given {@link goog.editor.Command} constant.
***REMOVED*** Subclasses may override this method if they want to use a custom mapping
***REMOVED*** scheme from commands to controls.
***REMOVED*** @param {string} command Editor command.
***REMOVED*** @return {string} Closure component ID of the corresponding toolbar
***REMOVED***     control, if any.
***REMOVED*** @protected
***REMOVED***
goog.ui.editor.ToolbarController.prototype.getComponentId = function(command) {
  // The default implementation assumes that the component ID is the same as
  // the command constant.
  return command;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the {@link goog.editor.Command} constant
***REMOVED*** that corresponds to the given Closure component ID.  Subclasses may override
***REMOVED*** this method if they want to use a custom mapping scheme from controls to
***REMOVED*** commands.
***REMOVED*** @param {string} id Closure component ID of a toolbar control.
***REMOVED*** @return {string} Editor command or dialog constant corresponding to the
***REMOVED***     toolbar control, if any.
***REMOVED*** @protected
***REMOVED***
goog.ui.editor.ToolbarController.prototype.getCommand = function(id) {
  // The default implementation assumes that the component ID is the same as
  // the command constant.
  return id;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the event handler object for the editor toolbar.  Useful for classes
***REMOVED*** that extend {@code goog.ui.editor.ToolbarController}.
***REMOVED*** @return {!goog.events.EventHandler} The event handler object.
***REMOVED*** @protected
***REMOVED***
goog.ui.editor.ToolbarController.prototype.getHandler = function() {
  return this.handler_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the field instance managed by the toolbar.  Useful for
***REMOVED*** classes that extend {@code goog.ui.editor.ToolbarController}.
***REMOVED*** @return {!goog.editor.Field} The field managed by the toolbar.
***REMOVED*** @protected
***REMOVED***
goog.ui.editor.ToolbarController.prototype.getField = function() {
  return this.field_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the toolbar UI component that manages the editor.  Useful for
***REMOVED*** classes that extend {@code goog.ui.editor.ToolbarController}.
***REMOVED*** @return {!goog.ui.Toolbar} The toolbar UI component.
***REMOVED***
goog.ui.editor.ToolbarController.prototype.getToolbar = function() {
  return this.toolbar_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the toolbar is visible.
***REMOVED***
goog.ui.editor.ToolbarController.prototype.isVisible = function() {
  return this.toolbar_.isVisible();
***REMOVED***


***REMOVED***
***REMOVED*** Shows or hides the toolbar.
***REMOVED*** @param {boolean} visible Whether to show or hide the toolbar.
***REMOVED***
goog.ui.editor.ToolbarController.prototype.setVisible = function(visible) {
  this.toolbar_.setVisible(visible);
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the toolbar is enabled.
***REMOVED***
goog.ui.editor.ToolbarController.prototype.isEnabled = function() {
  return this.toolbar_.isEnabled();
***REMOVED***


***REMOVED***
***REMOVED*** Enables or disables the toolbar.
***REMOVED*** @param {boolean} enabled Whether to enable or disable the toolbar.
***REMOVED***
goog.ui.editor.ToolbarController.prototype.setEnabled = function(enabled) {
  this.toolbar_.setEnabled(enabled);
***REMOVED***


***REMOVED***
***REMOVED*** Programmatically blurs the editor toolbar, un-highlighting the currently
***REMOVED*** highlighted item, and closing the currently open menu (if any).
***REMOVED***
goog.ui.editor.ToolbarController.prototype.blur = function() {
  // We can't just call this.toolbar_.getElement().blur(), because the toolbar
  // element itself isn't focusable, so goog.ui.Container#handleBlur isn't
  // registered to handle blur events.
  this.toolbar_.handleBlur(null);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.editor.ToolbarController.prototype.disposeInternal = function() {
  goog.ui.editor.ToolbarController.superClass_.disposeInternal.call(this);
  if (this.handler_) {
    this.handler_.dispose();
    delete this.handler_;
  }
  if (this.toolbar_) {
    this.toolbar_.dispose();
    delete this.toolbar_;
  }
  delete this.field_;
  delete this.queryCommands_;
***REMOVED***


***REMOVED***
***REMOVED*** Updates the toolbar in response to editor events.  Specifically, updates
***REMOVED*** button states based on {@code COMMAND_VALUE_CHANGE} events, reflecting the
***REMOVED*** effective formatting of the selection.
***REMOVED*** @param {goog.events.Event} e Editor event to handle.
***REMOVED*** @protected
***REMOVED***
goog.ui.editor.ToolbarController.prototype.updateToolbar = function(e) {
  if (!this.toolbar_.isEnabled() ||
      !this.dispatchEvent(goog.ui.Component.EventType.CHANGE)) {
    return;
  }

  var state;

 ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
  try {
   ***REMOVED*****REMOVED*** @type {Array.<string>}***REMOVED***
    e.commands; // Added by dispatchEvent.

    // If the COMMAND_VALUE_CHANGE event specifies which commands changed
    // state, then we only need to update those ones, otherwise update all
    // commands.
    state =***REMOVED*****REMOVED*** @type {Object}***REMOVED*** (
        this.field_.queryCommandValue(e.commands || this.queryCommands_));
  } catch (ex) {
    // TODO(attila): Find out when/why this happens.
    state = {***REMOVED***
  }

  this.updateToolbarFromState(state);
***REMOVED***


***REMOVED***
***REMOVED*** Updates the toolbar to reflect a given state.
***REMOVED*** @param {Object} state Object mapping editor commands to values.
***REMOVED***
goog.ui.editor.ToolbarController.prototype.updateToolbarFromState =
    function(state) {
  for (var command in state) {
    var button = this.toolbar_.getChild(this.getComponentId(command));
    if (button) {
      var value = state[command];
      if (button.updateFromValue) {
        button.updateFromValue(value);
      } else {
        button.setChecked(!!value);
      }
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles {@code ACTION} events dispatched by toolbar buttons in response to
***REMOVED*** user actions by executing the corresponding field command.
***REMOVED*** @param {goog.events.Event} e Action event to handle.
***REMOVED*** @protected
***REMOVED***
goog.ui.editor.ToolbarController.prototype.handleAction = function(e) {
  var command = this.getCommand(e.target.getId());
  this.field_.execCommand(command, e.target.getValue());
***REMOVED***
