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
***REMOVED*** @fileoverview Code for managing series of undo-redo actions in the form of
***REMOVED*** {@link goog.editor.plugins.UndoRedoState}s.
***REMOVED***
***REMOVED***


goog.provide('goog.editor.plugins.UndoRedoManager');
goog.provide('goog.editor.plugins.UndoRedoManager.EventType');

goog.require('goog.editor.plugins.UndoRedoState');
goog.require('goog.events.EventTarget');



***REMOVED***
***REMOVED*** Manages undo and redo operations through a series of {@code UndoRedoState}s
***REMOVED*** maintained on undo and redo stacks.
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
goog.editor.plugins.UndoRedoManager = function() {
  goog.events.EventTarget.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The maximum number of states on the undo stack at any time. Used to limit
  ***REMOVED*** the memory footprint of the undo-redo stack.
  ***REMOVED*** TODO(user) have a separate memory size based limit.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.maxUndoDepth_ = 100;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The undo stack.
  ***REMOVED*** @type {Array.<goog.editor.plugins.UndoRedoState>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.undoStack_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** The redo stack.
  ***REMOVED*** @type {Array.<goog.editor.plugins.UndoRedoState>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.redoStack_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** A queue of pending undo or redo actions. Stored as objects with two
  ***REMOVED*** properties: func and state. The func property stores the undo or redo
  ***REMOVED*** function to be called, the state property stores the state that method
  ***REMOVED*** came from.
  ***REMOVED*** @type {Array.<Object>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.pendingActions_ = [];
***REMOVED***
goog.inherits(goog.editor.plugins.UndoRedoManager, goog.events.EventTarget);


***REMOVED***
***REMOVED*** Event types for the events dispatched by undo-redo manager.
***REMOVED*** @enum {string}
***REMOVED***
goog.editor.plugins.UndoRedoManager.EventType = {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Signifies that he undo or redo stack transitioned between 0 and 1 states,
  ***REMOVED*** meaning that the ability to peform undo or redo operations has changed.
 ***REMOVED*****REMOVED***
  STATE_CHANGE: 'state_change',

 ***REMOVED*****REMOVED***
  ***REMOVED*** Signifies that a state was just added to the undo stack. Events of this
  ***REMOVED*** type will have a {@code state} property whose value is the state that
  ***REMOVED*** was just added.
 ***REMOVED*****REMOVED***
  STATE_ADDED: 'state_added',

 ***REMOVED*****REMOVED***
  ***REMOVED*** Signifies that the undo method of a state is about to be called.
  ***REMOVED*** Events of this type will have a {@code state} property whose value is the
  ***REMOVED*** state whose undo action is about to be performed. If the event is cancelled
  ***REMOVED*** the action does not proceed, but the state will still transition between
  ***REMOVED*** stacks.
 ***REMOVED*****REMOVED***
  BEFORE_UNDO: 'before_undo',

 ***REMOVED*****REMOVED***
  ***REMOVED*** Signifies that the redo method of a state is about to be called.
  ***REMOVED*** Events of this type will have a {@code state} property whose value is the
  ***REMOVED*** state whose redo action is about to be performed. If the event is cancelled
  ***REMOVED*** the action does not proceed, but the state will still transition between
  ***REMOVED*** stacks.
 ***REMOVED*****REMOVED***
  BEFORE_REDO: 'before_redo'
***REMOVED***


***REMOVED***
***REMOVED*** The key for the listener for the completion of the asynchronous state whose
***REMOVED*** undo or redo action is in progress. Null if no action is in progress.
***REMOVED*** @type {goog.events.Key}
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.UndoRedoManager.prototype.inProgressActionKey_ = null;


***REMOVED***
***REMOVED*** Set the max undo stack depth (not the real memory usage).
***REMOVED*** @param {number} depth Depth of the stack.
***REMOVED***
goog.editor.plugins.UndoRedoManager.prototype.setMaxUndoDepth =
    function(depth) {
  this.maxUndoDepth_ = depth;
***REMOVED***


***REMOVED***
***REMOVED*** Add state to the undo stack. This clears the redo stack.
***REMOVED***
***REMOVED*** @param {goog.editor.plugins.UndoRedoState} state The state to add to the undo
***REMOVED***     stack.
***REMOVED***
goog.editor.plugins.UndoRedoManager.prototype.addState = function(state) {
  // TODO: is the state.equals check necessary?
  if (this.undoStack_.length == 0 ||
      !state.equals(this.undoStack_[this.undoStack_.length - 1])) {
    this.undoStack_.push(state);
    if (this.undoStack_.length > this.maxUndoDepth_) {
      this.undoStack_.shift();
    }
    // Clobber the redo stack.
    var redoLength = this.redoStack_.length;
    this.redoStack_.length = 0;

    this.dispatchEvent({
      type: goog.editor.plugins.UndoRedoManager.EventType.STATE_ADDED,
      state: state
    });

    // If the redo state had states on it, then clobbering the redo stack above
    // has caused a state change.
    if (this.undoStack_.length == 1 || redoLength) {
      this.dispatchStateChange_();
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Dispatches a STATE_CHANGE event with this manager as the target.
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.UndoRedoManager.prototype.dispatchStateChange_ =
    function() {
  this.dispatchEvent(
      goog.editor.plugins.UndoRedoManager.EventType.STATE_CHANGE);
***REMOVED***


***REMOVED***
***REMOVED*** Performs the undo operation of the state at the top of the undo stack, moving
***REMOVED*** that state to the top of the redo stack. If the undo stack is empty, does
***REMOVED*** nothing.
***REMOVED***
goog.editor.plugins.UndoRedoManager.prototype.undo = function() {
  this.shiftState_(this.undoStack_, this.redoStack_);
***REMOVED***


***REMOVED***
***REMOVED*** Performs the redo operation of the state at the top of the redo stack, moving
***REMOVED*** that state to the top of the undo stack. If redo undo stack is empty, does
***REMOVED*** nothing.
***REMOVED***
goog.editor.plugins.UndoRedoManager.prototype.redo = function() {
  this.shiftState_(this.redoStack_, this.undoStack_);
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Wether the undo stack has items on it, i.e., if it is
***REMOVED***     possible to perform an undo operation.
***REMOVED***
goog.editor.plugins.UndoRedoManager.prototype.hasUndoState = function() {
  return this.undoStack_.length > 0;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Wether the redo stack has items on it, i.e., if it is
***REMOVED***     possible to perform a redo operation.
***REMOVED***
goog.editor.plugins.UndoRedoManager.prototype.hasRedoState = function() {
  return this.redoStack_.length > 0;
***REMOVED***


***REMOVED***
***REMOVED*** Move a state from one stack to the other, performing the appropriate undo
***REMOVED*** or redo action.
***REMOVED***
***REMOVED*** @param {Array.<goog.editor.plugins.UndoRedoState>} fromStack Stack to move
***REMOVED***     the state from.
***REMOVED*** @param {Array.<goog.editor.plugins.UndoRedoState>} toStack Stack to move
***REMOVED***     the state to.
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.UndoRedoManager.prototype.shiftState_ = function(
    fromStack, toStack) {
  if (fromStack.length) {
    var state = fromStack.pop();

    // Push the current state into the redo stack.
    toStack.push(state);

    this.addAction_({
      type: fromStack == this.undoStack_ ?
          goog.editor.plugins.UndoRedoManager.EventType.BEFORE_UNDO :
          goog.editor.plugins.UndoRedoManager.EventType.BEFORE_REDO,
      func: fromStack == this.undoStack_ ? state.undo : state.redo,
      state: state
    });

    // If either stack transitioned between 0 and 1 in size then the ability
    // to do an undo or redo has changed and we must dispatch a state change.
    if (fromStack.length == 0 || toStack.length == 1) {
      this.dispatchStateChange_();
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Adds an action to the queue of pending undo or redo actions. If no actions
***REMOVED*** are pending, immediately performs the action.
***REMOVED***
***REMOVED*** @param {Object} action An undo or redo action. Stored as an object with two
***REMOVED***     properties: func and state. The func property stores the undo or redo
***REMOVED***     function to be called, the state property stores the state that method
***REMOVED***     came from.
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.UndoRedoManager.prototype.addAction_ = function(action) {
  this.pendingActions_.push(action);
  if (this.pendingActions_.length == 1) {
    this.doAction_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Executes the action at the front of the pending actions queue. If an action
***REMOVED*** is already in progress or the queue is empty, does nothing.
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.UndoRedoManager.prototype.doAction_ = function() {
  if (this.inProgressActionKey_ || this.pendingActions_.length == 0) {
    return;
  }

  var action = this.pendingActions_.shift();

  var e = {
    type: action.type,
    state: action.state
 ***REMOVED*****REMOVED***

  if (this.dispatchEvent(e)) {
    if (action.state.isAsynchronous()) {
      this.inProgressActionKey_ = goog.events.listen(action.state,
          goog.editor.plugins.UndoRedoState.ACTION_COMPLETED,
          this.finishAction_, false, this);
      action.func.call(action.state);
    } else {
      action.func.call(action.state);
      this.doAction_();
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Finishes processing the current in progress action, starting the next queued
***REMOVED*** action if one exists.
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.UndoRedoManager.prototype.finishAction_ = function() {
  goog.events.unlistenByKey(***REMOVED*** @type {number}***REMOVED*** (this.inProgressActionKey_));
  this.inProgressActionKey_ = null;
  this.doAction_();
***REMOVED***


***REMOVED***
***REMOVED*** Clears the undo and redo stacks.
***REMOVED***
goog.editor.plugins.UndoRedoManager.prototype.clearHistory = function() {
  if (this.undoStack_.length > 0 || this.redoStack_.length > 0) {
    this.undoStack_.length = 0;
    this.redoStack_.length = 0;
    this.dispatchStateChange_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.editor.plugins.UndoRedoState|undefined} The state at the top of
***REMOVED***     the undo stack without removing it from the stack.
***REMOVED***
goog.editor.plugins.UndoRedoManager.prototype.undoPeek = function() {
  return this.undoStack_[this.undoStack_.length - 1];
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.editor.plugins.UndoRedoState|undefined} The state at the top of
***REMOVED***     the redo stack without removing it from the stack.
***REMOVED***
goog.editor.plugins.UndoRedoManager.prototype.redoPeek = function() {
  return this.redoStack_[this.redoStack_.length - 1];
***REMOVED***
