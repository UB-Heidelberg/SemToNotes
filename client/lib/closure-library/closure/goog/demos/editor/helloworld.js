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
***REMOVED*** @fileoverview A simple plugin that inserts 'Hello World!' on command. This
***REMOVED*** plugin is intended to be an example of a very simple plugin for plugin
***REMOVED*** developers.
***REMOVED***
***REMOVED*** @author gak@google.com (Gregory Kick)
***REMOVED*** @see helloworld.html
***REMOVED***

goog.provide('goog.demos.editor.HelloWorld');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.editor.Plugin');



***REMOVED***
***REMOVED*** Plugin to insert 'Hello World!' into an editable field.
***REMOVED***
***REMOVED*** @extends {goog.editor.Plugin}
***REMOVED*** @final
***REMOVED***
goog.demos.editor.HelloWorld = function() {
  goog.editor.Plugin.call(this);
***REMOVED***
goog.inherits(goog.demos.editor.HelloWorld, goog.editor.Plugin);


***REMOVED*** @override***REMOVED***
goog.demos.editor.HelloWorld.prototype.getTrogClassId = function() {
  return 'HelloWorld';
***REMOVED***


***REMOVED***
***REMOVED*** Commands implemented by this plugin.
***REMOVED*** @enum {string}
***REMOVED***
goog.demos.editor.HelloWorld.COMMAND = {
  HELLO_WORLD: '+helloWorld'
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.demos.editor.HelloWorld.prototype.isSupportedCommand = function(
    command) {
  return command == goog.demos.editor.HelloWorld.COMMAND.HELLO_WORLD;
***REMOVED***


***REMOVED***
***REMOVED*** Executes a command. Does not fire any BEFORECHANGE, CHANGE, or
***REMOVED*** SELECTIONCHANGE events (these are handled by the super class implementation
***REMOVED*** of {@code execCommand}.
***REMOVED*** @param {string} command Command to execute.
***REMOVED*** @override
***REMOVED*** @protected
***REMOVED***
goog.demos.editor.HelloWorld.prototype.execCommandInternal = function(
    command) {
  var domHelper = this.getFieldObject().getEditableDomHelper();
  var range = this.getFieldObject().getRange();
  range.removeContents();
  var newNode =
      domHelper.createDom(goog.dom.TagName.SPAN, null, 'Hello World!');
  range.insertNode(newNode, false);
***REMOVED***
