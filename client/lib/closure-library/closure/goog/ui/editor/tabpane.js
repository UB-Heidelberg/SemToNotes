// Copyright 2010 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Tabbed pane with style and functionality specific to
***REMOVED*** Editor dialogs.
***REMOVED***
***REMOVED*** @author robbyw@google.com (Robby Walker)
***REMOVED***

goog.provide('goog.ui.editor.TabPane');

goog.require('goog.asserts');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classlist');
goog.require('goog.events.EventHandler');
***REMOVED***
goog.require('goog.style');
goog.require('goog.ui.Component');
goog.require('goog.ui.Control');
goog.require('goog.ui.Tab');
goog.require('goog.ui.TabBar');



***REMOVED***
***REMOVED*** Creates a new Editor-style tab pane.
***REMOVED*** @param {goog.dom.DomHelper} dom The dom helper for the window to create this
***REMOVED***     tab pane in.
***REMOVED*** @param {string=} opt_caption Optional caption of the tab pane.
***REMOVED***
***REMOVED*** @extends {goog.ui.Component}
***REMOVED*** @final
***REMOVED***
goog.ui.editor.TabPane = function(dom, opt_caption) {
  goog.ui.editor.TabPane.base(this, 'constructor', dom);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The event handler used to register events.
  ***REMOVED*** @type {goog.events.EventHandler.<!goog.ui.editor.TabPane>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.eventHandler_ = new goog.events.EventHandler(this);
  this.registerDisposable(this.eventHandler_);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The tab bar used to render the tabs.
  ***REMOVED*** @type {goog.ui.TabBar}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.tabBar_ = new goog.ui.TabBar(goog.ui.TabBar.Location.START,
      undefined, this.dom_);
  this.tabBar_.setFocusable(false);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The content element.
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.tabContent_ = this.dom_.createDom(goog.dom.TagName.DIV,
      {className: goog.getCssName('goog-tab-content')});

 ***REMOVED*****REMOVED***
  ***REMOVED*** The currently selected radio button.
  ***REMOVED*** @type {Element}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.selectedRadio_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The currently visible tab content.
  ***REMOVED*** @type {Element}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.visibleContent_ = null;


  // Add the caption as the first element in the tab bar.
  if (opt_caption) {
    var captionControl = new goog.ui.Control(opt_caption, undefined,
        this.dom_);
    captionControl.addClassName(goog.getCssName('tr-tabpane-caption'));
    captionControl.setEnabled(false);
    this.tabBar_.addChild(captionControl, true);
  }
***REMOVED***
goog.inherits(goog.ui.editor.TabPane, goog.ui.Component);


***REMOVED***
***REMOVED*** @return {string} The ID of the content element for the current tab.
***REMOVED***
goog.ui.editor.TabPane.prototype.getCurrentTabId = function() {
  return this.tabBar_.getSelectedTab().getId();
***REMOVED***


***REMOVED***
***REMOVED*** Selects the tab with the given id.
***REMOVED*** @param {string} id Id of the tab to select.
***REMOVED***
goog.ui.editor.TabPane.prototype.setSelectedTabId = function(id) {
  this.tabBar_.setSelectedTab(this.tabBar_.getChild(id));
***REMOVED***


***REMOVED***
***REMOVED*** Adds a tab to the tab pane.
***REMOVED*** @param {string} id The id of the tab to add.
***REMOVED*** @param {string} caption The caption of the tab.
***REMOVED*** @param {string} tooltip The tooltip for the tab.
***REMOVED*** @param {string} groupName for the radio button group.
***REMOVED*** @param {Element} content The content element to show when this tab is
***REMOVED***     selected.
***REMOVED***
goog.ui.editor.TabPane.prototype.addTab = function(id, caption, tooltip,
    groupName, content) {
  var radio = this.dom_.createDom(goog.dom.TagName.INPUT,
      {
        name: groupName,
        type: 'radio'
      });

  var tab = new goog.ui.Tab([radio, this.dom_.createTextNode(caption)],
      undefined, this.dom_);
  tab.setId(id);
  tab.setTooltip(tooltip);
  this.tabBar_.addChild(tab, true);

  // When you navigate the radio buttons with TAB and then the Arrow keys on
  // Chrome and FF, you get a CLICK event on them, and the radio button
  // is selected.  You don't get a SELECT at all.  We listen for SELECT
  // nonetheless because it's possible that some browser will issue only
  // SELECT.
  this.eventHandler_.listen(radio,
      [goog.events.EventType.SELECT, goog.events.EventType.CLICK],
      goog.bind(this.tabBar_.setSelectedTab, this.tabBar_, tab));

  content.id = id + '-tab';
  this.tabContent_.appendChild(content);
  goog.style.setElementShown(content, false);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.editor.TabPane.prototype.enterDocument = function() {
  goog.ui.editor.TabPane.base(this, 'enterDocument');

  // Get the root element and add a class name to it.
  var root = this.getElement();
  goog.asserts.assert(root);
  goog.dom.classlist.add(root, goog.getCssName('tr-tabpane'));

  // Add the tabs.
  this.addChild(this.tabBar_, true);
  this.eventHandler_.listen(this.tabBar_, goog.ui.Component.EventType.SELECT,
      this.handleTabSelect_);

  // Add the tab content.
  root.appendChild(this.tabContent_);

  // Add an element to clear the tab float.
  root.appendChild(
      this.dom_.createDom(goog.dom.TagName.DIV,
          {className: goog.getCssName('goog-tab-bar-clear')}));
***REMOVED***


***REMOVED***
***REMOVED*** Handles a tab change.
***REMOVED*** @param {goog.events.Event} e The browser change event.
***REMOVED*** @private
***REMOVED***
goog.ui.editor.TabPane.prototype.handleTabSelect_ = function(e) {
  var tab =***REMOVED*****REMOVED*** @type {goog.ui.Tab}***REMOVED*** (e.target);

  // Show the tab content.
  if (this.visibleContent_) {
    goog.style.setElementShown(this.visibleContent_, false);
  }
  this.visibleContent_ = this.dom_.getElement(tab.getId() + '-tab');
  goog.style.setElementShown(this.visibleContent_, true);

  // Select the appropriate radio button (and deselect the current one).
  if (this.selectedRadio_) {
    this.selectedRadio_.checked = false;
  }
  this.selectedRadio_ = tab.getElement().getElementsByTagName(
      goog.dom.TagName.INPUT)[0];
  this.selectedRadio_.checked = true;
***REMOVED***
