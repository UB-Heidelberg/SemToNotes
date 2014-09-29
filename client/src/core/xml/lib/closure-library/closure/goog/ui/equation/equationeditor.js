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

goog.provide('goog.ui.equation.EquationEditor');

goog.require('goog.dom');
***REMOVED***
goog.require('goog.ui.Component');
goog.require('goog.ui.Tab');
goog.require('goog.ui.TabBar');
goog.require('goog.ui.equation.EditorPane');
goog.require('goog.ui.equation.ImageRenderer');
goog.require('goog.ui.equation.TexPane');



***REMOVED***
***REMOVED*** User interface for equation editor plugin.
***REMOVED***
***REMOVED*** @param {Object} context The context that this equation editor runs in.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper DomHelper to use.
***REMOVED*** @param {string=} opt_helpUrl Help document URL to use in the "Learn more"
***REMOVED***     link.
***REMOVED*** @extends {goog.ui.Component}
***REMOVED***
goog.ui.equation.EquationEditor = function(context, opt_domHelper,
    opt_helpUrl) {
  goog.base(this, opt_domHelper);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The context this editor runs in.
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.context_ = context;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Help document URL to use in the "Learn more" link.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.helpUrl_ = opt_helpUrl || '';
***REMOVED***
goog.inherits(goog.ui.equation.EquationEditor, goog.ui.Component);


***REMOVED***
***REMOVED*** Constants for event names.
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.equation.EquationEditor.EventType = {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Dispatched when equation changes.
 ***REMOVED*****REMOVED***
  CHANGE: 'change'
***REMOVED***


***REMOVED***
***REMOVED*** The index of the last active tab. Zero means first tab.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.equation.EquationEditor.prototype.activeTabIndex_ = 0;


***REMOVED*** @override***REMOVED***
goog.ui.equation.EquationEditor.prototype.createDom = function() {
  goog.base(this, 'createDom');
  this.createDom_();
***REMOVED***


***REMOVED***
***REMOVED*** Creates main editor contents.
***REMOVED*** @private
***REMOVED***
goog.ui.equation.EquationEditor.prototype.createDom_ = function() {
  var contentElement = this.getElement();

 ***REMOVED*****REMOVED*** @desc Title of the visual equation editor tab.***REMOVED***
  var MSG_VISUAL_EDITOR = goog.getMsg('Editor');

 ***REMOVED*****REMOVED*** @desc Title of the TeX equation editor tab.***REMOVED***
  var MSG_TEX_EDITOR = goog.getMsg('TeX');

  // Create the main tabs
  var dom = this.dom_;
  var tabTop = dom.createDom('div',
      {'class': 'goog-tab-bar goog-tab-bar-top'},
      dom.createDom('div',
          {'class': 'goog-tab goog-tab-selected'}, MSG_VISUAL_EDITOR),
      dom.createDom('div', {'class': 'goog-tab'}, MSG_TEX_EDITOR));
  var tabClear = dom.createDom('div', {'class': 'goog-tab-bar-clear'});
  var tabContent = dom.createDom('div', {'class': 'ee-content'});
  dom.appendChild(contentElement, tabTop);
  dom.appendChild(contentElement, tabClear);
  dom.appendChild(contentElement, tabContent);

  var tabBar = new goog.ui.TabBar();
  tabBar.decorate(tabTop);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The tab bar.
  ***REMOVED*** @type {!goog.ui.TabBar}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.tabBar_ = tabBar;

***REMOVED***tabBar, goog.ui.Component.EventType.SELECT,
      goog.bind(this.handleTabSelect_, this));

  var texEditor = new goog.ui.equation.TexPane(this.context_,
      this.helpUrl_, this.dom_);
  this.addChild(texEditor);
  texEditor.render(tabContent);

  this.setVisibleTab_(0); // Make first tab visible
***REMOVED***


***REMOVED***
***REMOVED*** Sets the visibility of the editor.
***REMOVED*** @param {boolean} visible Whether the editor should be visible.
***REMOVED***
goog.ui.equation.EquationEditor.prototype.setVisible = function(visible) {
  // Show active tab if visible, or none if not
  this.setVisibleTab_(visible ? this.activeTabIndex_ : -1);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the tab at the selected index as visible and all the rest as not
***REMOVED*** visible.
***REMOVED*** @param {number} tabIndex The tab index that is visible. -1 means no
***REMOVED***     tab is visible.
***REMOVED*** @private
***REMOVED***
goog.ui.equation.EquationEditor.prototype.setVisibleTab_ = function(tabIndex) {
  for (var i = 0; i < this.getChildCount(); i++) {
    this.getChildAt(i).setVisible(i == tabIndex);
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.equation.EquationEditor.prototype.decorateInternal = function(element) {
  this.setElementInternal(element);
  this.createDom_();
***REMOVED***


***REMOVED***
***REMOVED*** Returns the encoded equation.
***REMOVED*** @return {string} The encoded equation.
***REMOVED***
goog.ui.equation.EquationEditor.prototype.getEquation = function() {
  var sel = this.tabBar_.getSelectedTabIndex();
  return this.getChildAt(sel).getEquation();
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The html code to embed in the document.
***REMOVED***
goog.ui.equation.EquationEditor.prototype.getHtml = function() {
  return goog.ui.equation.ImageRenderer.getHtml(this.getEquation());
***REMOVED***


***REMOVED***
***REMOVED*** Checks whether the current equation is valid and can be used in a document.
***REMOVED*** @return {boolean} Whether the equation is valid.
***REMOVED***
goog.ui.equation.EquationEditor.prototype.isValid = function() {
  return goog.ui.equation.ImageRenderer.isEquationTooLong(
      this.getEquation());
***REMOVED***


***REMOVED***
***REMOVED*** Handles a tab selection by the user.
***REMOVED*** @param {goog.events.Event} e The event.
***REMOVED*** @private
***REMOVED***
goog.ui.equation.EquationEditor.prototype.handleTabSelect_ = function(e) {
  var sel = this.tabBar_.getSelectedTabIndex();
  if (sel != this.activeTabIndex_) {
    this.activeTabIndex_ = sel;
    this.setVisibleTab_(sel);
  }

  // TODO(user) Pass equation from the tab to the other is modified
***REMOVED***


***REMOVED***
***REMOVED*** Parse an equation and draw it.
***REMOVED*** Clears any previous displayed equation.
***REMOVED*** @param {string} equation The equation text to parse.
***REMOVED***
goog.ui.equation.EquationEditor.prototype.setEquation = function(equation) {
  var sel = this.tabBar_.getSelectedTabIndex();
  this.getChildAt(sel).setEquation(equation);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.equation.EquationEditor.prototype.disposeInternal = function() {
  this.context_ = null;
  goog.base(this, 'disposeInternal');
***REMOVED***
