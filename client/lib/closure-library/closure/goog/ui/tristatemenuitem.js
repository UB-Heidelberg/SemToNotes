// Copyright 2007 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview A menu item class that supports three state checkbox semantics.
***REMOVED***
***REMOVED*** @author eae@google.com (Emil A Eklund)
***REMOVED***

goog.provide('goog.ui.TriStateMenuItem');
goog.provide('goog.ui.TriStateMenuItem.State');

goog.require('goog.dom.classlist');
goog.require('goog.ui.Component');
goog.require('goog.ui.MenuItem');
goog.require('goog.ui.TriStateMenuItemRenderer');
goog.require('goog.ui.registry');



***REMOVED***
***REMOVED*** Class representing a three state checkbox menu item.
***REMOVED***
***REMOVED*** @param {goog.ui.ControlContent} content Text caption or DOM structure
***REMOVED***     to display as the content of the item (use to add icons or styling to
***REMOVED***     menus).
***REMOVED*** @param {Object=} opt_model Data/model associated with the menu item.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper used for
***REMOVED***     document interactions.
***REMOVED*** @param {goog.ui.MenuItemRenderer=} opt_renderer Optional renderer.
***REMOVED*** @param {boolean=} opt_alwaysAllowPartial  If true, always allow partial
***REMOVED***     state.
***REMOVED***
***REMOVED*** @extends {goog.ui.MenuItem}
***REMOVED*** TODO(attila): Figure out how to better integrate this into the
***REMOVED*** goog.ui.Control state management framework.
***REMOVED*** @final
***REMOVED***
goog.ui.TriStateMenuItem = function(content, opt_model, opt_domHelper,
    opt_renderer, opt_alwaysAllowPartial) {
  goog.ui.MenuItem.call(this, content, opt_model, opt_domHelper,
      opt_renderer || new goog.ui.TriStateMenuItemRenderer());
  this.setCheckable(true);
  this.alwaysAllowPartial_ = opt_alwaysAllowPartial || false;
***REMOVED***
goog.inherits(goog.ui.TriStateMenuItem, goog.ui.MenuItem);


***REMOVED***
***REMOVED*** Checked states for component.
***REMOVED*** @enum {number}
***REMOVED***
goog.ui.TriStateMenuItem.State = {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Component is not checked.
 ***REMOVED*****REMOVED***
  NOT_CHECKED: 0,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Component is partially checked.
 ***REMOVED*****REMOVED***
  PARTIALLY_CHECKED: 1,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Component is fully checked.
 ***REMOVED*****REMOVED***
  FULLY_CHECKED: 2
***REMOVED***


***REMOVED***
***REMOVED*** Menu item's checked state.
***REMOVED*** @type {goog.ui.TriStateMenuItem.State}
***REMOVED*** @private
***REMOVED***
goog.ui.TriStateMenuItem.prototype.checkState_ =
    goog.ui.TriStateMenuItem.State.NOT_CHECKED;


***REMOVED***
***REMOVED*** Whether the partial state can be toggled.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.TriStateMenuItem.prototype.allowPartial_ = false;


***REMOVED***
***REMOVED*** Used to override allowPartial_ to force the third state to always be
***REMOVED*** permitted.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.TriStateMenuItem.prototype.alwaysAllowPartial_ = false;


***REMOVED***
***REMOVED*** @return {goog.ui.TriStateMenuItem.State} The menu item's check state.
***REMOVED***
goog.ui.TriStateMenuItem.prototype.getCheckedState = function() {
  return this.checkState_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the checked state.
***REMOVED*** @param {goog.ui.TriStateMenuItem.State} state The checked state.
***REMOVED***
goog.ui.TriStateMenuItem.prototype.setCheckedState = function(state) {
  this.setCheckedState_(state);
  this.allowPartial_ =
      state == goog.ui.TriStateMenuItem.State.PARTIALLY_CHECKED;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the checked state and updates the CSS styling. Dispatches a
***REMOVED*** {@code CHECK} or {@code UNCHECK} event prior to changing the component's
***REMOVED*** state, which may be caught and canceled to prevent the component from
***REMOVED*** changing state.
***REMOVED*** @param {goog.ui.TriStateMenuItem.State} state The checked state.
***REMOVED*** @private
***REMOVED***
goog.ui.TriStateMenuItem.prototype.setCheckedState_ = function(state) {
  if (this.dispatchEvent(state != goog.ui.TriStateMenuItem.State.NOT_CHECKED ?
                             goog.ui.Component.EventType.CHECK :
                             goog.ui.Component.EventType.UNCHECK)) {
    this.setState(goog.ui.Component.State.CHECKED,
        state != goog.ui.TriStateMenuItem.State.NOT_CHECKED);
    this.checkState_ = state;
    this.updatedCheckedStateClassNames_();
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.TriStateMenuItem.prototype.performActionInternal = function(e) {
  switch (this.getCheckedState()) {
    case goog.ui.TriStateMenuItem.State.NOT_CHECKED:
      this.setCheckedState_(this.alwaysAllowPartial_ || this.allowPartial_ ?
          goog.ui.TriStateMenuItem.State.PARTIALLY_CHECKED :
          goog.ui.TriStateMenuItem.State.FULLY_CHECKED);
      break;
    case goog.ui.TriStateMenuItem.State.PARTIALLY_CHECKED:
      this.setCheckedState_(goog.ui.TriStateMenuItem.State.FULLY_CHECKED);
      break;
    case goog.ui.TriStateMenuItem.State.FULLY_CHECKED:
      this.setCheckedState_(goog.ui.TriStateMenuItem.State.NOT_CHECKED);
      break;
  }

  var checkboxClass = goog.getCssName(
      this.getRenderer().getCssClass(), 'checkbox');
  var clickOnCheckbox = e.target && goog.dom.classlist.contains(
     ***REMOVED*****REMOVED*** @type {!Element}***REMOVED*** (e.target), checkboxClass);

  return this.dispatchEvent(clickOnCheckbox || this.allowPartial_ ?
      goog.ui.Component.EventType.CHANGE :
      goog.ui.Component.EventType.ACTION);
***REMOVED***


***REMOVED***
***REMOVED*** Updates the extra class names applied to the menu item element.
***REMOVED*** @private
***REMOVED***
goog.ui.TriStateMenuItem.prototype.updatedCheckedStateClassNames_ = function() {
  var renderer = this.getRenderer();
  renderer.enableExtraClassName(
      this, goog.getCssName(renderer.getCssClass(), 'partially-checked'),
      this.getCheckedState() ==
      goog.ui.TriStateMenuItem.State.PARTIALLY_CHECKED);
  renderer.enableExtraClassName(
      this, goog.getCssName(renderer.getCssClass(), 'fully-checked'),
      this.getCheckedState() == goog.ui.TriStateMenuItem.State.FULLY_CHECKED);
***REMOVED***


// Register a decorator factory function for goog.ui.TriStateMenuItemRenderer.
goog.ui.registry.setDecoratorByClassName(
    goog.ui.TriStateMenuItemRenderer.CSS_CLASS,
    function() {
      // TriStateMenuItem defaults to using TriStateMenuItemRenderer.
      return new goog.ui.TriStateMenuItem(null);
    });
