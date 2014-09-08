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

***REMOVED***
***REMOVED*** @fileoverview A customized MenuButton for selection of items among lists.
***REMOVED*** Menu contains 'select all' and 'select none' MenuItems for selecting all and
***REMOVED*** no items by default. Other MenuItems can be added by user.
***REMOVED***
***REMOVED*** The checkbox content fires the action events associated with the 'select all'
***REMOVED*** and 'select none' menu items.
***REMOVED***
***REMOVED*** @see ../demos/selectionmenubutton.html
***REMOVED***

goog.provide('goog.ui.SelectionMenuButton');
goog.provide('goog.ui.SelectionMenuButton.SelectionState');

***REMOVED***
goog.require('goog.style');
goog.require('goog.ui.Component');
goog.require('goog.ui.MenuButton');
goog.require('goog.ui.MenuItem');
goog.require('goog.ui.registry');



***REMOVED***
***REMOVED*** A selection menu button control.  Extends {@link goog.ui.MenuButton}.
***REMOVED*** Menu contains 'select all' and 'select none' MenuItems for selecting all and
***REMOVED*** no items by default. Other MenuItems can be added by user.
***REMOVED***
***REMOVED*** The checkbox content fires the action events associated with the 'select all'
***REMOVED*** and 'select none' menu items.
***REMOVED***
***REMOVED*** @param {goog.ui.ButtonRenderer=} opt_renderer Renderer used to render or
***REMOVED***     decorate the menu button; defaults to {@link goog.ui.MenuButtonRenderer}.
***REMOVED*** @param {goog.ui.MenuItemRenderer=} opt_itemRenderer Optional menu item
***REMOVED***     renderer.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM hepler, used for
***REMOVED***     document interaction.
***REMOVED***
***REMOVED*** @extends {goog.ui.MenuButton}
***REMOVED***
goog.ui.SelectionMenuButton = function(opt_renderer,
                                       opt_itemRenderer,
                                       opt_domHelper) {
  goog.ui.MenuButton.call(this,
                          null,
                          null,
                          opt_renderer,
                          opt_domHelper);
  this.initialItemRenderer_ = opt_itemRenderer || null;
***REMOVED***
goog.inherits(goog.ui.SelectionMenuButton, goog.ui.MenuButton);


***REMOVED***
***REMOVED*** Constants for menu action types.
***REMOVED*** @enum {number}
***REMOVED***
goog.ui.SelectionMenuButton.SelectionState = {
  ALL: 0,
  SOME: 1,
  NONE: 2
***REMOVED***


***REMOVED***
***REMOVED*** Select button state
***REMOVED*** @type {goog.ui.SelectionMenuButton.SelectionState}
***REMOVED*** @protected
***REMOVED***
goog.ui.SelectionMenuButton.prototype.selectionState =
    goog.ui.SelectionMenuButton.SelectionState.NONE;


***REMOVED***
***REMOVED*** Item renderer used for the first 2 items, 'select all' and 'select none'.
***REMOVED*** @type {goog.ui.MenuItemRenderer}
***REMOVED*** @private
***REMOVED***
goog.ui.SelectionMenuButton.prototype.initialItemRenderer_;


***REMOVED***
***REMOVED*** Enables button and embedded checkbox.
***REMOVED*** @param {boolean} enable Whether to enable or disable the button.
***REMOVED*** @override
***REMOVED***
goog.ui.SelectionMenuButton.prototype.setEnabled = function(enable) {
  goog.ui.SelectionMenuButton.base(this, 'setEnabled', enable);
  this.setCheckboxEnabled(enable);
***REMOVED***


***REMOVED***
***REMOVED*** Enables the embedded checkbox.
***REMOVED*** @param {boolean} enable Whether to enable or disable the checkbox.
***REMOVED*** @protected
***REMOVED***
goog.ui.SelectionMenuButton.prototype.setCheckboxEnabled = function(enable) {
  this.getCheckboxElement().disabled = !enable;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.SelectionMenuButton.prototype.handleMouseDown = function(e) {
  if (!this.getDomHelper().contains(this.getCheckboxElement(),
     ***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (e.target))) {
    goog.ui.SelectionMenuButton.superClass_.handleMouseDown.call(this, e);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets the checkbox element. Needed because if decorating html, getContent()
***REMOVED*** may include and comment/text elements in addition to the input element.
***REMOVED*** @return {Element} Checkbox.
***REMOVED*** @protected
***REMOVED***
goog.ui.SelectionMenuButton.prototype.getCheckboxElement = function() {
  var elements = this.getDomHelper().getElementsByTagNameAndClass(
      'input',
      goog.getCssName('goog-selectionmenubutton-checkbox'),
      this.getContentElement());
  return elements[0];
***REMOVED***


***REMOVED***
***REMOVED*** Checkbox click handler.
***REMOVED*** @param {goog.events.BrowserEvent} e Checkbox click event.
***REMOVED*** @protected
***REMOVED***
goog.ui.SelectionMenuButton.prototype.handleCheckboxClick = function(e) {
  if (this.selectionState == goog.ui.SelectionMenuButton.SelectionState.NONE) {
    this.setSelectionState(goog.ui.SelectionMenuButton.SelectionState.ALL);
    if (this.getItemAt(0)) {
      this.getItemAt(0).dispatchEvent(  // 'All' item
          goog.ui.Component.EventType.ACTION);
    }
  } else {
    this.setSelectionState(goog.ui.SelectionMenuButton.SelectionState.NONE);
    if (this.getItemAt(1)) {
      this.getItemAt(1).dispatchEvent(  // 'None' item
          goog.ui.Component.EventType.ACTION);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Menu action handler to update checkbox checked state.
***REMOVED*** @param {goog.events.Event} e Menu action event.
***REMOVED*** @private
***REMOVED***
goog.ui.SelectionMenuButton.prototype.handleMenuAction_ = function(e) {
  if (e.target.getModel() == goog.ui.SelectionMenuButton.SelectionState.ALL) {
    this.setSelectionState(goog.ui.SelectionMenuButton.SelectionState.ALL);
  } else {
    this.setSelectionState(goog.ui.SelectionMenuButton.SelectionState.NONE);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Set up events related to the menu items.
***REMOVED*** @private
***REMOVED***
goog.ui.SelectionMenuButton.prototype.addMenuEvent_ = function() {
  if (this.getItemAt(0) && this.getItemAt(1)) {
    this.getHandler().listen(this.getMenu(),
                             goog.ui.Component.EventType.ACTION,
                             this.handleMenuAction_);
    this.getItemAt(0).setModel(goog.ui.SelectionMenuButton.SelectionState.ALL);
    this.getItemAt(1).setModel(goog.ui.SelectionMenuButton.SelectionState.NONE);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Set up events related to the checkbox.
***REMOVED*** @protected
***REMOVED***
goog.ui.SelectionMenuButton.prototype.addCheckboxEvent = function() {
  this.getHandler().listen(this.getCheckboxElement(),
                           goog.events.EventType.CLICK,
                           this.handleCheckboxClick);
***REMOVED***


***REMOVED***
***REMOVED*** Adds the checkbox to the button, and adds 2 items to the menu corresponding
***REMOVED*** to 'select all' and 'select none'.
***REMOVED*** @override
***REMOVED*** @protected
***REMOVED***
goog.ui.SelectionMenuButton.prototype.createDom = function() {
  goog.ui.SelectionMenuButton.superClass_.createDom.call(this);

  this.createCheckbox();

 ***REMOVED*****REMOVED*** @desc Text for 'All' button, used to select all items in a list.***REMOVED***
  var MSG_SELECTIONMENUITEM_ALL = goog.getMsg('All');
 ***REMOVED*****REMOVED*** @desc Text for 'None' button, used to unselect all items in a list.***REMOVED***
  var MSG_SELECTIONMENUITEM_NONE = goog.getMsg('None');

  var itemAll = new goog.ui.MenuItem(MSG_SELECTIONMENUITEM_ALL,
                                     null,
                                     this.getDomHelper(),
                                     this.initialItemRenderer_);
  var itemNone = new goog.ui.MenuItem(MSG_SELECTIONMENUITEM_NONE,
                                      null,
                                      this.getDomHelper(),
                                      this.initialItemRenderer_);
  this.addItem(itemAll);
  this.addItem(itemNone);

  this.addCheckboxEvent();
  this.addMenuEvent_();
***REMOVED***


***REMOVED***
***REMOVED*** Creates and adds the checkbox to the button.
***REMOVED*** @protected
***REMOVED***
goog.ui.SelectionMenuButton.prototype.createCheckbox = function() {
  var checkbox = this.getDomHelper().createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = goog.getCssName('goog-selectionmenubutton-checkbox');
  this.setContent(checkbox);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.SelectionMenuButton.prototype.decorateInternal = function(element) {
  goog.ui.SelectionMenuButton.superClass_.decorateInternal.call(this, element);
  this.addCheckboxEvent();
  this.addMenuEvent_();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.SelectionMenuButton.prototype.setMenu = function(menu) {
  goog.ui.SelectionMenuButton.superClass_.setMenu.call(this, menu);
  this.addMenuEvent_();
***REMOVED***


***REMOVED***
***REMOVED*** Set selection state and update checkbox.
***REMOVED*** @param {goog.ui.SelectionMenuButton.SelectionState} state Selection state.
***REMOVED***
goog.ui.SelectionMenuButton.prototype.setSelectionState = function(state) {
  if (this.selectionState != state) {
    var checkbox = this.getCheckboxElement();
    if (state == goog.ui.SelectionMenuButton.SelectionState.ALL) {
      checkbox.checked = true;
      goog.style.setOpacity(checkbox, 1);
    } else if (state == goog.ui.SelectionMenuButton.SelectionState.SOME) {
      checkbox.checked = true;
      // TODO(user): Get UX help to style this
      goog.style.setOpacity(checkbox, 0.5);
    } else { // NONE
      checkbox.checked = false;
      goog.style.setOpacity(checkbox, 1);
    }
    this.selectionState = state;
  }
***REMOVED***


***REMOVED***
* Get selection state.
* @return {goog.ui.SelectionMenuButton.SelectionState} Selection state.
*/
goog.ui.SelectionMenuButton.prototype.getSelectionState = function() {
  return this.selectionState;
***REMOVED***


// Register a decorator factory function for goog.ui.SelectionMenuButton.
goog.ui.registry.setDecoratorByClassName(
    goog.getCssName('goog-selectionmenubutton-button'),
    function() {
      return new goog.ui.SelectionMenuButton();
    });
