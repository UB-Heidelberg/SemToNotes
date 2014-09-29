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
***REMOVED*** @fileoverview Code for an UndoRedoState interface representing an undo and
***REMOVED*** redo action for a particular state change. To be used by
***REMOVED*** {@link goog.editor.plugins.UndoRedoManager}.
***REMOVED***
***REMOVED***


goog.provide('goog.editor.plugins.UndoRedoState');

goog.require('goog.events.EventTarget');



***REMOVED***
***REMOVED*** Represents an undo and redo action for a particular state transition.
***REMOVED***
***REMOVED*** @param {boolean} asynchronous Whether the undo or redo actions for this
***REMOVED***     state complete asynchronously. If true, then this state must fire
***REMOVED***     an ACTION_COMPLETED event when undo or redo is complete.
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
goog.editor.plugins.UndoRedoState = function(asynchronous) {
  goog.base(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Indicates if the undo or redo actions for this state complete
  ***REMOVED*** asynchronously.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.asynchronous_ = asynchronous;
***REMOVED***
goog.inherits(goog.editor.plugins.UndoRedoState, goog.events.EventTarget);


***REMOVED***
***REMOVED*** Event type for events indicating that this state has completed an undo or
***REMOVED*** redo operation.
***REMOVED***
goog.editor.plugins.UndoRedoState.ACTION_COMPLETED = 'action_completed';


***REMOVED***
***REMOVED*** @return {boolean} Whether or not the undo and redo actions of this state
***REMOVED***     complete asynchronously. If true, the state will fire an ACTION_COMPLETED
***REMOVED***     event when an undo or redo action is complete.
***REMOVED***
goog.editor.plugins.UndoRedoState.prototype.isAsynchronous = function() {
  return this.asynchronous_;
***REMOVED***


***REMOVED***
***REMOVED*** Undoes the action represented by this state.
***REMOVED***
goog.editor.plugins.UndoRedoState.prototype.undo = goog.abstractMethod;


***REMOVED***
***REMOVED*** Redoes the action represented by this state.
***REMOVED***
goog.editor.plugins.UndoRedoState.prototype.redo = goog.abstractMethod;


***REMOVED***
***REMOVED*** Checks if two undo-redo states are the same.
***REMOVED*** @param {goog.editor.plugins.UndoRedoState} state The state to compare.
***REMOVED*** @return {boolean} Wether the two states are equal.
***REMOVED***
goog.editor.plugins.UndoRedoState.prototype.equals = goog.abstractMethod;
