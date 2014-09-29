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

***REMOVED***
***REMOVED*** @fileoverview Adds a keyboard shortcut for the link command.
***REMOVED***
***REMOVED***

goog.provide('goog.editor.plugins.LinkShortcutPlugin');

goog.require('goog.editor.Command');
goog.require('goog.editor.Link');
goog.require('goog.editor.Plugin');
goog.require('goog.string');



***REMOVED***
***REMOVED*** Plugin to add a keyboard shortcut for the link command
***REMOVED***
***REMOVED*** @extends {goog.editor.Plugin}
***REMOVED***
goog.editor.plugins.LinkShortcutPlugin = function() {
  goog.base(this);
***REMOVED***
goog.inherits(goog.editor.plugins.LinkShortcutPlugin, goog.editor.Plugin);


***REMOVED*** @override***REMOVED***
goog.editor.plugins.LinkShortcutPlugin.prototype.getTrogClassId = function() {
  return 'LinkShortcutPlugin';
***REMOVED***


***REMOVED***
***REMOVED*** @inheritDoc
***REMOVED***
goog.editor.plugins.LinkShortcutPlugin.prototype.handleKeyboardShortcut =
    function(e, key, isModifierPressed) {
  var command;
  if (isModifierPressed && key == 'k' && !e.shiftKey) {
    var link =***REMOVED*****REMOVED*** @type {goog.editor.Link?}***REMOVED*** (
        this.getFieldObject().execCommand(goog.editor.Command.LINK));
    if (link) {
      link.finishLinkCreation(this.getFieldObject());
    }
    return true;
  }

  return false;
***REMOVED***

