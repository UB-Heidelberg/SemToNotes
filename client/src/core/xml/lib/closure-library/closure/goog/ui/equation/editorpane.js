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

goog.provide('goog.ui.equation.EditorPane');

goog.require('goog.dom');
goog.require('goog.style');
goog.require('goog.ui.Component');



***REMOVED***
***REMOVED*** An abstract equation editor tab pane.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
***REMOVED***
***REMOVED*** @extends {goog.ui.Component}
***REMOVED***
goog.ui.equation.EditorPane = function(opt_domHelper) {
  goog.ui.Component.call(this, opt_domHelper);
***REMOVED***
goog.inherits(goog.ui.equation.EditorPane, goog.ui.Component);


***REMOVED***
***REMOVED*** A link to any available help documentation to be displayed in a "Learn more"
***REMOVED*** link.  If not set through the equationeditor plugin constructor, the link
***REMOVED*** will be omitted.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.equation.EditorPane.prototype.helpUrl_ = '';


***REMOVED***
***REMOVED*** Sets the visibility of this tab pane.
***REMOVED*** @param {boolean} visible Whether this tab should become visible.
***REMOVED***
goog.ui.equation.EditorPane.prototype.setVisible =
    function(visible) {
  goog.style.showElement(this.getElement(), visible);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the equation to show in this tab pane.
***REMOVED*** @param {string} equation The equation.
***REMOVED*** @protected
***REMOVED***
goog.ui.equation.EditorPane.prototype.setEquation = goog.abstractMethod;


***REMOVED***
***REMOVED*** @return {string} The equation shown in this tab pane.
***REMOVED*** @protected
***REMOVED***
goog.ui.equation.EditorPane.prototype.getEquation = goog.abstractMethod;


***REMOVED***
***REMOVED*** Sets the help link URL to show in this tab pane.
***REMOVED*** @param {string} url The help link URL.
***REMOVED*** @protected
***REMOVED***
goog.ui.equation.EditorPane.prototype.setHelpUrl = function(url) {
  this.helpUrl_ = url;
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The help link URL.
***REMOVED*** @protected
***REMOVED***
goog.ui.equation.EditorPane.prototype.getHelpUrl = function() {
  return this.helpUrl_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the equation was modified.
***REMOVED*** @protected
***REMOVED***
goog.ui.equation.EditorPane.prototype.isModified = goog.abstractMethod;

