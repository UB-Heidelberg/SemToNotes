// Copyright 2011 The Closure Library Authors. All Rights Reserved.
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

goog.provide('goog.ui.editor.EquationEditorOkEvent');

goog.require('goog.events.Event');
goog.require('goog.ui.editor.AbstractDialog');



***REMOVED***
***REMOVED*** OK event object for the equation editor dialog.
***REMOVED*** @param {string} equationHtml html containing the equation to put in the
***REMOVED***     editable field.
***REMOVED***
***REMOVED*** @extends {goog.events.Event}
***REMOVED*** @final
***REMOVED***
goog.ui.editor.EquationEditorOkEvent = function(equationHtml) {
  this.equationHtml = equationHtml;
***REMOVED***
goog.inherits(goog.ui.editor.EquationEditorOkEvent,
    goog.events.Event);


***REMOVED***
***REMOVED*** Event type.
***REMOVED*** @type {goog.ui.editor.AbstractDialog.EventType}
***REMOVED*** @override
***REMOVED***
goog.ui.editor.EquationEditorOkEvent.prototype.type =
    goog.ui.editor.AbstractDialog.EventType.OK;


***REMOVED***
***REMOVED*** HTML containing the equation to put in the editable field.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.editor.EquationEditorOkEvent.prototype.equationHtml;
