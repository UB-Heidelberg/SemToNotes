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
***REMOVED*** @fileoverview Tab bar UI component.
***REMOVED***
***REMOVED*** @author attila@google.com (Attila Bodis)
***REMOVED*** @see ../demos/tabbar.html
***REMOVED***

goog.provide('goog.ui.TabBar');
goog.provide('goog.ui.TabBar.Location');

goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.Container');
goog.require('goog.ui.Container.Orientation');
// We need to include following dependency because of the magic with
// goog.ui.registry.setDecoratorByClassName
goog.require('goog.ui.Tab');
goog.require('goog.ui.TabBarRenderer');
goog.require('goog.ui.registry');



***REMOVED***
***REMOVED*** Tab bar UI component.  A tab bar contains tabs, rendered above, below,
***REMOVED*** before, or after tab contents.  Tabs in tab bars dispatch the following
***REMOVED*** events:
***REMOVED*** <ul>
***REMOVED***   <li>{@link goog.ui.Component.EventType.ACTION} when activated via the
***REMOVED***       keyboard or the mouse,
***REMOVED***   <li>{@link goog.ui.Component.EventType.SELECT} when selected, and
***REMOVED***   <li>{@link goog.ui.Component.EventType.UNSELECT} when deselected.
***REMOVED*** </ul>
***REMOVED*** Clients may listen for all of the above events on the tab bar itself, and
***REMOVED*** refer to the event target to identify the tab that dispatched the event.
***REMOVED*** When an unselected tab is clicked for the first time, it dispatches both a
***REMOVED*** {@code SELECT} event and an {@code ACTION} event; subsequent clicks on an
***REMOVED*** already selected tab only result in {@code ACTION} events.
***REMOVED***
***REMOVED*** @param {goog.ui.TabBar.Location=} opt_location Tab bar location; defaults to
***REMOVED***     {@link goog.ui.TabBar.Location.TOP}.
***REMOVED*** @param {goog.ui.TabBarRenderer=} opt_renderer Renderer used to render or
***REMOVED***     decorate the container; defaults to {@link goog.ui.TabBarRenderer}.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for document
***REMOVED***     interaction.
***REMOVED***
***REMOVED*** @extends {goog.ui.Container}
***REMOVED***
goog.ui.TabBar = function(opt_location, opt_renderer, opt_domHelper) {
  this.setLocation(opt_location || goog.ui.TabBar.Location.TOP);

  goog.ui.Container.call(this, this.getOrientation(),
      opt_renderer || goog.ui.TabBarRenderer.getInstance(),
      opt_domHelper);

  this.listenToTabEvents_();
***REMOVED***
goog.inherits(goog.ui.TabBar, goog.ui.Container);


***REMOVED***
***REMOVED*** Tab bar location relative to tab contents.
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.TabBar.Location = {
  // Above tab contents.
  TOP: 'top',
  // Below tab contents.
  BOTTOM: 'bottom',
  // To the left of tab contents (to the right if the page is right-to-left).
  START: 'start',
  // To the right of tab contents (to the left if the page is right-to-left).
  END: 'end'
***REMOVED***


***REMOVED***
***REMOVED*** Tab bar location; defaults to {@link goog.ui.TabBar.Location.TOP}.
***REMOVED*** @type {goog.ui.TabBar.Location}
***REMOVED*** @private
***REMOVED***
goog.ui.TabBar.prototype.location_;


***REMOVED***
***REMOVED*** Whether keyboard navigation should change the selected tab, or just move
***REMOVED*** the highlight.  Defaults to true.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.TabBar.prototype.autoSelectTabs_ = true;


***REMOVED***
***REMOVED*** The currently selected tab (null if none).
***REMOVED*** @type {goog.ui.Control?}
***REMOVED*** @private
***REMOVED***
goog.ui.TabBar.prototype.selectedTab_ = null;


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.ui.TabBar.prototype.enterDocument = function() {
  goog.ui.TabBar.superClass_.enterDocument.call(this);

  this.listenToTabEvents_();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.TabBar.prototype.disposeInternal = function() {
  goog.ui.TabBar.superClass_.disposeInternal.call(this);
  this.selectedTab_ = null;
***REMOVED***


***REMOVED***
***REMOVED*** Removes the tab from the tab bar.  Overrides the superclass implementation
***REMOVED*** by deselecting the tab being removed.  Since {@link #removeChildAt} uses
***REMOVED*** {@link #removeChild} internally, we only need to override this method.
***REMOVED*** @param {string|goog.ui.Component} tab Tab to remove.
***REMOVED*** @param {boolean=} opt_unrender Whether to call {@code exitDocument} on the
***REMOVED***     removed tab, and detach its DOM from the document (defaults to false).
***REMOVED*** @return {goog.ui.Control} The removed tab, if any.
***REMOVED*** @override
***REMOVED***
goog.ui.TabBar.prototype.removeChild = function(tab, opt_unrender) {
  // This actually only accepts goog.ui.Controls. There's a TODO
  // on the superclass method to fix this.
  this.deselectIfSelected(***REMOVED*** @type {goog.ui.Control}***REMOVED*** (tab));
  return goog.ui.TabBar.superClass_.removeChild.call(this, tab, opt_unrender);
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.ui.TabBar.Location} Tab bar location relative to tab contents.
***REMOVED***
goog.ui.TabBar.prototype.getLocation = function() {
  return this.location_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the location of the tab bar relative to tab contents.
***REMOVED*** @param {goog.ui.TabBar.Location} location Tab bar location relative to tab
***REMOVED***     contents.
***REMOVED*** @throws {Error} If the tab bar has already been rendered.
***REMOVED***
goog.ui.TabBar.prototype.setLocation = function(location) {
  // setOrientation() will take care of throwing an error if already rendered.
  this.setOrientation(goog.ui.TabBar.getOrientationFromLocation(location));
  this.location_ = location;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether keyboard navigation should change the selected tab,
***REMOVED***     or just move the highlight.
***REMOVED***
goog.ui.TabBar.prototype.isAutoSelectTabs = function() {
  return this.autoSelectTabs_;
***REMOVED***


***REMOVED***
***REMOVED*** Enables or disables auto-selecting tabs using the keyboard.  If auto-select
***REMOVED*** is enabled, keyboard navigation switches tabs immediately, otherwise it just
***REMOVED*** moves the highlight.
***REMOVED*** @param {boolean} enable Whether keyboard navigation should change the
***REMOVED***     selected tab, or just move the highlight.
***REMOVED***
goog.ui.TabBar.prototype.setAutoSelectTabs = function(enable) {
  this.autoSelectTabs_ = enable;
***REMOVED***


***REMOVED***
***REMOVED*** Highlights the tab at the given index in response to a keyboard event.
***REMOVED*** Overrides the superclass implementation by also selecting the tab if
***REMOVED*** {@link #isAutoSelectTabs} returns true.
***REMOVED*** @param {number} index Index of tab to highlight.
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.ui.TabBar.prototype.setHighlightedIndexFromKeyEvent = function(index) {
  goog.ui.TabBar.superClass_.setHighlightedIndexFromKeyEvent.call(this, index);
  if (this.autoSelectTabs_) {
    // Immediately select the tab.
    this.setSelectedTabIndex(index);
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.ui.Control?} The currently selected tab (null if none).
***REMOVED***
goog.ui.TabBar.prototype.getSelectedTab = function() {
  return this.selectedTab_;
***REMOVED***


***REMOVED***
***REMOVED*** Selects the given tab.
***REMOVED*** @param {goog.ui.Control?} tab Tab to select (null to select none).
***REMOVED***
goog.ui.TabBar.prototype.setSelectedTab = function(tab) {
  if (tab) {
    // Select the tab and have it dispatch a SELECT event, to be handled in
    // handleTabSelect() below.
    tab.setSelected(true);
  } else if (this.getSelectedTab()) {
    // De-select the currently selected tab and have it dispatch an UNSELECT
    // event, to be handled in handleTabUnselect() below.
    this.getSelectedTab().setSelected(false);
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} Index of the currently selected tab (-1 if none).
***REMOVED***
goog.ui.TabBar.prototype.getSelectedTabIndex = function() {
  return this.indexOfChild(this.getSelectedTab());
***REMOVED***


***REMOVED***
***REMOVED*** Selects the tab at the given index.
***REMOVED*** @param {number} index Index of the tab to select (-1 to select none).
***REMOVED***
goog.ui.TabBar.prototype.setSelectedTabIndex = function(index) {
  this.setSelectedTab(***REMOVED*** @type {goog.ui.Tab}***REMOVED*** (this.getChildAt(index)));
***REMOVED***


***REMOVED***
***REMOVED*** If the specified tab is the currently selected tab, deselects it, and
***REMOVED*** selects the closest selectable tab in the tab bar (first looking before,
***REMOVED*** then after the deselected tab).  Does nothing if the argument is not the
***REMOVED*** currently selected tab.  Called internally when a tab is removed, hidden,
***REMOVED*** or disabled, to ensure that another tab is selected instead.
***REMOVED*** @param {goog.ui.Control?} tab Tab to deselect (if any).
***REMOVED*** @protected
***REMOVED***
goog.ui.TabBar.prototype.deselectIfSelected = function(tab) {
  if (tab && tab == this.getSelectedTab()) {
    var index = this.indexOfChild(tab);
    // First look for the closest selectable tab before this one.
    for (var i = index - 1;
         tab =***REMOVED*****REMOVED*** @type {goog.ui.Tab}***REMOVED*** (this.getChildAt(i));
         i--) {
      if (this.isSelectableTab(tab)) {
        this.setSelectedTab(tab);
        return;
      }
    }
    // Next, look for the closest selectable tab after this one.
    for (var j = index + 1;
         tab =***REMOVED*****REMOVED*** @type {goog.ui.Tab}***REMOVED*** (this.getChildAt(j));
         j++) {
      if (this.isSelectableTab(tab)) {
        this.setSelectedTab(tab);
        return;
      }
    }
    // If all else fails, just set the selection to null.
    this.setSelectedTab(null);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the tab is selectable, false otherwise.  Only visible and
***REMOVED*** enabled tabs are selectable.
***REMOVED*** @param {goog.ui.Control} tab Tab to check.
***REMOVED*** @return {boolean} Whether the tab is selectable.
***REMOVED*** @protected
***REMOVED***
goog.ui.TabBar.prototype.isSelectableTab = function(tab) {
  return tab.isVisible() && tab.isEnabled();
***REMOVED***


***REMOVED***
***REMOVED*** Handles {@code SELECT} events dispatched by tabs as they become selected.
***REMOVED*** @param {goog.events.Event} e Select event to handle.
***REMOVED*** @protected
***REMOVED***
goog.ui.TabBar.prototype.handleTabSelect = function(e) {
  if (this.selectedTab_ && this.selectedTab_ != e.target) {
    // Deselect currently selected tab.
    this.selectedTab_.setSelected(false);
  }
  this.selectedTab_ =***REMOVED*****REMOVED*** @type {goog.ui.Tab}***REMOVED*** (e.target);
***REMOVED***


***REMOVED***
***REMOVED*** Handles {@code UNSELECT} events dispatched by tabs as they become deselected.
***REMOVED*** @param {goog.events.Event} e Unselect event to handle.
***REMOVED*** @protected
***REMOVED***
goog.ui.TabBar.prototype.handleTabUnselect = function(e) {
  if (e.target == this.selectedTab_) {
    this.selectedTab_ = null;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles {@code DISABLE} events displayed by tabs.
***REMOVED*** @param {goog.events.Event} e Disable event to handle.
***REMOVED*** @protected
***REMOVED***
goog.ui.TabBar.prototype.handleTabDisable = function(e) {
  this.deselectIfSelected(***REMOVED*** @type {goog.ui.Tab}***REMOVED*** (e.target));
***REMOVED***


***REMOVED***
***REMOVED*** Handles {@code HIDE} events displayed by tabs.
***REMOVED*** @param {goog.events.Event} e Hide event to handle.
***REMOVED*** @protected
***REMOVED***
goog.ui.TabBar.prototype.handleTabHide = function(e) {
  this.deselectIfSelected(***REMOVED*** @type {goog.ui.Tab}***REMOVED*** (e.target));
***REMOVED***


***REMOVED***
***REMOVED*** Handles focus events dispatched by the tab bar's key event target.  If no tab
***REMOVED*** is currently highlighted, highlights the selected tab or the first tab if no
***REMOVED*** tab is selected either.
***REMOVED*** @param {goog.events.Event} e Focus event to handle.
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.ui.TabBar.prototype.handleFocus = function(e) {
  if (!this.getHighlighted()) {
    this.setHighlighted(this.getSelectedTab() ||
       ***REMOVED*****REMOVED*** @type {goog.ui.Tab}***REMOVED*** (this.getChildAt(0)));
  }
***REMOVED***


***REMOVED***
***REMOVED*** Subscribes to events dispatched by tabs.
***REMOVED*** @private
***REMOVED***
goog.ui.TabBar.prototype.listenToTabEvents_ = function() {
  // Listen for SELECT, UNSELECT, DISABLE, and HIDE events dispatched by tabs.
  this.getHandler().
      listen(this, goog.ui.Component.EventType.SELECT, this.handleTabSelect).
      listen(this,
             goog.ui.Component.EventType.UNSELECT,
             this.handleTabUnselect).
      listen(this, goog.ui.Component.EventType.DISABLE, this.handleTabDisable).
      listen(this, goog.ui.Component.EventType.HIDE, this.handleTabHide);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the {@link goog.ui.Container.Orientation} that is implied by the
***REMOVED*** given {@link goog.ui.TabBar.Location}.
***REMOVED*** @param {goog.ui.TabBar.Location} location Tab bar location.
***REMOVED*** @return {goog.ui.Container.Orientation} Corresponding orientation.
***REMOVED***
goog.ui.TabBar.getOrientationFromLocation = function(location) {
  return location == goog.ui.TabBar.Location.START ||
         location == goog.ui.TabBar.Location.END ?
             goog.ui.Container.Orientation.VERTICAL :
             goog.ui.Container.Orientation.HORIZONTAL;
***REMOVED***


// Register a decorator factory function for goog.ui.TabBars.
goog.ui.registry.setDecoratorByClassName(goog.ui.TabBarRenderer.CSS_CLASS,
    function() {
      return new goog.ui.TabBar();
    });
