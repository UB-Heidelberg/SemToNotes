// Copyright 2009 The Closure Library Authors. All Rights Reserved.
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

goog.provide('goog.ui.equation.TexEditor');

goog.require('goog.ui.Component');
goog.require('goog.ui.equation.ImageRenderer');
goog.require('goog.ui.equation.TexPane');



***REMOVED***
***REMOVED*** User interface for equation editor plugin.
***REMOVED***
***REMOVED*** @param {Object} context The context that this Tex editor runs in.
***REMOVED*** @param {string} helpUrl URL pointing to help documentation.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper DomHelper to use.
***REMOVED*** @extends {goog.ui.Component}
***REMOVED*** @final
***REMOVED***
goog.ui.equation.TexEditor = function(context, helpUrl, opt_domHelper) {
  goog.ui.Component.call(this, opt_domHelper);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The context that this Tex editor runs in.
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.context_ = context;

 ***REMOVED*****REMOVED***
  ***REMOVED*** A URL pointing to help documentation.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.helpUrl_ = helpUrl;
***REMOVED***
goog.inherits(goog.ui.equation.TexEditor, goog.ui.Component);


***REMOVED***
***REMOVED*** The TeX editor pane.
***REMOVED*** @type {goog.ui.equation.TexPane}
***REMOVED*** @private
***REMOVED***
goog.ui.equation.TexEditor.prototype.texPane_ = null;


***REMOVED*** @override***REMOVED***
goog.ui.equation.TexEditor.prototype.createDom = function() {
  goog.ui.equation.TexEditor.base(this, 'createDom');
  this.createDom_();
***REMOVED***


***REMOVED***
***REMOVED*** Creates main editor contents.
***REMOVED*** @private
***REMOVED***
goog.ui.equation.TexEditor.prototype.createDom_ = function() {
  var contentElement = this.getElement();
  this.texPane_ = new goog.ui.equation.TexPane(this.context_,
      this.helpUrl_, this.dom_);
  this.addChild(this.texPane_);
  this.texPane_.render(contentElement);
  this.texPane_.setVisible(true);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.equation.TexEditor.prototype.decorateInternal = function(element) {
  this.setElementInternal(element);
  this.createDom_();
***REMOVED***


***REMOVED***
***REMOVED*** Returns the encoded equation.
***REMOVED*** @return {string} The encoded equation.
***REMOVED***
goog.ui.equation.TexEditor.prototype.getEquation = function() {
  return this.texPane_.getEquation();
***REMOVED***


***REMOVED***
***REMOVED*** Parse an equation and draw it.
***REMOVED*** Clears any previous displayed equation.
***REMOVED*** @param {string} equation The equation text to parse.
***REMOVED***
goog.ui.equation.TexEditor.prototype.setEquation = function(equation) {
  this.texPane_.setEquation(equation);
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The html code to embed in the document.
***REMOVED***
goog.ui.equation.TexEditor.prototype.getHtml = function() {
  return goog.ui.equation.ImageRenderer.getHtml(this.getEquation());
***REMOVED***


***REMOVED***
***REMOVED*** Checks whether the current equation is valid and can be used in a document.
***REMOVED*** @return {boolean} Whether the equation valid.
***REMOVED***
goog.ui.equation.TexEditor.prototype.isValid = function() {
  return goog.ui.equation.ImageRenderer.isEquationTooLong(
      this.getEquation());
***REMOVED***


***REMOVED***
***REMOVED*** Sets the visibility of the editor.
***REMOVED*** @param {boolean} visible Whether the editor should be visible.
***REMOVED***
goog.ui.equation.TexEditor.prototype.setVisible = function(visible) {
  this.texPane_.setVisible(visible);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.equation.TexEditor.prototype.disposeInternal = function() {
  if (this.texPane_) {
    this.texPane_.dispose();
  }
  this.context_ = null;
  goog.ui.equation.TexEditor.base(this, 'disposeInternal');
***REMOVED***

