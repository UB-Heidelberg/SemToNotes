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
***REMOVED*** @fileoverview Abstract Editor plugin class to handle tab keys.  Has one
***REMOVED*** abstract method which should be overriden to handle a tab key press.
***REMOVED***
***REMOVED*** @author robbyw@google.com (Robby Walker)
***REMOVED*** @author ajp@google.com (Andy Perelson)
***REMOVED***

goog.provide('goog.editor.plugins.AbstractTabHandler');

goog.require('goog.editor.Plugin');
goog.require('goog.events.KeyCodes');



***REMOVED***
***REMOVED*** Plugin to handle tab keys. Specific tab behavior defined by subclasses.
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.editor.Plugin}
***REMOVED***
goog.editor.plugins.AbstractTabHandler = function() {
  goog.editor.Plugin.call(this);
***REMOVED***
goog.inherits(goog.editor.plugins.AbstractTabHandler, goog.editor.Plugin);


***REMOVED*** @override***REMOVED***
goog.editor.plugins.AbstractTabHandler.prototype.getTrogClassId =
    goog.abstractMethod;


***REMOVED*** @override***REMOVED***
goog.editor.plugins.AbstractTabHandler.prototype.handleKeyboardShortcut =
    function(e, key, isModifierPressed) {
  // If a dialog doesn't have selectable field, Moz grabs the event and
  // performs actions in editor window. This solves that problem and allows
  // the event to be passed on to proper handlers.
  if (goog.userAgent.GECKO && this.getFieldObject().inModalMode()) {
    return false;
  }

  // Don't handle Ctrl+Tab since the user is most likely trying to switch
  // browser tabs. See bug 1305086.
  // FF3 on Mac sends Ctrl-Tab to trogedit and we end up inserting a tab, but
  // then it also switches the tabs. See bug 1511681. Note that we don't use
  // isModifierPressed here since isModifierPressed is true only if metaKey
  // is true on Mac.
  if (e.keyCode == goog.events.KeyCodes.TAB && !e.metaKey && !e.ctrlKey) {
    return this.handleTabKey(e);
  }

  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Handle a tab key press.
***REMOVED*** @param {goog.events.Event} e The key event.
***REMOVED*** @return {boolean} Whether this event was handled by this plugin.
***REMOVED*** @protected
***REMOVED***
goog.editor.plugins.AbstractTabHandler.prototype.handleTabKey =
    goog.abstractMethod;
